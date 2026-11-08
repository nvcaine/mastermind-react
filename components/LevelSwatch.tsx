import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HexCodes } from '@/constants/HexCodes';
import { PropComponent } from '@/components/PropComponent';

interface ColorSwatchProps {
    availableColors: number;
}
const allColors = Object.values(HexCodes);

const LevelSwatch: PropComponent<ColorSwatchProps> = (
    props: ColorSwatchProps
): React.JSX.Element => {
    const availableSwatches = allColors.slice(0, props.availableColors);

    return (
        <View style={styles.swatchContainer}>
            <Text style={styles.swatchLabel}>Pool:</Text>
            <View style={styles.swatchRow}>
                {availableSwatches.map((hex: string, i: number) => (
                    <View
                        key={i}
                        style={[
                            styles.swatchDot,
                            {
                                backgroundColor: hex
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    swatchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    swatchLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600'
    },
    swatchRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5
    },
    swatchDot: {
        width: 13,
        height: 13,
        borderRadius: 6.5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    }
});

export default LevelSwatch;
