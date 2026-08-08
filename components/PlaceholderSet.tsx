import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import EvaluatedSet, { EvaluatedSetObject } from '@/components/EvaluatedSet';
import { PropComponent, Props } from '@/components/PropComponent';

export interface PlaceholderSetProps extends Props {
    colorLength: number;
}

const PlaceholderSet: PropComponent<PlaceholderSetProps> = (
    props: PlaceholderSetProps
) => {
    const { colorLength } = props;
    const defaultSet: EvaluatedSetObject = {
        colors: Array(colorLength).fill('transparent'),
        correct: 0,
        offset: 0
    };

    return (
        <View style={[styles.hidden, styles.noHeight]}>
            <EvaluatedSet set={defaultSet} />
        </View>
    );
};

const styles = StyleSheet.create({
    noHeight: {
        height: 0,
        overflow: 'hidden'
    },
    hidden: {
        visibility: 'hidden'
    }
});

export default PlaceholderSet;
