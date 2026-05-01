import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const PRIMARY = '#8B5CF6';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Subtle aurora glows */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 40 }]}>

        {/* Logo */}
        <Animated.View entering={FadeIn.duration(1000)} style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Headline & subtitle */}
        <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} style={styles.textBlock}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🧭  Ghana's Wellness Navigator</Text>
          </View>
          <Text style={styles.headline}>
            Your Mind,{'\n'}
            <Text style={styles.headlineAccent}>Understood.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Personalised mental health guidance built for every Ghanaian student — private, precise, and empathetic.
          </Text>
        </Animated.View>

        {/* CTAs */}
        <Animated.View entering={FadeInDown.delay(500).duration(800).springify()} style={styles.ctaContainer}>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.85}
            style={styles.primaryWrapper}
          >
            <LinearGradient
              colors={[PRIMARY, '#6D28D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Begin Your Journey</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.7}
            style={styles.ghostBtn}
          >
            <Text style={styles.ghostBtnText}>
              Already have an account?{'  '}
              <Text style={styles.ghostBtnAccent}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer line */}
        <Animated.Text entering={FadeIn.delay(800).duration(600)} style={styles.footerText}>
          © 2026 MindBridge · Ghanaian Excellence
        </Animated.Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: PRIMARY,
    opacity: 0.08,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#6D28D9',
    opacity: 0.07,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: 80,
  },

  // Text
  textBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139,92,246,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.25)',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 24,
  },
  badgeText: {
    color: PRIMARY,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 60,
    marginBottom: 20,
  },
  headlineAccent: {
    color: PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    color: '#71717A',
    lineHeight: 26,
    fontWeight: '400',
    paddingRight: 24,
  },

  // Buttons
  ctaContainer: {
    gap: 14,
    marginBottom: 24,
  },
  primaryWrapper: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtn: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  ghostBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: {
    color: '#52525B',
    fontSize: 15,
    fontWeight: '500',
  },
  ghostBtnAccent: {
    color: PRIMARY,
    fontWeight: '700',
  },

  // Footer
  footerText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.15)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
