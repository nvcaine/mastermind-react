import React from 'react';
import { Modal, Pressable, StyleSheet, View, Text } from 'react-native';
import { EventCallback } from '@/constants/Events';
import { PropComponent, Props } from '@/components/PropComponent';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface WinModalProps extends Props {
    visible: boolean;
    onClose: EventCallback;
    onNextLevel: EventCallback;
    showRestart: boolean;
}

const WinModal: PropComponent<WinModalProps> = (
    props: WinModalProps
): React.JSX.Element => {
    const { visible, onClose, onNextLevel, showRestart } = props;
    const label: string = !showRestart
        ? 'You cracked the secret combination!'
        : 'Congratulations! You beat all levels!';
    const buttonLabel: string = !showRestart ? 'Next Level' : 'Restart Game';
    const icon: 'arrow-right' | 'refresh' = !showRestart
        ? 'arrow-right'
        : 'refresh';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    {/* Glowing Trophy Ring */}
                    <View style={styles.trophyRing}>
                        <FontAwesome name="trophy" size={36} color="#F59E0B" />
                    </View>

                    {/* Headline */}
                    <Text style={styles.title}>
                        {!showRestart
                            ? 'CHALLENGE CRACKED!'
                            : 'MASTERMIND CHAMPION!'}
                    </Text>

                    {/* Subtitle */}
                    <Text style={styles.subtitle}>{label}</Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonsRow}>
                        <Pressable
                            onPress={onNextLevel}
                            style={({ pressed }) => [
                                styles.primaryButton,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <Text style={styles.primaryButtonText}>
                                {buttonLabel}
                            </Text>
                            <FontAwesome
                                name={icon}
                                size={14}
                                color="#FFFFFF"
                            />
                        </Pressable>

                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.secondaryButton,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <FontAwesome
                                name="rotate-left"
                                size={14}
                                color="#94A3B8"
                            />
                            <Text style={styles.secondaryButtonText}>
                                Replay
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(11, 15, 25, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    modalCard: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#1E293B',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1,
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10
    },
    trophyRing: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderColor: 'rgba(245, 158, 11, 0.35)',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#F8FAFC',
        letterSpacing: 1,
        marginBottom: 8,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24
    },
    buttonsRow: {
        width: '100%',
        gap: 12
    },
    primaryButton: {
        backgroundColor: '#2563EB',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700'
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    secondaryButtonText: {
        color: '#CBD5E1',
        fontSize: 14,
        fontWeight: '600'
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }]
    }
});

export default WinModal;
