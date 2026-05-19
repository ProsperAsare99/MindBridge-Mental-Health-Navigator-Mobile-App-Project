import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Vibration,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Eye, Hand, Volume2, Smile, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const STEPS = [
  {
    step: 5,
    title: '5 Things You Can See',
    instruction: 'Look around you and name 5 things you can see. Type them below to ground yourself.',
    icon: Eye,
    placeholder: 'Thing you see',
    count: 5
  },
  {
    step: 4,
    title: '4 Things You Can Touch',
    instruction: 'Acknowledge 4 things you can physically feel (e.g. your clothes, chair, hair).',
    icon: Hand,
    placeholder: 'Thing you feel',
    count: 4
  },
  {
    step: 3,
    title: '3 Things You Can Hear',
    instruction: 'Listen carefully. Name 3 distinct sounds in your current environment.',
    icon: Volume2,
    placeholder: 'Sound you hear',
    count: 3
  },
  {
    step: 2,
    title: '2 Things You Can Smell',
    instruction: 'Inhale deeply. Name 2 scents or smells you notice around you.',
    icon: Smile,
    placeholder: 'Smell/Scent',
    count: 2
  },
  {
    step: 1,
    title: '1 Thing You Can Taste',
    instruction: 'Focus on your mouth. Name 1 thing you can taste right now.',
    icon: Smile,
    placeholder: 'Taste you notice',
    count: 1
  }
];

export default function GroundingScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputs, setInputs] = useState<string[]>(Array(5).fill(''));
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleInputChange = (text: string, idx: number) => {
    const nextInputs = [...inputs];
    nextInputs[idx] = text;
    setInputs(nextInputs);
  };

  const handleNext = () => {
    Vibration.vibrate(30);
    
    // Check if at least some inputs are filled (optional warning but keep it smooth)
    if (currentStepIndex < STEPS.length - 1) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      // Reset inputs for the next step's count
      setInputs(Array(STEPS[nextStepIndex].count).fill(''));
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    Vibration.vibrate([0, 100, 50, 150]);
    setIsCompleted(true);

    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`grounding_${today}`, 'true');
    } catch (e) {
      console.error('Failed to log grounding completion:', e);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient 
          colors={theme.isDark ? ['#0E1118', '#161B26'] : ['#2E4057', '#1E293B']} 
          style={StyleSheet.absoluteFillObject} 
        />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.85}>
            <X color="#FFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Grounding Space</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {isCompleted ? (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.completedContainer}>
              <View style={styles.badgeContainer}>
                <Award color="#F59E0B" size={60} strokeWidth={1.5} />
              </View>
              <Text style={styles.completedTitle}>You are Grounded</Text>
              <Text style={styles.completedSub}>
                By focusing on your five senses, you have successfully anchored your mind to the present moment. Take a deep breath.
              </Text>
              <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
                <Text style={styles.doneBtnText}>Back to Dashboard</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={styles.stepContainer}>
              {/* Stepper Indicators */}
              <View style={styles.progressRow}>
                {STEPS.map((s, idx) => (
                  <View 
                    key={s.step} 
                    style={[
                      styles.progressBar, 
                      { 
                        backgroundColor: idx <= currentStepIndex ? '#7B61FF' : 'rgba(255,255,255,0.1)',
                        flex: 1
                      }
                    ]} 
                  />
                ))}
              </View>

              {/* Icon & Title */}
              <Animated.View key={currentStep.step} entering={FadeIn.duration(400)} style={styles.card}>
                <View style={styles.iconContainer}>
                  <StepIcon color="#7B61FF" size={32} />
                </View>
                <Text style={styles.stepTitle}>{currentStep.title}</Text>
                <Text style={styles.instruction}>{currentStep.instruction}</Text>

                {/* Input Fields */}
                <View style={styles.inputsList}>
                  {Array(currentStep.count).fill(0).map((_, idx) => (
                    <TextInput
                      key={idx}
                      style={styles.textInput}
                      placeholder={`${currentStep.placeholder} ${idx + 1}`}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={inputs[idx] || ''}
                      onChangeText={(text) => handleInputChange(text, idx)}
                      returnKeyType="next"
                    />
                  ))}
                </View>
              </Animated.View>

              <TouchableOpacity 
                style={styles.nextBtn}
                onPress={handleNext}
                activeOpacity={0.9}
              >
                <Text style={styles.nextBtnText}>
                  {currentStepIndex === STEPS.length - 1 ? 'Complete Exercise' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  stepContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 24,
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(123,97,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  instruction: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputsList: {
    width: '100%',
    gap: 12,
  },
  textInput: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    color: '#FFF',
    fontSize: 14,
  },
  nextBtn: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#2E4057',
    fontSize: 16,
    fontWeight: '800',
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
