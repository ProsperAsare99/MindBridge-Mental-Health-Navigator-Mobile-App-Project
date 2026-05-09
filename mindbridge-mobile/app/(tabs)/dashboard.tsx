import React, { useContext, useState, useEffect } from 'react';
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
  Platform
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
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
  BookOpen,
  ClipboardList,
  Library,
  ShieldAlert,
  Users,
  Settings,
  Bot,
  Wind,
  ChevronRight,
  Quote
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Apple-inspired spring configuration
const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

// ─── Quote Slideshow Component ──────────────────────────────────────────────

const QUOTES = [
  { text: "What mental health needs is more sunlight, more candor, and more unashamed conversation.", author: "Glenn Close" },
  { text: "There is hope, even when your brain tells you there isn’t.", author: "John Green" },
  { text: "You don’t have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Deep breathing is our nervous system’s love language.", author: "Dr. Lauren Fogel Mersy" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Courage doesn't always roar. Sometimes courage is the little voice at the end of the day saying I'll try again tomorrow.", author: "Mary Anne Radmacher" },
  { text: "You alone are enough. You have nothing to prove to anybody.", author: "Maya Angelou" },
  { text: "The only journey is the journey within.", author: "Rainer Maria Rilke" },
  { text: "Not until we are lost do we begin to understand ourselves.", author: "Henry David Thoreau" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" }
];

const QuoteSlideshow = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const quote = QUOTES[index];

  return (
    <Animated.View entering={FadeInUp.delay(50).springify().damping(14)} style={styles.quoteCardContainer}>
      <LinearGradient 
        colors={[theme.colors.plum, '#4A3E4F']} 
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

// ─── Apple-Inspired Widget Component ─────────────────────────────────────────

type WidgetProps = {
  title: string;
  subtitle?: string;
  icon: any;
  color: string;
  onPress: () => void;
  size?: 'wide' | 'square' | 'list';
  delay?: number;
};

const AppleWidget = ({ title, subtitle, icon: Icon, color, onPress, size = 'square', delay = 0 }: WidgetProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  if (size === 'list') {
    return (
      <Animated.View entering={FadeInUp.delay(delay).springify().damping(14)}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={[styles.listWidget, animatedStyle]}>
            <View style={[styles.listIconWrap, { backgroundColor: color + '15' }]}>
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

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify().damping(14)} style={isWide ? { width: '100%' } : { width: (width - 48 - 16) / 2 }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.widget, isWide ? styles.widgetWide : styles.widgetSquare, animatedStyle]}>
          <LinearGradient colors={[color + '10', color + '03']} style={StyleSheet.absoluteFillObject} />

          <View style={isWide ? styles.wideContent : styles.squareContent}>
            <View style={[styles.widgetIconWrap, { backgroundColor: color }]}>
              <Icon color={theme.colors.surface} size={isWide ? 24 : 28} />
            </View>
            <View style={isWide ? styles.wideTextWrap : {}}>
              <Text style={[styles.widgetTitle, isWide && { fontSize: 18 }]}>{title}</Text>
              {subtitle && <Text style={[styles.widgetSubtitle, isWide && { fontSize: 14 }]} numberOfLines={2}>{subtitle}</Text>}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { signOut, userToken } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isGuest = userToken?.startsWith('guest-token');
  const userData = {
    name: isGuest ? "Explorer" : "Prosper",
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary, theme.colors.backgroundSecondary]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Apple-style Header */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.dateText}>{userData.date.toUpperCase()}</Text>
            <Text style={styles.greetingText}>{getGreeting()},{'\n'}{userData.name}.</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.profileBtn}>
            <Image source={require('../../assets/images/logo.png')} style={styles.avatar} />
          </TouchableOpacity>
        </Animated.View>

        {/* Daily Reflection Slideshow */}
        <View style={styles.section}>
          <QuoteSlideshow />
        </View>

        {/* AI Guide Hero Widget */}
        <View style={styles.section}>
          <AppleWidget
            title="Personalized AI Guide"
            subtitle="Your private 24/7 safe space for mental well-being."
            icon={Bot}
            color={theme.colors.plum}
            size="wide"
            delay={100}
            onPress={() => router.push('/(tabs)/ai-guide')}
          />
        </View>

        {/* Core Tools Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Tools</Text>
          <View style={styles.grid}>
            <AppleWidget
              title="Mood Tracker"
              subtitle="Log feelings"
              icon={Wind}
              color={theme.colors.accents.eucalyptus}
              delay={200}
              onPress={() => router.push('/(tabs)/garden')}
            />
            <AppleWidget
              title="Journal"
              subtitle="Reflect"
              icon={BookOpen}
              color={theme.colors.accents.powderBlue}
              delay={300}
              onPress={() => router.push('/(tabs)/journal')}
            />
            <AppleWidget
              title="Assessments"
              subtitle="Check in"
              icon={ClipboardList}
              color={theme.colors.accents.slate}
              delay={400}
              onPress={() => router.push('/(tabs)/assessments')}
            />
            <AppleWidget
              title="Resources"
              subtitle="Learn"
              icon={Library}
              color={theme.colors.accents.forestGreen}
              delay={500}
              onPress={() => router.push('/(tabs)/resources')}
            />
          </View>
        </View>

        {/* Support & Community Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & More</Text>
          <View style={styles.listContainer}>
            <AppleWidget
              title="Crisis Support"
              subtitle="Immediate help and helplines"
              icon={ShieldAlert}
              color={theme.colors.accents.terracotta}
              size="list"
              delay={600}
              onPress={() => router.push('/(tabs)/crisis')}
            />
            <View style={styles.divider} />
            <AppleWidget
              title="Support Community"
              subtitle="Connect with peers anonymously"
              icon={Users}
              color={theme.colors.plum}
              size="list"
              delay={700}
              onPress={() => router.push('/(tabs)/community')}
            />
            <View style={styles.divider} />
            <AppleWidget
              title="Settings"
              subtitle="App preferences"
              icon={Settings}
              color={theme.colors.text.secondary}
              size="list"
              delay={800}
              onPress={() => router.push('/(tabs)/settings')}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    letterSpacing: 1,
    marginBottom: 4
  },
  greetingText: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -1,
    lineHeight: 40
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  avatar: {
    width: '100%',
    height: '100%'
  },
  quoteCardContainer: {
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  quoteCard: {
    borderRadius: 24,
    padding: 28,
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180, 
    overflow: 'hidden',
    position: 'relative',
  },
  quoteMarkContainer: {
    position: 'absolute',
    top: -20,
    left: 20,
    opacity: 0.15,
  },
  largeQuoteMark: {
    fontSize: 120,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  quoteText: {
    fontSize: 19,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
    letterSpacing: -0.5
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16
  },
  widget: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)'
  },
  widgetSquare: {
    aspectRatio: 1,
    padding: 20,
  },
  widgetWide: {
    padding: 24,
  },
  squareContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  wideContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  widgetIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wideTextWrap: {
    flex: 1,
    marginLeft: 16,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  widgetSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: 4,
    lineHeight: 18,
  },
  listContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  listWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  listIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listTextWrap: {
    flex: 1,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  listSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 72, // Aligns with text
  }
});
