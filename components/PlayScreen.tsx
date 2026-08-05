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
import { HexCodes } from '@/constants/HexCodes';

type ShowModalSetter = (showModal: boolean) => void;
type EffectSetup = () => void; // duplicate in SetList
type FoundEffectSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: (showModal: boolean) => void
) => EffectSetup;
type Toggler = (
    showModal: boolean,
    setShowModal: (showModal: boolean) => void
) => void;

const toggleModal: Toggler = (
    showModal: boolean,
    setShowModal: (showModal: boolean) => void
): void => {
    setShowModal(!showModal);
};

const getOnCloseHandler: FoundEffectSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: (showModal: boolean) => void
): EffectSetup => {
    return (): void => {
        toggleModal(showModal, setShowModal);
        emitter.emit(Events.RESET_SETS);
    };
};

const getFoundEffectSetup: FoundEffectSetup = (
    emitter: NativeEventEmitter,
    showModal: boolean,
    setShowModal: ShowModalSetter
) => {
    return (): EffectSetup => {
        const subscription: EventSubscription = emitter.addListener(
            Events.FOUND_SET,
            (): void => toggleModal(showModal, setShowModal)
        );

        return () => subscription.remove();
    };
};

const PlayScreen: PropComponent<any> = (): React.JSX.Element => {
    const eventEmitter: NativeEventEmitter = new NativeEventEmitter();
    // get current level from storage (set length, available colors)
    const maxColors: number = 4; // get from current level
    const [showModal, setShowModal] = useState<boolean>(false);
    const foundEffect: EffectSetup = getFoundEffectSetup(
        eventEmitter,
        showModal,
        setShowModal
    );
    const onPressHandler: EffectSetup = getOnCloseHandler(
        eventEmitter,
        showModal,
        setShowModal
    );
    const maxAvailableColors: number = Object.values(HexCodes).length;

    useEffect(foundEffect, [showModal]);

    console.log('Init main screen');

    return (
        <View style={styles.container}>
            <WinModal visible={showModal} onPress={onPressHandler} />
            <SetList emitter={eventEmitter} maxColors={maxColors} />
            <ColorMenu
                emitter={eventEmitter}
                availableColors={maxAvailableColors}
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
