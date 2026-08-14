import {
    EmitterSubscription,
    NativeEventEmitter,
    ScrollView,
    StyleSheet
} from 'react-native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import EvaluatedSet, {
    evaluate,
    EvaluatedSetObject,
    getSetElement
} from '@/components/EvaluatedSet';
import { View } from '@/components/Themed';
import { GameLevel } from '@/constants/GameLevels';
import PlaceholderSet from '@/components/PlaceholderSet';
import { PropComponent, Props } from '@/components/PropComponent';
import { EventParamCallback, EventCallback, Events } from '@/constants/Events';

interface SetListProps extends Props {
    currentLevel: GameLevel;
    emitter: NativeEventEmitter;
    solution: string[];
}

type ResetHandler = (
    setSets: EventParamCallback<EvaluatedSetObject[]>
) => EventParamCallback<number>;
type AddColorHandler = (
    colors: string[],
    setColors: EventParamCallback<string[]>,
    maxColors: number,
    submitSet: EventParamCallback<string[]>
) => EventParamCallback<string>;
type SubmitSetHandler = (
    sets: EvaluatedSetObject[],
    setSets: EventParamCallback<EvaluatedSetObject[]>,
    solution: string[]
) => EventParamCallback<string[]>;
type SizeChangeHandler = (
    viewRef: RefObject<ScrollView | null>
) => EventCallback;

type AddColorEffectSetup = (
    emitter: NativeEventEmitter,
    onAddColor: EventParamCallback<string>
) => EventCallback;
type FoundEffectSetup = (
    emitter: NativeEventEmitter,
    sets: EvaluatedSetObject[],
    maxColors: number
) => EventCallback;
type ResetEffectSetup = (
    emitter: NativeEventEmitter,
    onReset: EventParamCallback<number>
) => EventCallback;

const getFoundEffectHandler: FoundEffectSetup = (
    emitter: NativeEventEmitter,
    sets: EvaluatedSetObject[],
    maxColors: number
): EventCallback => {
    return (): EventCallback => {
        const lastSet: EvaluatedSetObject | undefined = sets.at(-1);

        if (lastSet?.correct === maxColors) {
            emitter.emit(Events.FOUND_SET);
        }

        return (): void => {};
    };
};

const getResetHandler: ResetHandler = (
    setSets: EventParamCallback<EvaluatedSetObject[]>
): EventParamCallback<number> => {
    return (): void => {
        setSets([]);
    };
};

const getResetEffectHandler: ResetEffectSetup = (
    emitter: NativeEventEmitter,
    onReset: EventParamCallback<number>
): EventCallback => {
    return () => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.RESET_SETS,
            onReset
        );

        return () => subscription.remove();
    };
};

const getSizeChangeHandler: SizeChangeHandler = (
    viewRef: RefObject<ScrollView | null>
): EventCallback => {
    return (): void => {
        viewRef.current?.scrollToEnd({ animated: true });
    };
};

const getSubmitHandler: SubmitSetHandler = (
    sets: EvaluatedSetObject[],
    setSets: EventParamCallback<EvaluatedSetObject[]>,
    solution: string[]
): EventParamCallback<string[]> => {
    return (current: string[]): void => {
        const result: EvaluatedSetObject = evaluate(current, solution);

        setSets(sets.concat(result));
    };
};

const getAddColorHandler: AddColorHandler = (
    colors: string[],
    setColors: EventParamCallback<string[]>,
    maxColors: number,
    submitHandler: EventParamCallback<string[]>
): EventParamCallback<string> => {
    return (hexCode: string): void => {
        const current: string[] = colors.concat(hexCode);

        setColors(current);

        if (current.length === maxColors) {
            submitHandler(current);
            setColors([]);
        }
    };
};

const getAddColorEffectHandler: AddColorEffectSetup = (
    emitter: NativeEventEmitter,
    onAddColor: EventParamCallback<string>
): EventCallback => {
    return () => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.ADD_COLOR,
            onAddColor
        );

        return () => subscription.remove();
    };
};

const SetList: PropComponent<SetListProps> = (
    props: SetListProps
): React.JSX.Element => {
    const { emitter, currentLevel, solution } = props;
    const [sets, setSets] = useState<EvaluatedSetObject[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const submitSetHandler: EventParamCallback<string[]> = getSubmitHandler(
        sets,
        setSets,
        solution
    );
    const addColorHandler: EventParamCallback<string> = getAddColorHandler(
        colors,
        setColors,
        currentLevel.colorsLength,
        submitSetHandler
    );
    const resetHandler: EventParamCallback<number> = getResetHandler(setSets);
    const foundEffect: EventCallback = getFoundEffectHandler(
        emitter,
        sets,
        currentLevel.colorsLength
    );
    const resetEffect: EventCallback = getResetEffectHandler(
        emitter,
        resetHandler
    );
    const addColorEffect: EventCallback = getAddColorEffectHandler(
        emitter,
        addColorHandler
    );
    const viewRef: RefObject<ScrollView | null> = useRef<ScrollView>(null);
    const currentSet: EvaluatedSetObject = { colors, correct: 0, offset: 0 };

    useEffect(foundEffect, [sets]);
    useEffect(resetEffect, []);
    useEffect(addColorEffect, [colors]);

    console.log('Solution', solution);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                ref={viewRef}
                onContentSizeChange={getSizeChangeHandler(viewRef)}
            >
                {sets.map(getSetElement)}

                <PlaceholderSet colorLength={currentLevel.colorsLength} />

                <EvaluatedSet set={currentSet} hideLabels={true} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        flex: 1
    },
    scroll: {
        alignItems: 'flex-start',
        paddingBottom: 20
    }
});

export default SetList;
