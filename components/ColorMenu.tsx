import React from 'react';
import { NativeEventEmitter, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { EventParamCallback, Events } from '@/constants/Events';
import ColorList from '@/components/ColorList';
import { HexCodes } from '@/constants/HexCodes';
import { PropComponent, Props } from '@/components/PropComponent';

interface ColorMenuProps extends Props {
    emitter: NativeEventEmitter;
    availableColors: number;
}

type PressHandler = (emitter: NativeEventEmitter) => EventParamCallback<string>;

const getOnPressHandler: PressHandler = (
    emitter: NativeEventEmitter
): EventParamCallback<string> => {
    return (hexCode: string): void => {
        emitter.emit(Events.ADD_COLOR, hexCode);
    };
};

const ColorMenu: PropComponent<ColorMenuProps> = (
    props: ColorMenuProps
): React.JSX.Element => {
    const { emitter, availableColors } = props;
    const hexCodes: string[] = Object.values(HexCodes).slice(
        0,
        availableColors
    );
    const onPress: EventParamCallback<string> = getOnPressHandler(emitter);

    return (
        <View style={styles.container}>
            <ColorList colors={hexCodes} onPress={onPress} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20
    }
});

export default ColorMenu;
