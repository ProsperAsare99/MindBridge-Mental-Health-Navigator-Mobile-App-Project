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
import { LineChart } from 'react-native-gifted-charts';
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
  Clock,
  Sun,
  Sparkles,
  Wind,
  Heart,
  Moon,
  AlertCircle,
  CloudRain,
  Flame
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
const CHART_W = width - 96;

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
  
  const getMoodIcon = (emotion: string, size = 20, color = theme.colors.plum) => {
    switch(emotion) {
      case 'elated': return <Sun size={size} color={color} />;
      case 'joyful': return <Sparkles size={size} color={color} />;
      case 'calm': return <Wind size={size} color={color} />;
      case 'okay': return <Heart size={size} color={color} />;
      case 'neutral': return <Activity size={size} color={color} />;
      case 'tired': return <Moon size={size} color={color} />;
      case 'anxious': return <AlertCircle size={size} color={color} />;
      case 'sad': return <CloudRain size={size} color={color} />;
      case 'stressed': return <Flame size={size} color={color} />;
      default: return <Activity size={size} color={color} />;
    }
  };
  const { t } = theme;
  const router = useRouter();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  
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
      const [contextRes, logsRes, insightsRes] = await Promise.all([
        api.get('/ai/oracle-context'),
        api.get('/mood'),
        api.get('/mood/insights'),
      ]);

      setTotalCount(contextRes.data.moodCount || 0);
      setMoodLogs(logsRes.data || []);
      setInsights(insightsRes.data || null);

      // Recent history: last 3 logs
      const logs = logsRes.data || [];
      setHistory(logs.slice(0, 3));

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

  const EmotionLandscape = () => {
    const moods = [
      { id: 'elated', icon: Sun, colors: theme.isDark ? ['#EAB308', '#CA8A04'] : ['#FEF08A', '#FDE047'], label: 'Elated', vibe: 'High energy & glowing positivity', category: 'Vibrant' },
      { id: 'joyful', icon: Sparkles, colors: theme.isDark ? ['#EC4899', '#C084FC'] : ['#FCE7F3', '#F472B6'], label: 'Joyful', vibe: 'Warm connection & pure happiness', category: 'Bright' },
      { id: 'calm', icon: Wind, colors: theme.isDark ? ['#10B981', '#059669'] : ['#D1FAE5', '#A7F3D0'], label: 'Calm', vibe: 'Inner peace & tranquility', category: 'Serene' },
      { id: 'okay', icon: Heart, colors: theme.isDark ? ['#14B8A6', '#0F766E'] : ['#CCFBF1', '#2DD4BF'], label: 'Okay', vibe: 'Steady, content & balanced', category: 'Stable' },
      { id: 'neutral', icon: Activity, colors: theme.isDark ? ['#64748B', '#475569'] : ['#F1F5F9', '#CBD5E1'], label: 'Neutral', vibe: 'Observant & even-tempered', category: 'Balanced' },
      { id: 'tired', icon: Moon, colors: theme.isDark ? ['#8B5CF6', '#6D28D9'] : ['#EDE9FE', '#C084FC'], label: 'Tired', vibe: 'Low energy & needing recovery', category: 'Rest' },
      { id: 'anxious', icon: AlertCircle, colors: theme.isDark ? ['#475569', '#1E293B'] : ['#E2E8F0', '#94A3B8'], label: 'Anxious', vibe: 'High cognitive load & tension', category: 'Heavy' },
      { id: 'sad', icon: CloudRain, colors: theme.isDark ? ['#3B82F6', '#1D4ED8'] : ['#DBEAFE', '#93C5FD'], label: 'Sad', vibe: 'Reflective & processing feelings', category: 'Reflective' },
      { id: 'stressed', icon: Flame, colors: theme.isDark ? ['#EF4444', '#991B1B'] : ['#FEE2E2', '#F87171'], label: 'Stressed', vibe: 'Under pressure & overloaded', category: 'Overload' },
    ];

    return (
      <View style={styles.landscapeGrid}>
        {moods.map((m) => {
          const isSelected = selectedMood === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => setSelectedMood(m.id)}
              style={styles.landscapeCardContainer}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={(isSelected ? m.colors : (theme.isDark ? ['#1E293B', '#0F172A'] : ['#FFFFFF', '#F8FAFC'])) as unknown as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.landscapeCard,
                  isSelected && styles.landscapeCardSelected,
                  { borderColor: isSelected ? m.colors[0] : (theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)') }
                ]}
              >
                {isSelected && (
                  <View style={[styles.selectedVibeBadge, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.vibeBadgeText, { color: theme.isDark ? '#FFF' : theme.colors.text.primary }]}>{m.category}</Text>
                  </View>
                )}
                <View style={styles.moodHeaderRow}>
                  <m.icon size={28} color={isSelected ? (theme.isDark ? '#FFF' : theme.colors.plum) : theme.colors.text.secondary} />
                </View>
                <Text style={[styles.landscapeLabel, { color: isSelected && theme.isDark ? '#FFF' : theme.colors.text.primary }]}>
                  {m.label}
                </Text>
                <Text style={[styles.landscapeVibe, { color: isSelected && theme.isDark ? 'rgba(255,255,255,0.7)' : theme.colors.text.tertiary }]}>
                  {m.vibe}
                </Text>
              </LinearGradient>
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
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Moon size={20} color={theme.colors.plum} />
                    <Text style={[styles.qText, { color: theme.colors.text.secondary, marginBottom: 0 }]}>Did you sleep well?</Text>
                  </View>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity 
                      onPress={() => setAnswers({...answers, sleptWell: false})} 
                      style={[
                        styles.choiceBtn, 
                        !answers.sleptWell 
                          ? { backgroundColor: theme.isDark ? '#EF4444' : '#FEE2E2', borderColor: '#EF4444', borderWidth: 1.5 } 
                          : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: 'transparent', borderWidth: 1.5 }
                      ]}
                    >
                      <Text style={[styles.choiceTxt, { color: !answers.sleptWell ? (theme.isDark ? '#FFF' : '#EF4444') : theme.colors.text.tertiary }]}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setAnswers({...answers, sleptWell: true})} 
                      style={[
                        styles.choiceBtn, 
                        answers.sleptWell 
                          ? { backgroundColor: theme.isDark ? theme.colors.plum : theme.colors.plum + '20', borderColor: theme.colors.plum, borderWidth: 1.5 } 
                          : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: 'transparent', borderWidth: 1.5 }
                      ]}
                    >
                      <Text style={[styles.choiceTxt, { color: answers.sleptWell ? (theme.isDark ? '#FFF' : theme.colors.plum) : theme.colors.text.tertiary }]}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.qBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <AlertCircle size={20} color={theme.colors.plum} />
                    <Text style={[styles.qText, { color: theme.colors.text.secondary, marginBottom: 0 }]}>Feeling overwhelmed?</Text>
                  </View>
                  <View style={styles.choiceRow}>
                    <TouchableOpacity 
                      onPress={() => setAnswers({...answers, overwhelmed: false})} 
                      style={[
                        styles.choiceBtn, 
                        !answers.overwhelmed 
                          ? { backgroundColor: theme.isDark ? theme.colors.plum : theme.colors.plum + '20', borderColor: theme.colors.plum, borderWidth: 1.5 } 
                          : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: 'transparent', borderWidth: 1.5 }
                      ]}
                    >
                      <Text style={[styles.choiceTxt, { color: !answers.overwhelmed ? (theme.isDark ? '#FFF' : theme.colors.plum) : theme.colors.text.tertiary }]}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setAnswers({...answers, overwhelmed: true})} 
                      style={[
                        styles.choiceBtn, 
                        answers.overwhelmed 
                          ? { backgroundColor: theme.isDark ? '#EF4444' : '#FEE2E2', borderColor: '#EF4444', borderWidth: 1.5 } 
                          : { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: 'transparent', borderWidth: 1.5 }
                      ]}
                    >
                      <Text style={[styles.choiceTxt, { color: answers.overwhelmed ? (theme.isDark ? '#FFF' : '#EF4444') : theme.colors.text.tertiary }]}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.colors.plum }]} onPress={nextStep}><Text style={styles.nextBtnText}>Continue Tracking</Text></TouchableOpacity>
              </Animated.View>
            )}

            {step === 1 && (
              <Animated.View entering={FadeInRight} style={styles.stepContainer}>
                <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>Your Emotion</Text>
                <Text style={[styles.stepSub, { color: theme.colors.text.tertiary }]}>Select the emotion that best matches your current state.</Text>
                <EmotionLandscape />
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
          {history.length > 0 ? history.map((item: any, idx: number) => {
            const emotion = item.emotions?.[0] || 'neutral';
            return (
              <View key={idx} style={[styles.historyItem, { backgroundColor: theme.colors.surface, borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}>
                <View style={[styles.moodIndicator, { backgroundColor: theme.colors.plum + '12' }]}>
                  {getMoodIcon(emotion, 20, theme.colors.plum)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyMood, { color: theme.colors.text.primary }]}>{new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
                  <View style={styles.historyMeta}>
                    <Clock size={12} color={theme.colors.text.tertiary} />
                    <Text style={[styles.historyTime, { color: theme.colors.text.tertiary }]}>Score: {item.score}/10 · {emotion}</Text>
                  </View>
                </View>
                <ArrowRight size={16} color={theme.colors.text.tertiary} />
              </View>
            );
          }) : (
            <View style={styles.emptyHistory}>
              <History size={40} color={theme.colors.text.disabled} />
              <Text style={{ color: theme.colors.text.tertiary, marginTop: 12 }}>No recent check-ins found</Text>
            </View>
          )}
        </View>

        {/* ── Mood Analysis ── */}
        {moodLogs.length > 0 && (
          <View style={styles.analysisSection}>
            <Text style={[styles.historyTitle, { color: theme.colors.text.primary, marginBottom: 6 }]}>Mood Analysis</Text>
            <Text style={[styles.analysisSub, { color: theme.colors.text.tertiary }]}>Your emotional patterns based on {moodLogs.length} check-ins</Text>

            {/* 7-Day / 30-Day Trend Chart */}
            {(() => {
              const activeData = timeRange === '7d' 
                ? (insights?.trend || [])
                : moodLogs.slice(0, 30).reverse().map((l: any) => ({
                    value: l.score,
                    label: new Date(l.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
                  }));

              if (activeData.length === 0) return null;

              const avgScore = timeRange === '7d'
                ? (insights?.avgMood ?? 0)
                : (activeData.reduce((acc: number, item: any) => acc + (item.value ?? item.score ?? 0), 0) / activeData.length).toFixed(1);

              // Calculate dynamic Best Day of the Week based on all available check-ins
              const weekdayAvg: Record<string, { total: number; count: number }> = {};
              moodLogs.forEach((l: any) => {
                const dayName = new Date(l.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
                if (!weekdayAvg[dayName]) {
                  weekdayAvg[dayName] = { total: 0, count: 0 };
                }
                weekdayAvg[dayName].total += l.score;
                weekdayAvg[dayName].count += 1;
              });

              let bestDayName = 'N/A';
              let bestDayScore = 0;
              Object.entries(weekdayAvg).forEach(([day, val]) => {
                const avg = val.total / val.count;
                if (avg > bestDayScore) {
                  bestDayScore = avg;
                  bestDayName = day;
                }
              });

              return (
                <View style={[styles.analysisCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.chartHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.analysisCardTitle, { color: theme.colors.text.primary }]}>Mood Trend</Text>
                      <Text style={[styles.analysisCardSub, { color: theme.colors.text.tertiary }]}>Showing last {activeData.length} records</Text>
                    </View>
                    <View style={[styles.toggleContainer, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
                      <TouchableOpacity 
                        style={[styles.toggleBtn, timeRange === '7d' && [styles.toggleActiveBtn, { backgroundColor: theme.colors.plum }]]}
                        onPress={() => setTimeRange('7d')}
                      >
                        <Text style={[styles.toggleBtnText, timeRange === '7d' ? { color: '#FFF' } : { color: theme.colors.text.secondary }]}>Weekly</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.toggleBtn, timeRange === '30d' && [styles.toggleActiveBtn, { backgroundColor: theme.colors.plum }]]}
                        onPress={() => setTimeRange('30d')}
                      >
                        <Text style={[styles.toggleBtnText, timeRange === '30d' ? { color: '#FFF' } : { color: theme.colors.text.secondary }]}>Monthly</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ marginLeft: -8, marginTop: 16 }}>
                    <LineChart
                      data={activeData.map((d: any) => ({ 
                        value: d.value ?? d.score, 
                        label: d.label ?? d.day 
                      }))}
                      width={CHART_W}
                      height={120}
                      spacing={CHART_W / (activeData.length + 1)}
                      initialSpacing={16}
                      color={theme.colors.plum}
                      thickness={2.5}
                      startFillColor={theme.colors.plum + '25'}
                      endFillColor={theme.colors.plum + '00'}
                      areaChart
                      curved
                      dataPointsColor={theme.colors.plum}
                      dataPointsRadius={4}
                      yAxisColor={'transparent'}
                      xAxisColor={theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                      hideYAxisText
                      maxValue={10}
                      noOfSections={5}
                      yAxisThickness={0}
                      rulesColor={theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}
                      xAxisLabelTextStyle={{ color: theme.colors.text.tertiary, fontSize: 9, fontWeight: '700' }}
                      backgroundColor={'transparent'}
                    />
                  </View>

                  <View style={styles.trendSummaryRow}>
                    <View style={styles.trendStat}>
                      <Text style={[styles.trendStatNum, { color: theme.colors.plum }]}>{avgScore}</Text>
                      <Text style={[styles.trendStatLabel, { color: theme.colors.text.tertiary }]}>Avg Score</Text>
                    </View>
                    <View style={styles.trendDivider} />
                    <View style={styles.trendStat}>
                      <Text style={[styles.trendStatNum, { color: theme.colors.accents?.eucalyptus || '#34D399' }]}>
                        {activeData.filter((d: any) => (d.value ?? d.score) >= 7).length}
                      </Text>
                      <Text style={[styles.trendStatLabel, { color: theme.colors.text.tertiary }]}>Good Days</Text>
                    </View>
                    <View style={styles.trendDivider} />
                    <View style={styles.trendStat}>
                      <Text style={[styles.trendStatNum, { color: '#EAB308' }]}>
                        {bestDayName}
                      </Text>
                      <Text style={[styles.trendStatLabel, { color: theme.colors.text.tertiary }]}>Best Day</Text>
                    </View>
                  </View>
                </View>
              );
            })()}

            {/* AI Insight Capsule - Evaluates actual mood logs to build support tips */}
            {(() => {
              const recentOverwhelmed = moodLogs.slice(0, 5).filter(l => l.note?.toLowerCase().includes('stress') || l.note?.toLowerCase().includes('study') || l.note?.toLowerCase().includes('exam'));
              const avgSleep = moodLogs.reduce((acc, l) => acc + (l.sleepHours || 0), 0) / moodLogs.length;
              const avgScore = moodLogs.reduce((acc, l) => acc + l.score, 0) / moodLogs.length;

              let insightTitle = 'Emotional Reservoir Stable';
              let insightDesc = 'Your emotional trends show strong resilience. Maintain this momentum by writing down one intention each morning.';
              let IconComponent = Sparkles;
              let iconColor = theme.colors.plum;

              if (avgScore < 6.0) {
                insightTitle = 'Emotional Reservoir Low';
                insightDesc = 'Your average mood is slightly lower than usual. Try micro-dosing relaxation: do a 2-minute breathing cycle before studying.';
                IconComponent = Cloud;
                iconColor = theme.colors.accents.powderBlue;
              } else if (avgScore >= 8.0) {
                insightTitle = 'Glowing Vital Energy';
                insightDesc = 'You are experiencing high emotional clarity! Keep tracking what triggers these moments so you can replicate them next week.';
                IconComponent = Sun;
                iconColor = theme.colors.accents.gentlePeach;
              } else if (avgSleep < 6.5) {
                insightTitle = 'Rest Deficit Warning';
                insightDesc = 'Your average sleep is under 6.5 hours. A quick wind-down routine without your phone can increase sleep quality.';
                IconComponent = Moon;
                iconColor = theme.colors.accents.softLilac;
              } else if (recentOverwhelmed.length > 1) {
                insightTitle = 'High Cognitive Load';
                insightDesc = 'We detected studies/stress in your recent notes. Break study sessions into 25-minute Pomodoro focus blocks to reduce load.';
                IconComponent = Activity;
                iconColor = theme.colors.accents.terracotta;
              }

              return (
                <View style={[styles.analysisCard, { backgroundColor: theme.colors.plum + '08', borderColor: theme.colors.plum + '20' }]}>
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                    <View style={{ marginTop: 2 }}>
                      <IconComponent size={32} color={iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.analysisCardTitle, { color: theme.colors.plum }]}>{insightTitle}</Text>
                      <Text style={[styles.insightBannerText, { color: theme.colors.text.secondary, marginTop: 4, lineHeight: 20 }]}>{insightDesc}</Text>
                    </View>
                  </View>
                </View>
              );
            })()}

            {/* Emotion Frequency */}
            {(() => {
              const freq: Record<string, number> = {};
              moodLogs.forEach((l: any) => { (l.emotions || []).forEach((e: string) => { freq[e] = (freq[e] || 0) + 1; }); });
              const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
              const max = sorted[0]?.[1] || 1;
              const moodColors: Record<string,string> = { elated:'#EAB308', joyful:'#EC4899', calm:'#10B981', okay:'#14B8A6', neutral:'#64748B', tired:'#8B5CF6', anxious:'#475569', sad:'#3B82F6', stressed:'#EF4444' };
              if (sorted.length === 0) return null;
              return (
                <View style={[styles.analysisCard, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.analysisCardTitle, { color: theme.colors.text.primary }]}>Emotion Frequency</Text>
                  <Text style={[styles.analysisCardSub, { color: theme.colors.text.tertiary }]}>Your most common emotional states</Text>
                  <View style={{ marginTop: 20, gap: 14 }}>
                    {sorted.map(([emotion, count]) => (
                      <View key={emotion}>
                        <View style={styles.freqRow}>
                          <View style={{ marginRight: 6 }}>
                            {getMoodIcon(emotion, 18, moodColors[emotion] || theme.colors.plum)}
                          </View>
                          <Text style={[styles.freqLabel, { color: theme.colors.text.primary }]}>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</Text>
                          <Text style={[styles.freqCount, { color: theme.colors.text.tertiary }]}>{count}x</Text>
                        </View>
                        <View style={styles.freqBarBg}>
                          <View style={[styles.freqBarFill, { width: `${(count / max) * 100}%`, backgroundColor: moodColors[emotion] || theme.colors.plum }]} />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })()}

            {/* Sleep vs Mood */}
            {(() => {
              const good = moodLogs.filter((l: any) => l.sleepQuality === 'good' || l.sleepQuality === 'great');
              const poor = moodLogs.filter((l: any) => l.sleepQuality === 'poor' || l.sleepQuality === 'bad');
              if (good.length === 0 && poor.length === 0) return null;
              const avgGood = good.length ? (good.reduce((a: number, l: any) => a + l.score, 0) / good.length).toFixed(1) : 'N/A';
              const avgPoor = poor.length ? (poor.reduce((a: number, l: any) => a + l.score, 0) / poor.length).toFixed(1) : 'N/A';
              return (
                <View style={[styles.analysisCard, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.analysisCardTitle, { color: theme.colors.text.primary }]}>Sleep vs Mood</Text>
                  <Text style={[styles.analysisCardSub, { color: theme.colors.text.tertiary }]}>How sleep quality affects your emotional state</Text>
                  <View style={styles.sleepGrid}>
                    <View style={[styles.sleepCell, { backgroundColor: (theme.colors.accents?.eucalyptus || '#34D399') + '15' }]}>
                      <Sun size={28} color={theme.colors.accents?.eucalyptus || '#34D399'} style={{ marginBottom: 8 }} />
                      <Text style={[styles.sleepCellNum, { color: theme.colors.accents?.eucalyptus || '#34D399' }]}>{avgGood}</Text>
                      <Text style={[styles.sleepCellLabel, { color: theme.colors.text.tertiary }]}>Good Sleep</Text>
                      <Text style={[styles.sleepCellSub, { color: theme.colors.text.tertiary }]}>{good.length} nights</Text>
                    </View>
                    <View style={[styles.sleepCell, { backgroundColor: '#F8717115' }]}>
                      <Moon size={28} color="#F87171" style={{ marginBottom: 8 }} />
                      <Text style={[styles.sleepCellNum, { color: '#F87171' }]}>{avgPoor}</Text>
                      <Text style={[styles.sleepCellLabel, { color: theme.colors.text.tertiary }]}>Poor Sleep</Text>
                      <Text style={[styles.sleepCellSub, { color: theme.colors.text.tertiary }]}>{poor.length} nights</Text>
                    </View>
                  </View>
                  {good.length > 0 && poor.length > 0 && Number(avgGood) > Number(avgPoor) && (
                    <View style={[styles.insightBanner, { backgroundColor: theme.colors.plum + '10' }]}>
                      <Text style={[styles.insightBannerText, { color: theme.colors.plum }]}>💡 You feel {(Number(avgGood) - Number(avgPoor)).toFixed(1)} points better on nights you sleep well.</Text>
                    </View>
                  )}
                </View>
              );
            })()}

            {/* Social Setting Impact */}
            {insights?.bestSocialSetting && (
              <View style={[styles.analysisCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.analysisCardTitle, { color: theme.colors.text.primary }]}>Social Patterns</Text>
                <Text style={[styles.analysisCardSub, { color: theme.colors.text.tertiary }]}>Your mood across different social settings</Text>
                <View style={[styles.insightBanner, { backgroundColor: theme.colors.accents?.gentlePeach ? theme.colors.accents.gentlePeach + '15' : '#FDE68A20', marginTop: 16 }]}>
                  <Text style={[styles.insightBannerText, { color: theme.colors.text.primary }]}>✨ You tend to feel best when <Text style={{ fontWeight: '900', color: theme.colors.plum }}>{insights.bestSocialSetting.setting}</Text>.</Text>
                </View>
              </View>
            )}

          </View>
        )}

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
  landscapeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between', marginVertical: 12 },
  landscapeCardContainer: { width: (width - 110) / 3, aspectRatio: 0.82 },
  landscapeCard: { flex: 1, borderRadius: 20, padding: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, position: 'relative', overflow: 'hidden' },
  landscapeCardSelected: { shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  selectedVibeBadge: { position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  vibeBadgeText: { fontSize: 8, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.3 },
  moodHeaderRow: { marginBottom: 4 },
  landscapeLabel: { fontSize: 13, fontFamily: 'Outfit-Bold', textAlign: 'center', marginTop: 4 },
  landscapeVibe: { fontSize: 9, fontFamily: 'Outfit-Medium', textAlign: 'center', marginTop: 2, lineHeight: 11, opacity: 0.8 },
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
  // Analysis
  analysisSection: { paddingHorizontal: 24, marginTop: 40, paddingBottom: 40 },
  analysisSub: { fontSize: 13, fontWeight: '600', marginBottom: 24 },
  analysisCard: { borderRadius: 28, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(128,128,128,0.08)', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  analysisCardTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  analysisCardSub: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  trendSummaryRow: { flexDirection: 'row', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(128,128,128,0.08)' },
  trendStat: { flex: 1, alignItems: 'center' },
  trendStatNum: { fontSize: 22, fontWeight: '900' },
  trendStatLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  trendDivider: { width: 1, backgroundColor: 'rgba(128,128,128,0.1)', marginVertical: 4 },
  freqRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  freqLabel: { flex: 1, fontSize: 14, fontWeight: '700' },
  freqCount: { fontSize: 12, fontWeight: '700' },
  freqBarBg: { height: 6, borderRadius: 3, backgroundColor: 'rgba(128,128,128,0.1)' },
  freqBarFill: { height: '100%', borderRadius: 3 },
  sleepGrid: { flexDirection: 'row', gap: 12, marginTop: 20 },
  sleepCell: { flex: 1, borderRadius: 20, padding: 16, alignItems: 'center', gap: 4 },
  sleepCellNum: { fontSize: 24, fontWeight: '900', marginTop: 4 },
  sleepCellLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  sleepCellSub: { fontSize: 11, fontWeight: '600' },
  insightBanner: { borderRadius: 16, padding: 14, marginTop: 16 },
  insightBannerText: { fontSize: 13, fontWeight: '700', lineHeight: 20 },
  // Toggles
  chartHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleContainer: { flexDirection: 'row', borderRadius: 12, padding: 3, gap: 2 },
  toggleBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  toggleActiveBtn: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 1 },
  toggleBtnText: { fontSize: 11, fontWeight: '800' },
});
