import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GameTier } from '@/constants/GameLevels';

interface TierAccordionProps {
    tier: GameTier;
    initiallyExpanded?: boolean;
    children: React.ReactNode;
    badgeText?: string;
}

export const TierAccordion: React.FC<TierAccordionProps> = ({
    tier,
    initiallyExpanded = true,
    children,
    badgeText
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(initiallyExpanded);

    const toggleExpanded = (): void => {
        setIsExpanded((prev: boolean) => !prev);
    };

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleExpanded}
                style={styles.headerButton}
            >
                <View style={styles.headerLeft}>
                    <View style={styles.iconBadge}>
                        <FontAwesome name="cubes" size={14} color="#38BDF8" />
                    </View>
                    <View>
                        <Text style={styles.tierTitle}>{tier.title}</Text>
                        <Text style={styles.tierSubtitle}>
                            {tier.colorsLength} Code Pegs • 5 Challenge Levels
                        </Text>
                    </View>
                </View>

                <View style={styles.headerRight}>
                    {badgeText ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeLabel}>{badgeText}</Text>
                        </View>
                    ) : null}
                    <FontAwesome
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color="#94A3B8"
                    />
                </View>
            </TouchableOpacity>

            {isExpanded ? <View style={styles.content}>{children}</View> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    accordionContainer: {
        backgroundColor: '#1E293B',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden'
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#1E293B'
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1
    },
    iconBadge: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: 'rgba(56, 189, 248, 0.15)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tierTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F8FAFC',
        marginBottom: 2
    },
    tierSubtitle: {
        fontSize: 12,
        color: '#94A3B8'
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3
    },
    badgeLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#CBD5E1'
    },
    content: {
        paddingHorizontal: 14,
        paddingBottom: 14,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.06)',
        gap: 12
    }
});

export default TierAccordion;
