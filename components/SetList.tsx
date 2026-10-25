import {
    EmitterSubscription,
    NativeEventEmitter,
    ScrollView,
    StyleSheet,
    View,
    Text
} from 'react-native';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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
    UndoColorSetup,
    FoundSetup,
    ResetSetup
} from '@/constants/Events';

interface SetListProps extends Props {
    currentLevel: GameLevel;
    emitter: NativeEventEmitter;
    solution: string[];
}

const getAddColorHandler: OnAddColor = (
    colors: string[],
    setColors: ParamCallback<string[]>,
    maxColors: number,
    submitHandler: ParamCallback<string[]>
): ParamCallback<string> => {
    return (hexCode: string): void => {
        if (colors.length >= maxColors) return;

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

const getSizeChangeHandler = (
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

const getUndoColorSetup: UndoColorSetup = (
    emitter: NativeEventEmitter,
    onUndoColor: EventCallback
): EventCallback => {
    return () => {
        const subscription: EmitterSubscription = emitter.addListener(
            Events.UNDO_COLOR,
            onUndoColor
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
    const undoColorHandler: EventCallback = () => {
        if (colors.length > 0) {
            setColors(colors.slice(0, -1));
        }
    };

    const addColorSetup: EventCallback = getAddColorSetup(
        emitter,
        addColorHandler
    );
    const undoColorSetup: EventCallback = getUndoColorSetup(
        emitter,
        undoColorHandler
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
    useEffect(undoColorSetup, [colors]);
    useEffect(foundSetup, [sets]);
    useEffect(resetSetup, []);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                ref={viewRef}
                onContentSizeChange={getSizeChangeHandler(viewRef)}
            >
                {/* Empty state hint */}
                {sets.length === 0 && (
                    <View style={styles.welcomeBanner}>
                        <FontAwesome
                            name="lightbulb-o"
                            size={16}
                            color="#38BDF8"
                        />
                        <Text style={styles.welcomeText}>
                            Guess the secret {currentLevel.colorsLength}-color
                            code!
                        </Text>
                    </View>
                )}

                {/* Previous attempts */}
                {sets.map((set: SetData, index: number) => (
                    <ColorSet
                        set={set}
                        key={index}
                        attemptIndex={index}
                        totalSlots={currentLevel.colorsLength}
                    />
                ))}

                <PlaceholderSet colorLength={currentLevel.colorsLength} />

                {/* Active guess row */}
                <ColorSet
                    set={currentSet}
                    hideLabels={true}
                    attemptIndex={sets.length}
                    totalSlots={currentLevel.colorsLength}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0B0F19'
    },
    scrollView: {
        flex: 1,
        width: '100%'
    },
    scrollContent: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        alignItems: 'stretch'
    },
    welcomeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        borderColor: 'rgba(56, 189, 248, 0.2)',
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        gap: 8
    },
    welcomeText: {
        color: '#94A3B8',
        fontSize: 13,
        fontWeight: '500'
    }
});

export default SetList;
