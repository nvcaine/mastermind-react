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
            style={
                isFocused ? [styles.pressed, styles.focused] : styles.pressed
            }
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
        opacity: 0.6,
        flexGrow: 1,
        alignItems: 'center'
    },
    focused: {
        opacity: 1
    },
    tabButtonView: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.four,
        borderRadius: Spacing.three
    },
    tabIcon: {
        width: 18,
        height: 18
    }
});
