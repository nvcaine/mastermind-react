import { JSX } from 'react';
import {
    NativeEventEmitter,
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ColorList from '@/components/ColorList';
import { HexCodes } from '@/constants/HexCodes';
import { ParamCallback, Events } from '@/constants/Events';
import { PropComponent, Props } from '@/components/PropComponent';

interface ColorMenuProps extends Props {
    emitter: NativeEventEmitter;
    availableColors: number;
}

type PressHandler = (emitter: NativeEventEmitter) => ParamCallback<string>;

const getOnPressHandler: PressHandler = (
    emitter: NativeEventEmitter
): ParamCallback<string> => {
    return (hexCode: string): void => {
        emitter.emit(Events.ADD_COLOR, hexCode);
    };
};

const ColorMenu: PropComponent<ColorMenuProps> = (
    props: ColorMenuProps
): JSX.Element => {
    const { emitter, availableColors } = props;
    const hexCodes: string[] = Object.values(HexCodes).slice(
        0,
        availableColors
    );
    const onPress: ParamCallback<string> = getOnPressHandler(emitter);

    const onUndo = (): void => {
        emitter.emit(Events.UNDO_COLOR);
    };

    return (
        <View style={styles.dockWrapper}>
            <View style={styles.dock}>
                {/* Header hint */}
                <View style={styles.dockHeader}>
                    <Text style={styles.dockTitle}>SELECT PEG COLOR</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onUndo}
                        style={styles.undoButton}
                    >
                        <FontAwesome name="undo" size={13} color="#94A3B8" />
                        <Text style={styles.undoText}>Undo</Text>
                    </TouchableOpacity>
                </View>

                {/* Color swatches */}
                <View style={styles.paletteRow}>
                    <ColorList colors={hexCodes} onPress={onPress} size={38} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dockWrapper: {
        width: '100%',
        paddingHorizontal: 12,
        paddingBottom: 16,
        paddingTop: 8,
        backgroundColor: '#0B0F19'
    },
    dock: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6
    },
    dockHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 6
    },
    dockTitle: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#94A3B8'
    },
    undoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4
    },
    undoText: {
        fontSize: 12,
        color: '#CBD5E1',
        fontWeight: '600'
    },
    paletteRow: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4
    }
});

export default ColorMenu;
