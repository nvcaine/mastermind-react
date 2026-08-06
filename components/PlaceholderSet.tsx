import { View } from '@/components/Themed';
import EvaluatedSet, { EvaluatedSetObject } from '@/components/EvaluatedSet';
import React from 'react';
import { PropComponent } from '@/components/PropComponent';
import { StyleSheet } from 'react-native';

const PlaceholderSet: PropComponent<{}> = () => {
    const defaultSet: EvaluatedSetObject = {
        colors: ['transparent', 'transparent', 'transparent', 'transparent'],
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
