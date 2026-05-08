import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/colors';
import { ShieldAlert } from 'lucide-react-native';

export default function CrisisSupportScreen() {
  return (
    <View style={styles.container}>
      <ShieldAlert color={theme.colors.accents.gentlePeach} size={64} />
      <Text style={styles.title}>Crisis Support</Text>
      <Text style={styles.subtitle}>Immediate help and helplines will be listed here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.plum, marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center' }
});
