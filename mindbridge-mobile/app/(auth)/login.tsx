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
  ScrollView,
  Dimensions,
  Image,
  StatusBar
} from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../src/services/api';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, ChevronLeft, AlertCircle, Ghost } from 'lucide-react-native';
import AuthCharacters, { AuthField } from '../../src/components/AuthCharacters';

const { height, width } = Dimensions.get('window');

const ErrorMessage = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <Animated.View entering={FadeInUp.duration(300)} style={styles.errorRow}>
      <AlertCircle color={theme.colors.semantic.danger} size={14} style={{ marginRight: 4 }} />
      <Text style={styles.errorText}>{message}</Text>
    </Animated.View>
  );
};

export default function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();
  const { anonymous } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<AuthField>('none');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    let valid = true;
    let newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      await signIn(response.data.token);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Unable to connect to server';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymousLogin = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        await signIn('guest-token-' + Date.now());
        router.replace('/(auth)/onboarding');
      } catch (e) {
        Alert.alert('Error', 'Unable to start anonymous session');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['rgba(123, 97, 255, 0.12)', theme.colors.background, theme.colors.backgroundSecondary]} 
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top, paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color={theme.colors.plum} size={32} />
            </TouchableOpacity>
          </Animated.View>

          {/* Graphics / Character */}
          <Animated.View entering={FadeIn.duration(800)} style={styles.characterContainer}>
            <View style={styles.logoCircle}>
              <Image 
                source={require('../../assets/images/logo.png')} 
                style={styles.logoImage} 
                resizeMode="cover"
              />
            </View>
            <View style={styles.characterPos}>
              <AuthCharacters 
                focusedField={focusedField} 
                showPassword={showPassword} 
              />
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInUp.duration(800).springify().damping(14)} style={styles.formContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to your account.</Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="anna@example.com"
                  placeholderTextColor={theme.colors.text.disabled}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(txt) => {
                    setEmail(txt);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('none')}
                />
                <ErrorMessage message={errors.email || ''} />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.text.disabled}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(txt) => {
                      setPassword(txt);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('none')}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff color={theme.colors.text.disabled} size={22} />
                    ) : (
                      <Eye color={theme.colors.text.disabled} size={22} />
                    )}
                  </TouchableOpacity>
                </View>
                <ErrorMessage message={errors.password || ''} />
              </View>

              <TouchableOpacity style={styles.forgotPasswordBtn} onPress={() => Alert.alert('Reset Password', 'Instructions have been sent to your email.')}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading
                ? <ActivityIndicator color={theme.colors.surface} />
                : <Text style={styles.primaryButtonText}>Log In</Text>}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity 
              style={styles.anonymousButton} 
              onPress={handleAnonymousLogin}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ghost color={theme.colors.plum} size={20} style={{ marginRight: 12 }} />
              <Text style={styles.anonymousButtonText}>
                {loading ? 'Starting Session...' : 'Continue Anonymously'}
              </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.backgroundSecondary 
  },
  scrollContent: { 
    paddingHorizontal: 24, 
    minHeight: height,
  },
  header: { 
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: { 
    width: 44, 
    height: 44, 
    justifyContent: 'center',
    marginLeft: -8,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 10,
    height: 140,
  },
  logoCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    overflow: 'hidden', 
    backgroundColor: theme.colors.surface, 
    shadowColor: theme.colors.plum, 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 16, 
    elevation: 8 
  },
  logoImage: { width: '100%', height: '100%' },
  characterPos: {
    position: 'absolute',
    bottom: -10,
    right: '25%',
  },
  formContainer: { 
    flex: 1,
  },
  titleContainer: { 
    marginBottom: 32,
  },
  title: { 
    color: theme.colors.text.primary, 
    fontSize: 34, 
    fontWeight: '800', 
    letterSpacing: -1, 
    marginBottom: 8 
  },
  subtitle: { 
    color: theme.colors.text.secondary, 
    fontSize: 16, 
    fontWeight: '500',
  },
  inputGroup: { 
    gap: 20,
    marginBottom: 32,
  },
  inputWrapper: { gap: 8 },
  label: { 
    color: theme.colors.text.primary, 
    fontSize: 14, 
    fontWeight: '700', 
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: { 
    backgroundColor: theme.colors.surface, 
    color: theme.colors.text.primary, 
    fontSize: 16, 
    fontWeight: '600', 
    height: 60, 
    borderRadius: 20, 
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.surface, 
    borderRadius: 20,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  inputError: { 
    borderWidth: 2,
    borderColor: theme.colors.semantic.danger 
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 4, marginTop: 4 },
  errorText: { color: theme.colors.semantic.danger, fontSize: 13, fontWeight: '600' },
  eyeIcon: { padding: 16 },
  forgotPasswordBtn: { alignSelf: 'flex-end' },
  forgotPasswordText: { color: theme.colors.plum, fontSize: 14, fontWeight: '700' },
  primaryButton: { 
    backgroundColor: theme.colors.plum, 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonText: { color: theme.colors.surface, fontWeight: '800', fontSize: 17, letterSpacing: 0.2 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  divider: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(0,0,0,0.1)' },
  dividerText: { color: theme.colors.text.secondary, fontSize: 13, fontWeight: '700' },
  anonymousButton: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(123, 97, 255, 0.08)', 
    height: 60, 
    borderRadius: 20, 
    borderWidth: 1.5, 
    borderColor: 'rgba(123, 97, 255, 0.15)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  anonymousButtonText: { color: theme.colors.plum, fontWeight: '700', fontSize: 16 },
  signUpContainer: { marginTop: 32, alignItems: 'center', marginBottom: 20 },
  signUpText: { color: theme.colors.text.secondary, fontSize: 15, fontWeight: '500' },
  signUpLink: { color: theme.colors.plum, fontWeight: '800' },
});
