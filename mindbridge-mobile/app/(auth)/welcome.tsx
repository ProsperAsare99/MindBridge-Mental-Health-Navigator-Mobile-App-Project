import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../src/theme/colors';

const { width, height } = Dimensions.get('window');

// ─── Animated Orb ────────────────────────────────────────────────────────────
function Orb({
  size,
  color,
  style,
  delay = 0,
}: {
  size: number;
  color: string;
  style?: object;
  delay?: number;
}) {
  const pulse = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 3000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

// ─── Floating Dot ─────────────────────────────────────────────────────────────
function FloatingDot({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  const float = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(float, { toValue: -8, duration: 2500, useNativeDriver: true }),
            Animated.timing(float, { toValue: 0, duration: 2500, useNativeDriver: true }),
          ])
        ),
        Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
        opacity: Animated.multiply(fade, 0.5),
        transform: [{ translateY: float }],
      }}
    />
  );
}

const DOTS = [
  { x: width * 0.12, y: height * 0.22, delay: 0 },
  { x: width * 0.28, y: height * 0.31, delay: 300 },
  { x: width * 0.72, y: height * 0.18, delay: 600 },
  { x: width * 0.85, y: height * 0.38, delay: 900 },
  { x: width * 0.45, y: height * 0.14, delay: 200 },
  { x: width * 0.6,  y: height * 0.25, delay: 500 },
  { x: width * 0.15, y: height * 0.55, delay: 800 },
  { x: width * 0.9,  y: height * 0.6,  delay: 100 },
  { x: width * 0.05, y: height * 0.72, delay: 700 },
  { x: width * 0.78, y: height * 0.72, delay: 400 },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Staggered entrance values
  const logoOpacity   = useRef(new Animated.Value(0)).current;
  const logoTranslate = useRef(new Animated.Value(-20)).current;
  const badgeOpacity  = useRef(new Animated.Value(0)).current;
  const badgeScale    = useRef(new Animated.Value(0.85)).current;
  const headOpacity   = useRef(new Animated.Value(0)).current;
  const headTranslate = useRef(new Animated.Value(24)).current;
  const subOpacity    = useRef(new Animated.Value(0)).current;
  const ctaOpacity    = useRef(new Animated.Value(0)).current;
  const ctaTranslate  = useRef(new Animated.Value(32)).current;
  const footOpacity   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const seq = Animated.stagger(120, [
      // Logo
      Animated.parallel([
        Animated.timing(logoOpacity,   { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(logoTranslate, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]),
      // Badge
      Animated.parallel([
        Animated.timing(badgeOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(badgeScale,   { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      // Headline
      Animated.parallel([
        Animated.timing(headOpacity,   { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(headTranslate, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      // Subtitle
      Animated.timing(subOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      // CTAs
      Animated.parallel([
        Animated.timing(ctaOpacity,   { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(ctaTranslate, { toValue: 0, friction: 8, useNativeDriver: true }),
      ]),
      // Footer
      Animated.timing(footOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]);
    seq.start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Ambient orbs ── */}
      <Orb size={320} color={theme.colors.primary}   style={{ top: -110, right: -110 }} delay={0}    />
      <Orb size={240} color={theme.colors.primaryLight} style={{ bottom: -80, left: -80 }} delay={1200} />
      <Orb size={150} color={theme.colors.frozen}    style={{ top: height * 0.38, right: -60 }} delay={600} />

      {/* ── Floating particles ── */}
      {DOTS.map((d, i) => (
        <FloatingDot key={i} x={d.x} y={d.y} delay={d.delay} />
      ))}

      {/* ── Content ── */}
      <View style={[styles.content, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}>

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: logoOpacity, transform: [{ translateY: logoTranslate }] },
          ]}
        >
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        {/* Text block */}
        <View style={styles.textBlock}>
          {/* Badge */}
          <Animated.View
            style={[
              styles.badge,
              { opacity: badgeOpacity, transform: [{ scale: badgeScale }] },
            ]}
          >
            <Text style={styles.badgeText}>🧭  Ghana's Wellness Navigator</Text>
          </Animated.View>

          {/* Headline */}
          <Animated.Text
            style={[
              styles.headline,
              { opacity: headOpacity, transform: [{ translateY: headTranslate }] },
            ]}
          >
            Your Mind,{'\n'}
            <Text style={styles.headlineAccent}>Understood.</Text>
          </Animated.Text>

          {/* Divider line */}
          <Animated.View style={[styles.divider, { opacity: subOpacity }]} />

          {/* Subtitle */}
          <Animated.Text style={[styles.subtitle, { opacity: subOpacity }]}>
            Personalised mental health guidance built for every Ghanaian student —{' '}
            <Text style={styles.subtitleHighlight}>private, precise, and empathetic.</Text>
          </Animated.Text>

          {/* Feature pills */}
          <Animated.View style={[styles.pillRow, { opacity: subOpacity }]}>
            {['AI-Powered', 'Confidential', 'Evidence-Based'].map((label) => (
              <View key={label} style={styles.pill}>
                <Text style={styles.pillText}>{label}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* CTAs */}
        <Animated.View
          style={[
            styles.ctaCard,
            { opacity: ctaOpacity, transform: [{ translateY: ctaTranslate }] },
          ]}
        >
          {/* Primary button */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.88}
            style={styles.primaryWrapper}
          >
            <LinearGradient
              colors={['#5fa8d3', '#1b6a99', '#0d2b3e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Begin Your Journey</Text>
              <Text style={styles.primaryBtnArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          {/* Ghost / Sign In */}
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

        {/* Footer */}
        <Animated.Text style={[styles.footerText, { opacity: footOpacity }]}>
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
    overflow: 'hidden',
  },

  // ── Content layout ──
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // ── Logo ──
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(27,73,101,0.6)',
    borderWidth: 2,
    borderColor: 'rgba(95,168,211,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },

  // ── Text block ──
  textBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    width: '100%',
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(95,168,211,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.35)',
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 22,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  headline: {
    fontSize: 50,
    fontWeight: '900',
    color: theme.colors.text.primary,
    letterSpacing: -1.5,
    lineHeight: 58,
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
  },
  headlineAccent: {
    color: theme.colors.primary,
  },
  divider: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginBottom: 16,
    opacity: 0.6,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(202,233,255,0.55)',
    lineHeight: 25,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
  subtitleHighlight: {
    color: 'rgba(202,233,255,0.8)',
    fontWeight: '500',
  },

  // ── Feature pills ──
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    backgroundColor: 'rgba(27,73,101,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.2)',
    borderRadius: theme.borderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    color: theme.colors.primaryLight,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // ── CTA card ──
  ctaCard: {
    backgroundColor: 'rgba(27,73,101,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(95,168,211,0.15)',
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    marginBottom: 12,
    width: '100%',
    // Glassmorphism shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  primaryWrapper: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtn: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    gap: 10,
  },
  primaryBtnText: {
    color: theme.colors.palesky,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  primaryBtnArrow: {
    color: theme.colors.palesky,
    fontSize: 20,
    fontWeight: '300',
  },

  // ── OR separator ──
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(95,168,211,0.18)',
  },
  orText: {
    color: 'rgba(95,168,211,0.45)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ── Ghost button ──
  ghostBtn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: {
    color: 'rgba(202,233,255,0.45)',
    fontSize: 14,
    fontWeight: '500',
  },
  ghostBtnAccent: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // ── Footer ──
  footerText: {
    textAlign: 'center',
    color: 'rgba(202,233,255,0.18)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
});
