import { JSX, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router/react-navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
    getLastPassedLevel,
    isLevelPassed,
    isLevelUnlocked,
    setSelectedLevel
} from '@/constants/storage';
import LevelSpecs from '@/components/LevelSpecs';
import LevelState from '@/components/LevelState';
import LevelSwatch from '@/components/LevelSwatch';
import LevelButton from '@/components/LevelButton';
import TierAccordion from '@/components/TierAccordion';
import { PropComponent } from '@/components/PropComponent';
import { GameTiers, GameTier, GameLevel } from '@/constants/GameLevels';

interface DifficultyLabel {
    label: string;
    color: string;
    bg: string;
}

const difficultyLabels: DifficultyLabel[] = [
    { label: 'Beginner', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
    { label: 'Casual', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
    { label: 'Challenger', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
    { label: 'Expert', color: '#F95316', bg: 'rgba(249, 55, 22, 0.15)' },
    { label: 'Mastermind', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' }
];

const renderer = (
    lastPassed: number,
    handleSelectLevel: (level: number) => void
) => {
    return (tier: GameTier, tierIndex: number) => {
        const startIndex: number = tierIndex * 5;
        const passedInTier: number = Math.max(
            0,
            Math.min(5, lastPassed - startIndex + 1)
        );
        const isTierUnlocked: boolean = isLevelUnlocked(startIndex, lastPassed);

        return (
            <TierAccordion
                key={tier.tierNumber}
                tier={tier}
                initiallyExpanded={isTierUnlocked}
                badgeText={`${passedInTier}/5 Won`}
            >
                <View style={styles.cardsContainer}>
                    {tier.levels.map((lvl: GameLevel, localIndex: number) => {
                        const overallIndex: number = startIndex + localIndex;
                        const diff: DifficultyLabel =
                            difficultyLabels[localIndex] ?? difficultyLabels[0];
                        const passed: boolean = isLevelPassed(
                            overallIndex,
                            lastPassed
                        );
                        const unlocked: boolean = isLevelUnlocked(
                            overallIndex,
                            lastPassed
                        );

                        return (
                            <View
                                key={overallIndex}
                                style={[
                                    styles.levelCard,
                                    !unlocked && styles.levelCardLocked
                                ]}
                            >
                                <View style={styles.cardHeader}>
                                    <LevelState
                                        bg={diff.bg}
                                        color={diff.color}
                                        label={diff.label}
                                        overallIndex={overallIndex}
                                        passed={passed}
                                    />

                                    <LevelButton
                                        handleSelectLevel={handleSelectLevel}
                                        overallIndex={overallIndex}
                                        passed={passed}
                                        unlocked={unlocked}
                                    />
                                </View>

                                <LevelSpecs
                                    colorsLength={lvl.colorsLength}
                                    availableColors={lvl.availableColors}
                                />

                                <LevelSwatch
                                    availableColors={lvl.availableColors}
                                />
                            </View>
                        );
                    })}
                </View>
            </TierAccordion>
        );
    };
};

const LevelsScreen: PropComponent<any> = (): JSX.Element => {
    const router = useRouter();
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
        router.push('/');
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
                    {GameTiers.map(renderer(lastPassed, handleSelectLevel))}
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
    }
});

export default LevelsScreen;
