import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ColorList from '@/components/ColorList';
import { SetData } from '@/constants/HexCodes';
import { MonoText } from '@/components/StyledText';
import { PropComponent, Props } from '@/components/PropComponent';

interface EvaluatedSetProps extends Props {
    set: SetData;
    hideLabels?: boolean;
    attemptIndex?: number;
    totalSlots?: number;
}

const ColorSet: PropComponent<EvaluatedSetProps> = (
    props: EvaluatedSetProps
): React.JSX.Element => {
    const { set, hideLabels, attemptIndex, totalSlots } = props;

    // Build display colors padded with empty sockets if needed
    let displayColors = set?.colors ?? [];
    if (totalSlots && totalSlots > displayColors.length) {
        const remaining = totalSlots - displayColors.length;
        displayColors = displayColors.concat(
            Array(remaining).fill('transparent')
        );
    }

    const isCurrentActive = Boolean(hideLabels);

    return (
        <View
            style={[
                styles.card,
                isCurrentActive ? styles.activeCard : styles.completedCard
            ]}
        >
            {/* Left: Attempt Number */}
            <View style={styles.attemptContainer}>
                {attemptIndex !== undefined ? (
                    <MonoText style={styles.attemptText}>
                        {attemptIndex < 9
                            ? `0${attemptIndex + 1}`
                            : attemptIndex + 1}
                    </MonoText>
                ) : (
                    <MonoText style={styles.attemptTextMuted}>•</MonoText>
                )}
            </View>

            {/* Center: Pegs */}
            <View style={styles.pegsContainer}>
                <ColorList colors={displayColors} disabled={true} size={38} />
            </View>

            {/* Right: Clue badges or Active Indicator */}
            <View style={styles.cluesContainer}>
                {isCurrentActive ? (
                    <View style={styles.activePill}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeLabel}>Pick</Text>
                    </View>
                ) : (
                    <View style={styles.clueBadgesRow}>
                        {/* Exact match badge */}
                        <View style={styles.clueBadgeExact}>
                            <FontAwesome
                                name="check"
                                size={11}
                                color="#10B981"
                            />
                            <Text style={styles.clueCountExact}>
                                {set.correct}
                            </Text>
                        </View>

                        {/* Position offset badge */}
                        <View style={styles.clueBadgeOffset}>
                            <FontAwesome
                                name="repeat"
                                size={10}
                                color="#F59E0B"
                            />
                            <Text style={styles.clueCountOffset}>
                                {set.offset}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginVertical: 4,
        marginHorizontal: 12,
        borderWidth: 1
    },
    completedCard: {
        backgroundColor: '#1E293B',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2
    },
    activeCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.85)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderWidth: 1.5,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3
    },
    attemptContainer: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center'
    },
    attemptText: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '700'
    },
    attemptTextMuted: {
        color: '#475569',
        fontSize: 14
    },
    pegsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4
    },
    cluesContainer: {
        minWidth: 70,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    clueBadgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    clueBadgeExact: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        gap: 4
    },
    clueCountExact: {
        color: '#34D399',
        fontSize: 12,
        fontWeight: 'bold'
    },
    clueBadgeOffset: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        gap: 4
    },
    clueCountOffset: {
        color: '#FBBF24',
        fontSize: 12,
        fontWeight: 'bold'
    },
    activePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 5
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3B82F6'
    },
    activeLabel: {
        color: '#60A5FA',
        fontSize: 11,
        fontWeight: '600'
    }
});

export default ColorSet;
