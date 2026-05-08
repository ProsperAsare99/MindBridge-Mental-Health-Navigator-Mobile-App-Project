import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  Pressable
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
  Sparkles,
  BookOpen,
  ClipboardList,
  Library,
  ShieldAlert,
  Users,
  Settings,
  Bot,
  Wind,
  ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Apple-inspired spring configuration
const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
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
