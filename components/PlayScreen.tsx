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
import { getRandomColors } from '@/constants/HexCodes';
import { PropComponent } from '@/components/PropComponent';
import { GameLevel, GameLevels } from '@/constants/GameLevels';
import {
    ParamCallback,
    EventCallback,
    Events,
    OnClose,
    OnNextLevel,
    WinSetup
} from '@/constants/Events';

const getCloseHandler: OnClose = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ParamCallback<boolean>,
    setSolution: ParamCallback<string[]>
): ParamCallback<number> => {
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

const getNextLevelHandler: OnNextLevel = (
    levelIndex: number,
    setLevel: ParamCallback<number>,
    closeHandler: ParamCallback<number>
): EventCallback => {
    return (): void => {
        if (levelIndex < GameLevels.length - 1) {
            const currentLevel: number = levelIndex + 1;

            closeHandler(currentLevel);
            setLevel(currentLevel);
        }
    };
};

const getWinSetup: WinSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ParamCallback<boolean>
): EventCallback => {
    return (): EventCallback => {
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

    const closeHandler: ParamCallback<number> = getCloseHandler(
        eventEmitter,
        showModal,
        setShowModal,
        setSolution
    );
    const nextLevelHandler: EventCallback = getNextLevelHandler(
        level,
        setLevel,
        closeHandler
    );

    const winEffect: EventCallback = getWinSetup(
        eventEmitter,
        showModal,
        setShowModal
    );

    useEffect(winEffect, [showModal]);

    return (
        <View style={styles.container}>
            <WinModal
                visible={showModal}
                onClose={() => closeHandler(level)}
                onNextLevel={nextLevelHandler}
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
