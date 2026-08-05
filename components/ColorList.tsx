import { View } from '@/components/Themed';
import React from 'react';
import ColorButton from '@/components/ColorButton';
import { StyleSheet } from 'react-native';
import { PropComponent, Props } from '@/components/PropComponent';

type OnPressHandler = (color: string) => void;
type Renderer = (hexCode: string, index: number) => React.JSX.Element;
type Mapper = (onPress?: OnPressHandler, disabled?: boolean) => Renderer;

interface ColorListProps extends Props {
    colors: string[];
    onPress?: OnPressHandler;
}

const getColorElement: Mapper = (
    onPress?: OnPressHandler,
    disabled?: boolean
) => {
    return (hexCode: string, index: number) => (
        <ColorButton
            color={hexCode}
            key={index}
            disabled={disabled}
            onPress={(): void => (onPress ? onPress(hexCode) : undefined)}
        />
    );
};

const ColorList: PropComponent<ColorListProps> = (
    props: ColorListProps
): React.JSX.Element => {
    const { colors, disabled, onPress } = props;

    return (
        <View style={styles.container}>
            {colors.map(getColorElement(onPress, disabled))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    }
});

export default ColorList;
