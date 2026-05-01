import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';

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
    <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.screen, backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text.primary, fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>Welcome Back</Text>
      
      <TextInput
        style={{ backgroundColor: theme.colors.surface, color: theme.colors.text.primary, padding: 15, borderRadius: theme.borderRadius.sm, marginBottom: 15 }}
        placeholder="Email"
        placeholderTextColor={theme.colors.text.secondary}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={{ backgroundColor: theme.colors.surface, color: theme.colors.text.primary, padding: 15, borderRadius: theme.borderRadius.sm, marginBottom: 25 }}
        placeholder="Password"
        placeholderTextColor={theme.colors.text.secondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.primary, padding: 15, borderRadius: theme.borderRadius.sm, alignItems: 'center', marginBottom: 15 }}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Sign In</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={{ alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text.secondary }}>Don't have an account? <Text style={{ color: theme.colors.primary }}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  );
}
