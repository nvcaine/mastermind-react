import { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import ColorButton from '@/components/ColorButton';
import { ParamCallback } from '@/constants/Events';
import { PropComponent, Props } from '@/components/PropComponent';

interface ColorListProps extends Props {
    colors: string[];
    onPress?: ParamCallback<string>;
    size?: number;
}

const ColorList: PropComponent<ColorListProps> = (
    props: ColorListProps
): JSX.Element => {
    const { colors, disabled, onPress, size } = props;

    if (!colors || !Array.isArray(colors)) {
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>
            {colors.map((hexCode: string, index: number) => (
                <ColorButton
                    color={hexCode}
                    key={index}
                    size={size}
                    disabled={disabled}
                    onPress={(): void =>
                        onPress ? onPress(hexCode) : undefined
                    }
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default ColorList;
