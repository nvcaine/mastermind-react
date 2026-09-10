import { View } from '@/components/Themed';
import { MonoText } from '@/components/StyledText';
import { PropComponent } from '@/components/PropComponent';
import React from 'react';

const LevelsScreen: PropComponent<any> = (): React.JSX.Element => (
    <View>
        <MonoText>The levels screen</MonoText>
    </View>
);

export default LevelsScreen;
