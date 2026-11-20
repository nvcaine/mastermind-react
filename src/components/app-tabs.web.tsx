import { JSX, ReactNode } from 'react';
import {
    Tabs,
    TabList,
    TabTrigger,
    TabSlot,
    TabTriggerSlotProps,
    TabListProps
} from 'expo-router/ui';
import {
    Image,
    ImageSourcePropType,
    Pressable,
    useColorScheme,
    View,
    StyleSheet
} from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs(): JSX.Element {
    return (
        <Tabs style={styles.tabsContainer}>
            <TabSlot style={styles.tabSlot} />
            <TabList asChild>
                <CustomTabList>
                    <TabTrigger name="index" href="/" asChild>
                        <TabButton
                            icon={require('@/assets/images/tabIcons/gamepad.png')}
                        >
                            Play
                        </TabButton>
                    </TabTrigger>
                    <TabTrigger name="levels" href="/levels" asChild>
                        <TabButton
                            icon={require('@/assets/images/tabIcons/star.png')}
                        >
                            Levels
                        </TabButton>
                    </TabTrigger>
                    <TabTrigger name="settings" href="/settings" asChild>
                        <TabButton
                            icon={require('@/assets/images/tabIcons/magnifier.png')}
                        >
                            Guide
                        </TabButton>
                    </TabTrigger>
                </CustomTabList>
            </TabList>
        </Tabs>
    );
}

interface TabButtonProps extends TabTriggerSlotProps {
    children?: ReactNode;
    icon?: ImageSourcePropType;
}

export function TabButton({
    children,
    isFocused,
    icon,
    ...props
}: TabButtonProps) {
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

export function CustomTabList(props: TabListProps) {
    const scheme = useColorScheme();
    const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

    return (
        <View {...props} style={styles.tabListContainer}>
            <ThemedView type="backgroundElement" style={styles.innerContainer}>
                {props.children}
            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabsContainer: {
        flex: 1,
        height: '100%'
    },
    tabSlot: {
        flex: 1,
        paddingBottom: 72
    },
    tabListContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: Spacing.three,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    innerContainer: {
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.five,
        borderRadius: Spacing.five,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        gap: Spacing.two,
        maxWidth: MaxContentWidth
    },
    brandText: {
        marginRight: 'auto'
    },
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
    },
    externalPressable: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.one,
        marginLeft: Spacing.three
    }
});
