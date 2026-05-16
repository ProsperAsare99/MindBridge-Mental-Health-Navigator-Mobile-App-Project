import React, { useState, useEffect, useContext } from 'react';
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import {
  Leaf,
  Sun,
  Flower2,
  CircleDashed,
  Bell,
  ChevronRight,
  Sparkles,
  CloudRain,
  Wind
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { AuthContext } from '../../src/context/AuthContext';

const { width } = Dimensions.get('window');
const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

// ─── Constants ──────────────────────────────────────────────────────────────

const getTimeContext = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: 'Morning', prompt: 'Start with intention' };
  if (hour >= 12 && hour < 17) return { greeting: 'Afternoon', prompt: 'Check in with yourself' };
  if (hour >= 17 && hour < 21) return { greeting: 'Evening', prompt: 'Wind down and reflect' };
  return { greeting: 'Night', prompt: 'How was your day?' };
};

const getMoods = (theme: any) => [
  { id: 'elated', label: 'Elated', emoji: '😄', color: '#F59E0B', score: 10 },
  { id: 'joyful', label: 'Joyful', emoji: '😊', color: theme.colors.accents.gentlePeach, score: 9 },
  { id: 'calm', label: 'Calm', emoji: '😌', color: theme.colors.accents.eucalyptus, score: 8 },
  { id: 'okay', label: 'Okay', emoji: '🙂', color: '#6EE7B7', score: 7 },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: theme.colors.accents.powderBlue, score: 6 },
  { id: 'tired', label: 'Tired', emoji: '😔', color: theme.colors.accents.softLilac, score: 5 },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: theme.colors.accents.slate, score: 4 },
  { id: 'sad', label: 'Low', emoji: '😢', color: '#60A5FA', score: 3 },
  { id: 'stressed', label: 'Tense', emoji: '😩', color: '#F87171', score: 2 },
];

const CHECK_IN_QUESTIONS = [
  { id: 'sleep', question: 'Did you sleep well?', emoji: '🌙', key: 'sleptWell' },
  { id: 'stress', question: 'Feeling overwhelmed?', emoji: '📚', key: 'overwhelmed' },
];

// ─── Sub-Components ─────────────────────────────────────────────────────────

const MoodCircle = ({ mood, isSelected, onPress, delay, theme }: any) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(400)} style={[styles.moodCircleWrap, animStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.9, springConfig); }}
        onPressOut={() => { scale.value = withSpring(isSelected ? 1.05 : 1, springConfig); }}
        style={({ pressed }) => [
          styles.moodCircle,
          {
            backgroundColor: isSelected ? mood.color : (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'),
            borderColor: isSelected ? mood.color : (theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
            borderWidth: 1,
          },
          isSelected && styles.moodCircleSelected
        ]}
      >
        <Text style={{ fontSize: 32 }}>{mood.emoji}</Text>
      </Pressable>
      <Text
        style={[styles.moodLabel, { fontFamily: theme.typography.fonts.body }, isSelected && { color: theme.colors.text.primary, fontWeight: '700' }]}
        numberOfLines={1}
      >
        {mood.label}
      </Text>
    </Animated.View>
  );
};

const getGrowthStage = (count: number) => {
  if (count >= 20) return { label: 'Ancient Tree', icon: Flower2, color: '#8B5CF6', atmosphere: ['#2E1065', '#4C1D95'] as any, sparkles: true };
  if (count >= 14) return { label: 'Full Bloom', icon: Flower2, color: '#7B61FF', atmosphere: ['#4C1D95', '#5B21B6'] as any, sparkles: true };
  if (count >= 8) return { label: 'Healthy Plant', icon: Leaf, color: '#34D399', atmosphere: ['#064E3B', '#065F46'] as any, sparkles: false };
  if (count >= 4) return { label: 'Sprouting', icon: Sun, color: '#FBBF24', atmosphere: ['#78350F', '#92400E'] as any, sparkles: false };
  if (count >= 1) return { label: 'New Seed', icon: Leaf, color: '#60A5FA', atmosphere: ['#1E3A8A', '#1E40AF'] as any, sparkles: false };
  return { label: 'Empty Garden', icon: CircleDashed, color: '#94A3B8', atmosphere: ['#1F2937', '#111827'] as any, sparkles: false };
};

