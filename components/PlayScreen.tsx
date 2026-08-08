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

type EffectSetup = () => void; // duplicate in SetList
type ShowModalCallback = (showModal: boolean) => void;
type SetLevelCallback = (level: number) => void;

type CloseHandler = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ShowModalCallback,
    level: number
) => EffectSetup;
type NextLevelHandler = (
    level: number,
    setLevel: SetLevelCallback,
    closeHandler: EffectSetup
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
    level: number
): EffectSetup => {
    console.log('Get close handler', level)
    return (): void => {
        console.log('Close clicked');
        setShowModal(!showModal)
        emitter.emit(Events.RESET_SETS, level);
    };
};

const getOnNextLevelHandler: NextLevelHandler = (
    level: number,
    setLevel: SetLevelCallback,
    closeHandler: EffectSetup
): EffectSetup => {
    return (): void => {
        console.log('Next clicked');
        if (level < GameLevels.length - 1) {
            console.log('Inc level');
            setLevel(level + 1);
            closeHandler();
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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [level, setLevel] = useState<number>(0);

    const eventEmitter: NativeEventEmitter = new NativeEventEmitter();
    const currentLevel: GameLevel = GameLevels[level];

    const onCloseHandler: EffectSetup = getOnCloseHandler(
        eventEmitter,
        showModal,
        setShowModal,
        level
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

    console.log('Init main screen', currentLevel);

    return (
        <View style={styles.container}>
            <WinModal
                visible={showModal}
                onClose={onCloseHandler}
                onNextLevel={onNextLevelHandler}
            />
            <SetList
                emitter={eventEmitter}
                colorsLength={currentLevel.colorsLength}
                availableColors={currentLevel.availableColors}
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
