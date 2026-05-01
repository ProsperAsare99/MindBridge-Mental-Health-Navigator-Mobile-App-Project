import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) return Alert.alert('Error', 'Please fill in all fields');
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      await signIn(response.data.token);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Begin your personalised mental health journey.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={theme.colors.text.secondary}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={theme.colors.text.secondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.text.secondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color={theme.colors.background} />
              : <Text style={styles.primaryButtonText}>Continue</Text>}
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: { paddingVertical: 10 },
  backButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  formContainer: { gap: 16 },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    paddingHorizontal: 24,
    height: 64,
    borderRadius: theme.borderRadius.xl,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.15)',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 64,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: -0.3,
  },
});
