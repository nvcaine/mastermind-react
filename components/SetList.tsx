import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
    EmitterSubscription,
    NativeEventEmitter,
    ScrollView,
    StyleSheet
} from 'react-native';
import { Events } from '@/constants/Events';
import { PropComponent, Props } from '@/components/PropComponent';
import { getRandomColors } from '@/constants/HexCodes';
import EvaluatedSet, {
    evaluate,
    EvaluatedSetObject,
    getSetElement
} from '@/components/EvaluatedSet';
import { View } from '@/components/Themed';
import PlaceholderSet from '@/components/PlaceholderSet';

interface SetListProps extends Props {
    emitter: NativeEventEmitter;
    maxColors: number;
}

type EffectSetup = () => void;
type ColorCallback = (hexCode: string) => void;
type SetCallback = (set: string[]) => void;
type SetsCallback = (sets: EvaluatedSetObject[]) => void;

type ResetHandler = (
    setSets: SetsCallback,
    setSolution: SetCallback,
    maxColors: number
) => ColorCallback;
type AddColorHandler = (
    colors: string[],
    setColors: SetCallback,
    maxColors: number,
    addSet: SetCallback
) => ColorCallback;
type SubmitSetHandler = (
    sets: EvaluatedSetObject[],
    setSets: SetsCallback,
    solution: string[]
) => SetCallback;
type SizeChangeHandler = (viewRef: RefObject<ScrollView | null>) => EffectSetup;

type AddColorEffectSetup = (
    emitter: NativeEventEmitter,
    onAddColor: ColorCallback
) => EffectSetup;
type WinEffectSetup = (
    emitter: NativeEventEmitter,
    sets: EvaluatedSetObject[],
    maxColors: number
) => EffectSetup;
type ResetEffectSetup = (
    emitter: NativeEventEmitter,
    onReset: ColorCallback
) => EffectSetup;

const getWinEffectHandler: WinEffectSetup = (
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
    setSets: SetsCallback,
    setSolution: SetCallback,
    maxColors: number
): ColorCallback => {
    return (): void => {
        const randomColors: string[] = getRandomColors(maxColors);

        setSolution(randomColors);
        setSets([]);
    };
};

const getResetEffectHandler: ResetEffectSetup = (
    emitter: NativeEventEmitter,
    onReset: ColorCallback
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
        console.log('Size changed');
        viewRef.current?.scrollToEnd({ animated: true });
    };
};

const getSubmitHandler: SubmitSetHandler = (
    sets: EvaluatedSetObject[],
    setSets: SetsCallback,
    solution: string[]
): SetCallback => {
    return (current: string[]): void => {
        const result: EvaluatedSetObject = evaluate(current, solution);

        setSets(sets.concat([result]));
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
    const { emitter, maxColors } = props;
    const randomColors: string[] = getRandomColors(maxColors);
    const [sets, setSets] = useState<EvaluatedSetObject[]>([]);
    const [solution, setSolution] = useState<string[]>(randomColors);
    const [colors, setColors] = useState<string[]>([]);
    const submitSetHandler: SetCallback = getSubmitHandler(
        sets,
        setSets,
        solution
    );
    const addColorHandler: ColorCallback = getAddColorHandler(
        colors,
        setColors,
        maxColors,
        submitSetHandler
    );
    const resetHandler: ColorCallback = getResetHandler(
        setSets,
        setSolution,
        maxColors
    );
    const winEffect: EffectSetup = getWinEffectHandler(
        emitter,
        sets,
        maxColors
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

    useEffect(winEffect, [sets]);
    useEffect(resetEffect, []);
    useEffect(addColorEffect, [colors]);

    console.log(solution);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                ref={viewRef}
                onContentSizeChange={getSizeChangeHandler(viewRef)}
            >
                {sets.map(getSetElement)}

                <PlaceholderSet />

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
