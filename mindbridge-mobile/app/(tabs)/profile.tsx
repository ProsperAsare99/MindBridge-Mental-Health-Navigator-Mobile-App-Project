import React, { useContext } from 'react';
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
  TrendingUp
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

export default function ProfileScreen() {
  const { signOut, userToken, userData } = useContext(AuthContext) as any;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const themeContext = useTheme();
  const styles = createStyles(themeContext);

  const isGuest = userToken?.startsWith('guest-token');
  const userEmail = isGuest ? "Anonymous Session" : (userData?.email || "prosper@mindbridge.ai");
  const userName = isGuest ? "Explorer" : (userData?.name || "Prosper Asare");

  return (
    <View style={styles.container}>
      <StatusBar barStyle={themeContext.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={themeContext.isDark 
          ? ['rgba(123, 97, 255, 0.15)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
          : ['rgba(123, 97, 255, 0.12)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
        } 
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.statsGrid}>
          <StatsCard theme={themeContext} icon={Flame} value="4" label="Streak" color={themeContext.colors.accents.gentlePeach} />
          <StatsCard theme={themeContext} icon={Trophy} value="1250" label="Points" color={themeContext.colors.accents.powderBlue} />
          <StatsCard theme={themeContext} icon={CheckCircle2} value="12" label="Done" color={themeContext.colors.accents.eucalyptus} />
          <StatsCard theme={themeContext} icon={Award} value="3" label="Badges" color={themeContext.colors.plum} />
        </Animated.View>

        {/* Mood Visualization */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <TrendingUp color={themeContext.colors.plum} size={18} />
            <Text style={styles.insightsTitle}>Mood Trends (7 Days)</Text>
          </View>
          <View style={styles.moodTrendContainer}>
            <MoodTrendBar theme={themeContext} day="M" score={8} color={themeContext.colors.accents.eucalyptus} />
            <MoodTrendBar theme={themeContext} day="T" score={6} color={themeContext.colors.accents.powderBlue} />
            <MoodTrendBar theme={themeContext} day="W" score={4} color={themeContext.colors.accents.softLilac} />
            <MoodTrendBar theme={themeContext} day="T" score={7} color={themeContext.colors.accents.eucalyptus} />
            <MoodTrendBar theme={themeContext} day="F" score={9} color={themeContext.colors.accents.gentlePeach} />
            <MoodTrendBar theme={themeContext} day="S" score={5} color={themeContext.colors.accents.slate} />
            <MoodTrendBar theme={themeContext} day="S" score={8} color={themeContext.colors.accents.eucalyptus} />
          </View>
        </Animated.View>

        {/* Onboarding Resume Banner */}
        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.resumeBanner}>
          <View style={styles.resumeBannerIcon}>
            <ClipboardEdit color={themeContext.colors.plum} size={24} />
          </View>
          <View style={styles.resumeBannerContent}>
            <Text style={styles.resumeBannerTitle}>Complete Setup</Text>
            <Text style={styles.resumeBannerSubtitle}>Finish onboarding for personalized support.</Text>
          </View>
          <TouchableOpacity 
            style={styles.resumeBannerBtn}
            onPress={() => router.push('/(auth)/onboarding')}
          >
            <Text style={styles.resumeBannerBtnText}>Resume</Text>
          </TouchableOpacity>
        </Animated.View>

        <ProfileListGroup delay={400} theme={themeContext}>
          <ProfileListItem theme={themeContext} icon={User} title="Personal Information" color={themeContext.colors.plum} />
          <ProfileListItem theme={themeContext} icon={GraduationCap} title="Academic Context" color={themeContext.colors.accents.powderBlue} />
          <ProfileListItem theme={themeContext} icon={Heart} title="Support Preferences" color={themeContext.colors.accents.terracotta} isLast />
        </ProfileListGroup>

        <ProfileListGroup delay={500} theme={themeContext}>
          <ProfileListItem theme={themeContext} icon={Bell} title="Notifications" color={themeContext.colors.accents.softMint} />
          <ProfileListItem theme={themeContext} icon={Shield} title="Privacy & Security" color={themeContext.colors.accents.slate} isLast />
        </ProfileListGroup>

        <ProfileListGroup delay={600} theme={themeContext}>
          <ProfileListItem theme={themeContext} icon={HelpCircle} title="Help & Support" color={themeContext.colors.text.secondary} />
          <ProfileListItem 
            theme={themeContext}
            icon={LogOut} 
            title={isGuest ? "End Session" : "Log Out"} 
            color={themeContext.colors.text.secondary} 
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
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerProfile: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    padding: 4,
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.isDark ? 0.3 : 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.plum,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    marginBottom: 20,
  },
  editBtn: {
    backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.1)' : 'rgba(123, 97, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editBtnText: {
    color: theme.colors.plum,
    fontWeight: '800',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  statsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  statsLabel: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    fontWeight: '600',
    marginTop: 2,
  },
  insightsCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 28,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  moodTrendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: 4,
  },
  moodTrendCol: {
    alignItems: 'center',
    gap: 8,
  },
  moodTrendBarBg: {
    width: 8,
    height: 80,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  moodTrendBarFill: {
    width: '100%',
    borderRadius: 4,
  },
  moodTrendDay: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.tertiary,
  },
  resumeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.1)' : 'rgba(123, 97, 255, 0.08)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(140, 160, 185, 0.15)' : 'rgba(123, 97, 255, 0.15)',
  },
  resumeBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginRight: 16,
  },
  resumeBannerContent: {
    flex: 1,
  },
  resumeBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  resumeBannerSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  resumeBannerBtn: {
    backgroundColor: theme.colors.plum,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  resumeBannerBtnText: {
    color: theme.colors.text.onPrimary || '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  listGroup: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  listIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    marginLeft: 68, 
  },
});
