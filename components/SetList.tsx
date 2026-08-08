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
    getSetElement,
    EvaluatedSetsCallback
} from '@/components/EvaluatedSet';
import { View } from '@/components/Themed';
import { EffectSetup, Events } from '@/constants/Events';
import PlaceholderSet from '@/components/PlaceholderSet';
import { ColorCallback, SetCallback } from '@/constants/HexCodes';
import { GameLevel, LevelCallback } from '@/constants/GameLevels';
import { PropComponent, Props } from '@/components/PropComponent';

interface SetListProps extends Props {
    currentLevel: GameLevel;
    emitter: NativeEventEmitter;
    solution: string[];
}

type ResetHandler = (setSets: EvaluatedSetsCallback) => LevelCallback;
type AddColorHandler = (
    colors: string[],
    setColors: SetCallback,
    maxColors: number,
    submitSet: SetCallback
) => ColorCallback;
type SubmitSetHandler = (
    sets: EvaluatedSetObject[],
    setSets: EvaluatedSetsCallback,
    solution: string[]
) => SetCallback;
type SizeChangeHandler = (viewRef: RefObject<ScrollView | null>) => EffectSetup;

type AddColorEffectSetup = (
    emitter: NativeEventEmitter,
    onAddColor: ColorCallback
) => EffectSetup;
type FoundEffectSetup = (
    emitter: NativeEventEmitter,
    sets: EvaluatedSetObject[],
    maxColors: number
) => EffectSetup;
type ResetEffectSetup = (
    emitter: NativeEventEmitter,
    onReset: LevelCallback
) => EffectSetup;

const getFoundEffectHandler: FoundEffectSetup = (
    emitter: NativeEventEmitter,
    sets: EvaluatedSetObject[],
    maxColors: number
): EffectSetup => {
    return (): EffectSetup => {
        const lastSet: EvaluatedSetObject | undefined = sets.at(-1);

        if (lastSet?.correct === maxColors) {
            emitter.emit(Events.FOUND_SET);
        }

        return (): void => {};
    };
};

const getResetHandler: ResetHandler = (
    setSets: EvaluatedSetsCallback
): LevelCallback => {
    return (): void => {
        setSets([]);
    };
};

const getResetEffectHandler: ResetEffectSetup = (
    emitter: NativeEventEmitter,
    onReset: LevelCallback
): EffectSetup => {
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
): EffectSetup => {
    return (): void => {
        viewRef.current?.scrollToEnd({ animated: true });
    };
};

const getSubmitHandler: SubmitSetHandler = (
    sets: EvaluatedSetObject[],
    setSets: EvaluatedSetsCallback,
    solution: string[]
): SetCallback => {
    return (current: string[]): void => {
        const result: EvaluatedSetObject = evaluate(current, solution);

        setSets(sets.concat(result));
    };
};

const getAddColorHandler: AddColorHandler = (
    colors: string[],
    setColors: SetCallback,
    maxColors: number,
    submitHandler: SetCallback
): ColorCallback => {
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
    onAddColor: ColorCallback
): EffectSetup => {
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
    const submitSetHandler: SetCallback = getSubmitHandler(
        sets,
        setSets,
        solution
    );
    const addColorHandler: ColorCallback = getAddColorHandler(
        colors,
        setColors,
        currentLevel.colorsLength,
        submitSetHandler
    );
    const resetHandler: LevelCallback = getResetHandler(setSets);
    const foundEffect: EffectSetup = getFoundEffectHandler(
        emitter,
        sets,
        currentLevel.colorsLength
    );
    const resetEffect: EffectSetup = getResetEffectHandler(
        emitter,
        resetHandler
    );
    const addColorEffect: EffectSetup = getAddColorEffectHandler(
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
        flex: 1
    },
    scroll: {
        alignItems: 'flex-start'
    }
});

export default SetList;
