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
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useTheme } from '../../src/context/ThemeContext';
import { Ghost } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// ─── Illustrations ────────────────────────────────────────────────────────────
function MindIllustration({ color, theme }: { color: string, theme: any }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1.04, duration: 2800, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.6, duration: 2800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 2800, useNativeDriver: true }),
          Animated.timing(ringOpacity, { toValue: 0.4, duration: 2800, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 2, borderColor: color, opacity: ringOpacity, transform: [{ scale: pulse }] }]} />
      <Animated.View style={[{ position: 'absolute', width: 175, height: 175, borderRadius: 87.5, borderWidth: 1.5, borderColor: theme.colors.plum, opacity: 0.3, transform: [{ scale: pulse }] }]} />
      <View style={[{ width: 148, height: 148, borderRadius: 74, overflow: 'hidden', backgroundColor: theme.colors.surface, shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: theme.isDark ? 0.3 : 0.1, shadowRadius: 10, elevation: 8 }]}>
        <Image source={require('../../assets/images/logo.png')} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
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
    <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ translateY: float }] }}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Circle cx="80" cy="80" r="70" fill={color} fillOpacity="0.1" />
          <Path d="M56 40 Q56 34 62 34 L98 34 Q104 34 104 40 L104 120 Q104 126 98 126 L62 126 Q56 126 56 120Z" stroke={color} strokeWidth="3" fill="none" />
          <Line x1="66" y1="58" x2="94" y2="58" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <Line x1="66" y1="74" x2="88" y2="74" stroke={color} strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round" />
          <Line x1="66" y1="90" x2="94" y2="90" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <Circle cx="80" cy="110" r="5" stroke={color} strokeWidth="2" fill="none" />
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
    <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <Circle cx="80" cy="80" r="70" fill={color} fillOpacity="0.1" />
          <Path d="M80 30 L115 45 L115 80 C115 105 98 125 80 135 C62 125 45 105 45 80 L45 45 Z" stroke={color} strokeWidth="3" fill="none" />
          <Path d="M70 85 L70 105 L90 105 L90 85 Z" stroke={color} strokeWidth="2.5" fill="none" />
          <Path d="M74 85 L74 78 Q74 70 80 70 Q86 70 86 78 L86 85" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </Svg>
      </Animated.View>
    </View>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  
  const theme = useTheme();
  const styles = createStyles(theme);

  const SLIDES = [
    {
      key: 'mind',
      overline: 'MENTAL HEALTH · GHANA',
      headline: 'Your Mind,\nUnderstood.',
      body: 'Private, evidence-based support designed for every Ghanaian student.',
      accentColor: theme.colors.plum,
      IllustrationComponent: MindIllustration,
    },
    {
      key: 'guide',
      overline: 'AI-POWERED CARE',
      headline: 'Guidance\nOn Your Terms.',
      body: 'Personalised check-ins, mood tracking, and coping tools — always available.',
      accentColor: theme.colors.accents.slate,
      IllustrationComponent: GuideIllustration,
    },
    {
      key: 'safe',
      overline: 'FULLY CONFIDENTIAL',
      headline: 'A Safe Space,\nOnly Yours.',
      body: 'Your data stays private. Talk openly, without fear or judgment.',
      accentColor: theme.colors.accents.forestGreen,
      IllustrationComponent: SafeIllustration,
    },
  ];

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
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <View style={[styles.bgOrb, { backgroundColor: theme.colors.accents.eucalyptus, top: -180, right: -150 }]} />
      <View style={[styles.bgOrb, { backgroundColor: theme.colors.accents.gentlePeach, bottom: -120, left: -100, width: 300, height: 300 }]} />

      <View style={[styles.layout, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.slideArea}>
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
                  <View style={styles.illustrationContainer}>
                    <Illustration color={s.accentColor} theme={theme} />
                  </View>
                  <View style={styles.copyBlock}>
                    <Text style={[styles.overline, { color: s.accentColor }]}>{s.overline}</Text>
                    <Text style={styles.headline}>{s.headline}</Text>
                    <Text style={styles.body}>{s.body}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeSlide && [styles.dotActive, { backgroundColor: slide.accentColor }]]} />
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity onPress={goNext} activeOpacity={0.9} style={styles.primaryWrap}>
            <LinearGradient
              colors={activeSlide < SLIDES.length - 1
                ? [theme.colors.surface, theme.isDark ? theme.colors.backgroundSecondary : '#EAE5DE']
                : [theme.colors.plum, theme.isDark ? '#3D4C5D' : '#4A3E4F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.primaryBtn, activeSlide < SLIDES.length - 1 && styles.primaryBtnOutline]}
            >
              <Text style={[styles.primaryLabel, activeSlide < SLIDES.length - 1 ? { color: theme.colors.plum } : { color: theme.colors.onPrimary || '#FFF' }]}>
                {activeSlide < SLIDES.length - 1 ? 'Continue' : 'Get Started'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Anonymous/Guest Option */}
          {activeSlide === SLIDES.length - 1 && (
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login?anonymous=true')} 
              activeOpacity={0.7} 
              style={styles.guestBtn}
            >
              <Ghost color={theme.colors.plum} size={20} style={{ marginRight: 8 }} />
              <Text style={styles.guestBtnText}>Explore Anonymously</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.65} style={styles.signInRow}>
            <Text style={styles.signInText}>
              I already have an account{'  '}
              <Text style={styles.signInAccent}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  layout: { flex: 1, justifyContent: 'space-between' },
  bgOrb: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: theme.isDark ? 0.05 : 0.1,
  },
  slideArea: { flex: 1 },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  illustrationContainer: { marginBottom: 40, alignItems: 'center' },
  copyBlock: { alignItems: 'center', width: '100%' },
  overline: { fontSize: 11, fontWeight: '800', letterSpacing: 2.5, marginBottom: 16, textTransform: 'uppercase' },
  headline: { fontSize: 40, fontWeight: '900', color: theme.colors.plum, letterSpacing: -1.4, lineHeight: 46, textAlign: 'center', marginBottom: 16 },
  body: { fontSize: 16, color: theme.colors.text.primary, lineHeight: 26, textAlign: 'center', fontWeight: '600', maxWidth: width * 0.75 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.mauve, opacity: 0.5 },
  dotActive: { width: 22, height: 6, borderRadius: 3, opacity: 1 },
  ctaSection: { paddingHorizontal: 28, paddingBottom: 8 },
  primaryWrap: { borderRadius: 18, overflow: 'hidden', marginBottom: 10 },
  primaryBtn: { height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  primaryBtnOutline: { borderWidth: 2, borderColor: theme.colors.mauve },
  primaryLabel: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  guestBtn: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.1)' : 'rgba(123, 97, 255, 0.08)',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.isDark ? 'rgba(140, 160, 185, 0.15)' : 'rgba(123, 97, 255, 0.15)',
  },
  guestBtnText: {
    color: theme.colors.plum,
    fontSize: 16,
    fontWeight: '700',
  },
  signInRow: { height: 46, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  signInText: { fontSize: 15, color: theme.colors.text.primary, fontWeight: '600' },
  signInAccent: { color: theme.colors.plum, fontWeight: '800' },
});
