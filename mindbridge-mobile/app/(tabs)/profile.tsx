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
  ClipboardEdit
} from 'lucide-react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

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
  const { signOut, userToken } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const themeContext = useTheme();
  const styles = createStyles(themeContext);

  const isGuest = userToken?.startsWith('guest-token');

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
        <Animated.View entering={FadeInUp.duration(600).duration(500)} style={styles.headerProfile}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.avatarImage} 
            />
          </View>
          <Text style={styles.userName}>{isGuest ? "Explorer" : "Prosper Shaibu Asare"}</Text>
          <Text style={styles.userEmail}>{isGuest ? "Anonymous Session" : "anna@example.com"}</Text>
          
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Onboarding Resume Banner */}
        <Animated.View entering={FadeInUp.delay(50).duration(500)} style={styles.resumeBanner}>
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

        <ProfileListGroup delay={100} theme={themeContext}>
          <ProfileListItem theme={themeContext} icon={User} title="Personal Information" color={themeContext.colors.plum} />
          <ProfileListItem theme={themeContext} icon={GraduationCap} title="Academic Context" color={themeContext.colors.accents.powderBlue} />
          <ProfileListItem theme={themeContext} icon={Heart} title="Support Preferences" color={themeContext.colors.accents.terracotta} isLast />
        </ProfileListGroup>

        <ProfileListGroup delay={200} theme={themeContext}>
          <ProfileListItem theme={themeContext} icon={Bell} title="Notifications" color={themeContext.colors.accents.softMint} />
          <ProfileListItem theme={themeContext} icon={Shield} title="Privacy & Security" color={themeContext.colors.accents.slate} isLast />
        </ProfileListGroup>

        <ProfileListGroup delay={300} theme={themeContext}>
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
    marginBottom: 40,
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
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
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
