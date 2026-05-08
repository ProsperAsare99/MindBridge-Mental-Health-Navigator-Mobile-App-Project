import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/colors';
import { Settings } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Settings color={theme.colors.text.secondary} size={64} />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your app preferences and notifications.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.plum, marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center' }
});
