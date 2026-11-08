import React, { useEffect, useState, useCallback, useRef } from 'react';
import { NativeEventEmitter, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import SetList from '@/components/SetList';
import WinModal from '@/components/WinModal';
import ColorMenu from '@/components/ColorMenu';
import LevelHeading from '@/components/LevelHeading';
import { getRandomColors } from '@/constants/HexCodes';
import { PropComponent } from '@/components/PropComponent';
import { FIRST_LEVEL, GameLevel, GameLevels } from '@/constants/GameLevels';
import {
    ParamCallback,
    EventCallback,
    Events,
    OnClose,
    OnNextLevel,
    WinSetup
} from '@/constants/Events';
import {
    getSelectedLevel,
    setSelectedLevel,
    setLastPassedLevel
} from '@/constants/storage';

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
        const nextLevel: number =
            levelIndex < GameLevels.length - 1 ? levelIndex + 1 : FIRST_LEVEL;

        setSelectedLevel(nextLevel);
        setLevel(nextLevel);
        closeHandler(nextLevel);
    };
};

const getWinSetup: WinSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ParamCallback<boolean>
): EventCallback => {
    return (): EventCallback => {
        const subscription = emitter.addListener(Events.FOUND_SET, (): void =>
            setShowModal(!showModal)
        );

        return () => subscription.remove();
    };
};

const PlayScreen: PropComponent<any> = (): React.JSX.Element => {
    const [eventEmitter] = useState<NativeEventEmitter>(
        () => new NativeEventEmitter()
    );

    const [showModal, setShowModal] = useState<boolean>(false);
    const [level, setLevel] = useState<number>(() =>
        getSelectedLevel(GameLevels.length)
    );
    const currentLevel: GameLevel = GameLevels[level] ?? GameLevels[0];
    const [solution, setSolution] = useState<string[]>(() =>
        getRandomColors(currentLevel.colorsLength, currentLevel.availableColors)
    );

    const currentLevelRef = useRef<number>(level);
    currentLevelRef.current = level;

    // Sync level when navigating into PlayScreen (e.g. user selected a replay level in Levels tab)
    useFocusEffect(
        useCallback(() => {
            const active = getSelectedLevel(GameLevels.length);
            if (active !== currentLevelRef.current) {
                setLevel(active);
                const lvlObj = GameLevels[active] ?? GameLevels[0];
                setSolution(
                    getRandomColors(lvlObj.colorsLength, lvlObj.availableColors)
                );
                eventEmitter.emit(Events.RESET_SETS);
            }
        }, [eventEmitter])
    );

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

    // When win modal becomes visible, save the completed level in localStorage
    useEffect(() => {
        if (showModal) {
            setLastPassedLevel(level);
        }
    }, [showModal, level]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
            <View style={styles.container}>
                <WinModal
                    visible={showModal}
                    onClose={() => closeHandler(level)}
                    onNextLevel={nextLevelHandler}
                    showRestart={level === GameLevels.length - 1}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0B0F19'
    },
    container: {
        flex: 1,
        backgroundColor: '#0B0F19',
        flexDirection: 'column'
    }
});

export default PlayScreen;
