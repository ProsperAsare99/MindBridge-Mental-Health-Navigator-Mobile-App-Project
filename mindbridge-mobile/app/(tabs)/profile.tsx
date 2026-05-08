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
import { theme } from '../../src/theme/colors';
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
  Heart
} from 'lucide-react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

const ProfileListItem = ({ icon: Icon, title, color, isLast = false, onPress, destructive = false }: any) => {
  const scale = useSharedValue(1);

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
        <View style={[styles.listIconWrap, { backgroundColor: destructive ? 'rgba(239, 68, 68, 0.1)' : color + '15' }]}>
          <Icon color={destructive ? theme.colors.semantic.danger : color} size={20} />
        </View>
        <Text style={[styles.listTitle, destructive && { color: theme.colors.semantic.danger }]}>{title}</Text>
        <ChevronRight color={theme.colors.text.disabled} size={20} />
      </Animated.View>
      {!isLast && <View style={styles.divider} />}
    </Pressable>
  );
};

const ProfileListGroup = ({ children, delay }: any) => (
  <Animated.View entering={FadeInUp.delay(delay).springify().damping(14)} style={styles.listGroup}>
    {children}
  </Animated.View>
);

export default function ProfileScreen() {
  const { signOut, userToken } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const isGuest = userToken?.startsWith('guest-token');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['rgba(123, 97, 255, 0.12)', theme.colors.background, theme.colors.backgroundSecondary]} 
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(600).springify().damping(14)} style={styles.headerProfile}>
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

        <ProfileListGroup delay={100}>
          <ProfileListItem icon={User} title="Personal Information" color={theme.colors.plum} />
          <ProfileListItem icon={GraduationCap} title="Academic Context" color={theme.colors.accents.powderBlue} />
          <ProfileListItem icon={Heart} title="Support Preferences" color={theme.colors.accents.terracotta} isLast />
        </ProfileListGroup>

        <ProfileListGroup delay={200}>
          <ProfileListItem icon={Bell} title="Notifications" color={theme.colors.accents.softMint} />
          <ProfileListItem icon={Shield} title="Privacy & Security" color={theme.colors.accents.slate} isLast />
        </ProfileListGroup>

        <ProfileListGroup delay={300}>
          <ProfileListItem icon={HelpCircle} title="Help & Support" color={theme.colors.text.secondary} />
          <ProfileListItem 
            icon={LogOut} 
            title={isGuest ? "End Session" : "Log Out"} 
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

const styles = StyleSheet.create({
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
    shadowOpacity: 0.15,
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
    backgroundColor: 'rgba(123, 97, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editBtnText: {
    color: theme.colors.plum,
    fontWeight: '800',
    fontSize: 14,
  },
  listGroup: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 68, 
  },
});
