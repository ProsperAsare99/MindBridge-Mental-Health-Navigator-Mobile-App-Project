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
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Users,
  MessageCircle,
  Heart,
  MoreHorizontal,
  PenSquare,
  Search,
  X
} from 'lucide-react-native';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { SkeletonLoader } from '../../src/components/SkeletonLoader';
import api from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = theme;
  const styles = createStyles(theme);
  
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Final Year Stress');
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [publishing, setPublishing] = useState(false);

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

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Empty Post', 'Please write a message before publishing.');
      return;
    }
    setPublishing(true);
    try {
      const response = await api.post('/community', {
        content: postContent,
        group: selectedGroup
      });
      setFeed(prev => [response.data, ...prev]);
      setPostContent('');
      setIsCreateVisible(false);
      Alert.alert('Shared!', 'Your anonymous thought has been published to the community.');
    } catch (error) {
      console.error('Error sharing thought:', error);
      Alert.alert('Error', 'Failed to share post. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

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
            <View style={styles.feedContainer}>
              {[1, 2, 3].map((_, i) => (
                <View key={i} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.postAuthorInfo}>
                      <SkeletonLoader width={40} height={40} borderRadius={20} style={{ marginRight: 12 }} />
                      <View>
                        <SkeletonLoader width={100} height={15} borderRadius={4} style={{ marginBottom: 6 }} />
                        <SkeletonLoader width={80} height={13} borderRadius={4} />
                      </View>
                    </View>
                    <SkeletonLoader width={24} height={24} borderRadius={12} />
                  </View>
                  <SkeletonLoader width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonLoader width="85%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonLoader width="60%" height={16} borderRadius={4} style={{ marginBottom: 24 }} />
                  <View style={styles.postActions}>
                    <SkeletonLoader width={60} height={18} borderRadius={4} />
                    <SkeletonLoader width={60} height={18} borderRadius={4} />
                  </View>
                </View>
              ))}
            </View>
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
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setIsCreateVisible(true)}>
          <PenSquare color={theme.colors.text.onPrimary || '#FFF'} size={24} />
          <Text style={styles.fabText}>{t('community.share_thought') || 'Share Thought'}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Create Post Modal */}
      <Modal
        visible={isCreateVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={100} tint={theme.isDark ? 'dark' : 'light'} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('community.share_thought') || 'Share Anonymously'}</Text>
              <TouchableOpacity onPress={() => setIsCreateVisible(false)} style={styles.closeBtn}>
                <X color={theme.colors.plum} size={18} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Support Group</Text>
            <View style={styles.pickerRow}>
              {GROUPS.map(g => (
                <TouchableOpacity
                  key={g.id}
                  style={[
                    styles.pickerChip,
                    selectedGroup === g.title && { backgroundColor: theme.colors.plum, borderColor: theme.colors.plum }
                  ]}
                  onPress={() => setSelectedGroup(g.title)}
                >
                  <Text style={[
                    styles.pickerChipText,
                    { color: selectedGroup === g.title ? '#FFF' : theme.colors.text.secondary }
                  ]}>
                    {g.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Your Message</Text>
            <TextInput
              style={[styles.modalInput, { color: theme.colors.text.primary, borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}
              placeholder="What's on your mind? Sharing anonymously can help relieve stress..."
              placeholderTextColor={theme.colors.text.disabled}
              multiline
              numberOfLines={6}
              value={postContent}
              onChangeText={setPostContent}
            />

            <TouchableOpacity 
              style={[styles.publishBtn, (!postContent.trim() || publishing) && { opacity: 0.6 }]} 
              onPress={handleCreatePost}
              disabled={!postContent.trim() || publishing}
            >
              {publishing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <PenSquare color="#FFF" size={18} style={{ marginRight: 8 }} />
                  <Text style={styles.publishBtnText}>Publish Anonymously</Text>
                </>
              )}
            </TouchableOpacity>
          </BlurView>
        </View>
      </Modal>
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
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 15,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '600',
    color: theme.colors.plum,
  },
  groupsScroll: {
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
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  groupMembers: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
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
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.tertiary,
  },
  moreBtn: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  postActions: {
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
    fontFamily: theme.typography.fonts.accent,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.isDark ? 0.3 : 0.2,
    shadowRadius: 16,
    elevation: 8,
    gap: 8,
  },
  fabText: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.onPrimary || '#FFF',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { height: '70%', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden', padding: 24 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontFamily: theme.typography.fonts.header, fontWeight: '800', color: theme.colors.text.primary },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
  modalLabel: { fontSize: 12, fontFamily: theme.typography.fonts.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: theme.colors.text.tertiary, marginBottom: 10, marginTop: 10 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  pickerChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
  pickerChipText: { fontSize: 13, fontFamily: theme.typography.fonts.accent, fontWeight: '600' },
  modalInput: { borderWidth: 1, borderRadius: 16, padding: 14, fontSize: 15, fontFamily: theme.typography.fonts.body, lineHeight: 22, height: 120, textAlignVertical: 'top', marginBottom: 24, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
  publishBtn: { flexDirection: 'row', backgroundColor: '#7B61FF', paddingVertical: 16, borderRadius: 28, alignItems: 'center', justifyContent: 'center', gap: 8 },
  publishBtnText: { color: '#FFF', fontSize: 16, fontFamily: theme.typography.fonts.header, fontWeight: '800' },
});
