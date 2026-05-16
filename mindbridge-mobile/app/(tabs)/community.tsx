import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users,
  MessageCircle,
  Heart,
  MoreHorizontal,
  PenSquare,
  Search
} from 'lucide-react-native';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import api from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = theme;
  const styles = createStyles(theme);
  
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const GROUPS = [
    { id: '1', title: 'Final Year Stress', members: '1.2k', color: theme.colors.accents.powderBlue },
    { id: '2', title: 'Anxiety Support', members: '3.4k', color: theme.colors.accents.gentlePeach },
    { id: '3', title: 'Meditation Group', members: '850', color: theme.colors.accents.softMint },
  ];

  const fetchFeed = async () => {
    try {
      const response = await api.get('/community');
      setFeed(response.data);
    } catch (error) {
      console.error('Error fetching community feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleHug = async (postId: string) => {
    try {
      await api.post(`/community/${postId}/hug`);
      setFeed(feed.map(p => p.id === postId ? { ...p, hugs: p.hugs + 1 } : p));
    } catch (error) {
      console.error('Error sending hug:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return t('community.just_now');
    if (diffInHours < 24) return `${diffInHours}${t('community.hours_ago')}`;
    return `${Math.floor(diffInHours / 24)}${t('community.days_ago')}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={theme.isDark 
          ? ['rgba(216, 164, 143, 0.15)', theme.colors.background, theme.colors.backgroundSecondary]
          : ['rgba(216, 164, 143, 0.05)', theme.colors.background, theme.colors.backgroundSecondary]
        } 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title={t('community.title')} 
          subtitle={t('community.subtitle')}
          rightAction={
            <TouchableOpacity 
              style={styles.searchBtn}
              onPress={() => Alert.alert('Search', 'Community search will be available soon!')}
            >
              <Search color={theme.colors.accents.gentlePeach} size={24} />
            </TouchableOpacity>
          }
        />

        {/* My Groups */}
        <Animated.View entering={FadeInUp.delay(50).duration(500)}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('community.explore_groups')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupsScroll}>
              {GROUPS.map(group => (
                <TouchableOpacity key={group.id} style={[styles.groupCard, { borderColor: group.color + '30' }]}>
                  <View style={[styles.groupIcon, { backgroundColor: group.color + '20' }]}>
                    <Users color={group.color} size={20} />
                  </View>
                  <Text style={styles.groupTitle}>{group.title}</Text>
                  <Text style={styles.groupMembers}>{group.members} {t('community.members')}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>

        {/* Discussion Feed */}
        <Animated.View entering={FadeInUp.delay(150).duration(500)} style={styles.section}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 24, marginBottom: 16 }]}>{t('community.recent_discussions')}</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.plum} style={{ marginTop: 40 }} />
          ) : feed.length === 0 ? (
             <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ color: theme.colors.text.secondary }}>No discussions yet. Be the first to share!</Text>
             </View>
          ) : (
            <View style={styles.feedContainer}>
              {feed.map((post, index) => (
                <Animated.View key={post.id} entering={FadeInUp.delay(200 + (index * 50)).duration(500)} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.postAuthorInfo}>
                      <View style={[styles.postAvatar, { backgroundColor: theme.colors.accents.powderBlue }]} />
                      <View>
                        <Text style={styles.postGroup}>{post.group}</Text>
                        <Text style={styles.postTime}>{formatDate(post.createdAt)} • Anonymous</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.moreBtn}>
                      <MoreHorizontal color={theme.colors.text.tertiary} size={20} />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.postContent}>{post.content}</Text>
                  
                  <View style={styles.postActions}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleHug(post.id)}>
                      <Heart color={theme.colors.accents.dustyRose} size={18} fill={theme.colors.accents.dustyRose + '20'} />
                      <Text style={styles.actionText}>{post.hugs} {t('community.send_hug')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <MessageCircle color={theme.colors.text.secondary} size={18} />
                      <Text style={styles.actionText}>{post.comments || 0} {t('community.comment')}</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>

      </ScrollView>

      {/* FAB */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <PenSquare color={theme.colors.text.onPrimary || '#FFF'} size={24} />
          <Text style={styles.fabText}>Share Thought</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 120,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowOpacity: theme.isDark ? 0.2 : 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
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
    borderTopColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
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
    shadowOpacity: theme.isDark ? 0.5 : 0.3,
    shadowRadius: 16,
    elevation: 8,
    gap: 8,
  },
  fabText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.onPrimary || '#FFF',
  }
});
