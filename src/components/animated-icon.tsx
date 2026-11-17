import * as SplashScreen from 'expo-splash-screen';
import { JSX, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
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
const RING_SIZE = PEG_SIZE * 1.7;
const SEGMENT_COUNT = 10;
const GAME_COLORS = Object.values(HexCodes);

function GlowRing(): JSX.Element {
    const rotation = useSharedValue(0);
    rotation.value = withRepeat(
        withTiming(360, { duration: 4000, easing: Easing.linear }),
        -1
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }]
    }));

    return (
        <Animated.View style={[styles.glowRing, animatedStyle]}>
            {GAME_COLORS.slice(0, SEGMENT_COUNT).map((color, i) => {
                const angle = (i * 360) / SEGMENT_COUNT;
                return (
                    <View
                        key={color}
                        style={[
                            styles.segment,
                            {
                                backgroundColor: color,
                                transform: [{ rotate: `${angle}deg` }]
                            }
                        ]}
                    />
                );
            })}
        </Animated.View>
    );
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
        width: RING_SIZE,
        height: RING_SIZE,
        alignItems: 'center',
        justifyContent: 'center'
    },
    glowRing: {
        position: 'absolute',
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: RING_SIZE / 2,
        overflow: 'hidden'
    },
    segment: {
        position: 'absolute',
        width: RING_SIZE / 2,
        height: RING_SIZE,
        left: RING_SIZE / 2,
        top: 0,
        transformOrigin: `0px ${RING_SIZE / 2}px`
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
