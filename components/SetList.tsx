import React, { useEffect, useState } from 'react';
import { View } from '@/components/Themed';
import {
    EmitterSubscription,
    NativeEventEmitter,
    StyleSheet
} from 'react-native';
import { Events } from '@/constants/Events';
import { PropComponent, Props } from '@/components/PropComponent';
import { HexCodes } from '@/constants/HexCodes';
import EvaluatedSet, { EvaluatedSetObject } from '@/components/EvaluatedSet';

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
type SubmitEffectSetup = (
    emitter: NativeEventEmitter,
    onSubmitSet: SetSetter
) => EffectSetup;
type WinEffectSetup = (
    sets: EvaluatedSetObject[],
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

const getWinEffectHandler: WinEffectSetup = (
    sets: EvaluatedSetObject[],
    setSets: SetsSetter,
    setSolution: SetSetter,
    maxColors: number
) => {
    return (): EffectSetup => {
        const lastSet: EvaluatedSetObject | undefined = sets.at(-1);

        if (lastSet?.correct === maxColors) {
            const randomColors: string[] = getRandomColors(maxColors);

            setSolution(randomColors);
            setSets([]);
        }

        return (): void => {};
    };
};

const SetList: PropComponent<SetListProps> = (
    props: SetListProps
): React.JSX.Element => {
    const { emitter, maxColors } = props;
    const randomColors: string[] = getRandomColors(maxColors);
    const [sets, setSets] = useState<EvaluatedSetObject[]>([]);
    const [solution, setSolution] = useState<string[]>(randomColors);
    const onSubmitSet: SetSetter = getSubmitHandler(sets, setSets, solution);
    const submitHandler: EffectSetup = getSubmitEffectHandler(
        emitter,
        onSubmitSet
    );
    const winHandler: EffectSetup = getWinEffectHandler(
        sets,
        setSets,
        setSolution,
        maxColors
    );

    console.log(solution);

    useEffect(submitHandler, [sets]);
    useEffect(winHandler, [sets]);

    return <View style={styles.container}>{sets.map(getSetElement)}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start'
    }
});

export default SetList;
