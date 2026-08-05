import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
    EmitterSubscription,
    NativeEventEmitter,
    ScrollView,
    StyleSheet
} from 'react-native';
import { Events } from '@/constants/Events';
import { PropComponent, Props } from '@/components/PropComponent';
import { HexCodes } from '@/constants/HexCodes';
import EvaluatedSet, { EvaluatedSetObject } from '@/components/EvaluatedSet';
import { View } from '@/components/Themed';
import PlaceholderSet from '@/components/PlaceholderSet';

interface SetListProps extends Props {
    emitter: NativeEventEmitter;
    maxColors: number;
}

type SetSetter = (set: string[]) => void;
type SetsSetter = (sets: EvaluatedSetObject[]) => void;
type EffectSetup = () => void;
type SubmitHandler = (
    sets: EvaluatedSetObject[],
    setter: SetsSetter,
    solution: string[]
) => SetSetter;
type SizeChangeHandler = (viewRef: RefObject<ScrollView | null>) => EffectSetup;
type SubmitEffectSetup = (
    emitter: NativeEventEmitter,
    onSubmitSet: SetSetter
) => EffectSetup;
type WinEffectSetup = (
    emitter: NativeEventEmitter,
    sets: EvaluatedSetObject[],
    maxColors: number
) => EffectSetup;
type ResetEffectSetup = (
    emitter: NativeEventEmitter,
    setSets: SetsSetter,
    setSolution: SetSetter,
    maxColors: number
) => EffectSetup;
type Mapper = (set: EvaluatedSetObject, index: number) => React.JSX.Element;
type Shuffler = (maxColors: number) => string[];
type Checker = (colors: string[], solution: string[]) => EvaluatedSetObject;

const getSetElement: Mapper = (set: EvaluatedSetObject, index: number) => (
    <EvaluatedSet set={set} key={index} />
);

const getRandomColors: Shuffler = (maxColors: number): string[] => {
    const result: string[] = [];
    const colors: string[] = Object.values(HexCodes);

    for (let i: number = 0; i < maxColors; i++) {
        let index: number = Math.floor(Math.random() * colors.length);
        let currentIndex: number = result.indexOf(colors[index]);

        while (currentIndex !== -1) {
            index = Math.floor(Math.random() * colors.length);
            currentIndex = result.indexOf(colors[index]);
        }

        result.push(colors[index]);
    }

    return result;
};

const getWinEffectHandler: WinEffectSetup = (
    emitter: NativeEventEmitter,
    sets: EvaluatedSetObject[],
    maxColors: number
) => {
    return (): EffectSetup => {
        const lastSet: EvaluatedSetObject | undefined = sets.at(-1);

        if (lastSet?.correct === maxColors) {
            emitter.emit(Events.FOUND_SET);
        }

        return (): void => {};
    };
};

const evaluate: Checker = (
    colors: string[],
    solution: string[]
): EvaluatedSetObject => {
    let correct: number = 0;
    let offset: number = 0;

    for (let i: number = 0; i < colors.length; i++) {
        if (colors[i] === solution[i]) {
            correct++;
            continue;
        }

        for (let j: number = 0; j < solution.length; j++) {
            if (colors[i] === solution[j] && i !== j) {
                offset++;
            }
        }
    }

    console.log('Evaluated:', colors, correct, offset);

    return { colors, correct, offset };
};

const getSubmitHandler: SubmitHandler = (
    sets: EvaluatedSetObject[],
    setter: SetsSetter,
    solution: string[]
): SetSetter => {
    return (colors: string[]): void => {
        const result: EvaluatedSetObject = evaluate(colors, solution);

        setter(sets.concat([result]));
    };
};

const getSubmitEffectHandler: SubmitEffectSetup = (
    emitter: NativeEventEmitter,
    onSubmitSet: SetSetter
): EffectSetup => {
    return (): EffectSetup => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.SUBMIT_SET,
            onSubmitSet
        );

        return (): void => subscription.remove();
    };
};

const getResetEffectHandler: ResetEffectSetup = (
    emitter: NativeEventEmitter,
    setSets: SetsSetter,
    setSolution: SetSetter,
    maxColors: number
) => {
    return () => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.RESET_SETS,
            (): void => {
                const randomColors: string[] = getRandomColors(maxColors);

                setSolution(randomColors);
                setSets([]);
            }
        );

        return () => subscription.remove();
    };
};

const getSizeChangeHandler: SizeChangeHandler = (
    viewRef: RefObject<ScrollView | null>
) => {
    return (): void => {
        console.log('Size changed');
        viewRef.current?.scrollToEnd({ animated: true });
    };
};

const getAddColorHandler = (
    emitter: NativeEventEmitter,
    colors: string[],
    setColors: (colors: string[]) => void,
    maxColors: number
): EffectSetup => {
    return () => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.ADD_COLOR,
            (hexCode: string): void => {
                const currentColors: string[] = colors.concat(hexCode);

                setColors(currentColors);

                if (
                    currentColors.length === maxColors &&
                    currentColors.at(-1) !== 'transparent'
                ) {
                    // refactor this part to update the sets directly without using an event
                    emitter.emit(Events.SUBMIT_SET, currentColors);
                    setColors([]);
                }
            }
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
    const onSubmitSet: SetSetter = getSubmitHandler(sets, setSets, solution);
    const submitHandler: EffectSetup = getSubmitEffectHandler(
        emitter,
        onSubmitSet
    );
    const winHandler: EffectSetup = getWinEffectHandler(
        emitter,
        sets,
        maxColors
    );
    const resetHandler: EffectSetup = getResetEffectHandler(
        emitter,
        setSets,
        setSolution,
        maxColors
    );
    const addColorHandler: EffectSetup = getAddColorHandler(
        emitter,
        colors,
        setColors,
        maxColors
    );
    const viewRef: RefObject<ScrollView | null> = useRef<ScrollView>(null);
    const currentSet: EvaluatedSetObject = { colors, correct: 0, offset: 0 };

    useEffect(submitHandler, [sets]);
    useEffect(winHandler, [sets]);
    useEffect(resetHandler, []);
    useEffect(addColorHandler, [colors]);

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
