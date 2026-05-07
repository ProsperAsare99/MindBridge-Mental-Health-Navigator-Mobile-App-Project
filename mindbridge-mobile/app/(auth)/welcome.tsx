import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ─── Soft Luxury Palette ──────────────────────────────────────────────────────
const P = {
  // Backgrounds — Palette 2 (dark teal family)
  bg:           '#0e3447',
  surface:      '#124559',
  surfaceUp:    '#1a5a72',

  // Primary accent — Pearl Aqua (Palette 1)
  accent:       '#99e1d9',
  accentLight:  '#b8ece6',
  accentDim:    'rgba(153,225,217,0.15)',
  accentBorder: 'rgba(153,225,217,0.25)',
  accentGlow:   'rgba(153,225,217,0.18)',

  // Text — warm Beige / Cornsilk
  pearl:        '#eff6e0',
  pearlWarm:    '#fffae3',
  pearlMid:     'rgba(239,246,224,0.55)',
  pearlLow:     'rgba(239,246,224,0.28)',
  pearlGhost:   'rgba(239,246,224,0.10)',

  // Slide accents + neutrals
  border:       'rgba(153,225,217,0.18)',
  pink:         '#f7567c',
  success:      '#aec3b0',
  warm:         '#fffae3',
  grey:         '#598392',
};

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    key: 'mind',
    overline: 'MENTAL HEALTH · GHANA',
    headline: 'Your Mind,\nUnderstood.',
    body: 'Private, evidence-based support designed for every Ghanaian student.',
    accentColor: '#99e1d9',         // Pearl Aqua
    IllustrationComponent: MindIllustration,
  },
  {
    key: 'guide',
    overline: 'AI-POWERED CARE',
    headline: 'Guidance\nOn Your Terms.',
    body: 'Personalised check-ins, mood tracking, and coping tools — always available.',
    accentColor: '#aec3b0',         // Ash Grey-Green
    IllustrationComponent: GuideIllustration,
  },
  {
    key: 'safe',
    overline: 'FULLY CONFIDENTIAL',
    headline: 'A Safe Space,\nOnly Yours.',
    body: 'Your data stays private. Talk openly, without fear or judgment.',
    accentColor: '#f7567c',         // Bubblegum Pink
    IllustrationComponent: SafeIllustration,
  },
];

// ─── Illustrations ────────────────────────────────────────────────────────────
function MindIllustration({ color }: { color: string }) {
  const pulse       = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse,       { toValue: 1.06, duration: 2800, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.7,  duration: 2800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse,       { toValue: 1,   duration: 2800, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.3, duration: 2800, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.illustrationWrap}>
      {/* Outer pulsing glow rings */}
      <Animated.View style={[
        styles.glowRing,
        { borderColor: color, opacity: ringOpacity, transform: [{ scale: pulse }] },
      ]} />
      <Animated.View style={[
        styles.glowRingInner,
        { borderColor: color, opacity: ringOpacity, transform: [{ scale: pulse }] },
      ]} />

      {/* Circular logo */}
      <View style={[styles.logoCircle, { shadowColor: color }]}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

function GuideIllustration({ color }: { color: string }) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -10, duration: 2500, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.illustrationWrap}>
      <Animated.View style={{ transform: [{ translateY: float }] }}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Defs>
            <RadialGradient id="guideGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="80" cy="80" r="80" fill="url(#guideGrad)" />
          {/* Phone frame */}
          <Path d="M56 40 Q56 34 62 34 L98 34 Q104 34 104 40 L104 120 Q104 126 98 126 L62 126 Q56 126 56 120Z"
            stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.7" />
          {/* Screen lines */}
          <Line x1="66" y1="58" x2="94" y2="58" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          <Line x1="66" y1="70" x2="88" y2="70" stroke={color} strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
          <Line x1="66" y1="82" x2="94" y2="82" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          <Line x1="66" y1="94" x2="82" y2="94" stroke={color} strokeWidth="1.5" strokeOpacity="0.35" strokeLinecap="round" />
          {/* Check mark */}
          <Circle cx="80" cy="108" r="8" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
          <Path d="M75 108 L78 111 L85 104" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeOpacity="0.9" />
        </Svg>
      </Animated.View>
    </View>
  );
}

