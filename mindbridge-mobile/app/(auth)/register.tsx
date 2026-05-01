import { View, Text, Button } from 'react-native';
import { theme } from '../../src/theme/colors';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 24, marginBottom: 20 }}>Register</Text>
      <Button title="Go to Onboarding" onPress={() => router.push('/(auth)/onboarding')} color={theme.colors.primary} />
    </View>
  );
}
