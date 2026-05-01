import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await signIn(response.data.token);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Something went wrong');
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey.</Text>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} style={styles.formContainer}>
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
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign In</Text>}
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
  backButton: {
    paddingVertical: 10,
  },
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
  },
  formContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    paddingHorizontal: 24,
    height: 64,
    borderRadius: 32, // Pill shape
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 64,
    borderRadius: 32, // Pill shape
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
    letterSpacing: -0.3,
  }
});
