import React, { useState } from 'react';
import { View } from '@/components/Themed';
import { NativeEventEmitter } from 'react-native';
import { HexCodes } from '@/constants/HexCodes';
import { Events } from '@/constants/Events';
import ColorList from '@/components/ColorList';
import { PropComponent, Props } from '@/components/PropComponent';

interface ColorMenuProps extends Props {
    emitter: NativeEventEmitter;
    maxColors: number;
}

type ColorSetter = (hexCode: string) => void;
type ColorsSetter = (colors: string[]) => void;

const getOnPressHandler = (
    emitter: NativeEventEmitter,
    colors: string[],
    setColors: ColorsSetter,
    maxColors: number
): ColorSetter => {
    return (hexCode: string): void => {
        const currentColors: string[] = colors.concat([hexCode]);

        setColors(currentColors);
        console.log('Current colors:', currentColors);

        if (currentColors.length === maxColors) {
            emitter.emit(Events.SUBMIT_SET, currentColors);
            setColors([]);
            console.log('Submitted colors:', currentColors);
        }
    };
};

const ColorMenu: PropComponent<ColorMenuProps> = (
    props: ColorMenuProps
): React.JSX.Element => {
    const [colors, setColors] = useState<string[]>([]);
    const { emitter, maxColors } = props;
    const hexCodes: string[] = Object.values(HexCodes);
    const onPress: ColorSetter = getOnPressHandler(
        emitter,
        colors,
        setColors,
        maxColors
    );

    return (
        <View>
            <ColorList colors={colors} disabled={true} />
            <ColorList colors={hexCodes} onPress={onPress} />
        </View>
    );
};

export default ColorMenu;
