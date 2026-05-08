import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/colors';
import { Bot } from 'lucide-react-native';

export default function AIGuideScreen() {
  return (
    <View style={styles.container}>
      <Bot color={theme.colors.plum} size={64} />
      <Text style={styles.title}>Personalized AI Guide</Text>
      <Text style={styles.subtitle}>Your private safe space is coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.plum, marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center' }
});
