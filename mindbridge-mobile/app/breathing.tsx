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
  withRepeat, 
  withSequence,
  Easing,
  interpolate,
  FadeIn
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Wind } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Breathing phases: Inhale (4s), Hold (7s), Exhale (8s)
const PHASES = [
  { text: 'Inhale', duration: 4000, targetScale: 2 },
  { text: 'Hold', duration: 7000, targetScale: 2 },
  { text: 'Exhale', duration: 8000, targetScale: 1 },
];

export default function BreathingScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const startBreathing = () => {
    setIsActive(true);
    runPhase(0);
  };

  const runPhase = (index: number) => {
    const phase = PHASES[index];
    setPhaseIndex(index);

    // Vibration on phase change
    if (isActive) Vibration.vibrate(50);

    scale.value = withTiming(phase.targetScale, {
      duration: phase.duration,
      easing: Easing.out(Easing.poly(2)),
    });

    opacity.value = withTiming(phase.text === 'Hold' ? 0.6 : 0.4, {
      duration: phase.duration,
    });

    setTimeout(() => {
      const nextIndex = (index + 1) % PHASES.length;
      runPhase(nextIndex);
    }, phase.duration);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={theme.isDark ? ['#0A0A0A', '#1A1A1A'] : [theme.colors.plum, '#4A3E4F']} 
        style={StyleSheet.absoluteFillObject} 
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breathing</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.visualizerContainer}>
          {/* Animated Background Rings */}
          <Animated.View style={[styles.ring, { borderColor: 'rgba(255,255,255,0.1)' }]} />
          <Animated.View style={[styles.ring, { borderColor: 'rgba(255,255,255,0.05)', width: 280, height: 280 }]} />
          
          {/* Main Breathing Circle */}
          <Animated.View style={[styles.breathingCircle, animatedCircleStyle]}>
            <LinearGradient 
              colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']} 
              style={StyleSheet.absoluteFillObject} 
            />
          </Animated.View>

          <View style={styles.textOverlay}>
            <Text style={styles.phaseText}>
              {isActive ? PHASES[phaseIndex].text : 'Ready?'}
            </Text>
          </View>
        </View>

        {!isActive ? (
          <Animated.View entering={FadeIn.delay(500)} style={styles.footer}>
            <Text style={styles.instruction}>
              Follow the expanding circle to pace your breath. We'll use the 4-7-8 technique.
            </Text>
            <TouchableOpacity style={styles.startBtn} onPress={startBreathing}>
              <Text style={styles.startBtnText}>Begin Session</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity 
            style={styles.stopBtn} 
            onPress={async () => {
              const today = new Date().toDateString();
              await AsyncStorage.setItem(`breathing_${today}`, 'true');
              router.back();
            }}
          >
            <Text style={styles.stopBtnText}>End Session</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  visualizerContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 150,
    borderWidth: 1,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  instruction: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  startBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  startBtnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
  stopBtn: {
    position: 'absolute',
    bottom: 60,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  stopBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  }
});
