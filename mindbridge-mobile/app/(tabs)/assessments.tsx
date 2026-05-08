import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/colors';
import { ClipboardList } from 'lucide-react-native';

export default function AssessmentsScreen() {
  return (
    <View style={styles.container}>
      <ClipboardList color={theme.colors.accents.slate} size={64} />
      <Text style={styles.title}>Assessments</Text>
      <Text style={styles.subtitle}>Check your mental well-being with clinical assessments.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.plum, marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center' }
});
