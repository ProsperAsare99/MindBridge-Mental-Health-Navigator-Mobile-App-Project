import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Sparkles, ChevronLeft } from 'lucide-react-native';
import AuthCharacters, { AuthField } from '../../src/components/AuthCharacters';

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<AuthField>('none');

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
    <LinearGradient 
      colors={[theme.colors.background, '#081a26']} 
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header / Back Button */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft color={theme.colors.text.secondary} size={28} />
              </TouchableOpacity>
              
              <View style={styles.brandContainer}>
                <View style={styles.brandLogo}>
                  <Sparkles size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.brandName}>MindBridge</Text>
              </View>
              <View style={{ width: 40 }} /> {/* Spacer */}
            </View>

            {/* Interactive Characters */}
            <Animated.View entering={FadeInUp.duration(800).delay(200)}>
              <AuthCharacters 
                focusedField={focusedField} 
                showPassword={showPassword} 
              />
            </Animated.View>

            {/* Title Section */}
            <Animated.View 
              entering={FadeInUp.duration(600).springify()} 
              style={styles.titleContainer}
            >
              <Text style={styles.title}>Welcome back!</Text>
              <Text style={styles.subtitle}>Sign in to continue your journey.</Text>
            </Animated.View>

            {/* Form Section */}
            <Animated.View 
              entering={FadeInDown.duration(600).delay(200).springify()} 
              style={styles.formContainer}
            >
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="anna@gmail.com"
                    placeholderTextColor="rgba(202,233,255,0.3)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('none')}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(202,233,255,0.3)"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('none')}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff color={theme.colors.text.secondary} size={20} />
                    ) : (
                      <Eye color={theme.colors.text.secondary} size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading
                  ? <ActivityIndicator color={theme.colors.background} />
                  : <Text style={styles.primaryButtonText}>Log in</Text>}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                <Mail color={theme.colors.text.primary} size={20} style={{ marginRight: 12 }} />
                <Text style={styles.socialButtonText}>Log in with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/(auth)/register')}
                style={styles.signUpContainer}
              >
                <Text style={styles.signUpText}>
                  Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(95,168,211,0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    fontWeight: '400',
  },
  formContainer: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27,73,101,0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.2)',
    height: 58,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(95,168,211,0.1)',
  },
  dividerText: {
    color: theme.colors.text.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(27,73,101,0.2)',
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: theme.colors.text.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  signUpLink: {
    color: theme.colors.text.primary,
    fontWeight: '700',
  },
});
