import React, { useContext, useState, useEffect } from 'react';
import api from '../../src/services/api';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StatusBar,
  Pressable
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  GraduationCap,
  Heart,
  ClipboardEdit,
  Flame,
  Trophy,
  Award,
  CheckCircle2,
  TrendingUp,
  Settings as SettingsIcon,
  PhoneCall,
} from 'lucide-react-native';

import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

const StatsCard = ({ icon: Icon, value, label, color, theme }: any) => {
  const styles = createStyles(theme);
  return (
    <View style={styles.statsCard}>
      <View style={[styles.statsIconWrap, { backgroundColor: color + '15' }]}>
        <Icon color={color} size={20} />
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsLabel}>{label}</Text>
    </View>
  );
};

const MoodTrendBar = ({ day, score, color, theme }: any) => {
  const styles = createStyles(theme);
  return (
    <View style={styles.moodTrendCol}>
      <View style={styles.moodTrendBarBg}>
        <View style={[styles.moodTrendBarFill, { height: `${(score/10)*100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.moodTrendDay}>{day}</Text>
    </View>
  );
};

const ProfileListItem = ({ icon: Icon, title, color, theme, isLast = false, onPress, destructive = false }: any) => {
  const scale = useSharedValue(1);
  const styles = createStyles(theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.98, springConfig); };
  const handlePressOut = () => { scale.value = withSpring(1, springConfig); };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.listItem, animatedStyle]}>
        <View style={[styles.listIconWrap, { backgroundColor: destructive ? 'rgba(239, 68, 68, 0.1)' : color + (theme.isDark ? '25' : '15') }]}>
          <Icon color={destructive ? theme.colors.semantic.danger : color} size={20} />
        </View>
        <Text style={[styles.listTitle, destructive && { color: theme.colors.semantic.danger }]}>{title}</Text>
        <ChevronRight color={theme.colors.text.disabled} size={20} />
      </Animated.View>
      {!isLast && <View style={styles.divider} />}
    </Pressable>
  );
};

const ProfileListGroup = ({ children, delay, theme }: any) => {
  const styles = createStyles(theme);
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)} style={styles.listGroup}>
      {children}
    </Animated.View>
  );
};

// ─── Main Profile Screen ───────────────────────────────────────────────────

export default function ProfileScreen() {
  const { signOut, userToken, userData } = useContext(AuthContext) as any;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const isGuest = userToken?.startsWith('guest-token');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/ai/oracle-context');
        setProfile(res.data.onboarding);
      } catch (e) {
        console.error('Error fetching profile:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const userEmail = isGuest ? "Anonymous Session" : (userData?.email || "prosper@mindbridge.ai");
  const userName = profile?.firstName || userData?.name || "Prosper Asare";

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient 
          colors={theme.isDark 
            ? ['#121212', '#1A1A1A', '#0D0D0D'] 
            : ['#FDFCFB', '#F4F7F9', '#E6E9EF']
          } 
          style={StyleSheet.absoluteFillObject} 
        />
        <View style={[styles.bgBlob, { top: -80, left: -80, backgroundColor: theme.colors.plum + '08' }]} />
        <View style={[styles.bgBlob, { bottom: 0, right: -100, backgroundColor: theme.colors.accents.softMint + '05' }]} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title="My Space" 
          subtitle="Reflect on your growth and journey"
        />

        <Animated.View entering={FadeInUp.duration(600)} style={styles.headerProfile}>
          <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.9}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.avatarImage} 
            />
            <View style={styles.avatarEditBadge}>
              <Award color="#FFF" size={12} />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Manage Account</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.statsGrid}>
          <StatsCard theme={theme} icon={Flame} value="4" label="Day Streak" color={theme.colors.accents.gentlePeach} />
          <StatsCard theme={theme} icon={Trophy} value="1250" label="Points" color={theme.colors.accents.powderBlue} />
          <StatsCard theme={theme} icon={CheckCircle2} value="12" label="Seeds" color={theme.colors.accents.eucalyptus} />
          <StatsCard theme={theme} icon={Award} value="3" label="Badges" color={theme.colors.plum} />
        </Animated.View>

        {/* Mood Visualization */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <TrendingUp color={theme.colors.plum} size={18} />
            <Text style={styles.insightsTitle}>Mood Insights (7 Days)</Text>
          </View>
          <View style={styles.moodTrendContainer}>
            <MoodTrendBar theme={theme} day="M" score={8} color={theme.colors.accents.eucalyptus} />
            <MoodTrendBar theme={theme} day="T" score={6} color={theme.colors.accents.powderBlue} />
            <MoodTrendBar theme={theme} day="W" score={4} color={theme.colors.accents.softLilac} />
            <MoodTrendBar theme={theme} day="T" score={7} color={theme.colors.accents.eucalyptus} />
            <MoodTrendBar theme={theme} day="F" score={9} color={theme.colors.accents.gentlePeach} />
            <MoodTrendBar theme={theme} day="S" score={5} color={theme.colors.accents.slate} />
            <MoodTrendBar theme={theme} day="S" score={8} color={theme.colors.accents.eucalyptus} />
          </View>
        </Animated.View>

        <ProfileListGroup delay={400} theme={theme}>
          <ProfileListItem 
            theme={theme} 
            icon={User} 
            title="Identity & Personalize" 
            color={theme.colors.plum} 
          />
          <ProfileListItem 
            theme={theme} 
            icon={GraduationCap} 
            title={`${profile?.program || 'Engineering'} • Level ${profile?.level || '400'}`} 
            color={theme.colors.accents.powderBlue} 
          />
          <ProfileListItem 
            theme={theme} 
            icon={Heart} 
            title={`${profile?.communicationStyle || 'Gentle'} • ${profile?.preferredLanguage || 'English'}`} 
            color={theme.colors.accents.dustyRose} 
            isLast 
          />
        </ProfileListGroup>

        {/* Crisis & Support — always pinned (MindDoc pattern) */}
        <Animated.View entering={FadeInUp.delay(500)} style={[
          styles.listGroup,
          {
            borderWidth: 1.5,
            borderColor: theme.isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
            backgroundColor: theme.isDark ? 'rgba(239,68,68,0.05)' : 'rgba(255,241,241,0.8)',
          }
        ]}>
          <ProfileListItem
            theme={theme}
            icon={PhoneCall}
            title="Crisis Hotline & Support"
            color="#EF4444"
            isLast
            onPress={() => router.push('/(tabs)/crisis')}
          />
        </Animated.View>

        <ProfileListGroup delay={600} theme={theme}>
          <ProfileListItem theme={theme} icon={Bell} title="Reminders" color={theme.colors.accents.softMint} />
          <ProfileListItem theme={theme} icon={Shield} title="Privacy & Security" color={theme.colors.accents.slate} />
          <ProfileListItem theme={theme} icon={HelpCircle} title="Help Center" color={theme.colors.text.secondary} />
          <ProfileListItem 
            theme={theme}
            icon={LogOut} 
            title={isGuest ? "End Session" : "Sign Out"} 
            color={theme.colors.text.secondary} 
            destructive 
            isLast 
            onPress={() => {
              signOut();
              router.replace('/(auth)/welcome');
            }}
          />
        </ProfileListGroup>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  bgBlob: { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.5 },
  headerProfile: { alignItems: 'center', marginBottom: 32, paddingHorizontal: 20 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.surface, padding: 4, shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10, marginBottom: 16 },
  avatarImage: { width: '100%', height: '100%', borderRadius: 46 },
  avatarEditBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: theme.colors.plum, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: theme.colors.surface },
  userName: { fontSize: 24, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, marginBottom: 4 },
  userEmail: { fontSize: 14, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, marginBottom: 20 },
  editBtn: { backgroundColor: theme.colors.plum + '10', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  editBtnText: { color: theme.colors.plum, fontFamily: theme.typography.fonts.header, fontSize: 13 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24, paddingHorizontal: 20 },
  statsCard: { width: '48%', backgroundColor: theme.colors.surface, padding: 20, borderRadius: 28, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  statsIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statsValue: { fontSize: 20, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  statsLabel: { fontSize: 12, fontFamily: theme.typography.fonts.body, color: theme.colors.text.tertiary, marginTop: 2 },
  insightsCard: { backgroundColor: theme.colors.surface, padding: 24, borderRadius: 32, marginBottom: 24, marginHorizontal: 20, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  insightsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  insightsTitle: { fontSize: 17, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  moodTrendContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  moodTrendCol: { alignItems: 'center', gap: 8 },
  moodTrendBarBg: { width: 8, height: 80, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 4, justifyContent: 'flex-end' },
  moodTrendBarFill: { width: '100%', borderRadius: 4 },
  moodTrendDay: { fontSize: 10, fontFamily: theme.typography.fonts.header, color: theme.colors.text.tertiary },
  listGroup: { backgroundColor: theme.colors.surface, borderRadius: 32, marginBottom: 24, marginHorizontal: 20, overflow: 'hidden', borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: theme.colors.surface },
  listIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  listTitle: { flex: 1, fontSize: 16, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, letterSpacing: -0.3 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginLeft: 72 },
});

