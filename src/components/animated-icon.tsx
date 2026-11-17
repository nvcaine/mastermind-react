import * as SplashScreen from 'expo-splash-screen';
import { JSX, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const DURATION = 600;
const PEG_SIZE = 120;

function SplashPeg(): JSX.Element {
    return (
        <View style={styles.peg}>
            <View style={styles.glossHighlight} />
            <View style={styles.bottomSheen} />
        </View>
    );
}

export function AnimatedSplashOverlay() {
    const [animate, setAnimate] = useState(false);
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const splashKeyframe = new Keyframe({
        0: {
            transform: [{ scale: 1 }],
            opacity: 1
        },
        20: {
            opacity: 1
        },
        70: {
            opacity: 0,
            easing: Easing.elastic(0.7)
        },
        100: {
            opacity: 0,
            transform: [{ scale: 1 }],
            easing: Easing.elastic(0.7)
        }
    });

    return animate ? (
        <Animated.View
            entering={splashKeyframe
                .duration(DURATION)
                .withCallback((finished) => {
                    'worklet';
                    if (finished) {
                        scheduleOnRN(setVisible, false);
                    }
                })}
            style={styles.splashOverlay}
        >
            <SplashPeg />
        </Animated.View>
    ) : (
        <View
            onLayout={() => {
                SplashScreen.hideAsync().finally(() => {
                    setAnimate(true);
                });
            }}
            style={styles.splashOverlay}
        >
            <SplashPeg />
        </View>
    );
}

const styles = StyleSheet.create({
    splashOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#0B0F19',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    peg: {
        width: PEG_SIZE,
        height: PEG_SIZE,
        borderRadius: PEG_SIZE / 2,
        backgroundColor: '#1E293B',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5
    },
    glossHighlight: {
        position: 'absolute',
        top: PEG_SIZE * 0.08,
        width: PEG_SIZE * 0.65,
        height: PEG_SIZE * 0.28,
        borderRadius: PEG_SIZE * 0.15,
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
        alignSelf: 'center'
    },
    bottomSheen: {
        position: 'absolute',
        bottom: PEG_SIZE * 0.08,
        width: PEG_SIZE * 0.4,
        height: PEG_SIZE * 0.12,
        borderRadius: PEG_SIZE * 0.06,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignSelf: 'center'
    }
});
