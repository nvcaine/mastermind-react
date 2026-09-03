import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ColorList from '@/components/ColorList';
import { SetData } from '@/constants/HexCodes';
import { MonoText } from '@/components/StyledText';
import { PropComponent, Props } from '@/components/PropComponent';

interface EvaluatedSetProps extends Props {
    set: SetData;
    hideLabels?: boolean;
}

const ColorSet: PropComponent<EvaluatedSetProps> = (
    props: EvaluatedSetProps
): React.JSX.Element => {
    const { set, hideLabels } = props;
    const labelStyle = hideLabels
        ? [styles.hidden, styles.label]
        : styles.label;

    return (
        <View style={styles.container}>
            <MonoText style={[styles.correct, labelStyle]}>
                {set.correct}
            </MonoText>
            <ColorList colors={set.colors} disabled={true} />
            <MonoText style={[styles.offset, labelStyle]}>
                {set.offset}
            </MonoText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        paddingVertical: 5
    },
    label: {
        height: 40,
        fontSize: 16,
        lineHeight: 40,
        paddingHorizontal: 10
    },
    correct: {
        color: '#2C4'
    },
    offset: {
        color: '#C44'
    },
    hidden: {
        opacity: 0
    }
});

export default ColorSet;
