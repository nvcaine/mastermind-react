import React, { useEffect, useState } from 'react';
import {
    EventSubscription,
    NativeEventEmitter,
    StyleSheet
} from 'react-native';
import { View } from '@/components/Themed';
import SetList from '@/components/SetList';
import WinModal from '@/components/WinModal';
import ColorMenu from '@/components/ColorMenu';
import LevelHeading from '@/components/LevelHeading';
import { EffectSetup, Events } from '@/constants/Events';
import { PropComponent } from '@/components/PropComponent';
import { getRandomColors, SetCallback } from '@/constants/HexCodes';
import { GameLevel, GameLevels, LevelCallback } from '@/constants/GameLevels';

type ShowModalCallback = (showModal: boolean) => void;

type CloseHandler = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ShowModalCallback,
    setSolution: SetCallback
) => LevelCallback;
type NextLevelHandler = (
    levelIndex: number,
    setLevel: LevelCallback,
    closeHandler: LevelCallback
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
    setSolution: SetCallback
): LevelCallback => {
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
    setLevel: LevelCallback,
    closeHandler: LevelCallback
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

    const onCloseHandler: LevelCallback = getOnCloseHandler(
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
            <LevelHeading
                level={level + 1}
                colorsLength={currentLevel.colorsLength}
            />
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
    }
});

export default PlayScreen;
