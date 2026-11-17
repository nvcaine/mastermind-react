import { JSX } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { PropComponent } from '@/components/PropComponent';

interface LevelSpecsProps {
    colorsLength: number;
    availableColors: number;
}

const LevelSpecs: PropComponent<LevelSpecsProps> = (
    props: LevelSpecsProps
): JSX.Element => (
    <View style={styles.specsRow}>
        <View style={styles.specItem}>
            <FontAwesome name="circle" size={12} color="#38BDF8" />
            <Text style={styles.specText}>{props.colorsLength} Code Pegs</Text>
        </View>
        <View style={styles.specItem}>
            <FontAwesome name="th" size={12} color="#A855F7" />
            <Text style={styles.specText}>
                {props.availableColors} Color Pool
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    specsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)'
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    specText: {
        fontSize: 12,
        color: '#CBD5E1',
        fontWeight: '500'
    }
});

export default LevelSpecs;
