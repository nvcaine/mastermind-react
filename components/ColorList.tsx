import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ColorButton from '@/components/ColorButton';
import { EventParamCallback } from '@/constants/Events';
import { PropComponent, Props } from '@/components/PropComponent';

type Renderer = (hexCode: string, index: number) => React.JSX.Element;
type Mapper = (
    onPress?: EventParamCallback<string>,
    disabled?: boolean
) => Renderer;

interface ColorListProps extends Props {
    colors: string[];
    onPress?: EventParamCallback<string>;
}

const getColorElement: Mapper = (
    onPress?: EventParamCallback<string>,
    disabled?: boolean
): Renderer => {
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
        backgroundColor: 'transparent',
        flexDirection: 'row'
    }
});

export default ColorList;
