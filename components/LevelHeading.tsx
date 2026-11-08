import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PropComponent } from '@/components/PropComponent';
import { getTierInfo } from '@/constants/GameLevels';

interface LevelHeadingProps {
    level: number;
    colorsLength: number;
}

const LevelHeading: PropComponent<LevelHeadingProps> = (
    props: LevelHeadingProps
): React.JSX.Element => {
    const { level, colorsLength } = props;
    const levelIndex = Math.max(0, level - 1);
    const tierInfo = getTierInfo(levelIndex);

    return (
        <View style={styles.container}>
            {/* Top row: Level Badge & Difficulty */}
            <View style={styles.topRow}>
                <View style={styles.levelBadge}>
                    <FontAwesome name="trophy" size={13} color="#F59E0B" />
                    <Text style={styles.levelTitle}>
                        TIER {tierInfo.tierNumber} • LEVEL{' '}
                        {tierInfo.levelInTier}
                    </Text>
                </View>

                <View style={styles.chipsContainer}>
                    <View style={styles.chipTier}>
                        <Text style={styles.chipTierText}>
                            Overall #{level}
                        </Text>
                    </View>
                    <View style={styles.chip}>
                        <Text style={styles.chipText}>{colorsLength} Pegs</Text>
                    </View>
                </View>
            </View>

            {/* Bottom row: Mini clue legend for quick reference */}
            <View style={styles.legendRow}>
                <Text style={styles.legendIntro}>Clues:</Text>
                <View style={styles.legendItem}>
                    <View style={styles.exactDot}>
                        <FontAwesome name="check" size={9} color="#10B981" />
                    </View>
                    <Text style={styles.legendText}>Right Position</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={styles.offsetDot}>
                        <FontAwesome name="repeat" size={8} color="#F59E0B" />
                    </View>
                    <Text style={styles.legendText}>Wrong Position</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: '#0B0F19',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        gap: 6
    },
    levelTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FBBF24',
        letterSpacing: 0.8
    },
    chipsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    chipTier: {
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        borderColor: 'rgba(56, 189, 248, 0.25)',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 9,
        paddingVertical: 5
    },
    chipTierText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#38BDF8'
    },
    chip: {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    chipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8'
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.04)',
        gap: 12
    },
    legendIntro: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600'
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    exactDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    offsetDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    legendText: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '500'
    }
});

export default LevelHeading;
