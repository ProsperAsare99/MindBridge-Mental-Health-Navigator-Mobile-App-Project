import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInUp,
  FadeIn,
  FadeInRight,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Leaf, Sun, CloudRain, Wind, CloudLightning, Flower2, Clock, CircleDashed, Bell, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import api from '../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { LuxuryCard } from '../../src/components/LuxuryCard';
import { translations, Language } from '../../src/utils/translations';
import { AuthContext } from '../../src/context/AuthContext';
import { useContext } from 'react';
const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

// ─── Time-of-day context ────────────────────────────────────────────────────
const getTimeContext = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: 'Good morning', prompt: 'Start your day with intention.' };
  if (hour >= 12 && hour < 17) return { greeting: 'Good afternoon', prompt: 'How\'s your afternoon going?' };
  if (hour >= 17 && hour < 21) return { greeting: 'Good evening', prompt: 'Wind down and reflect.' };
  return { greeting: 'Good night', prompt: 'How did today feel?' };
};

// ─── 9 Mood States ──────────────────────────────────────────────────────────
const getMoods = (theme: any) => [
  { id: 'elated',    label: 'Elated',     emoji: '😄', color: '#F59E0B', score: 10 },
  { id: 'joyful',   label: 'Joyful',     emoji: '😊', color: theme.colors.accents.gentlePeach, score: 9 },
  { id: 'calm',     label: 'Calm',       emoji: '😌', color: theme.colors.accents.eucalyptus, score: 8 },
  { id: 'okay',     label: 'Okay',       emoji: '🙂', color: '#6EE7B7', score: 7 },
  { id: 'neutral',  label: 'Neutral',    emoji: '😐', color: theme.colors.accents.powderBlue, score: 6 },
  { id: 'tired',    label: 'Tired',      emoji: '😔', color: theme.colors.accents.softLilac, score: 5 },
  { id: 'anxious',  label: 'Anxious',    emoji: '😰', color: theme.colors.accents.slate, score: 4 },
  { id: 'sad',      label: 'Low',        emoji: '😢', color: '#60A5FA', score: 3 },
  { id: 'stressed', label: 'Overwhelmed',emoji: '😩', color: '#F87171', score: 2 },
];

// ─── Binary check-in questions ──────────────────────────────────────────────
const CHECK_IN_QUESTIONS = [
  {
    id: 'sleep',
    question: 'Did you sleep well last night?',
    emoji: '🌙',
    key: 'sleptWell',
  },
  {
    id: 'stress',
    question: 'Are you feeling overwhelmed by tasks right now?',
    emoji: '📚',
    key: 'overwhelmed',
  },
];

// ─── Mood Circle Component ───────────────────────────────────────────────────
const MoodCircle = ({ mood, isSelected, onPress, delay }: any) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400)} style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.9, springConfig); }}
        onPressOut={() => { scale.value = withSpring(isSelected ? 1.06 : 1, springConfig); }}
        style={styles_circle.wrap}
      >
        <View style={[
          styles_circle.circle,
          { backgroundColor: mood.color + (isSelected ? 'FF' : '30'), borderColor: mood.color, borderWidth: isSelected ? 3 : 1.5 },
          isSelected && {
            shadowColor: mood.color,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 10,
          }
        ]}>
          <Text style={{ fontSize: 32 }}>{mood.emoji}</Text>
        </View>
        <Text style={[styles_circle.label, isSelected && { color: mood.color, fontWeight: '800' }]}>
          {mood.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles_circle = StyleSheet.create({
  wrap: { alignItems: 'center', width: '31%' },
  circle: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  label: { fontSize: 11, fontWeight: '600', color: '#888', textAlign: 'center' },
});

// ─── Notification modal ──────────────────────────────────────────────────────
const NotificationModal = ({ visible, onAllow, onLater, theme }: any) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
      <Animated.View entering={FadeInUp.duration(400)} style={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        padding: 32, paddingBottom: 48,
        alignItems: 'center',
      }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.colors.plum + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Bell color={theme.colors.plum} size={36} />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 10, textAlign: 'center' }}>
          Keep your garden growing 🌱
        </Text>
        <Text style={{ fontSize: 15, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
          We'll gently remind you to plant your seed up to 3 times a day — morning, afternoon, and evening.
        </Text>
        <TouchableOpacity
          onPress={onAllow}
          style={{ backgroundColor: theme.colors.plum, width: '100%', height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}
        >
          <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '800' }}>Enable Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLater}>
          <Text style={{ color: theme.colors.text.secondary, fontSize: 16, fontWeight: '600' }}>Maybe later</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  </Modal>
);