const PeaceParticle = ({ delay, theme }: any) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-100, { duration: 4000 + Math.random() * 2000 }),
        withTiming(0, { duration: 0 })
      ),
      -1
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000 }),
        withTiming(0.6, { duration: 2000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0.5, { duration: 2000 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
    position: 'absolute',
    left: `${Math.random() * 100}%`,
    top: '80%',
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Sparkles color="#FFF" size={8} opacity={0.4} />
    </Animated.View>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────

// ─── Notification modal ──────────────────────────────────────────────────────

const NotificationModal = ({ visible, onAllow, onLater, theme }: any) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
      <Animated.View entering={FadeInUp.duration(400)} style={{
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 36, borderTopRightRadius: 36,
        padding: 32, paddingBottom: 48,
        alignItems: 'center',
      }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.plum + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Bell color={theme.colors.plum} size={40} />
        </View>
        <Text style={{ fontSize: 24, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, marginBottom: 12, textAlign: 'center' }}>
          Cultivate Your Peace 🌱
        </Text>
        <Text style={{ fontSize: 15, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 22, marginBottom: 32, paddingHorizontal: 20 }}>
          Allow Gentle reminders to help you plant your Mood seeds and Track your Wellness Journey.
        </Text>
        <TouchableOpacity
          onPress={onAllow}
          style={{ backgroundColor: theme.colors.plum, width: '100%', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
        >
          <Text style={{ color: '#FFF', fontSize: 17, fontFamily: theme.typography.fonts.header }}>Enable Reminders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLater}>
          <Text style={{ color: theme.colors.text.tertiary, fontSize: 16, fontFamily: theme.typography.fonts.header }}>Maybe later</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  </Modal>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function GardenScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { t } = theme;
  const { userData: authData } = useContext(AuthContext) as any;

  const [step, setStep] = useState<'question_0' | 'question_1' | 'mood' | 'planted'>('question_0');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const timeCtx = getTimeContext();
  const MOODS = getMoods(theme);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/ai/oracle-context');
      setMoodLogs(res.data.recentJournal || []);
      setTotalCount(res.data.moodCount || 0);
    } catch (e) { }
  };

  useEffect(() => { fetchLogs(); }, []);
  const growth = getGrowthStage(totalCount);

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
      const note = `Slept: ${answers.sleptWell ? 'Yes' : 'No'}, Stress: ${answers.overwhelmed ? 'Yes' : 'No'}. Mood: ${moodData.label}.`;
      await api.post('/mood', { score: moodData.score, emotions: [moodData.label], note });
      setStep('planted');
      fetchLogs();

      const hasAsked = await AsyncStorage.getItem('notif_asked');
      if (!hasAsked) setShowNotifModal(true);

      setTimeout(() => {
        setStep('question_0');
        setSelectedMood(null);
        setAnswers({});
      }, 5000);
    } catch (e) {
      Alert.alert('Error', 'Could not plant seed.');
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
          content: { title: '🌱 Time to Plant your seed', body: 'How are you feeling right now?', sound: true },
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

  const GrowthHeader = () => {
    const scale = useSharedValue(1);
    
    useEffect(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1,
        true
      );
    }, []);

    const animStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }));

    return (
      <Animated.View entering={FadeIn.duration(800)} style={styles.growthContainer}>
        <LinearGradient
          colors={theme.isDark ? growth.atmosphere : ['#FFF', '#F8FAFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.growthCard}
        >
          {growth.sparkles && theme.isDark && Array.from({ length: 15 }).map((_, i) => (
            <PeaceParticle key={i} theme={theme} />
          ))}
          
          <Animated.View style={[styles.growthIconWrap, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : growth.color + '20' }, animStyle]}>
            <growth.icon color={theme.isDark ? '#FFF' : growth.color} size={32} />
          </Animated.View>
          
          <View style={{ flex: 1 }}>
            <Text style={[styles.growthLabel, { 
              fontFamily: theme.typography.fonts.header, 
              color: theme.isDark ? '#FFF' : theme.colors.text.primary 
            }]}>
              {growth.label}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <View style={[styles.progressFill, { width: `${Math.min((totalCount / 20) * 100, 100)}%`, backgroundColor: theme.isDark ? '#FFF' : growth.color }]} />
            </View>
          </View>
          
          <View style={styles.growthCount}>
            <Text style={[styles.growthCountText, { 
              fontFamily: theme.typography.fonts.header, 
              color: theme.isDark ? '#FFF' : theme.colors.text.primary 
            }]}>
              {totalCount}
            </Text>
            <Leaf size={14} color={theme.isDark ? '#FFF' : theme.colors.plum} fill={theme.isDark ? 'rgba(255,255,255,0.2)' : theme.colors.plum + '20'} />
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={theme.isDark ? ['#121212', '#1A1A1A', '#0D0D0D'] : ['#FDFCFB', '#F4F7F9', '#E6E9EF']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.bgBlob, { top: -100, right: -100, backgroundColor: theme.colors.plum + '05' }]} />
        <View style={[styles.bgBlob, { bottom: -150, left: -100, backgroundColor: theme.colors.accents.powderBlue + '04' }]} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader title={t('garden.title')} subtitle={t('garden.subtitle')} />

        <GrowthHeader />

        <View style={styles.cardContainer}>
          <BlurView intensity={theme.isDark ? 30 : 80} tint={theme.isDark ? 'dark' : 'light'} style={styles.glassCard}>
            {step === 'question_0' || step === 'question_1' ? (
              <StepQuestion
                q={CHECK_IN_QUESTIONS[step === 'question_0' ? 0 : 1]}
                onAnswer={handleAnswer}
                stepIndex={step === 'question_0' ? 0 : 1}
                theme={theme}
              />
            ) : step === 'mood' ? (
              <StepMood
                timeCtx={timeCtx}
                moods={MOODS}
                selected={selectedMood}
                setSelected={setSelectedMood}
                theme={theme}
                t={t}
                router={router}
              />
            ) : (
              <StepSuccess theme={theme} t={t} />
            )}
          </BlurView>
        </View>

        {step === 'mood' && (
          <Animated.View entering={FadeInUp.delay(500)} style={styles.footer}>
            <TouchableOpacity
              style={[styles.plantBtn, { backgroundColor: theme.colors.plum }, !selectedMood && { opacity: 0.5 }]}
              disabled={!selectedMood || loading}
              onPress={handlePlant}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={[styles.plantBtnText, { fontFamily: theme.typography.fonts.header }]}>Nurture My Peace 🌱</Text>}
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <NotificationModal
        visible={showNotifModal}
        onAllow={handleAllowNotifications}
        onLater={handleLaterNotifications}
        theme={theme}
      />
    </View>
  );
}

