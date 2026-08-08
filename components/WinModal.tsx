import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { PropComponent, Props } from '@/components/PropComponent';
import { MonoText } from '@/components/StyledText';

interface WinModalProps extends Props {
    visible: boolean;
    onClose: () => void;
    onNextLevel: () => void;
}

const WinModal: PropComponent<WinModalProps> = (
    props: WinModalProps
): React.JSX.Element => {
    const { visible, onClose, onNextLevel } = props;

    return (
        <Modal animationType={'fade'} transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.modal}>
                    <MonoText style={styles.label}>
                        You found the solution!
                    </MonoText>
                    <View>
                        <Pressable onPress={onNextLevel} style={styles.button}>
                            <MonoText>Next</MonoText>
                        </Pressable>
                        <Pressable onPress={onClose} style={styles.button}>
                            <MonoText>Replay</MonoText>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    modal: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20
    },
    label: {
        color: '#000',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#29c',
        padding: 10,
        marginHorizontal: 10
    }
});

export default WinModal;
