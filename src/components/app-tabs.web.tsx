import { JSX } from 'react';
import { StyleSheet } from 'react-native';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';

import { TabButton } from '@/components/tab-button';
import { CustomTabList } from '@/components/custom-tab-list';

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
                    <TabTrigger name="guide" href="/guide" asChild>
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

const styles = StyleSheet.create({
    tabsContainer: {
        flex: 1,
        height: '100%'
    },
    tabSlot: {
        flex: 1,
        paddingBottom: 72
    }
});
