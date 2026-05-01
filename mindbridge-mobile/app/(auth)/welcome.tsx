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
import { theme } from '../../src/theme/colors';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Ambient glows using palette colours */}
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

        {/* Text block */}
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
              colors={['#5fa8d3', '#1b4965']}
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
    backgroundColor: theme.colors.background,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.primary,
    opacity: 0.12,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.frozen,
    opacity: 0.08,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.62,
    height: 80,
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(95,168,211,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.3)',
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 24,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 52,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: -2,
    lineHeight: 60,
    marginBottom: 20,
  },
  headlineAccent: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 26,
    fontWeight: '400',
    paddingRight: 24,
  },
  ctaContainer: {
    gap: 14,
    marginBottom: 24,
  },
  primaryWrapper: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryBtn: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.xl,
  },
  primaryBtnText: {
    color: theme.colors.palesky,
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
    color: theme.colors.text.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
  ghostBtnAccent: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(202,233,255,0.2)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
