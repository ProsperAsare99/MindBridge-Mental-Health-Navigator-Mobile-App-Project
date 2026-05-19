import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Vibration,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  Easing,
  FadeIn,
  FadeInDown,
  Layout
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Play, Square, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Breathing phases: Inhale (4s), Hold (7s), Exhale (8s)
const PHASES = [
  { text: 'Inhale', duration: 4000, targetScale: 1.8 },
  { text: 'Hold', duration: 7000, targetScale: 1.8 },
  { text: 'Exhale', duration: 8000, targetScale: 1.0 },
];

export default function BreathingScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  // Settings
  const [selectedDuration, setSelectedDuration] = useState(60); // default 1 minute (60s)
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // Animation values
  const scale = useSharedValue(1.0);
  const opacity = useSharedValue(0.4);
  const ringScale2 = useSharedValue(1.0);
  const ringScale3 = useSharedValue(1.0);

  // Timeout/Interval refs
  const phaseTimeoutRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  // Animated Styles
  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedRing2Style = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale2.value }],
    opacity: Math.max(0, 0.4 - (ringScale2.value - 1) * 0.4),
  }));

  const animatedRing3Style = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale3.value }],
    opacity: Math.max(0, 0.2 - (ringScale3.value - 1) * 0.2),
  }));

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const clearAllTimers = () => {
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const startBreathing = () => {
    setIsActive(true);
    setIsCompleted(false);
    setTimeLeft(selectedDuration);
    
    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    runPhase(0);
  };

  const runPhase = (index: number) => {
    const phase = PHASES[index];
    setPhaseIndex(index);

    // Dynamic Haptic Feedback trigger
    Vibration.vibrate(40);

    // Animating Main circle
    scale.value = withTiming(phase.targetScale, {
      duration: phase.duration,
      easing: Easing.out(Easing.quad),
    });

    opacity.value = withTiming(phase.text === 'Hold' ? 0.75 : 0.45, {
      duration: phase.duration,
    });

    // Outer Halo Ring Animations
    if (phase.text === 'Inhale') {
      ringScale2.value = withTiming(2.2, { duration: phase.duration, easing: Easing.out(Easing.quad) });
      ringScale3.value = withTiming(2.6, { duration: phase.duration, easing: Easing.out(Easing.quad) });
    } else if (phase.text === 'Exhale') {
      ringScale2.value = withTiming(1.0, { duration: phase.duration, easing: Easing.inOut(Easing.quad) });
      ringScale3.value = withTiming(1.0, { duration: phase.duration, easing: Easing.inOut(Easing.quad) });
    }

    phaseTimeoutRef.current = setTimeout(() => {
      const nextIndex = (index + 1) % PHASES.length;
      runPhase(nextIndex);
    }, phase.duration);
  };

  const stopBreathing = async () => {
    clearAllTimers();
    setIsActive(false);
    setPhaseIndex(0);
    scale.value = withTiming(1.0, { duration: 500 });
    opacity.value = withTiming(0.4, { duration: 500 });
    ringScale2.value = withTiming(1.0, { duration: 500 });
    ringScale3.value = withTiming(1.0, { duration: 500 });
  };

  const handleSessionComplete = async () => {
    clearAllTimers();
    setIsActive(false);
    setIsCompleted(true);
    Vibration.vibrate([0, 100, 100, 150]);

    // Save completed session date
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`breathing_${today}`, 'true');
    } catch (e) {
      console.error('Failed to log breathing completion:', e);
    }
  };

  // Helper to format remaining time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={theme.isDark ? ['#0C0E14', '#151821'] : ['#2E4057', '#1F2A38']} 
        style={StyleSheet.absoluteFillObject} 
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.85}>
          <X color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breathing Space</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {isCompleted ? (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.completedContainer}>
            <View style={styles.badgeContainer}>
              <Award color="#F59E0B" size={60} strokeWidth={1.5} />
            </View>
            <Text style={styles.completedTitle}>Session Completed!</Text>
            <Text style={styles.completedSub}>
              Great job taking time for your breath. Your mind is calmer and more focused.
            </Text>
            <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
              <Text style={styles.doneBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            {/* Visualizer Area */}
            <View style={styles.visualizerContainer}>
              {/* Nested Halo Ring 3 */}
              <Animated.View style={[styles.ring, styles.ringOuter, animatedRing3Style]} />
              
              {/* Nested Halo Ring 2 */}
              <Animated.View style={[styles.ring, styles.ringMid, animatedRing2Style]} />

              {/* Static target ring boundary */}
              <View style={styles.ringStatic} />
              
              {/* Main Breathing Circle */}
              <Animated.View style={[styles.breathingCircle, animatedCircleStyle]}>
                <LinearGradient 
                  colors={theme.isDark ? ['#8E6BE6', '#7F56D9'] : ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']} 
                  style={StyleSheet.absoluteFillObject} 
                />
              </Animated.View>

              <View style={styles.textOverlay}>
                <Text style={styles.phaseText}>
                  {isActive ? PHASES[phaseIndex].text : 'Ready?'}
                </Text>
                {isActive && (
                  <Text style={styles.timerDisplay}>
                    {formatTime(timeLeft)}
                  </Text>
                )}
              </View>
            </View>

            {/* Bottom Controls / Configuration panel */}
            {!isActive ? (
              <Animated.View entering={FadeIn.delay(300)} style={styles.footer}>
                <Text style={styles.instruction}>
                  Choose your duration. Focus on the expanding circle to pace your breathing using the 4-7-8 method.
                </Text>

                {/* Duration Picker Pills */}
                <View style={styles.pickerRow}>
                  {[60, 120, 300].map((durationSecs) => (
                    <TouchableOpacity
                      key={durationSecs}
                      style={[
                        styles.pickerPill,
                        selectedDuration === durationSecs && styles.pickerPillActive
                      ]}
                      onPress={() => setSelectedDuration(durationSecs)}
                      activeOpacity={0.8}
                    >
                      <Text style={[
                        styles.pickerPillText,
                        selectedDuration === durationSecs && styles.pickerPillTextActive
                      ]}>
                        {durationSecs / 60} Min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.startBtn} 
                  onPress={startBreathing}
                  activeOpacity={0.9}
                >
                  <Play color="#2E4057" size={20} fill="#2E4057" style={{ marginRight: 8 }} />
                  <Text style={styles.startBtnText}>Begin Session</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInDown} style={styles.footerActive}>
                <Text style={styles.pacingInstruction}>
                  {PHASES[phaseIndex].text === 'Inhale' && 'Breathe in deeply through your nose.'}
                  {PHASES[phaseIndex].text === 'Hold' && 'Hold your breath gently.'}
                  {PHASES[phaseIndex].text === 'Exhale' && 'Slowly release breath through your mouth.'}
                </Text>
                <TouchableOpacity 
                  style={styles.stopBtn} 
                  onPress={stopBreathing}
                  activeOpacity={0.8}
                >
                  <Square color="#FFF" size={14} fill="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.stopBtnText}>End Session</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualizerContainer: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 40,
  },
  ringStatic: {
    position: 'absolute',
    width: 216,
    height: 216,
    borderRadius: 108,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
  },
  ring: {
    position: 'absolute',
    borderRadius: 160,
    borderWidth: 1,
  },
  ringMid: {
    width: 140,
    height: 140,
    borderColor: 'rgba(123,97,255,0.2)',
  },
  ringOuter: {
    width: 140,
    height: 140,
    borderColor: 'rgba(123,97,255,0.1)',
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  textOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  timerDisplay: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 36,
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerActive: {
    width: '100%',
    paddingHorizontal: 36,
    alignItems: 'center',
    paddingBottom: 40,
  },
  instruction: {
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  pacingInstruction: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 32,
    minHeight: 48,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    justifyContent: 'center',
  },
  pickerPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pickerPillActive: {
    backgroundColor: '#FFF',
    borderColor: '#FFF',
  },
  pickerPillText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  pickerPillTextActive: {
    color: '#2E4057',
    fontWeight: '700',
  },
  startBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    color: '#2E4057',
    fontSize: 17,
    fontWeight: '800',
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  stopBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  completedContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  badgeContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245,158,11,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  completedTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  completedSub: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 32,
  },
  doneBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 28,
  },
  doneBtnText: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: '800',
  }
});
