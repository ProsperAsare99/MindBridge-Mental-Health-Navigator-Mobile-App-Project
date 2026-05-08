import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme/colors';
import { Users } from 'lucide-react-native';

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Users color={theme.colors.plum} size={64} />
      <Text style={styles.title}>Support Community</Text>
      <Text style={styles.subtitle}>Connect with peers in a safe, anonymous space.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.plum, marginTop: 16, marginBottom: 8 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center' }
});
