import { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { PropComponent, Props } from '@/components/PropComponent';
import ColorSet from '@/components/ColorSet';
import { SetData } from '@/constants/HexCodes';

export interface PlaceholderSetProps extends Props {
    colorLength: number;
}

const PlaceholderSet: PropComponent<PlaceholderSetProps> = (
    props: PlaceholderSetProps
): JSX.Element => {
    const { colorLength } = props;
    const defaultSet: SetData = {
        colors: Array(colorLength).fill('transparent'),
        correct: 0,
        offset: 0
    };

    return (
        <View style={styles.hidden}>
            <ColorSet set={defaultSet} hideLabels={true} />
        </View>
    );
};

const styles = StyleSheet.create({
    hidden: {
        height: 0,
        opacity: 0,
        overflow: 'hidden'
    }
});

export default PlaceholderSet;
