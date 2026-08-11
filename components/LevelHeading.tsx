import React from 'react';
import { PropComponent } from '@/components/PropComponent';
import { View } from '@/components/Themed';
import { MonoText } from '@/components/StyledText';
import { StyleSheet } from 'react-native';

interface LevelHeadingProps {
    level: number;
    colorsLength: number;
}

const LevelHeading: PropComponent<LevelHeadingProps> = (
    props: LevelHeadingProps
) => {
    const { level, colorsLength } = props;

    return (
        <View style={styles.heading}>
            <MonoText>
                Level: {level} ({colorsLength} colors)
            </MonoText>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        alignItems: 'center'
    }
});

export default LevelHeading;
