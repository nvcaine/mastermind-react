import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ColorList from '@/components/ColorList';
import { MonoText } from '@/components/StyledText';
import { PropComponent, Props } from '@/components/PropComponent';

interface EvaluatedSetProps extends Props {
    set: EvaluatedSetObject;
    hideLabels?: boolean;
}

export interface EvaluatedSetObject {
    colors: string[];
    correct: number; // right color, right position
    offset: number; // right color, wrong position
}

type Mapper = (set: EvaluatedSetObject, index: number) => React.JSX.Element;
type Checker = (colors: string[], solution: string[]) => EvaluatedSetObject;

export const getSetElement: Mapper = (
    set: EvaluatedSetObject,
    index: number
) => <EvaluatedSet set={set} key={index} />;

export const evaluate: Checker = (
    colors: string[],
    solution: string[]
): EvaluatedSetObject => {
    let correct: number = 0;
    let offset: number = 0;

    for (let i: number = 0; i < colors.length; i++) {
        if (colors[i] === solution[i]) {
            correct++;
            continue;
        }

        for (let j: number = 0; j < solution.length; j++) {
            if (colors[i] === solution[j] && i !== j) {
                offset++;
            }
        }
    }

    console.log('Evaluated:', colors, correct, offset);

    return { colors, correct, offset };
};

const EvaluatedSet: PropComponent<EvaluatedSetProps> = (
    props: EvaluatedSetProps
): React.JSX.Element => {
    const { set, hideLabels } = props;
    const labelStyle = hideLabels
        ? [styles.hidden, styles.label]
        : styles.label;

    return (
        <View style={styles.container}>
            <MonoText style={labelStyle}>{set.correct}</MonoText>
            <ColorList colors={set.colors} disabled={true} />
            <MonoText style={labelStyle}>{set.offset}</MonoText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 5
    },
    label: {
        padding: 5
    },
    hidden: {
        visibility: 'hidden',
        color: 'black'
    }
});

export default EvaluatedSet;
