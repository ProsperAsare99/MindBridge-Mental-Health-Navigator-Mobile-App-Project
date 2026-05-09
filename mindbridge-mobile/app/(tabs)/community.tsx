import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StatusBar
} from 'react-native';
import { theme } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users,
  MessageCircle,
  Heart,
  MoreHorizontal,
  PenSquare
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const GROUPS = [
  { id: '1', title: 'Final Year Stress', members: '1.2k', color: theme.colors.accents.powderBlue },
  { id: '2', title: 'Anxiety Support', members: '3.4k', color: theme.colors.accents.gentlePeach },
  { id: '3', title: 'Meditation Group', members: '850', color: theme.colors.accents.softMint },
];

const FEED = [
  { 
    id: 'p1', 
    avatarColor: theme.colors.accents.powderBlue, 
    time: '2h ago', 
    group: 'Anxiety Support',
    content: 'Just had my first presentation of the semester. I was terrified, but remembering the breathing exercises helped me get through it.',
    hugs: 24,
    replies: 5
  },
  { 
    id: 'p2', 
    avatarColor: theme.colors.accents.terracotta, 
    time: '4h ago', 
    group: 'Final Year Stress',
    content: 'Is anyone else feeling completely overwhelmed by their thesis? I feel like I am so far behind everyone else.',
    hugs: 56,
    replies: 12
  },
];

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['rgba(216, 164, 143, 0.05)', theme.colors.background, theme.colors.backgroundSecondary]} 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Users color={theme.colors.accents.gentlePeach} size={32} />
          </View>
          <Text style={styles.title}>Safe Space</Text>
          <Text style={styles.subtitle}>Connect with peers, share anonymously, and find support in a moderated environment.</Text>
        </Animated.View>

        {/* My Groups */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Support Groups</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>Explore</Text></TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
            snapToInterval={width * 0.4 + 16}
            decelerationRate="fast"
          >
            {GROUPS.map((group, index) => (
              <Animated.View key={group.id} entering={FadeInUp.delay(150 + (index * 50)).duration(600)}>
                <TouchableOpacity style={[styles.groupCard, { backgroundColor: group.color + '15', borderColor: group.color + '30' }]} activeOpacity={0.8}>
                  <View style={[styles.groupIconWrap, { backgroundColor: group.color }]}>
                    <Users color={theme.colors.surface} size={20} />
                  </View>
                  <Text style={styles.groupTitle} numberOfLines={2}>{group.title}</Text>
                  <Text style={styles.groupMembers}>{group.members} members</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Discussion Feed */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.section}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 24, marginBottom: 16 }]}>Recent Discussions</Text>
          
          <View style={styles.feedContainer}>
            {FEED.map((post, index) => (
              <Animated.View key={post.id} entering={FadeInUp.delay(300 + (index * 100)).duration(600)} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postAuthorInfo}>
                    <View style={[styles.postAvatar, { backgroundColor: post.avatarColor }]} />
                    <View>
                      <Text style={styles.postGroup}>{post.group}</Text>
                      <Text style={styles.postTime}>{post.time} • Anonymous</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.moreBtn}>
                    <MoreHorizontal color={theme.colors.text.tertiary} size={20} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.postContent}>{post.content}</Text>
                
                <View style={styles.postFooter}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Heart color={theme.colors.text.secondary} size={20} />
                    <Text style={styles.actionText}>Send Hug ({post.hugs})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <MessageCircle color={theme.colors.text.secondary} size={20} />
                    <Text style={styles.actionText}>{post.replies}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>

      {/* FAB */}
      <Animated.View entering={FadeInUp.delay(600).duration(600)} style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <PenSquare color={theme.colors.surface} size={24} />
          <Text style={styles.fabText}>Share Thought</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.accents.gentlePeach,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.plum,
  },
  horizontalScrollPadding: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 24,
  },
  groupCard: {
    width: width * 0.4,
    height: 140,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  groupIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  groupMembers: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  feedContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  postCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postGroup: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 13,
    color: theme.colors.text.tertiary,
  },
  moreBtn: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 16,
    gap: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.plum,
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 28,
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    gap: 8,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.surface,
  }
});
