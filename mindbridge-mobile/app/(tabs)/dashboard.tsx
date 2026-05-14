import React, { useContext, useState, useEffect } from 'react';
import api from '../../src/services/api';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Pressable,
  Platform,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Clock,
  CheckCircle2,
  BookOpen,
  ClipboardList,
  Library,
  ShieldAlert,
  Users,
  Bot,
  Leaf,
  Wind,
  ChevronRight,
  Flower2,
  Sun,
  CircleDashed,
  TrendingUp,
  Activity
} from 'lucide-react-native';
import { translations, Language, TranslationSchema } from '../../src/utils/translations';
import { ScreenHeader } from '../../src/components/ScreenHeader';

const { width } = Dimensions.get('window');
const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

// ─── Sub-Components ─────────────────────────────────────────────────────────

const ProgressRings = ({ completed, total, theme, styles }: any) => {
  const size = 52;
  const strokeWidth = 5;
  const progress = completed / total;

  return (
    <View style={[styles.ringsContainer, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)' }]}>
      <View style={styles.ringWrap}>
        <View style={[styles.ringBg, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: theme.colors.plum + '15' }]} />
        <View style={[styles.ringFill, { 
          width: size, 
          height: size, 
          borderRadius: size / 2, 
          borderTopColor: theme.colors.plum, 
          borderRightColor: progress >= 0.33 ? theme.colors.plum : 'transparent', 
          borderBottomColor: progress >= 0.66 ? theme.colors.plum : 'transparent', 
          borderLeftColor: progress >= 1.0 ? theme.colors.plum : 'transparent', 
          borderTopWidth: strokeWidth, 
          borderRightWidth: strokeWidth, 
          borderBottomWidth: strokeWidth, 
          borderLeftWidth: strokeWidth, 
          transform: [{ rotate: '-45deg' }] 
        }]} />
      </View>
      <View style={{ marginRight: 4 }}>
        <Text style={[styles.ringsCount, { color: theme.colors.text.primary }]}>{completed}/{total}</Text>
        <Text style={[styles.ringsLabel, { color: theme.colors.text.secondary }]}>Rituals</Text>
      </View>
    </View>
  );
};

// ─── Weekly Pulse Widget ─────────────────────────────────────────────────────

