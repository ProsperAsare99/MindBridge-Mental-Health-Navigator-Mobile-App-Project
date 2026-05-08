import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  StatusBar 
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { 
  Sparkles, 
  Brain, 
  Heart, 
  GraduationCap, 
  Calendar, 
  MessageCircle, 
  ArrowRight,
  TrendingUp,
  Moon,
  Wind
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// ─── Custom Personalized Components ──────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconWrap, { backgroundColor: color + '20' }]}>
      <Icon color={color} size={20} />
    </View>
    <View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);

const ActionCard = ({ title, subtitle, icon: Icon, color, onPress }: { title: string; subtitle: string; icon: any; color: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={onPress}>
    <LinearGradient colors={[color + '15', color + '05']} style={styles.actionGradient} />
    <View style={[styles.actionIconWrap, { backgroundColor: color }]}>
      <Icon color={theme.colors.surface} size={22} />
    </View>
    <View style={styles.actionTextWrap}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </View>
    <ArrowRight color={theme.colors.text.disabled} size={20} />
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const { signOut, userToken } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  
  // Mocking the personalization data that would come from the registration/onboarding
  // In a real app, this would be pulled from the user's profile state
  const isGuest = userToken?.startsWith('guest-token');
  const userData = {
    name: isGuest ? "Explorer" : "Prosper",
    institution: "University of Ghana",
    level: "Level 400",
    primaryGoal: "Manage Stress",
    moodToday: "Calm",
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <LinearGradient
          colors={[theme.colors.background, theme.colors.accents.softLilac]}
          style={[styles.headerHero, { paddingTop: insets.top + 20 }]}
        >
          <Animated.View entering={FadeInUp.duration(800)} style={styles.greetingRow}>
            <View>
              <Text style={styles.dateText}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
              <Text style={styles.greetingText}>Hello, {userData.name} <Sparkles color={theme.colors.plum} size={24} /></Text>
            </View>
            <TouchableOpacity onPress={signOut} style={styles.profileBtn}>
              <Image source={require('../../assets/images/logo.png')} style={styles.avatar} />
            </TouchableOpacity>
          </Animated.View>

          {/* Personalization Highlight Card */}
          <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.highlightCard}>
            <LinearGradient 
              colors={[theme.colors.plum, '#4A3E4F']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.highlightGradient} 
            />
            <View style={styles.highlightContent}>
              <View style={styles.highlightHeader}>
                <Text style={styles.highlightTag}>PERSONALIZED FOCUS</Text>
                <Heart color={theme.colors.accents.gentlePeach} size={18} fill={theme.colors.accents.gentlePeach} />
              </View>
              <Text style={styles.highlightTitle}>Let's focus on your goal: {userData.primaryGoal}</Text>
              <Text style={styles.highlightSubtitle}>Based on your onboarding, we've prepared a breathing session for you.</Text>
              <TouchableOpacity style={styles.highlightAction}>
                <Text style={styles.highlightActionText}>Start Session</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Quick Stats Row */}
          <View style={styles.statsRow}>
            <StatCard 
              title="Institution" 
              value={userData.institution} 
              icon={GraduationCap} 
              color={theme.colors.accents.slate} 
            />
            <StatCard 
              title="Study Level" 
              value={userData.level} 
              icon={Calendar} 
              color={theme.colors.accents.forestGreen} 
            />
          </View>

          {/* Personalized Sections */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Navigator</Text>
            <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.actionsGrid}>
            <ActionCard 
              title="Mood Garden" 
              subtitle={`You're feeling ${userData.moodToday} today`} 
              icon={Wind} 
              color={theme.colors.accents.eucalyptus} 
            />
            <ActionCard 
              title="Academic Support" 
              subtitle="Coping with exam pressure" 
              icon={Brain} 
              color={theme.colors.accents.powderBlue} 
            />
            <ActionCard 
              title="Chat with Al" 
              subtitle="Your private safe space" 
              icon={MessageCircle} 
              color={theme.colors.accents.softLilac} 
            />
            <ActionCard 
              title="Sleep Tools" 
              subtitle="Personalized for tonight" 
              icon={Moon} 
              color={theme.colors.accents.peach} 
            />
          </View>

          {/* Community Preview */}
          <View style={styles.communityCard}>
            <Text style={styles.communityTitle}>Student Pulse</Text>
            <Text style={styles.communityText}>"64% of students at {userData.institution} are feeling high stress this week. You are not alone."</Text>
            <View style={styles.communityFooter}>
              <TrendingUp color={theme.colors.accents.forestGreen} size={16} />
              <Text style={styles.communityTrend}>Community Support is active</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerHero: { paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  dateText: { fontSize: 13, fontWeight: '700', color: theme.colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1 },
  greetingText: { fontSize: 28, fontWeight: '900', color: theme.colors.plum, letterSpacing: -0.5, marginTop: 4 },
  profileBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surface, overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.mauve },
  avatar: { width: '100%', height: '100%' },
  highlightCard: { borderRadius: 28, overflow: 'hidden', height: 190, elevation: 8, shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15 },
  highlightGradient: { ...StyleSheet.absoluteFillObject },
  highlightContent: { flex: 1, padding: 24, justifyContent: 'space-between' },
  highlightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  highlightTag: { fontSize: 11, fontWeight: '800', color: theme.colors.surface, opacity: 0.8, letterSpacing: 1 },
  highlightTitle: { fontSize: 20, fontWeight: '800', color: theme.colors.surface, lineHeight: 28, marginTop: 8 },
  highlightSubtitle: { fontSize: 13, color: theme.colors.surface, opacity: 0.7, marginTop: 4 },
  highlightAction: { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 12 },
  highlightActionText: { color: theme.colors.plum, fontWeight: '800', fontSize: 14 },
  mainContent: { paddingHorizontal: 24, marginTop: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: theme.colors.surface, padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: theme.colors.accents.softLilac },
  statIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.text.secondary, textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '800', color: theme.colors.plum, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.plum, letterSpacing: -0.5 },
  viewAll: { fontSize: 14, fontWeight: '700', color: theme.colors.accents.slate },
  actionsGrid: { gap: 16 },
  actionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, backgroundColor: theme.colors.surface, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.accents.softLilac },
  actionGradient: { ...StyleSheet.absoluteFillObject },
  actionIconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  actionTextWrap: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '800', color: theme.colors.plum },
  actionSubtitle: { fontSize: 13, color: theme.colors.text.secondary, marginTop: 2, fontWeight: '600' },
  communityCard: { marginTop: 32, backgroundColor: theme.colors.accents.softMint + '30', padding: 24, borderRadius: 28, borderWidth: 1, borderColor: theme.colors.accents.softMint },
  communityTitle: { fontSize: 18, fontWeight: '900', color: theme.colors.plum, marginBottom: 8 },
  communityText: { fontSize: 15, color: theme.colors.plum, lineHeight: 22, fontWeight: '600', opacity: 0.8 },
  communityFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  communityTrend: { fontSize: 13, fontWeight: '700', color: theme.colors.accents.forestGreen },
});
