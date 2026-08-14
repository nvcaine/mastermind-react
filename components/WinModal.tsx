import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { EventCallback } from '@/constants/Events';
import { MonoText } from '@/components/StyledText';
import { PropComponent, Props } from '@/components/PropComponent';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface WinModalProps extends Props {
    visible: boolean;
    onClose: EventCallback;
    onNextLevel: EventCallback;
    showNext: boolean;
}

const WinModal: PropComponent<WinModalProps> = (
    props: WinModalProps
): React.JSX.Element => {
    const { visible, onClose, onNextLevel, showNext } = props;

    const replayButton: React.JSX.Element = (
        <Pressable onPress={onClose} style={styles.button}>
            <MonoText>Replay</MonoText>
            <FontAwesome name={'rotate-left'} style={styles.icon} />
        </Pressable>
    );

    const buttons: React.JSX.Element = (
        <View style={styles.buttons}>
            <Pressable onPress={onNextLevel} style={styles.button}>
                <MonoText>Next level</MonoText>
                <FontAwesome name={'play'} style={styles.icon} />
            </Pressable>
            {replayButton}
        </View>
    );

    return (
        <Modal animationType={'fade'} transparent={true} visible={visible}>
            <View style={styles.container}>
                <View style={styles.modal}>
                    <MonoText style={styles.label}>Way to go!</MonoText>

                    <MonoText style={styles.label}>
                        You found the solution!
                    </MonoText>
                    {showNext ? buttons : replayButton}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backdropFilter: 'blur(5px)',
        flex: 1,
        justifyContent: 'center'
    },
    modal: {
        alignItems: 'center',
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        padding: 20
    },
    label: {
        color: '#fff',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#29c',
        borderRadius: 5,
        flexDirection: 'row',
        lineHeight: 30,
        padding: 10,
        marginHorizontal: 10
    },
    buttons: {
        alignItems: 'stretch',
        flexDirection: 'row'
    },
    icon: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 20,
        paddingHorizontal: 5
    }
});

export default WinModal;
