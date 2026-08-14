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
        button: {
            backgroundImage: 'radial-gradient(circle at 50%, ' + color + ', ' + color + ' 30%, #000 100%)',
            experimental_backgroundImage: 'radial-gradient(circle at 50%, ' + color + ', ' + color + ' 30%, #000 100%)',
            backgroundColor: color,
            borderRadius: '50%',
            height: 40,
            marginHorizontal: 10,
            width: 40
        }
    });

export default ColorButton;
