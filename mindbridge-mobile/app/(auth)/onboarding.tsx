import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { translations, Language, TranslationSchema } from '../../src/utils/translations';
import { FadeInUp, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import Reanimated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/context/ThemeContext';
import { 
  ChevronRight, ChevronLeft, ShieldCheck, User, CheckCircle2,
  Info
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

type StepType = 'privacy' | 'text' | 'single-choice' | 'multiple-choice' | 'sliders' | 'summary' | 'consent';

interface OnboardingStep {
  id: string;
  type: StepType;
  title: string;
  subtitle?: string;
  whyWeAsk?: string;
  options?: { label: string; value: string; }[];
  sliderQuestions?: { label: string; key: string }[];
  required?: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'consent',
    type: 'consent',
    title: 'Consent & Commitment 🤝',
    required: true,
  },
  {
    id: 'q1',
    type: 'text',
    title: "Let's get to know you! 👋",
    subtitle: "What should we call you?",
    whyWeAsk: "We'll use this to make our conversations feel personal",
    required: false,
  },
  {
    id: 'q2',
    type: 'single-choice',
    title: "Welcome! 🎓",
    subtitle: "Which university are you attending?",
    whyWeAsk: "We'll connect you with campus-specific resources and support",
    options: [
      { label: "KNUST", value: "KNUST" },
      { label: "University of Ghana", value: "UG" },
      { label: "University of Cape Coast", value: "UCC" },
      { label: "Ashesi University", value: "Ashesi" },
      { label: "GIMPA", value: "GIMPA" },
      { label: "Other", value: "Other" },
    ],
    required: true,
  },
  {
    id: 'q3',
    type: 'single-choice',
    title: "What year are you in? 📚",
    subtitle: "Select your current level:",
    whyWeAsk: "Different years bring different stressors. Level 400? We know about thesis pressure!",
    options: [
      { label: "Level 100 (First year)", value: "100" },
      { label: "Level 200 (Second year)", value: "200" },
      { label: "Level 300 (Third year)", value: "300" },
      { label: "Level 400 (Final year)", value: "400" },
      { label: "Postgraduate", value: "500" },
    ],
    required: true,
  },
  {
    id: 'q4',
    type: 'single-choice',
    title: "What are you studying? 🔬",
    subtitle: "Select from common programs:",
    whyWeAsk: "Some programs have unique pressures we want to understand",
    options: [
      { label: "Engineering", value: "Engineering" },
      { label: "Medicine/Health Sciences", value: "Medicine/Health Sciences" },
      { label: "Business/Economics", value: "Business/Economics" },
      { label: "Arts/Humanities", value: "Arts/Humanities" },
      { label: "Science", value: "Science" },
      { label: "Social Sciences", value: "Social Sciences" },
      { label: "Law", value: "Law" },
      { label: "Other", value: "Other" },
    ],
    required: false,
  },
  {
    id: 'q5',
    type: 'multiple-choice',
    title: "What brings you to MindBridge? 💭",
    subtitle: "Select all that apply:",
    whyWeAsk: "This helps us prioritize what matters most to you",
    options: [
      { label: "Academic stress", value: "academic_stress" },
      { label: "Anxiety or worry", value: "anxiety" },
      { label: "Feeling sad or down", value: "sadness" },
      { label: "Loneliness or isolation", value: "loneliness" },
      { label: "Relationship issues", value: "relationships" },
      { label: "Financial stress", value: "financial" },
      { label: "Family pressure", value: "family" },
      { label: "Just want to track my mental health", value: "tracking" },
      { label: "Other", value: "other" },
    ],
    required: false,
  },
  {
    id: 'q6',
    type: 'sliders',
    title: "Current Stressors 📊",
    subtitle: "On a scale of 1-5, how much are these affecting you right now?",
    whyWeAsk: "We'll watch for patterns and offer support when these spike",
    sliderQuestions: [
      { label: "Exams & Tests", key: "exams" },
      { label: "Assignments", key: "assignments" },
      { label: "Financial concerns", key: "financial" },
      { label: "Social/relationships", key: "social" },
      { label: "Family expectations", key: "family" },
      { label: "Future uncertainty", key: "future" },
    ],
    required: false,
  },
  {
    id: 'q7',
    type: 'multiple-choice',
    title: "What helps you feel better? 🌿",
    subtitle: "Select what you already do or want to try:",
    whyWeAsk: "We'll ONLY suggest coping strategies you're comfortable with",
    options: [
      { label: "Exercise or movement", value: "exercise" },
      { label: "Writing or journaling", value: "journaling" },
      { label: "Prayer or meditation", value: "prayer" },
      { label: "Talking to someone", value: "talking" },
      { label: "Listening to music", value: "music" },
      { label: "Resting or sleeping", value: "rest" },
      { label: "Deep breathing", value: "breathing" },
      { label: "Other", value: "other" },
    ],
    required: true,
  },
  {
    id: 'q8',
    type: 'single-choice',
    title: "How important is faith in your life? 🙏",
    subtitle: "Select your preference:",
    whyWeAsk: "We respect your beliefs and will tailor our support accordingly",
    options: [
      { label: "Very important", value: "VERY_IMPORTANT" },
      { label: "Somewhat important", value: "SOMEWHAT_IMPORTANT" },
      { label: "Not important", value: "NOT_IMPORTANT" },
    ],
    required: false,
  },
  {
    id: 'q9',
    type: 'single-choice',
    title: "Who do you have in your corner? 💪",
    subtitle: "Right now, I feel:",
    whyWeAsk: "If you're feeling alone, we'll connect you with peer support",
    options: [
      { label: "Supported (I have people)", value: "STRONG" },
      { label: "Somewhat alone", value: "SOMEWHAT" },
      { label: "Very alone", value: "ALONE" },
    ],
    required: false,
  },
  {
    id: 'q10',
    type: 'multiple-choice',
    title: "What are you hoping to achieve? 🎯",
    subtitle: "Select your top goals (choose up to 3):",
    whyWeAsk: "We'll help you track progress toward what matters to you",
    options: [
      { label: "Reduce stress and anxiety", value: "reduce_stress" },
      { label: "Improve my mood", value: "improve_mood" },
      { label: "Build emotional resilience", value: "build_resilience" },
      { label: "Sleep better", value: "sleep_better" },
      { label: "Develop healthy habits", value: "healthy_habits" },
      { label: "Connect with peer support", value: "peer_support" },
      { label: "Track my mental health journey", value: "track_journey" },
      { label: "Prepare for counseling", value: "prepare_counseling" },
      { label: "Practice mindfulness", value: "mindfulness" },
      { label: "Improve my academic performance", value: "academic_performance" },
    ],
    required: false,
  },
  {
    id: 'summary',
    type: 'summary',
    title: "Your Personalized Profile 📋",
    required: true,
  }
];

const DiscreteSlider = ({ value, onValueChange, theme }: { value: number, onValueChange: (val: number) => void, theme: any }) => {
  const styles = createStyles(theme);
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderTrack} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity 
            key={val} 
            onPress={() => onValueChange(val)}
            style={[
              styles.sliderDot,
              value >= val && styles.sliderDotActive
            ]}
          >
            <Text style={[styles.sliderDotText, value >= val && styles.sliderDotTextActive]}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeContext = useTheme();
  const { userData: authData } = useContext(AuthContext);
  const styles = createStyles(themeContext);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    stressors: {}
  });
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const preferredLanguage = (authData?.preferredLanguage as Language) || 'English';
  const t: TranslationSchema = translations[preferredLanguage] || translations.English;

  const step = ONBOARDING_STEPS[currentStepIndex];

  // Questions 1 to 10 mapped to index 1 to 10
  const isQuestionStep = currentStepIndex > 0 && currentStepIndex < ONBOARDING_STEPS.length - 1;
  const questionNumber = currentStepIndex;

  useEffect(() => {
    let progress = 0;
    if (isQuestionStep) {
      progress = questionNumber / 10;
    } else if (currentStepIndex === ONBOARDING_STEPS.length - 1) {
      progress = 1;
    }
    Animated.spring(progressAnim, {
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsFinishing(true);
      // Artificial delay to show system status feedback
      setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 2500);
    }
  };

  const jumpToStep = (index: number) => {
    setCurrentStepIndex(index);
  };

  const handleSkipRequest = () => {
    if (step.required) return;
    setShowSkipModal(true);
  };

  const confirmSkip = () => {
    setShowSkipModal(false);
    handleNext();
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSelectSingle = (value: string) => {
    setAnswers({ ...answers, [step.id]: value });
  };

  const handleSelectMultiple = (value: string) => {
    const currentList = answers[step.id] || [];
    if (currentList.includes(value)) {
      setAnswers({ ...answers, [step.id]: currentList.filter((v: string) => v !== value) });
    } else {
      if (step.id === 'q10' && currentList.length >= 3) return; // Max 3 for goals
      setAnswers({ ...answers, [step.id]: [...currentList, value] });
    }
  };

  const handleSliderChange = (key: string, value: number) => {
    setAnswers({
      ...answers,
      stressors: {
        ...(answers.stressors || {}),
        [key]: value
      }
    });
  };

  const hasValidAnswer = () => {
    if (step.type === 'text') return (answers[step.id]?.trim()?.length || 0) >= 2;
    if (step.type === 'single-choice') return !!answers[step.id];
    if (step.type === 'multiple-choice') return (answers[step.id]?.length || 0) > 0;
    if (step.type === 'sliders') return answers.stressors && Object.keys(answers.stressors).length > 0;
    return true;
  };

  const isNextEnabled = hasValidAnswer();

  const renderContent = () => {
    switch (step.type) {
      case 'consent':
        const userName = authData?.name || 'Friend';
        const userUni = authData?.academic?.institution || 'your university';
        
        return (
          <View style={styles.centerContent}>
            <View style={styles.iconCircle}>
              <ShieldCheck color={themeContext.colors.plum} size={40} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>{step.title}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
              <Text style={styles.consentGreeting}>Hello {userName},</Text>
              <Text style={styles.consentBody}>
                To provide you with the best possible support, we'd like to use the information you shared—including your studies at {userUni}—to personalize your MindBridge experience.
              </Text>
              
              <View style={styles.consentPointsBox}>
                <View style={styles.consentPointRow}>
                  <CheckCircle2 color={themeContext.colors.accents.eucalyptus} size={18} />
                  <Text style={styles.consentPointText}>Your data is encrypted and stays between us.</Text>
                </View>
                <View style={styles.consentPointRow}>
                  <CheckCircle2 color={themeContext.colors.accents.eucalyptus} size={18} />
                  <Text style={styles.consentPointText}>You have full control over what the Oracle knows.</Text>
                </View>
                <View style={styles.consentPointRow}>
                  <CheckCircle2 color={themeContext.colors.accents.eucalyptus} size={18} />
                  <Text style={styles.consentPointText}>Our goal is to nurture your peace, not just track data.</Text>
                </View>
              </View>

              <Text style={styles.consentCommitmentTitle}>My Commitment to Self-Care</Text>
              <Text style={styles.consentCommitmentText}>
                I understand that MindBridge is a supportive tool and I agree to use it as part of my wellness journey. I will seek professional help if I ever feel I am in immediate danger.
              </Text>

              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 30, marginBottom: 20 }]} onPress={handleNext}>
                <Text style={styles.primaryBtnText}>I Consent & Agree</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 40, alignSelf: 'center' }}>
                <Text style={styles.skipText}>Exit MindBridge</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        );

      case 'text':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.subtitle}>{step.subtitle}</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Your name"
              placeholderTextColor={themeContext.colors.text.disabled}
              value={answers[step.id] || ''}
              onChangeText={(text) => setAnswers({ ...answers, [step.id]: text })}
              autoFocus
            />
            {step.whyWeAsk && (
              <View style={styles.whyWeAskBox}>
                <Info color={themeContext.colors.plum} size={16} />
                <Text style={styles.whyWeAskText}>{step.whyWeAsk}</Text>
              </View>
            )}
          </View>
        );

      case 'single-choice':
      case 'multiple-choice':
        const titleWithContext = step.id === 'q2' && answers['q1'] 
          ? `Welcome, ${answers['q1']}! 🎓` 
          : step.title;

        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>{titleWithContext}</Text>
            <Text style={styles.subtitle}>{step.subtitle}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 100 }}>
              {step.options?.map((opt) => {
                const isSelected = step.type === 'multiple-choice' 
                  ? (answers[step.id] || []).includes(opt.value)
                  : answers[step.id] === opt.value;

                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.optionBtn,
                      isSelected && styles.optionBtnActive
                    ]}
                    onPress={() => step.type === 'multiple-choice' ? handleSelectMultiple(opt.value) : handleSelectSingle(opt.value)}
                    activeOpacity={0.7}
                  >
                    {step.type === 'multiple-choice' && (
                      <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                        {isSelected && <CheckCircle2 color={themeContext.colors.surface} size={16} />}
                      </View>
                    )}
                    <Text style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelActive,
                      step.type === 'multiple-choice' && { marginLeft: 12 }
                    ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {step.whyWeAsk && (
              <View style={styles.whyWeAskBox}>
                <Info color={themeContext.colors.plum} size={16} />
                <Text style={styles.whyWeAskText}>{step.whyWeAsk}</Text>
              </View>
            )}
          </View>
        );

      case 'sliders':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.subtitle}>{step.subtitle}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              {step.sliderQuestions?.map((q) => (
                <View key={q.key} style={styles.sliderItem}>
                  <Text style={styles.sliderLabel}>{q.label}</Text>
                  <DiscreteSlider 
                    value={answers.stressors?.[q.key] || 0} 
                    onValueChange={(val) => handleSliderChange(q.key, val)}
                    theme={themeContext}
                  />
                </View>
              ))}
            </ScrollView>

            {step.whyWeAsk && (
              <View style={styles.whyWeAskBox}>
                <Info color={themeContext.colors.plum} size={16} />
                <Text style={styles.whyWeAskText}>{step.whyWeAsk}</Text>
              </View>
            )}
          </View>
        );

      case 'summary':
        const name = answers['q1'] || 'Friend';
        const level = ONBOARDING_STEPS.find(s => s.id === 'q3')?.options?.find(o => o.value === answers['q3'])?.label || answers['q3'];
        const program = answers['q4'] || 'student';
        const uni = answers['q2'];
        const goalsLabels = (answers['q10'] || []).map((val: string) => 
          ONBOARDING_STEPS.find(s => s.id === 'q10')?.options?.find(o => o.value === val)?.label
        ).filter(Boolean).join(', ');
        
        return (
          <View style={styles.centerContent}>
            <View style={styles.iconCircle}>
              <User color={themeContext.colors.plum} size={40} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>{t.onboarding.summaryTitle || step.title}</Text>
            <Text style={styles.summaryGreeting}>Hey {name}!</Text>
            
            <View style={styles.summaryBox}>
              <Text style={styles.summaryBoxTitle}>Here's what we learned about you:</Text>
              
              <TouchableOpacity onPress={() => jumpToStep(2)} style={styles.summaryItemRow}>
                <Text style={styles.summaryItem}>• {level} {program} at {uni}</Text>
                <Text style={styles.editLabel}>Edit</Text>
              </TouchableOpacity>

              {(answers['q5'] && answers['q5'].length > 0) && (
                <TouchableOpacity onPress={() => jumpToStep(6)} style={styles.summaryItemRow}>
                  <Text style={styles.summaryItem}>• Working on: {answers['q5'].length} concern(s)</Text>
                  <Text style={styles.editLabel}>Edit</Text>
                </TouchableOpacity>
              )}

              {(answers['q7'] && answers['q7'].length > 0) && (
                <TouchableOpacity onPress={() => jumpToStep(8)} style={styles.summaryItemRow}>
                  <Text style={styles.summaryItem}>• Coping via: {answers['q7'].length} method(s)</Text>
                  <Text style={styles.editLabel}>Edit</Text>
                </TouchableOpacity>
              )}

              {goalsLabels ? (
                <TouchableOpacity onPress={() => jumpToStep(11)} style={styles.summaryItemRow}>
                  <Text style={styles.summaryItem}>• Goals: {goalsLabels}</Text>
                  <Text style={styles.editLabel}>Edit</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.summaryFooterBox}>
              <Text style={styles.summaryItem}>✓ Personalize AI conversations</Text>
              <Text style={styles.summaryItem}>✓ Suggest relevant resources</Text>
              <Text style={styles.summaryItem}>✓ Track your progress</Text>
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { marginTop: 30 }]} onPress={handleNext}>
              <Text style={styles.primaryBtnText}>Let's Begin! 🚀</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle={themeContext.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={themeContext.isDark 
          ? ['rgba(123, 97, 255, 0.15)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
          : ['rgba(123, 97, 255, 0.12)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
        } 
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      {/* Header with Back and Progress */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          {currentStepIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <ChevronLeft color={themeContext.colors.plum} size={28} />
            </TouchableOpacity>
          ) : <View style={{ width: 28 }} />}
          
          {isQuestionStep && (
            <Text style={styles.progressText}>Question {questionNumber} of 10</Text>
          )}
          
          <View style={{ width: 28 }} />
        </View>

        {isQuestionStep && (
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
        )}
      </View>

      <View style={styles.content}>
        <Reanimated.View 
          key={currentStepIndex} 
          entering={FadeInRight.duration(400)} 
          exiting={FadeOutLeft.duration(300)}
          style={{ flex: 1 }}
        >
          {renderContent()}
        </Reanimated.View>
      </View>

      {/* Footer for non-privacy and non-summary steps */}
      {isQuestionStep && (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
          <View style={styles.leftFooterActions}>
            <TouchableOpacity onPress={handleBack} style={styles.backFooterBtn}>
              <ChevronLeft color={themeContext.colors.plum} size={24} />
            </TouchableOpacity>
            
            {!step.required && (
              <TouchableOpacity onPress={handleSkipRequest} style={styles.skipBtn}>
                <Text style={styles.skipText}>{t.common.skip}</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            onPress={handleNext} 
            style={[styles.nextBtn, !isNextEnabled && styles.nextBtnDisabled]}
            disabled={!isNextEnabled}
          >
            <Text style={styles.nextBtnText}>{t.common.next}</Text>
            <ChevronRight color={themeContext.colors.text.onPrimary || '#FFF'} size={20} />
          </TouchableOpacity>
        </View>
      )}

      {/* Skip Confirmation Modal */}
      <Modal visible={showSkipModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Reanimated.View entering={FadeInUp} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wait a moment</Text>
            <Text style={styles.modalText}>{t.onboarding.skipConfirm}</Text>
            <TouchableOpacity style={styles.modalPrimaryBtn} onPress={confirmSkip}>
              <Text style={styles.modalPrimaryBtnText}>{t.onboarding.skipConfirmAction}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSecondaryBtn} onPress={() => setShowSkipModal(false)}>
              <Text style={styles.modalSecondaryBtnText}>{t.onboarding.skipConfirmCancel}</Text>
            </TouchableOpacity>
          </Reanimated.View>
        </View>
      </Modal>

      {/* Finishing / Transition Modal */}
      <Modal visible={isFinishing} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: themeContext.colors.background }]}>
          <Reanimated.View entering={FadeInUp} style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" color={themeContext.colors.plum} />
            <Text style={[styles.modalTitle, { marginTop: 24 }]}>{t.common.loadingSafeSpace}</Text>
          </Reanimated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  background: { ...StyleSheet.absoluteFillObject },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  backBtn: { padding: 4 },
  progressTrack: { height: 8, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: theme.colors.plum, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '700', color: theme.colors.plum, opacity: 0.8 },
  content: { flex: 1, paddingHorizontal: 24 },
  
  // Layouts
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stepContainer: { flex: 1, paddingTop: 10 },
  
  // Shared
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 8 }, shadowOpacity: theme.isDark ? 0.3 : 0.1, shadowRadius: 16, elevation: 8 },
  title: { fontSize: 30, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 12, textAlign: 'center', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  
  // Privacy / Consent
  privacyText: { fontSize: 15, color: theme.colors.text.primary, lineHeight: 28, textAlign: 'center', paddingHorizontal: 10 },
  consentGreeting: { fontSize: 18, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, marginBottom: 12, marginTop: 10 },
  consentBody: { fontSize: 15, fontFamily: theme.typography.fonts.content, color: theme.colors.text.secondary, lineHeight: 24, marginBottom: 24 },
  consentPointsBox: { backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.05)' : 'rgba(0,0,0,0.02)', borderRadius: 20, padding: 20, gap: 16, marginBottom: 24 },
  consentPointRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  consentPointText: { flex: 1, fontSize: 14, fontFamily: theme.typography.fonts.body, color: theme.colors.text.primary, fontWeight: '500' },
  consentCommitmentTitle: { fontSize: 16, fontFamily: theme.typography.fonts.header, color: theme.colors.plum, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  consentCommitmentText: { fontSize: 14, fontFamily: theme.typography.fonts.humanist, color: theme.colors.text.tertiary, lineHeight: 22, fontStyle: 'italic' },
  
  // Options
  optionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, paddingHorizontal: 20, paddingVertical: 18, borderRadius: 20, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: theme.isDark ? 0.2 : 0.04, shadowRadius: 12, elevation: 2 },
  optionBtnActive: { backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.15)' : 'rgba(123, 97, 255, 0.05)', borderColor: theme.isDark ? 'rgba(140, 160, 185, 0.3)' : 'rgba(123, 97, 255, 0.15)' },
  optionLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: theme.colors.text.primary },
  optionLabelActive: { color: theme.colors.plum, fontWeight: '700' },
  
  // Checkbox
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: theme.colors.plum, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: theme.colors.plum },
  
  // Input
  textInput: { backgroundColor: theme.colors.surface, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 18, fontSize: 18, color: theme.colors.text.primary, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: theme.isDark ? 0.2 : 0.04, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  
  // Sliders
  sliderItem: { marginBottom: 24, backgroundColor: theme.colors.surface, padding: 20, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: theme.isDark ? 0.2 : 0.04, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  sliderLabel: { fontSize: 16, fontWeight: '600', color: theme.colors.text.primary, marginBottom: 16 },
  sliderContainer: { position: 'relative', width: '100%', height: 40, justifyContent: 'center' },
  sliderTrack: { position: 'absolute', top: 19, left: 10, right: 10, height: 2, backgroundColor: theme.colors.accents.softLilac },
  sliderDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.accents.softLilac, alignItems: 'center', justifyContent: 'center' },
  sliderDotActive: { backgroundColor: theme.colors.plum, borderColor: theme.colors.plum },
  sliderDotText: { fontSize: 13, fontWeight: '700', color: theme.colors.text.secondary },
  sliderDotTextActive: { color: theme.colors.text.onPrimary || '#FFF' },

  // Why We Ask
  whyWeAskBox: { flexDirection: 'row', backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.1)' : 'rgba(123, 97, 255, 0.1)', padding: 16, borderRadius: 12, marginTop: 24, alignItems: 'center' },
  whyWeAskText: { flex: 1, fontSize: 14, color: theme.colors.plum, marginLeft: 12, fontWeight: '500', lineHeight: 20 },

  // Summary
  summaryGreeting: { fontSize: 22, fontWeight: '700', color: theme.colors.text.primary, marginBottom: 24 },
  summaryBox: { backgroundColor: theme.colors.surface, padding: 24, borderRadius: 24, width: '100%', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: theme.isDark ? 0.2 : 0.04, shadowRadius: 12, elevation: 3, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  summaryBoxTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.plum, marginBottom: 12 },
  summaryItem: { flex: 1, fontSize: 15, color: theme.colors.text.secondary, marginBottom: 8, lineHeight: 22 },
  summaryItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  editLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.plum, marginLeft: 10, backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.1)' : 'rgba(123, 97, 255, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  summaryFooterBox: { width: '100%', paddingHorizontal: 10, marginTop: 10 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: theme.colors.surface, borderRadius: 32, padding: 32, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 12 },
  modalText: { fontSize: 16, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  modalPrimaryBtn: { backgroundColor: theme.colors.plum, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 20, width: '100%', alignItems: 'center' },
  modalPrimaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalSecondaryBtn: { paddingVertical: 16, width: '100%', alignItems: 'center', marginTop: 8 },
  modalSecondaryBtnText: { color: theme.colors.text.tertiary, fontSize: 15, fontWeight: '600' },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, justifyContent: 'space-between', backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: theme.isDark ? 0.3 : 0.05, shadowRadius: 12, elevation: 8, zIndex: 100 },
  leftFooterActions: { flexDirection: 'row', alignItems: 'center' },
  skipBtn: { paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1.5, borderColor: theme.colors.plumLight, borderRadius: 30, marginLeft: 12 },
  skipText: { fontSize: 15, fontWeight: '700', color: theme.colors.plumLight },
  backFooterBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.1)' : 'rgba(123, 97, 255, 0.08)', alignItems: 'center', justifyContent: 'center' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.plum, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 30 },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: theme.colors.text.onPrimary || '#FFF', marginRight: 8 },
  
  // Primary Action
  primaryBtn: { backgroundColor: theme.colors.plum, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 4 }, shadowOpacity: theme.isDark ? 0.4 : 0.3, shadowRadius: 8, elevation: 6 },
  primaryBtnText: { color: theme.colors.text.onPrimary || '#FFF', fontSize: 18, fontWeight: '700' },
});
