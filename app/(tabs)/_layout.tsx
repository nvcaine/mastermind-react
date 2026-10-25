import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: React.ComponentProps<typeof FontAwesome>['color'];
}): React.JSX.Element {
    return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout(): React.JSX.Element {
    const rawColorScheme = useColorScheme();
    const themeKey = rawColorScheme === 'dark' ? 'dark' : 'light';
    const theme = Colors[themeKey];

    return (
        <Tabs
            backBehavior="firstRoute"
            screenOptions={{
                tabBarActiveTintColor: theme.tabIconSelected,
                tabBarInactiveTintColor: theme.tabIconDefault,
                tabBarStyle: {
                    backgroundColor: theme.dockBackground,
                    borderTopColor: theme.dockBorder,
                    borderTopWidth: 1,
                    height: 58,
                    paddingBottom: 6,
                    paddingTop: 6
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600'
                },
                headerStyle: {
                    backgroundColor: theme.background,
                    borderBottomColor: theme.cardBorder,
                    borderBottomWidth: 1
                },
                headerTintColor: theme.text,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 17
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Play',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="gamepad" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="levels"
                options={{
                    title: 'Levels',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="trophy" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Guide',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="book" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
