import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { PropComponent } from '@/components/PropComponent';

const SettingsScreen: PropComponent<any> = (): React.JSX.Element => (
    <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
        // justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 30
    },
    separator: {
        height: 1,
        marginVertical: 30,
        width: '80%'
    }
});

export default SettingsScreen;
