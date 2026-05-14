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
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  Quote,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ClipboardList,
  Library,
  ShieldAlert,
  Users,
  Settings,
  Bot,
  Leaf,
  Wind,
  ChevronRight
} from 'lucide-react-native';
import { translations, Language, TranslationSchema } from '../../src/utils/translations';
import { ScreenHeader } from '../../src/components/ScreenHeader';

const { width } = Dimensions.get('window');

const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

// ─── Quote Slideshow ────────────────────────────────────────────────────────

const QUOTES = [
  { text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
  { text: "There is hope, even when your brain tells you there isn’t.", author: "John Green" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
];

const QuoteSlideshow = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const quote = QUOTES[index];

  return (
    <Animated.View entering={FadeInUp.delay(50).duration(500)} style={styles.quoteCardContainer}>
      <LinearGradient 
        colors={[theme.colors.plum, theme.isDark ? '#2E3A4A' : '#4A3E4F']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quoteCard}
      >
        <View style={styles.quoteMarkContainer}>
          <Text style={styles.largeQuoteMark}>“</Text>
        </View>
        <Animated.View key={index} entering={FadeIn.duration(1000)}>
          <Text style={styles.quoteText}>{quote.text}</Text>
          <Text style={styles.quoteAuthor}>{quote.author}</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

// ─── Apple Widget ───────────────────────────────────────────────────────────

type WidgetProps = {
  title: string;
  subtitle?: string;
  icon: any;
  color: string;
  onPress: () => void;
  size?: 'wide' | 'square' | 'list' | 'fixed';
  delay?: number;
};

const AppleWidget = ({ title, subtitle, icon: Icon, color, onPress, size = 'square', delay = 0 }: WidgetProps) => {
  const scale = useSharedValue(1);
  const theme = useTheme();
  const styles = createStyles(theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.96, springConfig); };
  const handlePressOut = () => { scale.value = withSpring(1, springConfig); };

  if (size === 'list') {
    return (
      <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={[styles.listWidget, animatedStyle]}>
            <View style={[styles.listIconWrap, { backgroundColor: color + (theme.isDark ? '30' : '15') }]}>
              <Icon color={color} size={22} />
            </View>
            <View style={styles.listTextWrap}>
              <Text style={styles.listTitle}>{title}</Text>
              {subtitle && <Text style={styles.listSubtitle}>{subtitle}</Text>}
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
    <Animated.View 
      entering={FadeInUp.delay(delay).duration(500)} 
      style={isWide ? { width: '100%' } : (isFixed ? { width: 140, marginRight: 12 } : { width: '47.5%' })}
    >
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[styles.widget, isWide ? styles.widgetWide : (isFixed ? styles.widgetFixed : styles.widgetSquare), animatedStyle]}>
          <View style={isWide ? styles.wideContent : styles.squareContent}>
            <View style={[styles.widgetIconWrap, { backgroundColor: color }]}>
              <Icon color={'#FFF'} size={isWide ? 22 : 24} />
            </View>
            <View style={isWide ? styles.wideTextWrap : { marginTop: 12 }}>
              <Text style={styles.widgetTitle} numberOfLines={1}>{title}</Text>
              {subtitle && <Text style={styles.widgetSubtitle} numberOfLines={1}>{subtitle}</Text>}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

// ─── Ritual Item ────────────────────────────────────────────────────────────

const RitualItem = ({ label, done, icon: Icon, color, theme, onPress }: any) => {
  const styles = createStyles(theme);
  return (
    <TouchableOpacity style={styles.ritualItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.ritualIconCircle, { backgroundColor: done ? color : (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') }]}>
        <Icon color={done ? '#FFF' : theme.colors.text.disabled} size={24} />
        {done && (
          <View style={styles.checkBadge}>
            <CheckCircle2 color="#FFF" size={12} fill={color} />
          </View>
        )}
      </View>
      <Text style={[styles.ritualLabel, done && { color: theme.colors.text.primary }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// ─── Dashboard Screen ────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { userToken, userData: authData } = useContext(AuthContext) as any;
  
  const [rituals, setRituals] = useState({ garden: false, journal: false, breathing: false });
  const [userData, setUserData] = useState({
    name: authData?.name || 'Friend',
    language: 'English' as Language
  });

  const t: TranslationSchema = translations[userData.language] || translations.English;

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const todayStr = new Date().toDateString();
        const res = await api.get('/ai/oracle-context');
        const { latestMood, recentJournal } = res.data;
        
        setRituals({
          garden: latestMood && new Date(latestMood.createdAt).toDateString() === todayStr,
          journal: recentJournal && recentJournal.some((log: any) => new Date(log.createdAt).toDateString() === todayStr),
          breathing: await AsyncStorage.getItem(`breathing_${todayStr}`) === 'true'
        });

        if (res.data.onboarding?.firstName) {
          setUserData(prev => ({ ...prev, name: res.data.onboarding.firstName }));
        }
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
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={theme.isDark 
            ? ['#121212', '#1A1A1A', '#0D0D0D'] 
            : ['#FDFCFB', '#F4F7F9', '#E6E9EF']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.bgBlob, { top: -50, right: -50, backgroundColor: theme.colors.plum + '08' }]} />
        <View style={[styles.bgBlob, { bottom: 100, left: -50, backgroundColor: theme.colors.accents.powderBlue + '05' }]} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader 
          title={`${getGreeting()}, ${userData.name}`}
          subtitle="How can we nurture your peace today?"
        />

        <View style={styles.section}>
          <QuoteSlideshow />
        </View>

        <Animated.View entering={FadeInUp.delay(100)} style={styles.ritualsContainer}>
          <View style={styles.ritualHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Leaf color={theme.colors.plum} size={20} strokeWidth={2.5} />
              <Text style={styles.ritualTitle}>{t.dashboard.nurtureTitle}</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.ritualProgress}>{Object.values(rituals).filter(Boolean).length}/3</Text>
            </View>
          </View>
          
          <View style={styles.ritualRow}>
            <RitualItem label="Mood Seed" done={rituals.garden} icon={Leaf} color={theme.colors.accents.eucalyptus} theme={theme} onPress={() => router.push('/(tabs)/garden')} />
            <RitualItem label="Reflect" done={rituals.journal} icon={BookOpen} color={theme.colors.accents.powderBlue} theme={theme} onPress={() => router.push('/(tabs)/journal')} />
            <RitualItem label="Breathe" done={rituals.breathing} icon={Wind} color={theme.colors.accents.softLilac} theme={theme} onPress={() => router.push('/breathing')} />
          </View>
        </Animated.View>

        <View style={styles.section}>
          <AppleWidget title={t.ai.title} subtitle={t.ai.subtitle} icon={Bot} color={theme.colors.plum} size="wide" delay={150} onPress={() => router.push('/(tabs)/ai-guide')} />
        </View>

        <View style={styles.sectionCompact}>
          <Text style={styles.sectionTitle}>{t.dashboard.toolsTitle}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll} snapToInterval={152} decelerationRate="fast">
            <AppleWidget title="Assessments" subtitle="Daily check" icon={ClipboardList} color={theme.colors.accents.slate} size="fixed" delay={200} onPress={() => router.push('/(tabs)/assessments')} />
            <AppleWidget title="Resources" subtitle="Library" icon={Library} color={theme.colors.accents.forestGreen} size="fixed" delay={300} onPress={() => router.push('/(tabs)/resources')} />
            <AppleWidget title="Community" subtitle="Connect" icon={Users} color={theme.colors.accents.dustyRose} size="fixed" delay={400} onPress={() => router.push('/(tabs)/community')} />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.dashboard.supportTitle}</Text>
          <View style={styles.listContainer}>
            <AppleWidget title="Wellness Journey" subtitle="Your personalized roadmap" icon={Clock} color={theme.colors.plum} size="list" delay={500} onPress={() => router.push('/(tabs)/journey')} />
            <View style={styles.divider} />
            <AppleWidget title="Crisis Support" subtitle="Immediate assistance 24/7" icon={ShieldAlert} color={theme.colors.accents.terracotta} size="list" delay={600} onPress={() => router.push('/(tabs)/crisis')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  bgBlob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.6 },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 20, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, marginBottom: 16, paddingHorizontal: 24 },
  sectionCompact: { marginBottom: 32 },
  horizontalScroll: { paddingLeft: 24, paddingRight: 8 },
  quoteCardContainer: { shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  quoteCard: { borderRadius: 32, padding: 32, minHeight: 200, justifyContent: 'center', overflow: 'hidden' },
  quoteMarkContainer: { position: 'absolute', top: -20, left: 20, opacity: 0.1 },
  largeQuoteMark: { fontSize: 140, color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  quoteText: { fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#FFF', lineHeight: 28, textAlign: 'center', fontStyle: 'italic', marginBottom: 16 },
  quoteAuthor: { fontSize: 11, fontFamily: theme.typography.fonts.header, color: 'rgba(255,255,255,0.7)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 },
  ritualsContainer: { marginHorizontal: 24, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  ritualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  ritualTitle: { fontSize: 18, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  progressBadge: { backgroundColor: theme.colors.plum + '15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  ritualProgress: { fontSize: 13, fontFamily: theme.typography.fonts.header, color: theme.colors.plum },
  ritualRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ritualItem: { alignItems: 'center', width: (width - 48 - 48) / 3 },
  ritualIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  checkBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', borderRadius: 10, padding: 2 },
  ritualLabel: { fontSize: 11, fontFamily: theme.typography.fonts.header, color: theme.colors.text.tertiary, textAlign: 'center' },
  widget: { borderRadius: 28, overflow: 'hidden', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  widgetSquare: { aspectRatio: 1, padding: 20 },
  widgetWide: { padding: 24, minHeight: 110 },
  widgetFixed: { width: 140, aspectRatio: 1, padding: 16 },
  squareContent: { flex: 1, justifyContent: 'space-between' },
  wideContent: { flexDirection: 'row', alignItems: 'center', height: '100%' },
  widgetIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  wideTextWrap: { flex: 1, marginLeft: 16 },
  widgetTitle: { fontSize: 15, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  widgetSubtitle: { fontSize: 12, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, marginTop: 2 },
  listContainer: { backgroundColor: theme.colors.surface, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
  listWidget: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  listIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  listTextWrap: { flex: 1 },
  listTitle: { fontSize: 16, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  listSubtitle: { fontSize: 13, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginLeft: 72 },
});
