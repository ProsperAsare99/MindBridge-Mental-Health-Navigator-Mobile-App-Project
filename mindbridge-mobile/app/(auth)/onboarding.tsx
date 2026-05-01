import { View, Text, Button } from 'react-native';
import { theme } from '../../src/theme/colors';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';

export default function OnboardingScreen() {
  const { signIn } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 24, marginBottom: 20 }}>12-Step Onboarding</Text>
      <Button title="Complete Onboarding" onPress={() => signIn('demo-token')} color={theme.colors.primary} />
    </View>
  );
}
