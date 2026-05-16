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
  TextInput,
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
  withTiming,
} from 'react-native-reanimated';
import {
  Leaf,
  Sun,
  Flower2,
  CircleDashed,
  Sparkles,
  Mic,
  StopCircle,
  Play,
  MapPin,
  Cloud
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import { AuthContext } from '../../src/context/AuthContext';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { 
  EnergySelector, 
  SleepTracker, 
  SocialPicker, 
  SymptomCloud 
} from '../../src/components/TrackingComponents';

const { width } = Dimensions.get('window');
const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

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

export default function AdvancedGardenScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = theme;
  const router = useRouter();
  
  // ─── State ─────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0); // 0: Questions, 1: Mood, 2: Vitals, 3: Context, 4: Success
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Tracking Data
  const [answers, setAnswers] = useState({ sleptWell: true, overwhelmed: false });
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState(6);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [social, setSocial] = useState('alone');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  
  // Environmental
  const [location, setLocation] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  
  // Audio
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await api.get('/ai/oracle-context');
        setTotalCount(res.data.moodCount || 0);
        
        // Auto-fetch location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          // Simplified: In a real app, reverse geocode or use weather API
          setLocation('University Campus');
          setWeather('Sunny');
        }
      } catch (e) {}
    };
    fetchContext();
  }, []);

  const growth = getGrowthStage(totalCount);

  // ─── Actions ───────────────────────────────────────────────────────────────
  const handlePlant = async () => {
    setLoading(true);
    try {
      const moods = [
        { id: 'elated', score: 10 }, { id: 'joyful', score: 9 }, { id: 'calm', score: 8 },
        { id: 'okay', score: 7 }, { id: 'neutral', score: 6 }, { id: 'tired', score: 5 },
        { id: 'anxious', score: 4 }, { id: 'sad', score: 3 }, { id: 'stressed', score: 2 }
      ];
      const moodScore = moods.find(m => m.id === selectedMood)?.score || 6;

      await api.post('/mood', {
        score: moodScore,
        emotions: [selectedMood],
        energyLevel: energy,
        sleepHours,
        sleepQuality,
        socialSetting: social,
        physicalSymptoms: symptoms,
        weather,
        location,
        note,
        audioUrl: audioUri, 
      });
      
      setStep(4);
      setTotalCount(prev => prev + 1);
    } catch (error) {
      Alert.alert('Error', 'Failed to nurture your garden. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      Alert.alert('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri);
  };

  // ─── Render Components ─────────────────────────────────────────────────────
  
  const GrowthHeader = () => {
    const scale = useSharedValue(1);
    useEffect(() => {
      scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 2000 }), withTiming(1, { duration: 2000 })), -1, true);
    }, []);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
      <Animated.View entering={FadeIn.duration(800)} style={styles.growthContainer}>
        <LinearGradient colors={theme.isDark ? growth.atmosphere : ['#FFF', '#F8FAFC']} style={styles.growthCard}>
          {growth.sparkles && theme.isDark && Array.from({ length: 15 }).map((_, i) => <PeaceParticle key={i} theme={theme} />)}
          <Animated.View style={[styles.growthIconWrap, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : growth.color + '20' }, animStyle]}>
            <growth.icon color={theme.isDark ? '#FFF' : growth.color} size={32} />
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.growthLabel, { color: theme.isDark ? '#FFF' : theme.colors.text.primary }]}>{growth.label}</Text>
            <View style={[styles.progressBar, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
              <View style={[styles.progressFill, { width: `${Math.min((totalCount / 20) * 100, 100)}%`, backgroundColor: theme.isDark ? '#FFF' : growth.color }]} />
            </View>
          </View>
          <View style={styles.growthCount}>
            <Text style={[styles.growthCountText, { color: theme.isDark ? '#FFF' : theme.colors.text.primary }]}>{totalCount}</Text>
            <Leaf size={14} color={theme.isDark ? '#FFF' : theme.colors.plum} />
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const MoodWheel = () => {
    const moods = [
      { id: 'elated', emoji: '😄', color: '#F59E0B', label: 'Elated' },
      { id: 'joyful', emoji: '😊', color: '#FBCFE8', label: 'Joyful' },
      { id: 'calm', emoji: '😌', color: '#D1FAE5', label: 'Calm' },
      { id: 'okay', emoji: '🙂', color: '#6EE7B7', label: 'Okay' },
      { id: 'neutral', emoji: '😐', color: '#E5E7EB', label: 'Neutral' },
      { id: 'tired', emoji: '😔', color: '#DDD6FE', label: 'Tired' },
      { id: 'anxious', emoji: '😰', color: '#94A3B8', label: 'Anxious' },
      { id: 'sad', emoji: '😢', color: '#60A5FA', label: 'Sad' },
      { id: 'stressed', emoji: '😩', color: '#F87171', label: 'Stressed' },
    ];

    return (
      <View style={styles.wheelContainer}>
        <View style={styles.wheelCenter}>
          {selectedMood ? (
            <Animated.View entering={FadeIn} style={styles.selectedMoodCircle}>
              <Text style={{ fontSize: 56 }}>{moods.find(m => m.id === selectedMood)?.emoji}</Text>
              <Text style={[styles.selectedMoodLabel, { color: theme.colors.text.primary }]}>{moods.find(m => m.id === selectedMood)?.label}</Text>
            </Animated.View>
          ) : (
            <Text style={{ fontSize: 40, opacity: 0.3 }}>✨</Text>
          )}
        </View>
        {moods.map((m, i) => {
          const angle = (i * (360 / moods.length)) * (Math.PI / 180);
          const x = 120 * Math.cos(angle);
          const y = 120 * Math.sin(angle);
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => setSelectedMood(m.id)}
              style={[styles.wheelItem, { transform: [{ translateX: x }, { translateY: y }], backgroundColor: selectedMood === m.id ? m.color : (theme.isDark ? 'rgba(255,255,255,0.05)' : '#FFF') }]}
            >
              <Text style={{ fontSize: 26 }}>{m.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top }]}>
        <ScreenHeader title={t('garden.title')} subtitle={t('garden.subtitle')} />
        <GrowthHeader />

        <View style={styles.cardContainer}>
          <BlurView intensity={theme.isDark ? 30 : 80} tint={theme.isDark ? 'dark' : 'light'} style={styles.glassCard}>
            
            {/* ── STEP 0: INITIAL QUESTIONS ── */}
            {step === 0 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <View style={styles.pagination}>{[0,1,2,3].map(i => <View key={i} style={[styles.dot, i === 0 && { width: 24, backgroundColor: theme.colors.plum }]} />)}</View>
                <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>Quick Check-in</Text>
                <View style={styles.qBox}>
                  <Text style={[styles.qText, { color: theme.colors.text.secondary }]}>Did you sleep well? 🌙</Text>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity onPress={() => setAnswers({...answers, sleptWell: false})} style={[styles.choiceBtn, !answers.sleptWell && { backgroundColor: '#EF4444' }]}><Text style={styles.choiceTxt}>No</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setAnswers({...answers, sleptWell: true})} style={[styles.choiceBtn, answers.sleptWell && { backgroundColor: theme.colors.plum }]}><Text style={styles.choiceTxt}>Yes</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.qBox}>
                  <Text style={[styles.qText, { color: theme.colors.text.secondary }]}>Feeling overwhelmed? 📚</Text>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity onPress={() => setAnswers({...answers, overwhelmed: false})} style={[styles.choiceBtn, !answers.overwhelmed && { backgroundColor: theme.colors.plum }]}><Text style={styles.choiceTxt}>No</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setAnswers({...answers, overwhelmed: true})} style={[styles.choiceBtn, answers.overwhelmed && { backgroundColor: '#EF4444' }]}><Text style={styles.choiceTxt}>Yes</Text></TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.colors.plum }]} onPress={() => setStep(1)}><Text style={styles.nextBtnText}>Continue</Text></TouchableOpacity>
              </Animated.View>
            )}

            {/* ── STEP 1: MOOD WHEEL ── */}
            {step === 1 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <View style={styles.pagination}>{[0,1,2,3].map(i => <View key={i} style={[styles.dot, i <= 1 && { width: 24, backgroundColor: theme.colors.plum }]} />)}</View>
                <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>Your Emotional State</Text>
                <MoodWheel />
                <TouchableOpacity disabled={!selectedMood} style={[styles.nextBtn, { backgroundColor: theme.colors.plum }, !selectedMood && { opacity: 0.5 }]} onPress={() => setStep(2)}><Text style={styles.nextBtnText}>Next</Text></TouchableOpacity>
              </Animated.View>
            )}

            {/* ── STEP 2: VITALS (ENERGY & SLEEP) ── */}
            {step === 2 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <View style={styles.pagination}>{[0,1,2,3].map(i => <View key={i} style={[styles.dot, i <= 2 && { width: 24, backgroundColor: theme.colors.plum }]} />)}</View>
                <EnergySelector value={energy} onChange={setEnergy} theme={theme} />
                <SleepTracker quality={sleepQuality} hours={sleepHours} onQualityChange={setSleepQuality} onHoursChange={setSleepHours} theme={theme} />
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.colors.plum }]} onPress={() => setStep(3)}><Text style={styles.nextBtnText}>Almost There</Text></TouchableOpacity>
              </Animated.View>
            )}

            {/* ── STEP 3: CONTEXT & JOURNALING ── */}
            {step === 3 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <View style={styles.pagination}>{[0,1,2,3].map(i => <View key={i} style={[styles.dot, i <= 3 && { width: 24, backgroundColor: theme.colors.plum }]} />)}</View>
                <SocialPicker value={social} onChange={setSocial} theme={theme} />
                <SymptomCloud selected={symptoms} onToggle={(id: string) => setSymptoms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} theme={theme} />
                
                {/* Environmental Context */}
                <View style={styles.envRow}>
                  <View style={styles.envTag}><MapPin size={14} color={theme.colors.plum} /><Text style={styles.envText}>{location || 'Locating...'}</Text></View>
                  <View style={styles.envTag}><Cloud size={14} color={theme.colors.plum} /><Text style={styles.envText}>{weather || 'Syncing...'}</Text></View>
                </View>

                {/* Journaling */}
                <View style={styles.journalBox}>
                  <TextInput
                    style={[styles.noteInput, { color: theme.colors.text.primary, borderColor: theme.colors.text.tertiary + '20' }]}
                    placeholder="Add a thought..."
                    placeholderTextColor={theme.colors.text.tertiary}
                    multiline
                    value={note}
                    onChangeText={setNote}
                  />
                  <TouchableOpacity 
                    style={[styles.micBtn, recording && { backgroundColor: '#EF4444' }]} 
                    onPress={recording ? stopRecording : startRecording}
                  >
                    {recording ? <StopCircle color="#FFF" size={24} /> : <Mic color={theme.colors.plum} size={24} />}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.plantBtn, { backgroundColor: theme.colors.plum }]} onPress={handlePlant}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.nextBtnText}>{t('garden.nurtureBtn')}</Text>}
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* ── STEP 4: SUCCESS ── */}
            {step === 4 && (
              <Animated.View entering={FadeIn} style={styles.successContainer}>
                <View style={styles.successIconWrap}><Flower2 color={theme.colors.accents.eucalyptus} size={48} /></View>
                <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>{t('garden.successTitle')}</Text>
                <Text style={[styles.successSubtitle, { color: theme.colors.text.secondary }]}>{t('garden.successSubtitle')}</Text>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.colors.plum, marginTop: 40 }]} onPress={() => router.push('/(tabs)/dashboard')}><Text style={styles.nextBtnText}>Back to Journey</Text></TouchableOpacity>
              </Animated.View>
            )}

          </BlurView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 120 },
  growthContainer: { paddingHorizontal: 24, marginBottom: 24 },
  growthCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  growthIconWrap: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  growthLabel: { fontSize: 16, fontWeight: '700' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden', flex: 1, marginHorizontal: 12 },
  progressFill: { height: '100%', borderRadius: 3 },
  growthCount: { alignItems: 'center', gap: 4 },
  growthCountText: { fontSize: 18, fontWeight: '800' },
  cardContainer: { paddingHorizontal: 24 },
  glassCard: { borderRadius: 36, overflow: 'hidden', padding: 24, minHeight: 520, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  stepContainer: { flex: 1, alignItems: 'center' },
  pagination: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.05)' },
  stepTitle: { fontSize: 24, fontWeight: '800', marginBottom: 24, textAlign: 'center' },
  qBox: { width: '100%', marginBottom: 24 },
  qText: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  choiceRow: { flexDirection: 'row', gap: 12 },
  choiceBtn: { flex: 1, height: 50, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
  choiceTxt: { color: '#FFF', fontWeight: '700' },
  nextBtn: { width: '100%', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 'auto' },
  nextBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  wheelContainer: { width: 300, height: 300, alignItems: 'center', justifyContent: 'center', marginVertical: 32 },
  wheelCenter: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  wheelItem: { position: 'absolute', width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  selectedMoodCircle: { alignItems: 'center', justifyContent: 'center' },
  selectedMoodLabel: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  envRow: { flexDirection: 'row', gap: 10, marginVertical: 16, alignSelf: 'flex-start' },
  envTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.03)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  envText: { fontSize: 12, fontWeight: '600', color: '#666' },
  journalBox: { width: '100%', flexDirection: 'row', gap: 12, alignItems: 'flex-end', marginBottom: 24 },
  noteInput: { flex: 1, minHeight: 80, borderBottomWidth: 1, paddingVertical: 10, fontSize: 16 },
  micBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
  plantBtn: { width: '100%', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  successIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(52, 211, 153, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 28, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  successSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
});
