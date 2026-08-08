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
import { EventParamCallback, EventCallback, Events } from '@/constants/Events';

type CloseHandler = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: EventParamCallback<boolean>,
    setSolution: EventParamCallback<string[]>
) => EventParamCallback<number>;
type NextLevelHandler = (
    levelIndex: number,
    setLevel: EventParamCallback<number>,
    closeHandler: EventParamCallback<number>
) => EventCallback;

type FoundEffectSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: EventParamCallback<boolean>
) => EventCallback;

const getOnCloseHandler: CloseHandler = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: EventParamCallback<boolean>,
    setSolution: EventParamCallback<string[]>
): EventParamCallback<number> => {
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
    setLevel: EventParamCallback<number>,
    closeHandler: EventParamCallback<number>
): EventCallback => {
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
    setShowModal: EventParamCallback<boolean>
) => {
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

    const onCloseHandler: EventParamCallback<number> = getOnCloseHandler(
        eventEmitter,
        showModal,
        setShowModal,
        setSolution
    );
    const onNextLevelHandler: EventCallback = getOnNextLevelHandler(
        level,
        setLevel,
        onCloseHandler
    );

    const foundEffect: EventCallback = getFoundEffectSetup(
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
