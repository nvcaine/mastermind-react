import React from 'react';
import { ColorSchemeName } from 'react-native';
import { Link, Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}): React.JSX.Element {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout(): React.JSX.Element {
    const colorScheme: ColorSchemeName = useColorScheme();

    return (
        <Tabs
            backBehavior={'firstRoute'}
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerBackButtonDisplayMode: 'minimal',
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true)
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Play',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="play" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="levels"
                options={{
                    title: 'Levels',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="trophy" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="cog" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
