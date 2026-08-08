import React, { useEffect, useState } from 'react';
import {
    EventSubscription,
    NativeEventEmitter,
    StyleSheet
} from 'react-native';
import { View } from '@/components/Themed';
import ColorMenu from '@/components/ColorMenu';
import SetList from '@/components/SetList';
import { PropComponent } from '@/components/PropComponent';
import { Events } from '@/constants/Events';
import WinModal from '@/components/WinModal';
import { GameLevel, GameLevels } from '@/constants/GameLevels';
import { getRandomColors } from '@/constants/HexCodes';
import { MonoText } from '@/components/StyledText';

type EffectSetup = () => void; // duplicate in SetList
type ShowModalCallback = (showModal: boolean) => void;
type SetLevelCallback = (levelIndex: number) => void;
type SetSolutionCallback = (solution: string[]) => void;

type CloseHandler = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ShowModalCallback,
    setSolution: SetSolutionCallback
) => SetLevelCallback;
type NextLevelHandler = (
    levelIndex: number,
    setLevel: SetLevelCallback,
    closeHandler: SetLevelCallback
) => EffectSetup;

type FoundEffectSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ShowModalCallback
) => EffectSetup;

const getOnCloseHandler: CloseHandler = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ShowModalCallback,
    setSolution: SetSolutionCallback
): SetLevelCallback => {
    return (levelIndex: number): void => {
        const currentLevel: GameLevel = GameLevels[levelIndex];
        const randomColors: string[] = getRandomColors(
            currentLevel.colorsLength,
            currentLevel.availableColors
        );

        setSolution(randomColors);
        setShowModal(!showModal);
        emitter.emit(Events.RESET_SETS);
    };
};

const getOnNextLevelHandler: NextLevelHandler = (
    levelIndex: number,
    setLevel: SetLevelCallback,
    closeHandler: SetLevelCallback
): EffectSetup => {
    return (): void => {
        if (levelIndex < GameLevels.length - 1) {
            const currentLevel: number = levelIndex + 1;

            closeHandler(currentLevel);
            setLevel(currentLevel);
        }
    };
};

const getFoundEffectSetup: FoundEffectSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ShowModalCallback
) => {
    return (): EffectSetup => {
        const subscription: EventSubscription = emitter.addListener(
            Events.FOUND_SET,
            (): void => setShowModal(!showModal)
        );

        return () => subscription.remove();
    };
};

const PlayScreen: PropComponent<any> = (): React.JSX.Element => {
    const eventEmitter: NativeEventEmitter = new NativeEventEmitter();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [level, setLevel] = useState<number>(0);
    const currentLevel: GameLevel = GameLevels[level];
    const randomColors: string[] = getRandomColors(
        currentLevel.colorsLength,
        currentLevel.availableColors
    );
    const [solution, setSolution] = useState<string[]>(randomColors);

    const onCloseHandler: SetLevelCallback = getOnCloseHandler(
        eventEmitter,
        showModal,
        setShowModal,
        setSolution
    );
    const onNextLevelHandler: EffectSetup = getOnNextLevelHandler(
        level,
        setLevel,
        onCloseHandler
    );

    const foundEffect: EffectSetup = getFoundEffectSetup(
        eventEmitter,
        showModal,
        setShowModal
    );

    useEffect(foundEffect, [showModal]);

    return (
        <View style={styles.container}>
            <WinModal
                visible={showModal}
                onClose={() => onCloseHandler(level)}
                onNextLevel={onNextLevelHandler}
                showNext={level < GameLevels.length - 1}
            />
            <View style={styles.heading}>
                <MonoText>
                    Level: {level + 1} ({currentLevel.colorsLength} colors)
                </MonoText>
            </View>
            <SetList
                emitter={eventEmitter}
                currentLevel={currentLevel}
                solution={solution}
            />
            <ColorMenu
                emitter={eventEmitter}
                availableColors={currentLevel.availableColors}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column'
    },
    heading: {
        alignItems: 'center'
    }
});

export default PlayScreen;
