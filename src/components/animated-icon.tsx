import * as SplashScreen from 'expo-splash-screen';
import { JSX, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolateColor,
    Keyframe,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { HexCodes } from '@/constants/HexCodes';

const DURATION = 600;
const MIN_VISIBLE_MS = 2000;
const PEG_SIZE = 120;
const GLOW_SIZE = PEG_SIZE * 1.5;
const GAME_COLORS = Object.values(HexCodes);
// To complete a full smooth loop back to the beginning:
const COLOR_CYCLE = [...GAME_COLORS, GAME_COLORS[0]];
const CYCLE_INPUT_RANGE = COLOR_CYCLE.map((_, i) => i);
const CYCLE_DURATION = 4000;

function GlowRing(): JSX.Element {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(COLOR_CYCLE.length - 1, {
                duration: CYCLE_DURATION,
                easing: Easing.linear
            }),
            -1
        );
    }, [progress]);

    const animatedGlowStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            progress.value,
            CYCLE_INPUT_RANGE,
            COLOR_CYCLE
        );

        return {
            backgroundColor: color,
            shadowColor: color
        };
    });

    return <Animated.View style={[styles.glowRing, animatedGlowStyle]} />;
}

function SplashPeg(): JSX.Element {
    return (
        <View style={styles.pegWrapper}>
            <GlowRing />
            <View style={styles.peg}>
                <View style={styles.glossHighlight} />
                <View style={styles.bottomSheen} />
            </View>
        </View>
    );
}

export function AnimatedSplashOverlay() {
    const [animate, setAnimate] = useState(false);
    const [visible, setVisible] = useState(true);
    const mountTime = useRef(Date.now());

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
                    const elapsed = Date.now() - mountTime.current;
                    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
                    setTimeout(() => setAnimate(true), remaining);
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
    pegWrapper: {
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        alignItems: 'center',
        justifyContent: 'center'
    },
    glowRing: {
        position: 'absolute',
        width: GLOW_SIZE,
        height: GLOW_SIZE,
        borderRadius: GLOW_SIZE / 2,
        opacity: 0.5,
        // Blur / glow effect across iOS, Android, and Web
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 35,
        elevation: 20
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
