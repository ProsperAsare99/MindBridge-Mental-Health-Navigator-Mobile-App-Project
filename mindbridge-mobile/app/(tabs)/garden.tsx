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
  FlatList,
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
  withTiming,
} from 'react-native-reanimated';
import {
  Activity,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Mic,
  StopCircle,
  MapPin,
  Cloud,
  History,
  ArrowRight,
  Clock
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

// ─── Tracker Header ──────────────────────────────────────────────────────────
const TrackerHeader = ({ totalCount, avgMood, theme }: any) => {
  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.headerGrid}>
      <LinearGradient 
        colors={theme.isDark ? ['#1E293B', '#0F172A'] : ['#F8FAFC', '#F1F5F9']} 
        style={styles.statsCard}
      >
        <View style={[styles.statsIcon, { backgroundColor: theme.colors.plum + '15' }]}>
          <Activity color={theme.colors.plum} size={20} />
        </View>
        <Text style={[styles.statsVal, { color: theme.colors.text.primary }]}>{totalCount}</Text>
        <Text style={[styles.statsLabel, { color: theme.colors.text.tertiary }]}>Total Records</Text>
      </LinearGradient>

      <LinearGradient 
        colors={theme.isDark ? ['#1E293B', '#0F172A'] : ['#F8FAFC', '#F1F5F9']} 
        style={styles.statsCard}
      >
        <View style={[styles.statsIcon, { backgroundColor: '#34D39915' }]}>
          <TrendingUp color="#34D399" size={20} />
        </View>
        <Text style={[styles.statsVal, { color: theme.colors.text.primary }]}>{avgMood || '7.2'}</Text>
        <Text style={[styles.statsLabel, { color: theme.colors.text.tertiary }]}>Avg. Mood</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default function WellnessTrackerScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = theme;
  const router = useRouter();
  
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  
  const [answers, setAnswers] = useState({ sleptWell: true, overwhelmed: false });
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState(6);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [social, setSocial] = useState('alone');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [weather, setWeather] = useState<string | null>(null);
  
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/ai/oracle-context');
      setTotalCount(res.data.moodCount || 0);
      
      // Fetch recent logs
      const logsRes = await api.get('/mood/insights'); // Assuming insights has history
      setHistory(logsRes.data.trends?.slice(0, 3) || []);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocation('University Campus');
        setWeather('Clear');
      }
    } catch (e) {}
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s > 0 ? s - 1 : 0);

  const StepProgress = ({ current }: { current: number }) => (
    <View style={styles.progressRow}>
      {[0, 1, 2, 3].map((i) => (
        <View 
          key={i} 
          style={[
            styles.progressBar, 
            { backgroundColor: i <= current ? theme.colors.plum : theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
          ]} 
        />
      ))}
    </View>
  );

  const handleLog = async () => {
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
      Alert.alert('Error', 'Failed to save log.');
    } finally {
      setLoading(false);
    }
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
            <Text style={{ fontSize: 40, opacity: 0.2 }}>🔍</Text>
          )}
        </View>
        {moods.map((m, i) => {
          const angle = (i * (360 / moods.length)) * (Math.PI / 180);
          const x = 110 * Math.cos(angle);
          const y = 110 * Math.sin(angle);
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => setSelectedMood(m.id)}
              style={[styles.wheelItem, { transform: [{ translateX: x }, { translateY: y }], backgroundColor: selectedMood === m.id ? m.color : (theme.isDark ? 'rgba(255,255,255,0.05)' : '#FFF') }]}
            >
              <Text style={{ fontSize: 24 }}>{m.emoji}</Text>
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
        <ScreenHeader title={t('tracker.title')} subtitle={t('tracker.subtitle')} />
        
        <TrackerHeader totalCount={totalCount} theme={theme} />

        <View style={styles.cardContainer}>
          <BlurView intensity={theme.isDark ? 30 : 80} tint={theme.isDark ? 'dark' : 'light'} style={styles.glassCard}>
            
            {step < 4 && (
              <View style={styles.wizardHeader}>
                <StepProgress current={step} />
                <View style={styles.wizardNav}>
                  {step > 0 ? (
                    <TouchableOpacity onPress={prevStep} style={styles.backBtn}>
                      <ArrowRight size={20} color={theme.colors.text.tertiary} style={{ transform: [{ rotate: '180deg' }] }} />
                      <Text style={[styles.backText, { color: theme.colors.text.tertiary }]}>{t('common.back')}</Text>
                    </TouchableOpacity>
                  ) : <View />}
                </View>
              </View>
            )}

            {step === 0 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>Quick Pulse</Text>
                <Text style={[styles.stepSub, { color: theme.colors.text.tertiary }]}>Let's start with a few basics about your day.</Text>
                <View style={styles.qBox}>
                  <Text style={[styles.qText, { color: theme.colors.text.secondary }]}>Did you sleep well? 🌙</Text>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity onPress={() => setAnswers({...answers, sleptWell: false})} style={[styles.choiceBtn, !answers.sleptWell ? { backgroundColor: '#EF4444' } : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}><Text style={[styles.choiceTxt, { color: !answers.sleptWell ? '#FFF' : theme.colors.text.tertiary }]}>No</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setAnswers({...answers, sleptWell: true})} style={[styles.choiceBtn, answers.sleptWell ? { backgroundColor: theme.colors.plum } : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}><Text style={[styles.choiceTxt, { color: answers.sleptWell ? '#FFF' : theme.colors.text.tertiary }]}>Yes</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.qBox}>
                  <Text style={[styles.qText, { color: theme.colors.text.secondary }]}>Feeling overwhelmed? 📚</Text>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity onPress={() => setAnswers({...answers, overwhelmed: false})} style={[styles.choiceBtn, !answers.overwhelmed ? { backgroundColor: theme.colors.plum } : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}><Text style={[styles.choiceTxt, { color: !answers.overwhelmed ? '#FFF' : theme.colors.text.tertiary }]}>No</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => setAnswers({...answers, overwhelmed: true})} style={[styles.choiceBtn, answers.overwhelmed ? { backgroundColor: '#EF4444' } : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}><Text style={[styles.choiceTxt, { color: answers.overwhelmed ? '#FFF' : theme.colors.text.tertiary }]}>Yes</Text></TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.colors.plum }]} onPress={nextStep}><Text style={styles.nextBtnText}>Continue Tracking</Text></TouchableOpacity>
              </Animated.View>
            )}

            {step === 1 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>Your Emotion</Text>
                <Text style={[styles.stepSub, { color: theme.colors.text.tertiary }]}>Select the emotion that best matches your current state.</Text>
                <MoodWheel />
                <TouchableOpacity disabled={!selectedMood} style={[styles.nextBtn, { backgroundColor: theme.colors.plum }, !selectedMood && { opacity: 0.5 }]} onPress={nextStep}><Text style={styles.nextBtnText}>Next Step</Text></TouchableOpacity>
              </Animated.View>
            )}

            {step === 2 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>Vitals</Text>
                <Text style={[styles.stepSub, { color: theme.colors.text.tertiary }]}>Tracking energy and sleep helps us find patterns.</Text>
                <View style={{ width: '100%', gap: 12 }}>
                  <EnergySelector value={energy} onChange={setEnergy} theme={theme} />
                  <SleepTracker quality={sleepQuality} hours={sleepHours} onQualityChange={setSleepQuality} onHoursChange={setSleepHours} theme={theme} />
                </View>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.colors.plum }]} onPress={nextStep}><Text style={styles.nextBtnText}>Add Context</Text></TouchableOpacity>
              </Animated.View>
            )}

            {step === 3 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>Final Context</Text>
                <Text style={[styles.stepSub, { color: theme.colors.text.tertiary }]}>Who are you with and what symptoms are you noticing?</Text>
                <SocialPicker value={social} onChange={setSocial} theme={theme} />
                <SymptomCloud selected={symptoms} onToggle={(id: string) => setSymptoms(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} theme={theme} />
                
                <View style={styles.envRow}>
                  <View style={styles.envTag}><MapPin size={14} color={theme.colors.plum} /><Text style={[styles.envText, { color: theme.colors.text.secondary }]}>{location || 'Locating...'}</Text></View>
                  <View style={styles.envTag}><Cloud size={14} color={theme.colors.plum} /><Text style={[styles.envText, { color: theme.colors.text.secondary }]}>{weather || 'Syncing...'}</Text></View>
                </View>

                <View style={styles.journalBox}>
                  <TextInput
                    style={[styles.noteInput, { color: theme.colors.text.primary, borderColor: theme.colors.text.tertiary + '20' }]}
                    placeholder="Briefly reflect on your day..."
                    placeholderTextColor={theme.colors.text.tertiary}
                    multiline
                    value={note}
                    onChangeText={setNote}
                  />
                </View>

                <TouchableOpacity style={[styles.plantBtn, { backgroundColor: theme.colors.plum }]} onPress={handleLog}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.nextBtnText}>{t('tracker.submitBtn')}</Text>}
                </TouchableOpacity>
              </Animated.View>
            )}

            {step === 4 && (
              <Animated.View entering={FadeIn} style={styles.successContainer}>
                <View style={styles.successIconWrap}><CheckCircle2 color={theme.colors.accents.eucalyptus} size={48} /></View>
                <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>{t('tracker.successTitle')}</Text>
                <Text style={[styles.successSubtitle, { color: theme.colors.text.secondary }]}>{t('tracker.successSubtitle')}</Text>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.colors.plum, marginTop: 40 }]} onPress={() => router.push('/(tabs)/dashboard')}><Text style={styles.nextBtnText}>Return to Home</Text></TouchableOpacity>
              </Animated.View>
            )}
          </BlurView>
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: theme.colors.text.primary }]}>Recent Check-ins</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}><Text style={{ color: theme.colors.plum, fontWeight: '700' }}>View All</Text></TouchableOpacity>
          </View>
          {history.length > 0 ? history.map((item, idx) => (
            <View key={idx} style={[styles.historyItem, { backgroundColor: theme.colors.surface, borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
              <View style={[styles.moodIndicator, { backgroundColor: theme.colors.plum + '20' }]}>
                <Text style={{ fontSize: 20 }}>{idx === 0 ? '😊' : idx === 1 ? '😌' : '😐'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.historyMood, { color: theme.colors.text.primary }]}>{item.date}</Text>
                <View style={styles.historyMeta}>
                  <Clock size={12} color={theme.colors.text.tertiary} />
                  <Text style={[styles.historyTime, { color: theme.colors.text.tertiary }]}>Mood: {item.avgScore}/10</Text>
                </View>
              </View>
              <ArrowRight size={16} color={theme.colors.text.tertiary} />
            </View>
          )) : (
            <View style={styles.emptyHistory}>
              <History size={40} color={theme.colors.text.disabled} />
              <Text style={{ color: theme.colors.text.tertiary, marginTop: 12 }}>No recent check-ins found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 120 },
  headerGrid: { flexDirection: 'row', gap: 16, paddingHorizontal: 24, marginBottom: 24 },
  statsCard: { flex: 1, padding: 16, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statsIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statsVal: { fontSize: 24, fontFamily: 'Outfit-Bold' },
  statsLabel: { fontSize: 13, fontFamily: 'Outfit-Medium', marginTop: 2 },
  cardContainer: { paddingHorizontal: 24, marginTop: 8 },
  glassCard: { borderRadius: 36, overflow: 'hidden', padding: 24, minHeight: 560, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  stepContainer: { flex: 1, width: '100%' },
  wizardHeader: { width: '100%', marginBottom: 28 },
  progressRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  progressBar: { flex: 1, height: 4, borderRadius: 2 },
  wizardNav: { height: 32, justifyContent: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 14, fontFamily: 'Outfit-Bold' },
  stepTitle: { fontSize: 28, fontFamily: 'Outfit-Bold', marginBottom: 8 },
  stepSub: { fontSize: 15, fontFamily: 'Outfit-Regular', marginBottom: 32, lineHeight: 22 },
  qBox: { width: '100%', marginBottom: 24 },
  qText: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  choiceRow: { flexDirection: 'row', gap: 12 },
  choiceBtn: { flex: 1, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  choiceTxt: { fontWeight: '700', fontSize: 16 },
  nextBtn: { width: '100%', height: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  nextBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  wheelContainer: { width: 260, height: 260, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginVertical: 24 },
  wheelCenter: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  wheelItem: { position: 'absolute', width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  selectedMoodCircle: { alignItems: 'center', justifyContent: 'center' },
  selectedMoodLabel: { fontSize: 18, fontWeight: '800', marginTop: 8 },
  envRow: { flexDirection: 'row', gap: 10, marginVertical: 20, alignSelf: 'flex-start' },
  envTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(128,128,128,0.08)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  envText: { fontSize: 12, fontWeight: '700' },
  journalBox: { width: '100%', marginBottom: 32 },
  noteInput: { minHeight: 80, borderBottomWidth: 1.5, paddingVertical: 12, fontSize: 16, fontFamily: 'Outfit-Medium' },
  plantBtn: { width: '100%', height: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  successIconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(52, 211, 153, 0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  successTitle: { fontSize: 32, fontFamily: 'Outfit-Bold', marginBottom: 12, textAlign: 'center' },
  successSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 26, paddingHorizontal: 20, fontFamily: 'Outfit-Regular' },
  
  historySection: { paddingHorizontal: 24, marginTop: 48 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  historyTitle: { fontSize: 22, fontFamily: 'Outfit-Bold' },
  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 24, marginBottom: 14, borderWidth: 1, gap: 16 },
  moodIndicator: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  historyMood: { fontSize: 17, fontFamily: 'Outfit-Bold' },
  historyMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  historyTime: { fontSize: 14, fontFamily: 'Outfit-Medium' },
  emptyHistory: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
});
