import { PropComponent, Props } from '@/components/PropComponent';
import React from 'react';
import { View } from '@/components/Themed';
import { MonoText } from '@/components/StyledText';
import ColorList from '@/components/ColorList';
import { StyleSheet } from 'react-native';

interface EvaluatedSetProps extends Props {
    set: EvaluatedSetObject;
}

export interface EvaluatedSetObject {
    colors: string[];
    correct: number; // right color, right position
    offset: number; // right color, wrong position
}

const EvaluatedSet: PropComponent<EvaluatedSetProps> = (
    props: EvaluatedSetProps
): React.JSX.Element => {
    const { set } = props;

    return (
        <View style={styles.container}>
            <MonoText style={styles.label}>{set.correct}</MonoText>
            <ColorList colors={set.colors} disabled={true} />
            <MonoText style={styles.label}>{set.offset}</MonoText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    label: {
        padding: 4
    }
});

export default EvaluatedSet;
