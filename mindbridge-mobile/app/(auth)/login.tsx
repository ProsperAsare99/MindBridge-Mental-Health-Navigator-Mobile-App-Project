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
  Image
} from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../../src/services/api';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, ChevronLeft, AlertCircle, Ghost } from 'lucide-react-native';
import AuthCharacters, { AuthField } from '../../src/components/AuthCharacters';

const { height } = Dimensions.get('window');

const ErrorMessage = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <Animated.View entering={FadeInDown} style={styles.errorRow}>
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
      <LinearGradient 
        colors={[theme.colors.background, theme.colors.accents.softLilac]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.topSection, { paddingTop: insets.top }]}
      >
        <View style={[styles.blurCircle, styles.circle1]} />
        <View style={[styles.blurCircle, styles.circle2]} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color={theme.colors.plum} size={30} />
          </TouchableOpacity>
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Image 
                source={require('../../assets/images/logo.png')} 
                style={styles.logoImage} 
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.charactersWrapper}>
          <AuthCharacters 
            focusedField={focusedField} 
            showPassword={showPassword} 
          />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.bottomSectionWrapper}
      >
        <View style={styles.bottomSection}>
          <ScrollView 
            contentContainerStyle={[styles.formScrollContent, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View entering={FadeInUp.duration(600).springify()} style={styles.titleContainer}>
              <Text style={styles.title}>Welcome back!</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="anna@gmail.com"
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
                    style={[styles.input, { flex: 1, borderWidth: 0, backgroundColor: 'transparent' }]}
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
                      <EyeOff color={theme.colors.plum} size={22} />
                    ) : (
                      <Eye color={theme.colors.plum} size={22} />
                    )}
                  </TouchableOpacity>
                </View>
                <ErrorMessage message={errors.password || ''} />
              </View>

              <View style={styles.forgotPasswordRow}>
                <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'Instructions have been sent to your email.')}>
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
                  : <Text style={styles.primaryButtonText}>Log in</Text>}
              </TouchableOpacity>

              {/* Anonymous Entry Divider */}
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
                style={styles.socialButton} 
                activeOpacity={0.7}
                onPress={() => Alert.alert('Google Auth', 'Google Login will be available in the next update.')}
              >
                <Mail color={theme.colors.plum} size={20} style={{ marginRight: 12 }} />
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundSecondary },
  topSection: { height: height * 0.45, overflow: 'hidden' },
  blurCircle: { position: 'absolute', borderRadius: 150, opacity: 0.5 },
  circle1: { top: '10%', right: '-10%', width: 200, height: 200, backgroundColor: theme.colors.accents.softMint },
  circle2: { bottom: '10%', left: '-15%', width: 250, height: 250, backgroundColor: theme.colors.accents.powderBlue },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, zIndex: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  brandContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', backgroundColor: theme.colors.surface, borderWidth: 2.5, borderColor: theme.colors.mauve, elevation: 8 },
  logoImage: { width: '100%', height: '100%' },
  charactersWrapper: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20, zIndex: 5 },
  bottomSectionWrapper: { flex: 1, marginTop: -30 },
  bottomSection: { flex: 1, backgroundColor: theme.colors.backgroundSecondary, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  formScrollContent: { paddingHorizontal: 28, paddingTop: 32 },
  titleContainer: { marginBottom: 32, alignItems: 'center' },
  title: { color: theme.colors.plum, fontSize: 30, fontWeight: '900', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { color: theme.colors.text.primary, fontSize: 16, fontWeight: '600', opacity: 0.7 },
  formContainer: { gap: 20 },
  inputWrapper: { gap: 6 },
  label: { color: theme.colors.plum, fontSize: 14, fontWeight: '800', marginLeft: 4 },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.plum, fontSize: 16, fontWeight: '600', height: 60, borderRadius: 18, paddingHorizontal: 18, borderWidth: 2, borderColor: theme.colors.mauve },
  inputError: { borderColor: theme.colors.semantic.danger },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 4, marginTop: 2 },
  errorText: { color: theme.colors.semantic.danger, fontSize: 12, fontWeight: '600' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 18, borderWidth: 2, borderColor: theme.colors.mauve, height: 60 },
  eyeIcon: { padding: 16 },
  forgotPasswordRow: { alignItems: 'flex-end' },
  forgotPasswordText: { color: theme.colors.plum, fontSize: 14, fontWeight: '700' },
  primaryButton: { backgroundColor: theme.colors.plum, height: 62, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 8, elevation: 6 },
  primaryButtonText: { color: theme.colors.surface, fontWeight: '800', fontSize: 17 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, gap: 10 },
  divider: { flex: 1, height: 1, backgroundColor: theme.colors.mauve, opacity: 0.5 },
  dividerText: { color: theme.colors.text.secondary, fontSize: 12, fontWeight: '700' },
  anonymousButton: { flexDirection: 'row', backgroundColor: theme.colors.accents.softLilac, height: 60, borderRadius: 18, borderWidth: 2, borderColor: theme.colors.mauve, justifyContent: 'center', alignItems: 'center' },
  anonymousButtonText: { color: theme.colors.plum, fontWeight: '700', fontSize: 15 },
  socialButton: { flexDirection: 'row', backgroundColor: 'transparent', height: 60, borderRadius: 18, borderWidth: 2, borderColor: theme.colors.mauve, justifyContent: 'center', alignItems: 'center' },
  socialButtonText: { color: theme.colors.plum, fontWeight: '700', fontSize: 15 },
  signUpContainer: { marginTop: 16, alignItems: 'center' },
  signUpText: { color: theme.colors.text.primary, fontSize: 14, fontWeight: '500' },
  signUpLink: { color: theme.colors.plum, fontWeight: '800' },
});
