import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { FadeInUp } from 'react-native-reanimated';
import Reanimated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../src/theme/colors';
import { 
  Smile, Frown, Meh, Sun, Moon, Zap, 
  Target, Users, BookOpen, Activity, 
  ShieldCheck, Bell, ChevronRight, ChevronLeft,
  CheckCircle2
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// ─── Onboarding Step Data ───────────────────────────────────────────────────

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  icon: any;
  options: { label: string; value: string; icon?: any }[];
  multiple?: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "How are you feeling?",
    subtitle: "Select your current emotional state to help us understand you better.",
    icon: Smile,
    options: [
      { label: "Radiant", value: "radiant", icon: Sun },
      { label: "Calm", value: "calm", icon: Meh },
      { label: "Anxious", value: "anxious", icon: Activity },
      { label: "Low", value: "low", icon: Frown },
    ]
  },
  {
    id: 2,
    title: "How was your sleep?",
    subtitle: "Rest is crucial for mental clarity.",
    icon: Moon,
    options: [
      { label: "Deep & Restful", value: "great" },
      { label: "Okay", value: "okay" },
      { label: "Restless", value: "poor" },
      { label: "Insomnia", value: "very_poor" },
    ]
  },
  {
    id: 3,
    title: "Energy Levels",
    subtitle: "How would you describe your vitality right now?",
    icon: Zap,
    options: [
      { label: "High Energy", value: "high" },
      { label: "Moderate", value: "mid" },
      { label: "Tired", value: "low" },
      { label: "Exhausted", value: "empty" },
    ]
  },
  {
    id: 4,
    title: "Primary Goal",
    subtitle: "What do you hope to achieve with MindBridge?",
    icon: Target,
    options: [
      { label: "Manage Stress", value: "stress" },
      { label: "Better Focus", value: "focus" },
      { label: "Better Sleep", value: "sleep" },
      { label: "Social Connection", value: "social" },
    ]
  },
  {
    id: 5,
    title: "Academic Pressure",
    subtitle: "How much is university work affecting you currently?",
    icon: BookOpen,
    options: [
      { label: "Minimal", value: "none" },
      { label: "Manageable", value: "mid" },
      { label: "Heavy", value: "high" },
      { label: "Overwhelming", value: "extreme" },
    ]
  },
  {
    id: 6,
    title: "Physical Activity",
    subtitle: "Movement can boost your mood significantly.",
    icon: Activity,
    options: [
      { label: "Daily", value: "daily" },
      { label: "Few times a week", value: "weekly" },
      { label: "Rarely", value: "rare" },
      { label: "Not at all", value: "none" },
    ]
  },
  {
    id: 7,
    title: "Social Support",
    subtitle: "How often do you connect with friends or family?",
    icon: Users,
    options: [
      { label: "Very Often", value: "high" },
      { label: "Sometimes", value: "mid" },
      { label: "Rarely", value: "low" },
      { label: "I feel isolated", value: "isolated" },
    ]
  },
  {
    id: 8,
    title: "Privacy Level",
    subtitle: "How would you like to appear in community features?",
    icon: ShieldCheck,
    options: [
      { label: "Fully Anonymous", value: "anon" },
      { label: "Pseudonym (Nickname)", value: "pseudo" },
      { label: "Visible Name", value: "visible" },
    ]
  },
  {
    id: 9,
    title: "Daily Check-ins",
    subtitle: "When should we remind you to reflect?",
    icon: Bell,
    options: [
      { label: "Morning (8 AM)", value: "morning" },
      { label: "Afternoon (1 PM)", value: "afternoon" },
      { label: "Evening (8 PM)", value: "evening" },
      { label: "No Reminders", value: "none" },
    ]
  },
  {
    id: 10,
    title: "Ready to Begin?",
    subtitle: "Your personal navigator is now tailored to your needs.",
    icon: CheckCircle2,
    options: [
      { label: "Let's Start!", value: "finish" },
    ]
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const progressAnim = useRef(new Animated.Value(0)).current;

  const step = ONBOARDING_STEPS[currentStep];

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (currentStep + 1) / ONBOARDING_STEPS.length,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleSelect = (value: string) => {
    setAnswers({ ...answers, [step.id]: value });
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // Final Step
      router.replace('/(tabs)/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={[theme.colors.background, theme.colors.accents.softLilac]} 
        style={styles.background} 
      />

      {/* Progress Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressBar, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                }) 
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Step {currentStep + 1} of 10</Text>
      </View>

      <View style={styles.content}>
        <Reanimated.View key={currentStep} entering={FadeInUp} style={styles.stepContent}>
          <View style={styles.iconCircle}>
            <step.icon color={theme.colors.plum} size={40} strokeWidth={1.5} />
          </View>
          
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.subtitle}>{step.subtitle}</Text>

          <View style={styles.optionsContainer}>
            {step.options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionBtn,
                  answers[step.id] === opt.value && styles.optionBtnActive
                ]}
                onPress={() => handleSelect(opt.value)}
                activeOpacity={0.7}
              >
                {opt.icon && <opt.icon color={answers[step.id] === opt.value ? theme.colors.surface : theme.colors.plum} size={20} style={{marginRight: 12}} />}
                <Text style={[
                  styles.optionLabel,
                  answers[step.id] === opt.value && styles.optionLabelActive
                ]}>
                  {opt.label}
                </Text>
                {answers[step.id] === opt.value && <ChevronRight color={theme.colors.surface} size={20} />}
              </TouchableOpacity>
            ))}
          </View>
        </Reanimated.View>
      </View>

      {/* Footer Navigation */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        {currentStep > 0 && (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ChevronLeft color={theme.colors.plum} size={24} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }} />
        {currentStep === ONBOARDING_STEPS.length - 1 && (
           <TouchableOpacity onPress={() => router.replace('/(tabs)/dashboard')} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip Onboarding</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  background: { ...StyleSheet.absoluteFillObject },
  header: { paddingHorizontal: 24, marginBottom: 40 },
  progressTrack: { height: 6, backgroundColor: theme.colors.accents.softLilac, borderRadius: 3, overflow: 'hidden', marginBottom: 12 },
  progressBar: { height: '100%', backgroundColor: theme.colors.plum },
  progressText: { fontSize: 13, fontWeight: '700', color: theme.colors.plum, opacity: 0.6, letterSpacing: 0.5 },
  content: { flex: 1, paddingHorizontal: 32, justifyContent: 'center' },
  stepContent: { alignItems: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 32, shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10 },
  title: { fontSize: 28, fontWeight: '900', color: theme.colors.plum, textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 40, fontWeight: '600' },
  optionsContainer: { width: '100%', gap: 14 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, paddingHorizontal: 20, paddingVertical: 18, borderRadius: 20, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 },
  optionBtnActive: { backgroundColor: theme.colors.plum, borderColor: theme.colors.plum },
  optionLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: theme.colors.plum },
  optionLabelActive: { color: theme.colors.surface },
  footer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtnText: { fontSize: 16, fontWeight: '700', color: theme.colors.plum },
  skipBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  skipBtnText: { fontSize: 14, fontWeight: '700', color: theme.colors.text.disabled, textDecorationLine: 'underline' },
});
