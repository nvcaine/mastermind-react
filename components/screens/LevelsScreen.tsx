import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Router, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GameTiers, GameTier, GameLevel } from '@/constants/GameLevels';
import { HexCodes } from '@/constants/HexCodes';
import { PropComponent } from '@/components/PropComponent';
import {
    getLastPassedLevel,
    isLevelPassed,
    isLevelUnlocked,
    setSelectedLevel
} from '@/constants/storage';
import TierAccordion from '@/components/TierAccordion';

const allColors = Object.values(HexCodes);

interface DifficultyLabel {
    label: string;
    color: string;
    bg: string;
}

const difficultyLabels: DifficultyLabel[] = [
    { label: 'Beginner', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
    { label: 'Casual', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
    { label: 'Challenger', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
    { label: 'Expert', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
    { label: 'Mastermind', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' }
];

const LevelsScreen: PropComponent<any> = (): React.JSX.Element => {
    const router: Router = useRouter();
    const [lastPassed, setLastPassed] = useState<number>(() =>
        getLastPassedLevel()
    );

    // Refresh progress when navigating to this screen
    useFocusEffect(
        useCallback((): void => {
            setLastPassed(getLastPassedLevel());
        }, [])
    );

    const handleSelectLevel = (overallIndex: number): void => {
        setSelectedLevel(overallIndex);
        router.push('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header Title */}
                <View style={styles.header}>
                    <Text style={styles.title}>Game Tiers & Levels</Text>
                    <Text style={styles.subtitle}>
                        Conquer 4 tiers of escalating challenge, expanding peg
                        lengths, and richer color pools
                    </Text>
                </View>

                <View style={styles.tiersContainer}>
                    {GameTiers.map((tier: GameTier, tierIndex: number) => {
                        const startIdx: number = tierIndex * 5;
                        // const endIdx = startIdx + 4;
                        const passedInTier: number = Math.max(
                            0,
                            Math.min(5, lastPassed - startIdx + 1)
                        );
                        const isTierUnlocked: boolean = isLevelUnlocked(
                            startIdx,
                            lastPassed
                        );

                        return (
                            <TierAccordion
                                key={tier.tierNumber}
                                tier={tier}
                                initiallyExpanded={isTierUnlocked}
                                badgeText={`${passedInTier}/5 Won`}
                            >
                                <View style={styles.cardsContainer}>
                                    {tier.levels.map(
                                        (
                                            lvl: GameLevel,
                                            localIndex: number
                                        ) => {
                                            const overallIndex: number =
                                                startIdx + localIndex;
                                            const diff: DifficultyLabel =
                                                difficultyLabels[localIndex] ??
                                                difficultyLabels[0];
                                            const passed: boolean = isLevelPassed(
                                                overallIndex,
                                                lastPassed
                                            );
                                            const unlocked: boolean = isLevelUnlocked(
                                                overallIndex,
                                                lastPassed
                                            );
                                            const availableSwatches =
                                                allColors.slice(
                                                    0,
                                                    lvl.availableColors
                                                );

                                            return (
                                                <View
                                                    key={overallIndex}
                                                    style={[
                                                        styles.levelCard,
                                                        !unlocked &&
                                                            styles.levelCardLocked
                                                    ]}
                                                >
                                                    <View
                                                        style={
                                                            styles.cardHeader
                                                        }
                                                    >
                                                        <View
                                                            style={
                                                                styles.levelInfo
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.levelNumber
                                                                }
                                                            >
                                                                LEVEL{' '}
                                                                {overallIndex +
                                                                    1}
                                                            </Text>
                                                            <View
                                                                style={[
                                                                    styles.diffBadge,
                                                                    {
                                                                        backgroundColor:
                                                                            diff.bg
                                                                    }
                                                                ]}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.diffText,
                                                                        {
                                                                            color: diff.color
                                                                        }
                                                                    ]}
                                                                >
                                                                    {diff.label}
                                                                </Text>
                                                            </View>
                                                            {passed ? (
                                                                <View
                                                                    style={
                                                                        styles.passedBadge
                                                                    }
                                                                >
                                                                    <FontAwesome
                                                                        name="check"
                                                                        size={
                                                                            10
                                                                        }
                                                                        color="#10B981"
                                                                    />
                                                                    <Text
                                                                        style={
                                                                            styles.passedText
                                                                        }
                                                                    >
                                                                        Passed
                                                                    </Text>
                                                                </View>
                                                            ) : null}
                                                        </View>

                                                        {/* Action Button: Replay, Play, or Padlock */}
                                                        {passed ? (
                                                            <TouchableOpacity
                                                                activeOpacity={
                                                                    0.7
                                                                }
                                                                style={
                                                                    styles.replayButton
                                                                }
                                                                onPress={() =>
                                                                    handleSelectLevel(
                                                                        overallIndex
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesome
                                                                    name="repeat"
                                                                    size={11}
                                                                    color="#FFFFFF"
                                                                />
                                                                <Text
                                                                    style={
                                                                        styles.playButtonText
                                                                    }
                                                                >
                                                                    Replay
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ) : unlocked ? (
                                                            <TouchableOpacity
                                                                activeOpacity={
                                                                    0.7
                                                                }
                                                                style={
                                                                    styles.playButton
                                                                }
                                                                onPress={() =>
                                                                    handleSelectLevel(
                                                                        overallIndex
                                                                    )
                                                                }
                                                            >
                                                                <Text
                                                                    style={
                                                                        styles.playButtonText
                                                                    }
                                                                >
                                                                    Play
                                                                </Text>
                                                                <FontAwesome
                                                                    name="play"
                                                                    size={10}
                                                                    color="#FFFFFF"
                                                                />
                                                            </TouchableOpacity>
                                                        ) : (
                                                            <View
                                                                style={
                                                                    styles.padlockContainer
                                                                }
                                                            >
                                                                <FontAwesome
                                                                    name="lock"
                                                                    size={14}
                                                                    color="#64748B"
                                                                />
                                                            </View>
                                                        )}
                                                    </View>

                                                    {/* Specs */}
                                                    <View
                                                        style={styles.specsRow}
                                                    >
                                                        <View
                                                            style={
                                                                styles.specItem
                                                            }
                                                        >
                                                            <FontAwesome
                                                                name="circle"
                                                                size={12}
                                                                color="#38BDF8"
                                                            />
                                                            <Text
                                                                style={
                                                                    styles.specText
                                                                }
                                                            >
                                                                {
                                                                    lvl.colorsLength
                                                                }{' '}
                                                                Code Pegs
                                                            </Text>
                                                        </View>
                                                        <View
                                                            style={
                                                                styles.specItem
                                                            }
                                                        >
                                                            <FontAwesome
                                                                name="th"
                                                                size={12}
                                                                color="#A855F7"
                                                            />
                                                            <Text
                                                                style={
                                                                    styles.specText
                                                                }
                                                            >
                                                                {
                                                                    lvl.availableColors
                                                                }{' '}
                                                                Color Pool
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    {/* Color Swatch Preview */}
                                                    <View
                                                        style={
                                                            styles.swatchContainer
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.swatchLabel
                                                            }
                                                        >
                                                            Pool:
                                                        </Text>
                                                        <View
                                                            style={
                                                                styles.swatchRow
                                                            }
                                                        >
                                                            {availableSwatches.map(
                                                                (
                                                                    hex: string,
                                                                    i: number
                                                                ) => (
                                                                    <View
                                                                        key={i}
                                                                        style={[
                                                                            styles.swatchDot,
                                                                            {
                                                                                backgroundColor:
                                                                                    hex
                                                                            }
                                                                        ]}
                                                                    />
                                                                )
                                                            )}
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        }
                                    )}
                                </View>
                            </TierAccordion>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0B0F19'
    },
    container: {
        flex: 1,
        backgroundColor: '#0B0F19'
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 4
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#F8FAFC',
        letterSpacing: 0.5,
        marginBottom: 4
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        lineHeight: 20
    },
    tiersContainer: {
        gap: 4
    },
    cardsContainer: {
        gap: 12,
        paddingTop: 4
    },
    levelCard: {
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderRadius: 14,
        padding: 14
    },
    levelCardLocked: {
        opacity: 0.55,
        backgroundColor: 'rgba(15, 23, 42, 0.4)'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
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
    },
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
    },
    specsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)'
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    specText: {
        fontSize: 12,
        color: '#CBD5E1',
        fontWeight: '500'
    },
    swatchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    swatchLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600'
    },
    swatchRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5
    },
    swatchDot: {
        width: 13,
        height: 13,
        borderRadius: 6.5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    }
});

export default LevelsScreen;
