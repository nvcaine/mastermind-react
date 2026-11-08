import { JSX } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { PropComponent } from '@/components/PropComponent';

interface LevelStateProps {
    bg: string;
    color: string;
    label: string;
    overallIndex: number;
    passed: boolean;
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
        {props.passed ? (
            <View style={styles.passedBadge}>
                <FontAwesome name="check" size={10} color="#10B981" />
                <Text style={styles.passedText}>Passed</Text>
            </View>
        ) : null}
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
    },
    passedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 4
    },
    passedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#34D399'
    }
});

export default LevelState;
