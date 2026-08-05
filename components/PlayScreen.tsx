import React from 'react';
import { NativeEventEmitter, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ColorMenu from '@/components/ColorMenu';
import SetList from '@/components/SetList';
import { PropComponent } from '@/components/PropComponent';

const PlayScreen: PropComponent<any> = (): React.JSX.Element => {
    const eventEmitter: NativeEventEmitter = new NativeEventEmitter();
    // get current level from storage (set length, available colors)
    const maxColors: number = 4; // get from current level

    console.log('Init main screen');

    return (
        <View style={styles.container}>
            <SetList emitter={eventEmitter} maxColors={maxColors} />
            <ColorMenu emitter={eventEmitter} maxColors={maxColors} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column'
    }
});

export default PlayScreen;
