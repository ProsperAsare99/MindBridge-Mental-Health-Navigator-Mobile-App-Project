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
import { Leaf, Sun, CloudRain, Wind, CloudLightning, Flower2, Clock, CircleDashed, Bell, X, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { LuxuryCard } from '../../src/components/LuxuryCard';
import { translations, Language, TranslationSchema } from '../../src/utils/translations';
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
  const router = useRouter();
  const themeContext = useTheme();
  const gStyles = createStyles(themeContext);
  const MOODS = getMoods(themeContext);

  const [step, setStep] = useState<'question_0' | 'question_1' | 'mood' | 'planted'>('question_0');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { userData: authData } = useContext(AuthContext);
  const preferredLanguage = (authData?.preferredLanguage as Language) || 'English';
  const t: TranslationSchema = translations[preferredLanguage] || translations.English;
  
  const [loading, setLoading] = useState(false);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const timeCtx = getTimeContext();

  const fetchLogs = async () => {
    try {
      const res = await api.get('/ai/oracle-context');
      setMoodLogs(res.data.recentJournal || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const growth = getGrowthStage(moodLogs.length);

  const handleAnswer = (key: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step === 'question_0') setStep('question_1');
    else setStep('mood');
  };

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

      const hasAsked = await AsyncStorage.getItem('notif_asked');
      if (!hasAsked) setShowNotifModal(true);

      setTimeout(() => { 
        setStep('question_0'); 
        setSelectedMood(null); 
        setAnswers({}); 
      }, 6000);
    } catch (e) {
      Alert.alert('Connection Issue', 'We couldn\'t plant your seed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAllowNotifications = async () => {
    setShowNotifModal(false);
    await AsyncStorage.setItem('notif_asked', 'true');
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
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

  const GrowthHeader = () => (
    <Animated.View entering={FadeIn.duration(1000)} style={gStyles.growthHeader}>
      <BlurView intensity={themeContext.isDark ? 20 : 40} tint={themeContext.isDark ? 'dark' : 'light'} style={gStyles.growthGlass}>
        <View style={[gStyles.growthIconWrap, { backgroundColor: growth.color + '20' }]}>
          <growth.icon color={growth.color} size={32} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={gStyles.growthLabel}>{growth.label}</Text>
          <View style={gStyles.progressBg}>
            <View style={[gStyles.progressFill, { width: `${Math.min((moodLogs.length / 20) * 100, 100)}%`, backgroundColor: growth.color }]} />
          </View>
        </View>
        <View style={gStyles.seedCount}>
          <Text style={gStyles.seedCountText}>{moodLogs.length}</Text>
          <Leaf color={themeContext.colors.text.tertiary} size={12} />
        </View>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={[gStyles.container, { backgroundColor: themeContext.colors.background }]}>
      <StatusBar barStyle={themeContext.isDark ? 'light-content' : 'dark-content'} />
      
      {/* Background Organic Elements */}
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={themeContext.isDark
            ? ['#1A1A1A', '#0D0D0D']
            : ['#FDFCFB', '#E2D1C3']}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View entering={FadeIn.delay(300)} style={[gStyles.blob, { top: -100, right: -100, backgroundColor: themeContext.colors.plum + '10' }]} />
        <Animated.View entering={FadeIn.delay(600)} style={[gStyles.blob, { bottom: -150, left: -150, backgroundColor: themeContext.colors.accents.softMint + '15' }]} />
      </View>

      <ScrollView contentContainerStyle={[gStyles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title={t.garden.title}
          subtitle={t.garden.subtitle}
        />

        <GrowthHeader />

        <View style={gStyles.mainCardWrap}>
          <BlurView intensity={themeContext.isDark ? 40 : 80} tint={themeContext.isDark ? 'dark' : 'light'} style={gStyles.mainGlassCard}>
            {step === 'question_0' && renderQuestion(0)}
            {step === 'question_1' && renderQuestion(1)}
            {step === 'mood' && renderMoodSelector()}
            {step === 'planted' && renderSuccess()}
          </BlurView>
        </View>

        {step === 'mood' && (
          <Animated.View entering={FadeInUp.delay(600)} style={gStyles.actionFooter}>
            <TouchableOpacity
              style={[gStyles.plantBtn, { backgroundColor: themeContext.colors.plum }, (!selectedMood || loading) && { opacity: 0.5 }]}
              disabled={!selectedMood || loading}
              onPress={handlePlant}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={gStyles.plantBtnText}>Nurture My Peace 🌱</Text>}
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <NotificationModal
        visible={showNotifModal}
        onAllow={handleAllowNotifications}
        onLater={handleLaterNotifications}
        theme={themeContext}
      />
    </View>
  );

  function renderQuestion(qIndex: 0 | 1) {
    const q = CHECK_IN_QUESTIONS[qIndex];
    return (
      <Animated.View key={`q-${qIndex}`} entering={FadeInRight.springify()} style={gStyles.stepContent}>
        <View style={gStyles.pagination}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[gStyles.paginationDot, i <= qIndex && { backgroundColor: themeContext.colors.plum, width: 24 }]} />
          ))}
        </View>
        <Text style={gStyles.stepEmoji}>{q.emoji}</Text>
        <Text style={gStyles.stepTitle}>{q.question}</Text>
        <View style={gStyles.choiceRow}>
          <TouchableOpacity style={gStyles.choiceBtn} onPress={() => handleAnswer(q.key, false)}>
            <Text style={gStyles.choiceBtnText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[gStyles.choiceBtn, { backgroundColor: themeContext.colors.plum }]} onPress={() => handleAnswer(q.key, true)}>
            <Text style={[gStyles.choiceBtnText, { color: '#FFF' }]}>Yes</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  function renderMoodSelector() {
    return (
      <Animated.View key="mood-step" entering={FadeInRight.springify()} style={gStyles.stepContent}>
        <View style={gStyles.pagination}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[gStyles.paginationDot, { backgroundColor: themeContext.colors.plum, width: 24 }]} />
          ))}
        </View>
        <Text style={gStyles.moodPromptTitle}>{timeCtx.prompt}</Text>
        <Text style={gStyles.moodPromptSubtitle}>{t.garden.seedQuestion}</Text>
        
        {['tired', 'anxious', 'sad', 'stressed'].includes(selectedMood || '') && (
          <Animated.View entering={FadeInUp} style={gStyles.nudgeBox}>
            <Sparkles color={themeContext.colors.plum} size={16} />
            <Text style={gStyles.nudgeText}>{t.garden.supportNudge}</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/tools')}>
              <Text style={gStyles.nudgeLink}>Try Breathing</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={gStyles.moodGrid}>
          {MOODS.map((mood, i) => (
            <MoodCircle
              key={mood.id}
              mood={mood}
              isSelected={selectedMood === mood.id}
              onPress={() => setSelectedMood(mood.id)}
              delay={i * 40}
            />
          ))}
        </View>
      </Animated.View>
    );
  }

  function renderSuccess() {
    return (
      <Animated.View entering={FadeIn.duration(800)} style={gStyles.successContent}>
        <Sparkles color={themeContext.colors.accents.eucalyptus} size={48} style={{ marginBottom: 20 }} />
        <Text style={gStyles.successTitle}>{t.garden.successTitle}</Text>
        <Text style={gStyles.successSubtitle}>{t.garden.successSubtitle}</Text>
      </Animated.View>
    );
  }
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100 },
  blob: { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.4 },
  
  // Growth Header
  growthHeader: { paddingHorizontal: 24, marginBottom: 24 },
  growthGlass: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)' },
  growthIconWrap: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  growthLabel: { fontSize: 17, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, marginBottom: 6 },
  progressBg: { height: 6, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  seedCount: { paddingLeft: 16, alignItems: 'center' },
  seedCountText: { fontSize: 18, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },

  // Main Card
  mainCardWrap: { paddingHorizontal: 24 },
  mainGlassCard: { borderRadius: 32, overflow: 'hidden', padding: 32, minHeight: 460, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 },
  
  // Steps
  stepContent: { alignItems: 'center', width: '100%' },
  pagination: { flexDirection: 'row', gap: 6, marginBottom: 40 },
  paginationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
  stepEmoji: { fontSize: 64, marginBottom: 24 },
  stepTitle: { fontSize: 24, fontFamily: theme.typography.fonts.header, textAlign: 'center', color: theme.colors.text.primary, lineHeight: 32, marginBottom: 48 },
  choiceRow: { flexDirection: 'row', gap: 16, width: '100%' },
  choiceBtn: { flex: 1, height: 64, borderRadius: 22, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
  choiceBtnText: { fontSize: 18, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },

  // Mood step
  moodPromptTitle: { fontSize: 22, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, textAlign: 'center', marginBottom: 8 },
  moodPromptSubtitle: { fontSize: 15, fontFamily: theme.typography.fonts.content, color: theme.colors.text.secondary, textAlign: 'center', marginBottom: 24 },
  nudgeBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.colors.plum + '10', padding: 12, borderRadius: 16, marginBottom: 20, width: '100%' },
  nudgeText: { flex: 1, fontSize: 13, color: theme.colors.text.primary, fontFamily: theme.typography.fonts.body },
  nudgeLink: { fontSize: 13, fontFamily: theme.typography.fonts.header, color: theme.colors.plum, textDecorationLine: 'underline' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', width: '100%' },

  // Success
  successContent: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  successTitle: { fontSize: 28, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, textAlign: 'center', marginBottom: 16 },
  successSubtitle: { fontSize: 16, fontFamily: theme.typography.fonts.content, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 24 },

  // Footer
  actionFooter: { paddingHorizontal: 24, marginTop: 24 },
  plantBtn: { height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  plantBtnText: { color: '#FFF', fontSize: 18, fontFamily: theme.typography.fonts.header },
});

