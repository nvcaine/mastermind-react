import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PropComponent } from '@/components/PropComponent';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen: PropComponent<any> = (): React.JSX.Element => (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Settings & Guide</Text>
                <Text style={styles.subtitle}>
                    Game rules, clue mechanics, and information
                </Text>
            </View>

            {/* How to Play Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <FontAwesome name="book" size={16} color="#38BDF8" />
                    <Text style={styles.cardTitle}>How to Play Mastermind</Text>
                </View>

                <Text style={styles.bodyText}>
                    The computer creates a hidden sequence of colored pegs. Your
                    goal is to deduce the secret combination in as few attempts
                    as possible.
                </Text>

                <View style={styles.clueExplanation}>
                    <View style={styles.clueRow}>
                        <View style={styles.clueBadgeExact}>
                            <FontAwesome
                                name="check"
                                size={11}
                                color="#10B981"
                            />
                            <Text style={styles.clueExactText}>✓ Exact</Text>
                        </View>
                        <Text style={styles.clueDesc}>
                            Correct color placed in the exact right position.
                        </Text>
                    </View>

                    <View style={styles.clueRow}>
                        <View style={styles.clueBadgeOffset}>
                            <FontAwesome
                                name="repeat"
                                size={10}
                                color="#F59E0B"
                            />
                            <Text style={styles.clueOffsetText}>⟲ Color</Text>
                        </View>
                        <Text style={styles.clueDesc}>
                            Correct color present in secret code, but in wrong
                            position.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Tips & Strategy */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <FontAwesome name="lightbulb-o" size={18} color="#F59E0B" />
                    <Text style={styles.cardTitle}>Winning Strategy</Text>
                </View>
                <View style={styles.tipList}>
                    <Text style={styles.tipItem}>
                        • Test distinct colors on your first guess to establish
                        which hues are in play.
                    </Text>
                    <Text style={styles.tipItem}>
                        • Use the <Text style={styles.boldText}>Undo</Text>{' '}
                        button in the dock if you tap a color by mistake.
                    </Text>
                    <Text style={styles.tipItem}>
                        • Track color positions across turns to isolate the
                        exact pegs.
                    </Text>
                </View>
            </View>

            {/* About Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <FontAwesome name="info-circle" size={16} color="#A855F7" />
                    <Text style={styles.cardTitle}>About Mastermind</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Game Version</Text>
                    <Text style={styles.infoValue}>1.0.0 Modern Edition</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Engine</Text>
                    <Text style={styles.infoValue}>
                        React Native + Expo Router
                    </Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
);

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
    card: {
        backgroundColor: '#1E293B',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F8FAFC'
    },
    bodyText: {
        fontSize: 13,
        color: '#CBD5E1',
        lineHeight: 20,
        marginBottom: 14
    },
    clueExplanation: {
        gap: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        padding: 12
    },
    clueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    clueBadgeExact: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        width: 80,
        gap: 5
    },
    clueExactText: {
        color: '#34D399',
        fontSize: 11,
        fontWeight: '700'
    },
    clueBadgeOffset: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        width: 80,
        gap: 5
    },
    clueOffsetText: {
        color: '#FBBF24',
        fontSize: 11,
        fontWeight: '700'
    },
    clueDesc: {
        flex: 1,
        fontSize: 12,
        color: '#94A3B8',
        lineHeight: 16
    },
    tipList: {
        gap: 8
    },
    tipItem: {
        fontSize: 13,
        color: '#94A3B8',
        lineHeight: 19
    },
    boldText: {
        color: '#F8FAFC',
        fontWeight: '600'
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)'
    },
    infoLabel: {
        fontSize: 13,
        color: '#94A3B8'
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#CBD5E1'
    }
});

export default SettingsScreen;
