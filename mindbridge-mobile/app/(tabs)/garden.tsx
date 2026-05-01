import { View, Text } from 'react-native';
import { theme } from '../../src/theme/colors';

export default function GardenScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 24 }}>Mood Garden</Text>
    </View>
  );
}
