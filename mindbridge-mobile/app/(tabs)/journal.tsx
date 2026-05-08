import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/colors';
import { BookOpen } from 'lucide-react-native';

export default function JournalScreen() {
  return (
    <View style={styles.container}>
      <BookOpen color={theme.colors.accents.powderBlue} size={64} />
      <Text style={styles.title}>Unified Journal</Text>
      <Text style={styles.subtitle}>Write down your thoughts and reflections.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.plum, marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center' }
});