const WeeklyPulse = ({ theme, styles, data }: any) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Calculate real scores from data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toDateString();
  });

  const scores = last7Days.map(dayStr => {
    // Robust date matching
    const entry = data.find((d: any) => new Date(d.createdAt).toDateString() === dayStr);
    return entry ? Math.min(Math.max(entry.score / 10, 0.1), 1) : 0.4;
  });

  return (
    <Animated.View entering={FadeInUp.delay(200)} style={styles.pulseCard}>
      <BlurView intensity={theme.isDark ? 30 : 60} tint={theme.isDark ? 'dark' : 'light'} style={styles.pulseGlass}>
        <View style={styles.pulseHeader}>
          <View>
            <Text style={[styles.pulseTitle, { color: theme.colors.text.primary }]}>Weekly Pulse</Text>
            <Text style={[styles.pulseSubtitle, { color: theme.colors.text.secondary }]}>
              {scores.every(s => s === 0.4) ? "Plant seeds to see your emotional trend" : "Your emotional journey this week"}
            </Text>
          </View>
          <Activity color={theme.colors.plum} size={18} />
        </View>
        <View style={styles.pulseGraph}>
          {scores.map((score, i) => (
            <View key={i} style={styles.pulseCol}>
              <View style={[styles.pulseBarBg, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                <LinearGradient
                  colors={[theme.colors.plum, theme.colors.accents.powderBlue]}
                  style={[styles.pulseBarFill, { height: `${score * 100}%` }]}
                />
              </View>
              <Text style={[styles.pulseDayLabel, { color: theme.colors.text.tertiary }]}>{days[new Date(last7Days[i]).getDay()]}</Text>
            </View>
          ))}
        </View>
      </BlurView>
    </Animated.View>
  );
};

const QUOTES = [
  { text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
  { text: "There is hope, even when your brain tells you there isn’t.", author: "John Green" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
];

const QuoteSlideshow = ({ theme, styles }: any) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => { setIndex((prev) => (prev + 1) % QUOTES.length); }, 7000);
    return () => clearInterval(timer);
  }, []);
  const quote = QUOTES[index];

  return (
    <Animated.View entering={FadeInUp.delay(50).duration(500)} style={styles.quoteCardContainer}>
      <LinearGradient colors={[theme.colors.plum, theme.isDark ? '#2E3A4A' : '#4A3E4F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.quoteCard}>
        <View style={styles.quoteMarkContainer}><Text style={styles.largeQuoteMark}>“</Text></View>
        <Animated.View key={index} entering={FadeIn.duration(1000)}>
          <Text style={styles.quoteText}>{quote.text}</Text>
          <Text style={styles.quoteAuthor}>{quote.author}</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const AppleWidget = ({ title, subtitle, icon: Icon, color, onPress, theme, styles, size = 'square', delay = 0, value, label }: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const handlePressIn = () => { scale.value = withSpring(0.96, springConfig); };
  const handlePressOut = () => { scale.value = withSpring(1, springConfig); };

  if (size === 'list') {
    return (
      <Animated.View entering={FadeInUp.delay(delay)}>
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={[styles.listWidget, animatedStyle]}>
            <View style={[styles.listIconWrap, { backgroundColor: color + (theme.isDark ? '30' : '15') }]}>
              <Icon color={color} size={22} />
            </View>
            <View style={styles.listTextWrap}>
              <Text style={[styles.listTitle, { color: theme.colors.text.primary }]}>{title}</Text>
              {subtitle && <Text style={[styles.listSubtitle, { color: theme.colors.text.secondary }]}>{subtitle}</Text>}
            </View>
            <ChevronRight color={theme.colors.text.disabled} size={20} />
          </Animated.View>
        </Pressable>
      </Animated.View>
    );
  }

  const isWide = size === 'wide';
  const isFixed = size === 'fixed';

  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={isWide ? { width: '100%' } : (isFixed ? { width: 142, marginRight: 12 } : { width: '47.5%' })}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} hitSlop={10}>
        <Animated.View style={[styles.widget, { backgroundColor: theme.colors.surface, borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }, isWide ? styles.widgetWide : (isFixed ? styles.widgetFixed : styles.widgetSquare), animatedStyle]}>
          <View style={isWide ? styles.wideContent : styles.squareContent}>
            <View style={[styles.widgetIconWrap, { backgroundColor: color }]}>
              <Icon color={'#FFF'} size={isWide ? 22 : 24} />
            </View>
            <View style={isWide ? styles.wideTextWrap : { marginTop: 12 }}>
              <Text style={[styles.widgetTitle, { color: theme.colors.text.primary }]} numberOfLines={1}>{title}</Text>
              {value ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: theme.colors.text.primary }}>{value}</Text>
                  {label && <Text style={{ fontSize: 11, color: theme.colors.text.tertiary, marginLeft: 4, textTransform: 'uppercase' }}>{label}</Text>}
                </View>
              ) : (
                subtitle && <Text style={[styles.widgetSubtitle, { color: theme.colors.text.secondary }]} numberOfLines={1}>{subtitle}</Text>
              )}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const RitualItem = ({ label, done, icon: Icon, color, theme, styles, onPress }: any) => (
  <TouchableOpacity style={styles.ritualItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.ritualIconCircle, { backgroundColor: done ? color : (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') }]}>
      <Icon color={done ? '#FFF' : theme.colors.text.disabled} size={24} />
      {done && <View style={styles.checkBadge}><CheckCircle2 color="#FFF" size={12} fill={color} /></View>}
    </View>
    <Text style={[styles.ritualLabel, { color: done ? theme.colors.text.primary : theme.colors.text.tertiary }]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { userData: authData } = useContext(AuthContext) as any;
  
  const [rituals, setRituals] = useState({ garden: false, journal: false, breathing: false });
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [gardenStats, setGardenStats] = useState({ count: 0, stage: 'Empty Garden', icon: CircleDashed, color: '#94A3B8' });
  const [userData, setUserData] = useState({ name: authData?.name || 'Friend', language: 'English' as Language });
  const t: TranslationSchema = translations[userData.language] || translations.English;
  const completedCount = Object.values(rituals).filter(Boolean).length;

  const getGrowthStage = (count: number) => {
    if (count >= 20) return { label: 'Ancient Tree', icon: Flower2, color: '#8B5CF6' };
    if (count >= 14) return { label: 'Full Bloom', icon: Flower2, color: '#7B61FF' };
    if (count >= 8) return { label: 'Healthy Plant', icon: Leaf, color: '#34D399' };
    if (count >= 4) return { label: 'Sprouting', icon: Sun, color: '#FBBF24' };
    if (count >= 1) return { label: 'New Seed', icon: Leaf, color: '#60A5FA' };
    return { label: 'Empty Garden', icon: CircleDashed, color: '#94A3B8' };
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const todayStr = new Date().toDateString();
        const res = await api.get('/ai/oracle-context');
        const logs = res.data.recentJournal || [];
        setMoodHistory(logs);
        
        const growth = getGrowthStage(logs.length);
        setGardenStats({ count: logs.length, stage: growth.label, icon: growth.icon, color: growth.color });

        setRituals({
          garden: res.data.latestMood && new Date(res.data.latestMood.createdAt).toDateString() === todayStr,
          journal: logs.some((log: any) => new Date(log.createdAt).toDateString() === todayStr),
          breathing: await AsyncStorage.getItem(`breathing_${todayStr}`) === 'true'
        });
        if (res.data.onboarding?.firstName) setUserData(prev => ({ ...prev, name: res.data.onboarding.firstName }));
      } catch (e) {}
    };
    checkStatus();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.greetingMorning;
    if (hour < 18) return t.dashboard.greetingAfternoon;
    return t.dashboard.greetingEvening;
  };

  return (
    <View style={dashStyles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient colors={theme.isDark ? ['#121212', '#1A1A1A', '#0D0D0D'] : ['#FDFCFB', '#F4F7F9', '#E6E9EF']} style={StyleSheet.absoluteFillObject} />
        <View style={[dashStyles.bgBlob, { top: -50, right: -50, backgroundColor: theme.colors.plum + '08' }]} />
        <View style={[dashStyles.bgBlob, { bottom: 100, left: -50, backgroundColor: theme.colors.accents.powderBlue + '05' }]} />
      </View>

      <ScrollView contentContainerStyle={[dashStyles.scrollContent, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <View style={dashStyles.headerRow}>
          <View style={{ flex: 1 }}>
            <ScreenHeader title={`${getGreeting()}, ${userData.name}`} subtitle="Nurture your peace today" noPadding />
          </View>
          <ProgressRings completed={completedCount} total={3} theme={theme} styles={dashStyles} />
        </View>

        <View style={dashStyles.section}><QuoteSlideshow theme={theme} styles={dashStyles} /></View>
        <View style={dashStyles.section}><WeeklyPulse theme={theme} styles={dashStyles} data={moodHistory} /></View>

        <Animated.View entering={FadeInUp.delay(300)} style={[dashStyles.ritualsContainer, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' }]}>
          <View style={dashStyles.ritualHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Leaf color={theme.colors.plum} size={20} strokeWidth={2.5} />
              <Text style={[dashStyles.ritualTitle, { color: theme.colors.text.primary }]}>Daily Rituals</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/journey')}><Text style={{ color: theme.colors.plum, fontSize: 13, fontWeight: '700' }}>View Journey</Text></TouchableOpacity>
          </View>
          <View style={dashStyles.ritualRow}>
            <RitualItem label="Mood Seed" done={rituals.garden} icon={Leaf} color={theme.colors.accents.eucalyptus} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/garden')} />
            <RitualItem label="Reflect" done={rituals.journal} icon={BookOpen} color={theme.colors.accents.powderBlue} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/journal')} />
            <RitualItem label="Breathe" done={rituals.breathing} icon={Wind} color={theme.colors.accents.softLilac} theme={theme} styles={dashStyles} onPress={() => router.push('/breathing')} />
          </View>
        </Animated.View>

        {/* ── New Overview Section ── */}
        <View style={dashStyles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <AppleWidget 
              title="Garden Growth" 
              subtitle={gardenStats.stage} 
              icon={gardenStats.icon} 
              color={gardenStats.color} 
              theme={theme} 
              styles={dashStyles} 
              onPress={() => router.push('/(tabs)/garden')}
              value={gardenStats.count}
              label="Seeds"
              delay={350}
            />
            <AppleWidget 
              title="Assessments" 
              subtitle="Emotional Check" 
              icon={ClipboardList} 
              color={theme.colors.accents.slate} 
              theme={theme} 
              styles={dashStyles} 
              onPress={() => router.push('/(tabs)/assessments')}
              value={moodHistory.length > 0 ? "85%" : "0%"}
              label="Ready"
              delay={400}
            />
          </View>
        </View>

        <View style={dashStyles.section}><AppleWidget title="The Oracle" subtitle="AI Personal Guide" icon={Bot} color={theme.colors.plum} size="wide" delay={450} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/ai-guide')} /></View>

        <View style={dashStyles.sectionCompact}>
          <View style={dashStyles.sectionHeader}><Text style={[dashStyles.sectionTitleText, { color: theme.colors.text.primary }]}>Your Wellness Toolkit</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dashStyles.horizontalScroll} snapToInterval={154} decelerationRate="fast">
            <AppleWidget title="Journal" subtitle="Reflections" icon={BookOpen} color={theme.colors.accents.powderBlue} size="fixed" delay={500} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/journal')} />
            <AppleWidget title="Resources" subtitle="Discovery Hub" icon={Library} color={theme.colors.accents.forestGreen} size="fixed" delay={550} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/resources')} />
            <AppleWidget title="Community" subtitle="Connect" icon={Users} color={theme.colors.accents.dustyRose} size="fixed" delay={600} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/community')} />
            <AppleWidget title="Profile" subtitle="Settings" icon={Clock} color={theme.colors.accents.slate} size="fixed" delay={650} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/profile')} />
          </ScrollView>
        </View>

        <View style={dashStyles.section}>
          <Text style={[dashStyles.sectionTitleText, { color: theme.colors.text.primary }]}>Support & Safety</Text>
          <View style={[dashStyles.listContainer, { backgroundColor: theme.colors.surface, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}>
            <AppleWidget title="Wellness Journey" subtitle="View milestones" icon={TrendingUp} color={theme.colors.plum} size="list" delay={700} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/journey')} />
            <View style={[dashStyles.divider, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]} />
            <AppleWidget title="Crisis Support" subtitle="Immediate assistance" icon={ShieldAlert} color={theme.colors.accents.terracotta} size="list" delay={750} theme={theme} styles={dashStyles} onPress={() => router.push('/(tabs)/crisis')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const dashStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  bgBlob: { position: 'absolute', width: 400, height: 400, borderRadius: 200 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 24 },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionHeader: { paddingHorizontal: 24, marginBottom: 16 },
  sectionTitleText: { fontSize: 20, fontWeight: '800' },
  sectionCompact: { marginBottom: 32 },
  horizontalScroll: { paddingLeft: 24, paddingRight: 8 },
  ringsContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  ringWrap: { width: 52, height: 52, justifyContent: 'center', alignItems: 'center' },
  ringBg: { position: 'absolute' },
  ringFill: { position: 'absolute' },
  ringsCount: { fontSize: 15, fontWeight: '800', lineHeight: 18 },
  ringsLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  pulseCard: { marginBottom: 8 },
  pulseGlass: { borderRadius: 32, overflow: 'hidden', padding: 24, borderWidth: 1 },
  pulseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  pulseTitle: { fontSize: 18, fontWeight: '800' },
  pulseSubtitle: { fontSize: 13, marginTop: 2 },
  pulseGraph: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80, paddingHorizontal: 4 },
  pulseCol: { alignItems: 'center', gap: 8 },
  pulseBarBg: { width: 14, height: 60, borderRadius: 7, overflow: 'hidden', justifyContent: 'flex-end' },
  pulseBarFill: { width: '100%', borderRadius: 7 },
  pulseDayLabel: { fontSize: 11, fontWeight: '700' },
  quoteCardContainer: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  quoteCard: { borderRadius: 32, padding: 32, minHeight: 180, justifyContent: 'center', overflow: 'hidden' },
  quoteMarkContainer: { position: 'absolute', top: -20, left: 20, opacity: 0.1 },
  largeQuoteMark: { fontSize: 140, color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  quoteText: { fontSize: 17, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#FFF', lineHeight: 26, textAlign: 'center', fontStyle: 'italic', marginBottom: 16 },
  quoteAuthor: { fontSize: 10, color: 'rgba(255,255,255,0.7)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 },
  ritualsContainer: { marginHorizontal: 24, borderRadius: 32, padding: 24, marginBottom: 32, borderWidth: 1 },
  ritualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  ritualTitle: { fontSize: 18, fontWeight: '800' },
  ritualRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ritualItem: { alignItems: 'center', width: (width - 48 - 48) / 3 },
  ritualIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  checkBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', borderRadius: 10, padding: 2 },
  ritualLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  widget: { borderRadius: 28, overflow: 'hidden', borderWidth: 1 },
  widgetSquare: { aspectRatio: 1, padding: 20 },
  widgetWide: { padding: 24, minHeight: 110 },
  widgetFixed: { width: 142, aspectRatio: 1, padding: 16 },
  squareContent: { flex: 1, justifyContent: 'space-between' },
  wideContent: { flexDirection: 'row', alignItems: 'center', height: '100%' },
  widgetIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  wideTextWrap: { flex: 1, marginLeft: 16 },
  widgetTitle: { fontSize: 15, fontWeight: '800' },
  widgetSubtitle: { fontSize: 12, marginTop: 2 },
  listContainer: { borderRadius: 28, overflow: 'hidden', borderWidth: 1 },
  listWidget: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  listIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  listTextWrap: { flex: 1 },
  listTitle: { fontSize: 16, fontWeight: '800' },
  listSubtitle: { fontSize: 13 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 72 },
});
