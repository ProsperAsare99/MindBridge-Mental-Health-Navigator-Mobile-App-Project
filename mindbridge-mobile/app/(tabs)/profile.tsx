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
  Pressable,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring, FadeIn, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
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
  X,
  Camera,
  ShieldAlert,
  Phone,
  Mic
} from 'lucide-react-native';

import { AuthContext } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';

const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

const UNIVERSITIES = [
  "KNUST",
  "University of Ghana (UG)",
  "University of Cape Coast (UCC)",
  "Ashesi University",
  "Academic City",
  "Lancaster University Ghana",
  "Valley View University",
  "UPSA",
  "GIMPA",
  "Other"
];

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
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = theme;
  const router = useRouter();
  const { signOut, userToken, userData, userData: authData } = useContext(AuthContext) as any;
  const styles = createStyles(theme);

  const isGuest = userToken?.startsWith('guest-token');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showUniPicker, setShowUniPicker] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/profile');
      setProfile(res.data);
      setEditData({
        name: res.data.name,
        phoneNumber: res.data.phoneNumber,
        studentId: res.data.studentId,
        university: res.data.onboarding?.university,
        program: res.data.onboarding?.program,
        level: res.data.onboarding?.level,
      });
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await api.get('/mood/insights');
      setInsights(res.data);
    } catch (e) {}
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      try {
        await api.put('/profile', { profileImage: selectedUri });
        setProfile((prev: any) => ({ ...prev, profileImage: selectedUri }));
      } catch (e) {
        Alert.alert('Error', 'Could not upload image');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put('/profile', editData);
      setIsEditing(false);
      fetchProfile();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (e) {
      Alert.alert('Error', 'Could not update profile');
    }
  };

  const handleLogout = () => {
    signOut();
    router.replace('/(auth)/welcome');
  };

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
          title={t('profile.title')} 
          subtitle={t('profile.subtitle')}
        />

        <Animated.View entering={FadeInUp.duration(600)} style={styles.headerProfile}>
          <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.9} onPress={pickImage}>
            {profile?.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarImage, { backgroundColor: theme.colors.plum + '20', alignItems: 'center', justifyContent: 'center' }]}>
                <User color={theme.colors.plum} size={48} />
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Award color="#FFF" size={12} />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{profile?.name || userData?.name}</Text>
          <Text style={styles.userEmail}>{isGuest ? "Guest User" : profile?.email}</Text>
          
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8} onPress={() => setIsEditing(true)}>
            <Text style={styles.editBtnText}>{t('profile.edit_profile')}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.statsGrid}>
          <StatsCard theme={theme} icon={Flame} value={profile?.stats?.streak || "0"} label={t('profile.stats_streak')} color={theme.colors.accents.gentlePeach} />
          <StatsCard theme={theme} icon={Trophy} value={profile?.stats?.points || "0"} label={t('profile.stats_points')} color={theme.colors.accents.powderBlue} />
          <StatsCard theme={theme} icon={CheckCircle2} value={profile?.stats?.seeds || "0"} label={t('profile.stats_seeds')} color={theme.colors.accents.eucalyptus} />
          <StatsCard theme={theme} icon={Award} value={profile?.stats?.badges || "0"} label={t('profile.stats_badges')} color={theme.colors.plum} />
        </Animated.View>

        {/* Mood Visualization */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.insightsCard}>
          <View style={styles.insightsHeader}>
            <TrendingUp color={theme.colors.plum} size={18} />
            <Text style={styles.insightsTitle}>{t('profile.mood_insights')}</Text>
          </View>
          <View style={styles.moodTrendContainer}>
            {(insights?.trend || Array.from({length: 7}).map((_, i) => ({day: ['M','T','W','T','F','S','S'][i], score: 0}))).map((item: any, i: number) => (
              <MoodTrendBar 
                key={i}
                theme={theme} 
                day={item.day} 
                score={item.score} 
                color={item.score > 7 ? theme.colors.accents.eucalyptus : item.score > 4 ? theme.colors.accents.powderBlue : theme.colors.accents.softLilac} 
              />
            ))}
          </View>
          
          {insights?.hasData && (
            <View style={styles.correlationGrid}>
              <View style={[styles.correlationCard, { backgroundColor: theme.colors.accents.gentlePeach + '10' }]}>
                <Heart size={16} color={theme.colors.accents.gentlePeach} />
                <Text style={styles.correlationVal}>{insights.bestSocialSetting?.setting || 'N/A'}</Text>
                <Text style={styles.correlationLab}>Best Social Setting</Text>
              </View>
              <View style={[styles.correlationCard, { backgroundColor: theme.colors.accents.powderBlue + '10' }]}>
                <Mic size={16} color={theme.colors.accents.powderBlue} />
                <Text style={styles.correlationVal}>{insights.voiceJournals || '0'}</Text>
                <Text style={styles.correlationLab}>Voice Reflections</Text>
              </View>
            </View>
          )}
        </Animated.View>

        <ProfileListGroup delay={400} theme={theme}>
          <View style={styles.sectionLabelRow}>
            <User size={14} color={theme.colors.text.tertiary} />
            <Text style={styles.sectionLabel}>{t('profile.identity_personal')}</Text>
          </View>
          <ProfileListItem 
            theme={theme} 
            icon={PhoneCall} 
            title={profile?.phoneNumber || "Add Phone Number"} 
            color={theme.colors.plum} 
          />
          <ProfileListItem 
            theme={theme} 
            icon={Mail} 
            title={profile?.email} 
            color={theme.colors.accents.powderBlue} 
          />
          <ProfileListItem 
            theme={theme} 
            icon={Heart} 
            title={`${profile?.onboarding?.communicationStyle || 'Gentle'} Style • ${profile?.onboarding?.preferredLanguage || 'English'}`} 
            color={theme.colors.accents.dustyRose} 
            isLast 
          />
        </ProfileListGroup>

        <ProfileListGroup delay={500} theme={theme}>
          <View style={styles.sectionLabelRow}>
            <ShieldAlert size={14} color={theme.colors.semantic.danger} />
            <Text style={[styles.sectionLabel, { color: theme.colors.semantic.danger }]}>{t('profile.crisis_support')}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.crisisCard, { backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }]}
            onPress={() => router.push('/(tabs)/crisis')}
          >
            <View style={[styles.crisisIconWrap, { backgroundColor: theme.colors.semantic.danger }]}>
              <Phone size={20} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.crisisTitle}>Emergency Hotline</Text>
              <Text style={styles.crisisSubtitle}>Tap for immediate mental health support</Text>
            </View>
            <ChevronRight color={theme.colors.semantic.danger} size={20} />
          </TouchableOpacity>
        </ProfileListGroup>

        <ProfileListGroup delay={600} theme={theme}>
          <View style={styles.sectionLabelRow}>
            <GraduationCap size={14} color={theme.colors.text.tertiary} />
            <Text style={styles.sectionLabel}>{t('profile.academic_info')}</Text>
          </View>
          <ProfileListItem 
            theme={theme} 
            icon={GraduationCap} 
            title={profile?.onboarding?.university || "University not set"} 
            color={theme.colors.accents.powderBlue} 
          />
          <ProfileListItem 
            theme={theme} 
            icon={ClipboardEdit} 
            title={`${profile?.onboarding?.program || 'Program'} • Level ${profile?.onboarding?.level || 'N/A'}`} 
            color={theme.colors.accents.eucalyptus} 
          />
          <ProfileListItem 
            theme={theme} 
            icon={Shield} 
            title={`ID: ${profile?.studentId || 'Not provided'}`} 
            color={theme.colors.accents.slate} 
            isLast
          />
        </ProfileListGroup>

        <ProfileListGroup delay={700} theme={theme}>
          <ProfileListItem theme={theme} icon={Bell} title="Reminders" color={theme.colors.accents.softMint} />
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

        {/* Edit Profile Modal */}
        <Modal visible={isEditing} animationType="fade" transparent statusBarTranslucent>
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsEditing(false)}>
              <BlurView intensity={theme.isDark ? 30 : 15} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            </Pressable>
            
            <Animated.View entering={SlideInDown.duration(400)} style={styles.modalContentWrap}>
              <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Update Profile</Text>
                  <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeBtn}>
                    <X size={20} color={theme.colors.text.tertiary} />
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput 
                    style={styles.input} 
                    value={editData.name} 
                    onChangeText={t => setEditData({...editData, name: t})}
                    placeholder="Enter your name"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput 
                    style={styles.input} 
                    value={editData.phoneNumber} 
                    onChangeText={t => setEditData({...editData, phoneNumber: t})}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>University</Text>
                  <TouchableOpacity 
                    style={styles.pickerTrigger} 
                    onPress={() => setShowUniPicker(!showUniPicker)}
                  >
                    <Text style={[styles.pickerTriggerText, !editData.university && { color: theme.colors.text.disabled }]}>
                      {editData.university || "Select University"}
                    </Text>
                    <ChevronRight size={20} color={theme.colors.text.tertiary} style={{ transform: [{ rotate: showUniPicker ? '90deg' : '0deg' }] }} />
                  </TouchableOpacity>
                  
                  {showUniPicker && (
                    <Animated.View entering={FadeInUp} style={styles.uniList}>
                      {UNIVERSITIES.map(uni => (
                        <TouchableOpacity 
                          key={uni} 
                          style={styles.uniOption} 
                          onPress={() => {
                            setEditData({...editData, university: uni});
                            setShowUniPicker(false);
                          }}
                        >
                          <Text style={[styles.uniOptionText, editData.university === uni && { color: theme.colors.plum, fontWeight: '700' }]}>{uni}</Text>
                        </TouchableOpacity>
                      ))}
                    </Animated.View>
                  )}
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Program of Study</Text>
                  <TextInput 
                    style={styles.input} 
                    value={editData.program} 
                    onChangeText={t => setEditData({...editData, program: t})}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Level</Text>
                  <TextInput 
                    style={styles.input} 
                    value={editData.level} 
                    onChangeText={t => setEditData({...editData, level: t})}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Student ID (Optional)</Text>
                  <TextInput 
                    style={styles.input} 
                    value={editData.studentId} 
                    onChangeText={t => setEditData({...editData, studentId: t})}
                    placeholder="Enter student ID"
                  />
                </View>
              </ScrollView>

              <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
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
  correlationGrid: { flexDirection: 'row', gap: 12, marginTop: 24, borderTopWidth: 1, borderTopColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', paddingTop: 20 },
  correlationCard: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'center', gap: 4 },
  correlationVal: { fontSize: 16, fontWeight: '800', color: theme.colors.text.primary, textTransform: 'capitalize' },
  correlationLab: { fontSize: 11, fontWeight: '600', color: theme.colors.text.tertiary, textAlign: 'center' },
  listGroup: { backgroundColor: theme.colors.surface, borderRadius: 32, marginBottom: 24, marginHorizontal: 20, overflow: 'hidden', borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: theme.colors.surface },
  listIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  listTitle: { flex: 1, fontSize: 16, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, letterSpacing: -0.3 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginLeft: 72 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: theme.colors.text.tertiary, letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
  modalContentWrap: { height: '85%', width: '100%' },
  modalContent: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 24, paddingTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
  modalHandle: { width: 40, height: 5, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 2.5, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.text.primary },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
  modalBody: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.text.tertiary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 16, padding: 16, color: theme.colors.text.primary, fontSize: 16 },
  saveBtn: { backgroundColor: theme.colors.plum, padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  pickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 16,
  },
  pickerTriggerText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  uniList: {
    marginTop: 8,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    borderRadius: 16,
    padding: 8,
  },
  uniOption: {
    padding: 12,
    borderRadius: 12,
  },
  uniOptionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  crisisCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 20, 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 16,
    gap: 12
  },
  crisisIconWrap: { 
    width: 40, 
    height: 40, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  crisisTitle: { 
    fontSize: 16, 
    fontFamily: theme.typography.fonts.header, 
    color: theme.colors.text.primary 
  },
  crisisSubtitle: { 
    fontSize: 12, 
    fontFamily: theme.typography.fonts.body, 
    color: theme.colors.text.secondary 
  },
});