// ─── Step Components ────────────────────────────────────────────────────────

const StepQuestion = ({ q, onAnswer, stepIndex, theme }: any) => (
  <Animated.View key={q.id} entering={FadeInRight.springify()} style={styles.stepContainer}>
    <View style={styles.pagination}>
      {[0, 1, 2].map(i => (
        <View key={i} style={[styles.dot, i <= stepIndex && { backgroundColor: theme.colors.plum, width: 24 }]} />
      ))}
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>{q.emoji}</Text>
      <Text style={styles.stepTitle}>{q.question}</Text>
    </View>
    <View style={styles.choiceRow}>
      <TouchableOpacity style={styles.choiceBtn} onPress={() => onAnswer(q.key, false)}>
        <Text style={[styles.choiceText, { color: theme.colors.text.primary }]}>No</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.choiceBtn, { backgroundColor: theme.colors.plum }]} onPress={() => onAnswer(q.key, true)}>
        <Text style={[styles.choiceText, { color: '#FFF' }]}>Yes</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

const StepMood = ({ timeCtx, moods, selected, setSelected, theme, t, router }: any) => (
  <Animated.View key="mood" entering={FadeInRight.springify()} style={styles.stepContainer}>
    <View style={styles.pagination}>
      {[0, 1, 2].map(i => (
        <View key={i} style={[styles.dot, { backgroundColor: theme.colors.plum, width: 24 }]} />
      ))}
    </View>
    <View style={styles.moodHeader}>
      <Text style={styles.moodPromptTitle}>{timeCtx.prompt}</Text>
      <Text style={styles.moodPromptSubtitle}>{t('garden.seedQuestion')}</Text>
    </View>

    {['tired', 'anxious', 'sad', 'stressed'].includes(selected || '') && (
      <Animated.View entering={FadeInUp} style={styles.nudge}>
        <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: theme.colors.plum }} />
        <Text style={styles.nudgeText}>{t('garden.supportNudge')}</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/tools')}>
          <Text style={styles.nudgeLink}>Try Breathing</Text>
        </TouchableOpacity>
      </Animated.View>
    )}

    <View style={styles.wheelContainer}>
      <View style={styles.wheelCenter}>
        {selected ? (
          <Animated.View entering={FadeIn} style={[styles.selectedMoodCircle, { backgroundColor: moods.find((m: any) => m.id === selected)?.color + '20' }]}>
            <Text style={{ fontSize: 56 }}>{moods.find((m: any) => m.id === selected)?.emoji}</Text>
            <Text style={[styles.selectedMoodLabel, { color: theme.colors.text.primary }]}>{moods.find((m: any) => m.id === selected)?.label}</Text>
          </Animated.View>
        ) : (
          <View style={styles.wheelPlaceholder}>
            <Text style={[styles.placeholderEmoji, { color: theme.colors.text.tertiary }]}>✨</Text>
          </View>
        )}
      </View>

      {moods.map((m: any, i: number) => {
        const angle = (i * (360 / moods.length)) * (Math.PI / 180);
        const radius = 120;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        return (
          <TouchableOpacity
            key={m.id}
            onPress={() => setSelected(m.id)}
            style={[
              styles.wheelItem,
              { 
                transform: [{ translateX: x }, { translateY: y }],
                backgroundColor: selected === m.id ? m.color : (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)'),
                borderColor: selected === m.id ? m.color : (theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
              }
            ]}
          >
            <Text style={{ fontSize: 26 }}>{m.emoji}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </Animated.View>
);

const StepSuccess = ({ theme, t }: any) => (
  <Animated.View entering={FadeIn.duration(800)} style={styles.successContainer}>
    <View style={styles.successIconWrap}>
      <Flower2 color={theme.colors.accents.eucalyptus} size={48} />
    </View>
    <Text style={styles.successTitle}>{t('garden.successTitle')}</Text>
    <Text style={styles.successSubtitle}>{t('garden.successSubtitle')}</Text>
  </Animated.View>
);

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 120 },
  bgBlob: { position: 'absolute', width: 500, height: 500, borderRadius: 250 },
  growthContainer: { paddingHorizontal: 24, marginBottom: 24 },
  growthCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  growthIconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  growthLabel: { fontSize: 16, fontWeight: '700', color: '#888', marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  growthCount: { paddingLeft: 16, alignItems: 'center', gap: 4 },
  growthCountText: { fontSize: 18, fontWeight: '800' },
  cardContainer: { paddingHorizontal: 24 },
  glassCard: { borderRadius: 36, overflow: 'hidden', padding: 28, minHeight: 480, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  stepContainer: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  pagination: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.05)' },
  stepContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stepEmoji: { fontSize: 64, marginBottom: 20 },
  stepTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 30, paddingHorizontal: 10 },
  choiceRow: { flexDirection: 'row', gap: 16, width: '100%', marginTop: 20 },
  choiceBtn: { flex: 1, height: 60, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  choiceText: { fontSize: 17, fontWeight: '700' },
  moodHeader: { alignItems: 'center', marginBottom: 24 },
  moodPromptTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  moodPromptSubtitle: { fontSize: 14, color: '#666', textAlign: 'center' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  moodCircleWrap: { width: (width - 48 - 56 - 40) / 3, alignItems: 'center', marginBottom: 16 },
  moodCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  moodCircleSelected: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  moodLabel: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 4 },
  wheelContainer: { width: 300, height: 300, alignItems: 'center', justifyContent: 'center', marginVertical: 32 },
  wheelCenter: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  wheelItem: { position: 'absolute', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  selectedMoodCircle: { alignItems: 'center', justifyContent: 'center', width: 140, height: 140, borderRadius: 70 },
  selectedMoodLabel: { fontSize: 16, fontWeight: '800', marginTop: 8 },
  wheelPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderEmoji: { fontSize: 40, opacity: 0.5 },
  nudge: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(123, 97, 255, 0.1)', padding: 12, borderRadius: 16, marginBottom: 20 },
  nudgeText: { flex: 1, fontSize: 12, fontWeight: '500' },
  nudgeLink: { fontSize: 12, fontWeight: '700', color: '#7B61FF', textDecorationLine: 'underline' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(52, 211, 153, 0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 26, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  successSubtitle: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  footer: { paddingHorizontal: 24, marginTop: 24 },
  plantBtn: { height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#7B61FF', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  plantBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
