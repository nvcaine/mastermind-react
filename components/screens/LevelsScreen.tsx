import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GameLevels, GameLevel } from '@/constants/GameLevels';
import { HexCodes } from '@/constants/HexCodes';
import { PropComponent } from '@/components/PropComponent';

const difficultyLabels = [
    { label: 'Beginner', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
    { label: 'Casual', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)' },
    { label: 'Challenger', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
    { label: 'Expert', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
    { label: 'Mastermind', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' }
];

const allColors = Object.values(HexCodes);

const LevelsScreen: PropComponent<any> = (): React.JSX.Element => {
    const router = useRouter();

    const handleSelectLevel = () => {
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
                    <Text style={styles.title}>Game Levels</Text>
                    <Text style={styles.subtitle}>
                        Progressively harder challenges with larger color pools
                    </Text>
                </View>

                {/* Level Cards */}
                <View style={styles.cardsContainer}>
                    {GameLevels.map((lvl: GameLevel, index: number) => {
                        const diff =
                            difficultyLabels[index] ?? difficultyLabels[0];
                        const availableSwatches = allColors.slice(
                            0,
                            lvl.availableColors
                        );

                        return (
                            <View key={index} style={styles.levelCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.levelInfo}>
                                        <Text style={styles.levelNumber}>
                                            LEVEL {index + 1}
                                        </Text>
                                        <View
                                            style={[
                                                styles.diffBadge,
                                                { backgroundColor: diff.bg }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.diffText,
                                                    { color: diff.color }
                                                ]}
                                            >
                                                {diff.label}
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={styles.playButton}
                                        onPress={handleSelectLevel}
                                    >
                                        <Text style={styles.playButtonText}>
                                            Play
                                        </Text>
                                        <FontAwesome
                                            name="play"
                                            size={10}
                                            color="#FFFFFF"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Specs */}
                                <View style={styles.specsRow}>
                                    <View style={styles.specItem}>
                                        <FontAwesome
                                            name="circle"
                                            size={12}
                                            color="#38BDF8"
                                        />
                                        <Text style={styles.specText}>
                                            {lvl.colorsLength} Code Pegs
                                        </Text>
                                    </View>
                                    <View style={styles.specItem}>
                                        <FontAwesome
                                            name="th"
                                            size={12}
                                            color="#A855F7"
                                        />
                                        <Text style={styles.specText}>
                                            {lvl.availableColors} Color Pool
                                        </Text>
                                    </View>
                                </View>

                                {/* Color Swatch Preview */}
                                <View style={styles.swatchContainer}>
                                    <Text style={styles.swatchLabel}>
                                        Pool:
                                    </Text>
                                    <View style={styles.swatchRow}>
                                        {availableSwatches.map(
                                            (hex: string, i: number) => (
                                                <View
                                                    key={i}
                                                    style={[
                                                        styles.swatchDot,
                                                        { backgroundColor: hex }
                                                    ]}
                                                />
                                            )
                                        )}
                                    </View>
                                </View>
                            </View>
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
    cardsContainer: {
        gap: 14
    },
    levelCard: {
        backgroundColor: '#1E293B',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    levelInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    levelNumber: {
        fontSize: 16,
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
    playButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 7,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    playButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700'
    },
    specsRow: {
        flexDirection: 'row',
        gap: 18,
        marginBottom: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)'
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
        gap: 6
    },
    swatchDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)'
    }
});

export default LevelsScreen;