function SafeIllustration({ color }: { color: string }) {
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.04, duration: 3000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.95, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.illustrationWrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Defs>
            <RadialGradient id="safeGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="80" cy="80" r="80" fill="url(#safeGrad)" />
          {/* Shield */}
          <Path d="M80 30 L110 44 L110 78 C110 100 96 116 80 124 C64 116 50 100 50 78 L50 44Z"
            stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.7" />
          {/* Lock body */}
          <Path d="M68 80 L68 100 L92 100 L92 80Z" stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.6" />
          {/* Lock shackle */}
          <Path d="M72 80 L72 72 Q72 64 80 64 Q88 64 88 72 L88 80" stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.6" strokeLinecap="round" />
          {/* Keyhole */}
          <Circle cx="80" cy="88" r="3.5" fill={color} fillOpacity="0.7" />
          <Path d="M78 90 L82 90 L81.5 96 L78.5 96Z" fill={color} fillOpacity="0.7" />
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── Breathing Orb ────────────────────────────────────────────────────────────
function BreathOrb({ size, color, style, delay = 0 }: { size: number; color: string; style?: object; delay?: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale   = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.6, duration: 4500, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1.1, duration: 4500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.3, duration: 4500, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 0.9, duration: 4500, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[{
        position: 'absolute', width: size, height: size,
        borderRadius: size / 2, backgroundColor: color,
        opacity, transform: [{ scale }],
      }, style]}
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function WelcomeScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Entrance anims
  const contentA = useRef(new Animated.Value(0)).current;
  const contentT = useRef(new Animated.Value(30)).current;
  const ctaA     = useRef(new Animated.Value(0)).current;
  const ctaT     = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(contentA, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(contentT, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(ctaA, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(ctaT, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveSlide(idx);
  };

  const goNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (activeSlide + 1) * width, animated: true });
    } else {
      router.push('/(auth)/register');
    }
  };

  const slide = SLIDES[activeSlide];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ambient orbs */}
      <BreathOrb size={380} color="rgba(91,164,207,0.13)" delay={0}    style={{ top: -140, right: -120 }} />
      <BreathOrb size={280} color="rgba(91,164,207,0.08)" delay={1800} style={{ bottom: 40, left: -100 }} />

      <View style={[styles.layout, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

        {/* ── SCROLLABLE SLIDES ── */}
        <Animated.View style={[styles.slideArea, { opacity: contentA, transform: [{ translateY: contentT }] }]}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
            scrollEventThrottle={16}
          >
            {SLIDES.map((s) => {
              const Illustration = s.IllustrationComponent;
              return (
                <View key={s.key} style={styles.slide}>
                  {/* Illustration */}
                  <View style={styles.illustrationContainer}>
                    <Illustration color={s.accentColor} />
                  </View>

                  {/* Copy */}
                  <View style={styles.copyBlock}>
                    <Text style={[styles.overline, { color: s.accentColor }]}>{s.overline}</Text>
                    <Text style={styles.headline}>{s.headline}</Text>
                    <Text style={styles.body}>{s.body}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Pagination dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  i === activeSlide && [styles.dotActive, { backgroundColor: slide.accentColor }],
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* ── CTAs ── */}
        <Animated.View style={[styles.ctaSection, { opacity: ctaA, transform: [{ translateY: ctaT }] }]}>
          {/* Primary button */}
          <TouchableOpacity onPress={goNext} activeOpacity={0.84} style={styles.primaryWrap}>
            <LinearGradient
              colors={activeSlide < SLIDES.length - 1
                ? ['rgba(91,164,207,0.25)', 'rgba(91,164,207,0.1)']
                : ['#6DBDE0', '#3A8EBF', '#1C5A85']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.primaryBtn,
                activeSlide < SLIDES.length - 1 && styles.primaryBtnOutline,
              ]}
            >
              <Text style={[
                styles.primaryLabel,
                activeSlide < SLIDES.length - 1 && { color: P.accentLight },
              ]}>
                {activeSlide < SLIDES.length - 1 ? 'Continue' : 'Get Started'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign in */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.65}
            style={styles.signInRow}
          >
            <Text style={styles.signInText}>
              I already have an account{'  '}
              <Text style={styles.signInAccent}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: P.bg,
    overflow: 'hidden',
  },
  layout: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // ── Slides ──
  slideArea: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  // ── Illustration ──
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  illustrationWrap: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
  },
  glowRingInner: {
    position: 'absolute',
    width: 175,
    height: 175,
    borderRadius: 87.5,
    borderWidth: 1,
    opacity: 0.4,
  },
  logoCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    overflow: 'hidden',
    backgroundColor: '#0C1825',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  logoImage: {
    width: 148,
    height: 148,
    borderRadius: 74,
  },

  // ── Copy ──
  copyBlock: {
    alignItems: 'center',
    width: '100%',
  },
  overline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 40,
    fontWeight: '800',
    color: P.pearl,
    letterSpacing: -1.4,
    lineHeight: 46,
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    fontSize: 16,
    color: P.pearlMid,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '400',
    maxWidth: width * 0.75,
  },

  // ── Pagination ──
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: P.pearlGhost,
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
  },

  // ── CTAs ──
  ctaSection: {
    paddingHorizontal: 28,
    paddingBottom: 8,
  },
  primaryWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: P.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryBtn: {
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  primaryBtnOutline: {
    borderWidth: 1,
    borderColor: P.border,
  },
  primaryLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: P.pearl,
    letterSpacing: -0.2,
  },
  signInRow: {
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  signInText: {
    fontSize: 15,
    color: P.pearlLow,
    fontWeight: '400',
  },
  signInAccent: {
    color: P.accentLight,
    fontWeight: '600',
  },
});
