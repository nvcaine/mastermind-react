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
import {GameLevel, GameLevels} from '@/constants/GameLevels';

interface SetListProps extends Props {
    availableColors: number;
    emitter: NativeEventEmitter;
    colorsLength: number;
}

type EffectSetup = () => void;
type ColorCallback = (hexCode: string) => void;
type LevelCallback = (level: number) => void;
type SetCallback = (set: string[]) => void;
type SetsCallback = (sets: EvaluatedSetObject[]) => void;

type ResetHandler = (
    setSets: SetsCallback,
    setSolution: SetCallback
) => LevelCallback;
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
    setSets: SetsCallback,
    setSolution: SetCallback
): LevelCallback => {
    return (level: number): void => {
        const currentLevel: GameLevel = GameLevels[level];

        console.log('Call reset handler', currentLevel);
        const randomColors: string[] = getRandomColors(
            currentLevel.colorsLength,
            currentLevel.availableColors
        );
        console.log('On reset colors', randomColors);

        setSolution(randomColors);
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
    const { emitter, colorsLength, availableColors } = props;
    const randomColors: string[] = getRandomColors(
        colorsLength,
        availableColors
    );
    console.log('Initial random colors', randomColors);
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
        colorsLength,
        submitSetHandler
    );
    const resetHandler: LevelCallback = getResetHandler(setSets, setSolution);
    const foundEffect: EffectSetup = getFoundEffectHandler(
        emitter,
        sets,
        colorsLength
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
    useEffect(resetEffect, [solution]);
    useEffect(addColorEffect, [colors]);

    console.log('Solution:', solution);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                ref={viewRef}
                onContentSizeChange={getSizeChangeHandler(viewRef)}
            >
                {sets.map(getSetElement)}

                <PlaceholderSet colorLength={colorsLength} />

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
