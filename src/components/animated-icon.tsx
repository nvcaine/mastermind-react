import * as SplashScreen from 'expo-splash-screen';
import { JSX, RefObject, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    Keyframe,
    ReanimatedKeyframe
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import SplashPeg from '@/components/splash-peg';

const DURATION: number = 600;
const MIN_VISIBLE_MS: number = 2000;

export function AnimatedSplashOverlay(): JSX.Element | null {
    const [animate, setAnimate] = useState(false);
    const [visible, setVisible] = useState(true);
    const mountTime: RefObject<number> = useRef(Date.now());

    if (!visible) return null;

    const splashKeyframe: ReanimatedKeyframe = new Keyframe({
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
                .withCallback((finished: boolean): void => {
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
            onLayout={(): void => {
                SplashScreen.hideAsync().finally(() => {
                    const elapsed: number = Date.now() - mountTime.current;
                    const remaining: number = Math.max(
                        0,
                        MIN_VISIBLE_MS - elapsed
                    );
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
    }
});
