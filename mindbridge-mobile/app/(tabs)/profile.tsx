import { View, Text } from 'react-native';
import { theme } from '../../src/theme/colors';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 24 }}>User Profile</Text>
    </View>
  );
}
