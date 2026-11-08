import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { PropComponent, Props } from '@/components/PropComponent';

interface ColorButtonProps extends Props {
    color: string;
    size?: number;
    onPress?: () => void;
}

const ColorButton: PropComponent<ColorButtonProps> = (
    props: ColorButtonProps
): React.JSX.Element => {
    const { color, disabled, onPress, size = 42 } = props;
    const isSocket = !color || color === 'transparent';

    const borderRadius = size / 2;

    if (isSocket) {
        return (
            <View
                style={[
                    styles.socket,
                    {
                        width: size,
                        height: size,
                        borderRadius
                    }
                ]}
            >
                <View
                    style={[
                        styles.socketInner,
                        {
                            width: size * 0.4,
                            height: size * 0.4,
                            borderRadius: (size * 0.4) / 2
                        }
                    ]}
                />
            </View>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                {
                    backgroundColor: color,
                    width: size,
                    height: size,
                    borderRadius
                }
            ]}
        >
            {/* Top glossy specular highlight */}
            <View
                style={[
                    styles.glossHighlight,
                    {
                        width: size * 0.65,
                        height: size * 0.28,
                        borderRadius: size * 0.15,
                        top: size * 0.08
                    }
                ]}
            />
            {/* Bottom reflection accent */}
            <View
                style={[
                    styles.bottomSheen,
                    {
                        width: size * 0.4,
                        height: size * 0.12,
                        borderRadius: size * 0.06,
                        bottom: size * 0.08
                    }
                ]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative'
    },
    glossHighlight: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        alignSelf: 'center'
    },
    bottomSheen: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignSelf: 'center'
    },
    socket: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 2,
        borderStyle: 'dashed',
        marginHorizontal: 6
    },
    socketInner: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)'
    }
});

export default ColorButton;
