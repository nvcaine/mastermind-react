import { JSX } from 'react';
import { TabListProps } from 'expo-router/ui';
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function CustomTabList(props: TabListProps): JSX.Element {
    return (
        <View {...props} style={styles.tabListContainer}>
            <ThemedView type="backgroundElement" style={styles.innerContainer}>
                {props.children}
            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabListContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    innerContainer: {
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.five,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        gap: Spacing.two
    }
});
