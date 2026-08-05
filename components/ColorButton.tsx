import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { PropComponent, Props } from '@/components/PropComponent';

interface ColorButtonProps extends Props {
    color: string;
    onPress?: () => void;
}

const ColorButton: PropComponent<ColorButtonProps> = (
    props: ColorButtonProps
): React.JSX.Element => {
    const { color, disabled, onPress } = props;
    const style = getButtonStyle(color);

    return (
        <TouchableOpacity
            style={style.button}
            onPress={onPress}
            disabled={disabled}
        />
    );
};

const getButtonStyle = (color: string) =>
    StyleSheet.create({
        // duplicate
        button: {
            backgroundColor: color,
            height: 30,
            marginLeft: 10,
            marginRight: 10,
            width: 30
        }
    });

export default ColorButton;