// ─── Growth stage ────────────────────────────────────────────────────────────
const getGrowthStage = (count: number) => {
  if (count >= 20) return { label: 'Ancient Tree',   icon: Flower2,      color: '#8B5CF6', stage: 5 };
  if (count >= 14) return { label: 'Full Bloom',     icon: Flower2,      color: '#7B61FF', stage: 4 };
  if (count >= 8)  return { label: 'Healthy Plant',  icon: Leaf,         color: '#34D399', stage: 3 };
  if (count >= 4)  return { label: 'Sprouting',      icon: Sun,          color: '#FBBF24', stage: 2 };
  if (count >= 1)  return { label: 'New Seed',       icon: Leaf,         color: '#60A5FA', stage: 1 };
  return           { label: 'Empty Garden', icon: CircleDashed, color: '#94A3B8', stage: 0 };
};

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function GardenScreen() {
  const insets = useSafeAreaInsets();
  const themeContext = useTheme();
  const MOODS = getMoods(themeContext);

  // Flow steps: 'question_0' | 'question_1' | 'mood' | 'planted'
  const [step, setStep] = useState<'question_0' | 'question_1' | 'mood' | 'planted'>('question_0');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { userData: authData } = useContext(AuthContext);
  const preferredLanguage = (authData?.preferredLanguage as Language) || 'English';
  const t = translations[preferredLanguage] || translations.English;
  
  const [loading, setLoading] = useState(false);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const timeCtx = getTimeContext();

  const fetchLogs = async () => {
    try {
      // Use the unified oracle-context endpoint
      const res = await api.get('/ai/oracle-context');
      setMoodLogs(res.data.recentJournal || []); // Simplified for growth tracking
      // Note: We might want a dedicated endpoint for ALL mood logs if we want a full history
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const growth = getGrowthStage(moodLogs.length);

  // ── Binary question answer ──
  const handleAnswer = (key: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step === 'question_0') setStep('question_1');
    else setStep('mood');
  };

  // ── Plant seed ──
  const handlePlant = async () => {
    if (!selectedMood) return;
    const moodData = MOODS.find(m => m.id === selectedMood)!;
    setLoading(true);
    try {
      const note = `Slept well: ${answers.sleptWell ? 'Yes' : 'No'}. Overwhelmed: ${answers.overwhelmed ? 'Yes' : 'No'}. Feeling ${moodData.label.toLowerCase()}.`;
      await api.post('/mood', {
        score: moodData.score,
        emotions: [moodData.label],
        note,
      });
      setStep('planted');
      fetchLogs();

      // Show notification modal only on first seed ever
      const hasAsked = await AsyncStorage.getItem('notif_asked');
      if (!hasAsked) setShowNotifModal(true);

      // Auto-reset after 5s
      setTimeout(() => { setStep('question_0'); setSelectedMood(null); setAnswers({}); }, 5000);
    } catch (e) {
      Alert.alert('Connection Issue', 'We couldn\'t plant your seed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Notification permission ──
  const handleAllowNotifications = async () => {
    setShowNotifModal(false);
    await AsyncStorage.setItem('notif_asked', 'true');
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      // Schedule morning, afternoon, evening reminders
      const times = [{ hour: 8, min: 0 }, { hour: 13, min: 0 }, { hour: 20, min: 0 }];
      for (const t of times) {
        await Notifications.scheduleNotificationAsync({
          content: { title: '🌱 Time to plant your seed', body: 'How are you feeling right now?', sound: true },
          trigger: { 
            type: SchedulableTriggerInputTypes.CALENDAR,
            hour: t.hour, 
            minute: t.min, 
            repeats: true 
          },
        });
      }
    }
  };

  const handleLaterNotifications = async () => {
    setShowNotifModal(false);
    await AsyncStorage.setItem('notif_asked', 'true');
  };

  // ── Growth visual ──
  const GrowthVisual = () => (
    <Animated.View entering={FadeIn.duration(800)} style={{ paddingHorizontal: 24, marginBottom: 28 }}>
      <LuxuryCard variant="glass" padding="none">
        <View style={gStyles.growthContent}>
          <View style={[gStyles.growthIconWrap, { backgroundColor: growth.color + '20' }]}>
            <growth.icon color={growth.color} size={44} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[gStyles.growthLabel, { color: themeContext.colors.text.primary }]}>{growth.label}</Text>
            <Text style={[gStyles.growthDesc, { color: themeContext.colors.text.secondary }]}>
              {moodLogs.length} seeds planted.{' '}
              {moodLogs.length < 20 ? `${20 - moodLogs.length} until Ancient Tree!` : 'Your garden is legendary.'}
            </Text>
          </View>
        </View>
        <View style={[gStyles.progressBg, { backgroundColor: themeContext.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <View style={[gStyles.progressFill, { width: `${Math.min((moodLogs.length / 20) * 100, 100)}%`, backgroundColor: growth.color }]} />
        </View>
      </LuxuryCard>
    </Animated.View>
  );

  // ── Binary question screen ──
  const renderQuestion = (qIndex: 0 | 1) => {
    const q = CHECK_IN_QUESTIONS[qIndex];
    return (
      <Animated.View key={step} entering={FadeInRight.duration(350)} style={gStyles.questionWrap}>
        {/* Dot pagination */}
        <View style={gStyles.dotRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[gStyles.dot, { backgroundColor: i <= qIndex ? themeContext.colors.plum : (themeContext.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)') }]} />
          ))}
        </View>

        <View style={gStyles.questionCircle}>
          <Text style={{ fontSize: 52 }}>{q.emoji}</Text>
        </View>
        <Text style={[gStyles.questionText, { color: themeContext.colors.text.primary }]}>{q.question}</Text>

        <View style={gStyles.binaryRow}>
          <TouchableOpacity
            style={[gStyles.binaryBtn, { backgroundColor: themeContext.colors.surface, borderColor: themeContext.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}
            onPress={() => handleAnswer(q.key, false)}
          >
            <Text style={[gStyles.binaryBtnText, { color: themeContext.colors.text.primary }]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[gStyles.binaryBtn, { backgroundColor: themeContext.colors.plum }]}
            onPress={() => handleAnswer(q.key, true)}
          >
            <Text style={[gStyles.binaryBtnText, { color: '#FFF' }]}>Yes</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // ── Mood selector screen ──
  const renderMoodSelector = () => (
    <Animated.View key="mood" entering={FadeInRight.duration(350)} style={gStyles.moodWrap}>
      {/* Dot pagination — step 3 active */}
      <View style={gStyles.dotRow}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[gStyles.dot, { backgroundColor: themeContext.colors.plum }]} />
        ))}
      </View>

      <Text style={[gStyles.thankYou, { color: themeContext.colors.text.primary }]}>
        Thank you for sharing! 🙏
      </Text>
      <Text style={[gStyles.moodQuestion, { color: themeContext.colors.text.secondary }]}>
        {timeCtx.prompt}
        {'\n'}How are you feeling right now?
      </Text>

      <View style={gStyles.moodGrid}>
        {MOODS.map((mood, i) => (
          <MoodCircle
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onPress={() => setSelectedMood(mood.id)}
            delay={i * 50}
          />
        ))}
      </View>
    </Animated.View>
  );

  // ── Success state ──
  const renderSuccess = () => (
    <Animated.View entering={FadeIn.duration(700)} style={gStyles.successWrap}>
      <LinearGradient colors={[themeContext.colors.accents.eucalyptus + '20', 'transparent']} style={gStyles.successGlow} />
      <Animated.Text entering={FadeInUp.delay(200).duration(500)} style={{ fontSize: 72 }}>🌱</Animated.Text>
      <Animated.Text entering={FadeInUp.delay(400).duration(500)} style={[gStyles.successTitle, { color: themeContext.colors.text.primary }]}>
        Seed Planted!
      </Animated.Text>
      <Animated.Text entering={FadeInUp.delay(600).duration(500)} style={[gStyles.successSubtitle, { color: themeContext.colors.text.secondary }]}>
        Your garden is growing beautifully.{'\n'}Take a deep breath — you're doing great.
      </Animated.Text>
    </Animated.View>
  );

  return (
    <View style={[gStyles.container, { backgroundColor: themeContext.colors.backgroundSecondary }]}>
      <StatusBar barStyle={themeContext.isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={themeContext.isDark
          ? ['rgba(123, 97, 255, 0.15)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
          : ['rgba(123, 97, 255, 0.12)', themeContext.colors.background, themeContext.colors.backgroundSecondary]}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={[gStyles.scroll, { paddingTop: insets.top + 20 }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title={t.garden.title}
          subtitle={t.garden.subtitle}
          rightAction={
            <TouchableOpacity style={gStyles.historyBtn} onPress={() => Alert.alert('Coming Soon', 'Garden history arrives in the next update!')}>
              <Clock color={themeContext.colors.plum} size={24} />
            </TouchableOpacity>
          }
        />

        {step !== 'planted' && <GrowthVisual />}

        {step === 'question_0' && renderQuestion(0)}
        {step === 'question_1' && renderQuestion(1)}
        {step === 'mood' && renderMoodSelector()}
        {step === 'planted' && renderSuccess()}
      </ScrollView>

      {/* Plant Seed CTA */}
      {step === 'mood' && (
        <Animated.View entering={FadeInUp.delay(600).duration(600)} style={[gStyles.footer, { paddingBottom: insets.bottom + 20, backgroundColor: themeContext.colors.surface }]}>
          <TouchableOpacity
            style={[gStyles.plantBtn, { backgroundColor: themeContext.colors.plum }, (!selectedMood || loading) && gStyles.plantBtnDisabled]}
            disabled={!selectedMood || loading}
            onPress={handlePlant}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={gStyles.plantBtnText}>Plant My Seed 🌱</Text>
            }
          </TouchableOpacity>
        </Animated.View>
      )}

      <NotificationModal
        visible={showNotifModal}
        onAllow={handleAllowNotifications}
        onLater={handleLaterNotifications}
        theme={themeContext}
      />
    </View>
  );
}

const gStyles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 0, paddingBottom: 140 },
  historyBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },

  // Growth card
  growthContent: { flexDirection: 'row', alignItems: 'center', padding: 22 },
  growthIconWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  growthLabel: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 },
  growthDesc: { fontSize: 13, lineHeight: 19 },
  progressBg: { width: '100%', height: 7, borderRadius: 0, overflow: 'hidden' },
  progressFill: { height: '100%' },

  // Questions
  questionWrap: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 8 },
  dotRow: { flexDirection: 'row', gap: 8, marginBottom: 36 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  questionCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(123,97,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  questionText: { fontSize: 22, fontWeight: '700', textAlign: 'center', lineHeight: 32, marginBottom: 40, letterSpacing: -0.4 },
  binaryRow: { flexDirection: 'row', gap: 16, width: '100%' },
  binaryBtn: { flex: 1, height: 58, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  binaryBtnText: { fontSize: 18, fontWeight: '800' },

  // Mood
  moodWrap: { paddingHorizontal: 24, paddingTop: 4 },
  thankYou: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 },
  moodQuestion: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },

  // Success
  successWrap: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32 },
  successGlow: { position: 'absolute', width: 280, height: 280, borderRadius: 140, top: 0 },
  successTitle: { fontSize: 30, fontWeight: '800', marginTop: 20, marginBottom: 12, letterSpacing: -0.5 },
  successSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 26 },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)' },
  plantBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6 },
  plantBtnDisabled: { opacity: 0.4, shadowOpacity: 0 },
  plantBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },
});
