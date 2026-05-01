import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 24, marginBottom: 20 }}>Login to MindBridge</Text>
      <Button title="Login (Demo)" onPress={() => signIn('demo-token')} color={theme.colors.primary} />
      <Button title="Go to Register" onPress={() => router.push('/(auth)/register')} />
    </View>
  );
}
