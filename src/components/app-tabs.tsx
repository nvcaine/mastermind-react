import { JSX } from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export default function AppTabs(): JSX.Element {
    const scheme = useColorScheme();
    const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

    return (
        <NativeTabs
            backgroundColor={colors.background}
            indicatorColor={colors.backgroundElement}
            labelStyle={{ selected: { color: colors.text } }}
        >
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Play</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/home.png')}
                    renderingMode="template"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="levels">
                <NativeTabs.Trigger.Label>Levels</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="settings">
                <NativeTabs.Trigger.Label>Guide</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    src={require('@/assets/images/tabIcons/explore.png')}
                    renderingMode="template"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
