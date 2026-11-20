import { JSX, ReactNode } from 'react';
import {
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    useColorScheme
} from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { TabTriggerSlotProps } from 'expo-router/ui';

interface TabButtonProps extends TabTriggerSlotProps {
    children?: ReactNode;
    icon?: ImageSourcePropType;
}

export function TabButton({
    children,
    isFocused,
    icon,
    ...props
}: TabButtonProps): JSX.Element {
    const scheme = useColorScheme();
    const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
    const tintColor = isFocused ? colors.text : colors.textSecondary;

    return (
        <Pressable
            {...props}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <ThemedView
                type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.tabButtonView}
            >
                {icon && (
                    <Image
                        source={icon}
                        style={[styles.tabIcon, { tintColor }]}
                        resizeMode="contain"
                    />
                )}
                <ThemedText
                    type="small"
                    themeColor={isFocused ? 'text' : 'textSecondary'}
                >
                    {children}
                </ThemedText>
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.7
    },
    tabButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.two,
        paddingVertical: Spacing.one,
        paddingHorizontal: Spacing.three,
        borderRadius: Spacing.three
    },
    tabIcon: {
        width: 18,
        height: 18
    }
});
