import { JSX } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PropComponent } from '@/components/PropComponent';

interface LevelButtonProps {
    handleSelectLevel: (level: number) => void;
    overallIndex: number;
    passed: boolean;
    unlocked: boolean;
}

const LevelButton: PropComponent<LevelButtonProps> = (
    props: LevelButtonProps
): JSX.Element => (
    <View>
        {props.passed ? (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.replayButton}
                onPress={() => props.handleSelectLevel(props.overallIndex)}
            >
                <FontAwesome name="repeat" size={11} color="#FFFFFF" />
                <Text style={styles.playButtonText}>Replay</Text>
            </TouchableOpacity>
        ) : props.unlocked ? (
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.playButton}
                onPress={() => props.handleSelectLevel(props.overallIndex)}
            >
                <Text style={styles.playButtonText}>Play</Text>
                <FontAwesome name="play" size={10} color="#FFFFFF" />
            </TouchableOpacity>
        ) : (
            <View style={styles.padlockContainer}>
                <FontAwesome name="lock" size={14} color="#64748B" />
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    playButton: {
        backgroundColor: '#2563EB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    replayButton: {
        backgroundColor: '#0D9488',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    playButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700'
    },
    padlockContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40
    }
});

export default LevelButton;
