import { JSX, useEffect } from 'react';
import Animated, {
    Easing,
    interpolateColor,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { HexCodes } from '@/constants/HexCodes';

const PEG_SIZE: number = 120;
const GLOW_SIZE: number = PEG_SIZE * 1.5;
const GAME_COLORS: string[] = Object.values(HexCodes);

// To complete a full smooth loop back to the beginning:
const COLOR_CYCLE: string[] = [...GAME_COLORS, GAME_COLORS[0]];
const CYCLE_INPUT_RANGE: number[] = COLOR_CYCLE.map(
    (_: string, i: number): number => i
);
const CYCLE_DURATION: number = 4000;

function GlowRing(): JSX.Element {
    const progress: SharedValue<number> = useSharedValue(0);

    useEffect((): void => {
        progress.value = withRepeat(
            withTiming(COLOR_CYCLE.length - 1, {
                duration: CYCLE_DURATION,
                easing: Easing.linear
            }),
            -1
        );
    }, [progress]);

    const animatedGlowStyle = useAnimatedStyle(() => {
        const color: string = interpolateColor(
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

export default function SplashPeg(): JSX.Element {
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

const styles = StyleSheet.create({
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
        elevation: 20,
        filter: 'blur(15px)'
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
