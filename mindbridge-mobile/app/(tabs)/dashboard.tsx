import { View, Text, Button } from 'react-native';
import { theme } from '../../src/theme/colors';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';

export default function DashboardScreen() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 24, marginBottom: 20 }}>Dashboard</Text>
      <Button title="Sign Out" onPress={signOut} color={theme.colors.danger} />
    </View>
  );
}
