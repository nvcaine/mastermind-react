import { JSX } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PropComponent } from '@/components/PropComponent';

interface LevelStateProps {
    bg: string;
    color: string;
    label: string;
    overallIndex: number;
}

const LevelState: PropComponent<LevelStateProps> = (
    props: LevelStateProps
): JSX.Element => (
    <View style={styles.levelInfo}>
        <Text style={styles.levelNumber}>LEVEL {props.overallIndex + 1}</Text>
        <View
            style={[
                styles.diffBadge,
                {
                    backgroundColor: props.bg
                }
            ]}
        >
            <Text
                style={[
                    styles.diffText,
                    {
                        color: props.color
                    }
                ]}
            >
                {props.label}
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    levelInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    levelNumber: {
        fontSize: 15,
        fontWeight: '800',
        color: '#F8FAFC',
        letterSpacing: 0.5
    },
    diffBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8
    },
    diffText: {
        fontSize: 11,
        fontWeight: '700'
    }
});

export default LevelState;
