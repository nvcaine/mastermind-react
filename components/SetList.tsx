import {
    EmitterSubscription,
    NativeEventEmitter,
    ScrollView,
    StyleSheet
} from 'react-native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { View } from '@/components/Themed';
import { GameLevel } from '@/constants/GameLevels';
import { evaluate, SetData } from '@/constants/HexCodes';
import PlaceholderSet from '@/components/PlaceholderSet';
import { PropComponent, Props } from '@/components/PropComponent';
import ColorSet from '@/components/ColorSet';
import {
    ParamCallback,
    EventCallback,
    Events,
    OnAddColor,
    OnResetSets,
    OnSizeChange,
    OnSubmitSet,
    AddColorSetup,
    FoundSetup,
    ResetSetup
} from '@/constants/Events';

interface SetListProps extends Props {
    currentLevel: GameLevel;
    emitter: NativeEventEmitter;
    solution: string[];
}

type Mapper = (set: SetData, index: number) => React.JSX.Element;

const getSetElement: Mapper = (set: SetData, index: number) => (
    <ColorSet set={set} key={index} />
);

const getAddColorHandler: OnAddColor = (
    colors: string[],
    setColors: ParamCallback<string[]>,
    maxColors: number,
    submitHandler: ParamCallback<string[]>
): ParamCallback<string> => {
    return (hexCode: string): void => {
        const current: string[] = colors.concat(hexCode);

        setColors(current);

        if (current.length === maxColors) {
            submitHandler(current);
            setColors([]);
        }
    };
};

const getResetHandler: OnResetSets = (
    setSets: ParamCallback<SetData[]>
): ParamCallback<number> => {
    return (): void => {
        setSets([]);
    };
};

const getSizeChangeHandler: OnSizeChange = (
    viewRef: RefObject<ScrollView | null>
): EventCallback => {
    return (): void => {
        viewRef.current?.scrollToEnd({ animated: true });
    };
};

const getSubmitHandler: OnSubmitSet = (
    sets: SetData[],
    setSets: ParamCallback<SetData[]>,
    solution: string[]
): ParamCallback<string[]> => {
    return (current: string[]): void => {
        const result: SetData = evaluate(current, solution);

        setSets(sets.concat(result));
    };
};

const getAddColorSetup: AddColorSetup = (
    emitter: NativeEventEmitter,
    onAddColor: ParamCallback<string>
): EventCallback => {
    return () => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.ADD_COLOR,
            onAddColor
        );

        return () => subscription.remove();
    };
};

const getFoundSetup: FoundSetup = (
    emitter: NativeEventEmitter,
    sets: SetData[],
    maxColors: number
): EventCallback => {
    return (): EventCallback => {
        const lastSet: SetData | undefined = sets.at(-1);

        if (lastSet?.correct === maxColors) {
            emitter.emit(Events.FOUND_SET);
        }

        return (): void => {};
    };
};

const getResetSetup: ResetSetup = (
    emitter: NativeEventEmitter,
    onReset: ParamCallback<number>
): EventCallback => {
    return () => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.RESET_SETS,
            onReset
        );

        return () => subscription.remove();
    };
};

const SetList: PropComponent<SetListProps> = (
    props: SetListProps
): React.JSX.Element => {
    const { emitter, currentLevel, solution } = props;
    const [sets, setSets] = useState<SetData[]>([]);
    const [colors, setColors] = useState<string[]>([]);

    const submitSetHandler: ParamCallback<string[]> = getSubmitHandler(
        sets,
        setSets,
        solution
    );
    const addColorHandler: ParamCallback<string> = getAddColorHandler(
        colors,
        setColors,
        currentLevel.colorsLength,
        submitSetHandler
    );
    const addColorSetup: EventCallback = getAddColorSetup(
        emitter,
        addColorHandler
    );

    const foundSetup: EventCallback = getFoundSetup(
        emitter,
        sets,
        currentLevel.colorsLength
    );

    const resetHandler: ParamCallback<number> = getResetHandler(setSets);
    const resetSetup: EventCallback = getResetSetup(emitter, resetHandler);

    const viewRef: RefObject<ScrollView | null> = useRef<ScrollView>(null);
    const currentSet: SetData = { colors, correct: 0, offset: 0 };

    useEffect(addColorSetup, [colors]);
    useEffect(foundSetup, [sets]);
    useEffect(resetSetup, []);

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

                <ColorSet set={currentSet} hideLabels={true} />
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
