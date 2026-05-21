import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { SkeletonLoader } from '../../src/components/SkeletonLoader';
import { 
  Library,
  Headphones,
  Wind,
  Play,
  FileText,
  BookOpen,
  PlayCircle,
  Download,
  Search,
  Brain,
  Waves,
  Sun,
  Users,
  MessageSquare,
  Shield,
  Coins,
  BarChart2,
  Home,
  Globe,
  TrendingUp,
  PenTool,
  Moon,
  Heart,
  Activity,
  Compass,
} from 'lucide-react-native';
import api from '../../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// MindDoc-inspired: onboarding answers → curated resource cards
const FOR_YOU_MAP: Record<string, { title: string; subtitle: string; icon: any; color: string; tag: string }[]> = {
  academic_stress: [
    { title: 'Exam Stress Toolkit', subtitle: 'Reclaim your focus', icon: BookOpen, color: '#6366F1', tag: 'For You' },
    { title: 'Study Without Burning Out', subtitle: 'Pace yourself safely', icon: Brain, color: '#8B5CF6', tag: 'Trending' },
  ],
  anxiety: [
    { title: 'Navigate Anxiety', subtitle: 'Soothe your nervous system', icon: Waves, color: '#06B6D4', tag: 'For You' },
    { title: 'Box Breathing', subtitle: 'Find your center in 5 mins', icon: Wind, color: '#0EA5E9', tag: 'Quick Relief' },
  ],
  sadness: [
    { title: 'Gentle Mood Lifts', subtitle: 'Small steps for heavy days', icon: Sun, color: '#F59E0B', tag: 'For You' },
    { title: 'Find Your Spark', subtitle: 'Behavioral activation basics', icon: Compass, color: '#EF4444', tag: 'Evidence-Based' },
  ],
  loneliness: [
    { title: 'Bridge the Gap', subtitle: 'From isolation to belonging', icon: Heart, color: '#10B981', tag: 'For You' },
    { title: 'Your Campus Community', subtitle: 'Meaningful connections', icon: Users, color: '#34D399', tag: 'Student Life' },
  ],
  relationships: [
    { title: 'Communicate Clearly', subtitle: 'Speak your truth with care', icon: MessageSquare, color: '#EC4899', tag: 'For You' },
    { title: 'Healthy Boundaries', subtitle: 'Protect your peace', icon: Shield, color: '#F43F5E', tag: 'Popular' },
  ],
  financial: [
    { title: 'Money & Mind', subtitle: 'Ease financial anxiety', icon: Coins, color: '#84CC16', tag: 'For You' },
    { title: 'The Student Budget', subtitle: 'Practical money moves', icon: BarChart2, color: '#65A30D', tag: 'Practical' },
  ],
  family: [
    { title: 'Family Dynamics', subtitle: 'Navigating expectations', icon: Home, color: '#F97316', tag: 'For You' },
    { title: 'Cultural Bridges', subtitle: 'Honoring multiple worlds', icon: Globe, color: '#EA580C', tag: 'Deep Dive' },
  ],
  tracking: [
    { title: 'Pattern Recognition', subtitle: 'Understand your mood cycles', icon: TrendingUp, color: '#7C3AED', tag: 'For You' },
    { title: 'Clarity Journal', subtitle: 'Write your way to insight', icon: BookOpen, color: '#6D28D9', tag: 'Reflective' },
  ],
  default: [
    { title: 'Mindful Beginnings', subtitle: 'A gentle 5-minute start', icon: Compass, color: '#14B8A6', tag: 'Start Here' },
    { title: 'Restful Nights', subtitle: 'Science-backed sleep hygiene', icon: Moon, color: '#6366F1', tag: 'Popular' },
    { title: 'The Art of Self-Compassion', subtitle: 'Be kind to your mind', icon: Heart, color: '#F59E0B', tag: 'For You' },
  ],
};


export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { t } = theme;
  const styles = createStyles(theme);
  
  const [resources, setResources] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [forYouCards, setForYouCards] = useState<any[]>([]);

  const CATEGORIES = [
    t('resources.all'), 
    t('resources.audio'), 
    t('resources.techniques'), 
    t('resources.articles'), 
    t('resources.videos'), 
    t('resources.books')
  ];

  const COPING_TOOLS = [
    { id: 'breath', title: 'Box Breathing', subtitle: 'Calm your nervous system', icon: Wind, color: theme.colors.accents.eucalyptus },
    { id: 'ground', title: '5-4-3-2-1 Method', subtitle: 'Instant grounding technique', icon: Play, color: theme.colors.accents.powderBlue },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data);
      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadForYou = async () => {
      try {
        const raw = await AsyncStorage.getItem('onboarding_answers');
        const answers = raw ? JSON.parse(raw) : {};
        const goals: string[] = answers['q5'] || [];
        const cards: any[] = [];
        const seen = new Set<string>();

        // Collect up to 6 personalized cards based on goals
        for (const goal of goals) {
          const mapped = FOR_YOU_MAP[goal] || [];
          for (const card of mapped) {
            if (!seen.has(card.title) && cards.length < 6) {
              seen.add(card.title);
              cards.push(card);
            }
          }
        }

        // Pad with defaults if fewer than 3
        if (cards.length < 3) {
          for (const card of FOR_YOU_MAP.default) {
            if (!seen.has(card.title) && cards.length < 6) {
              seen.add(card.title);
              cards.push(card);
            }
          }
        }

        setForYouCards(cards);
      } catch (e) {
        setForYouCards(FOR_YOU_MAP.default);
      }
    };

    loadData();
    loadForYou();
  }, []);


  const { audio = [], articles = [], videos = [], books = [] } = resources || {};

  // ── For You Card Component ──────────────────────────────────
  const ForYouCard = ({ card, index }: { card: any; index: number }) => {
    const IconComponent = card.icon;
    return (
      <Animated.View entering={FadeInUp.delay(80 + index * 60).duration(450)}>
        <TouchableOpacity
          activeOpacity={0.82}
          style={[styles.fyCard, { backgroundColor: card.color + '18', borderColor: card.color + '40' }]}
          onPress={() => {}}
        >
          <View style={[styles.fyIconWrap, { backgroundColor: card.color + '22' }]}>
            <IconComponent color={card.color} size={26} strokeWidth={2} />
          </View>
          <View style={[styles.fyTag, { backgroundColor: card.color + '25' }]}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: card.color }} />
            <Text style={[styles.fyTagText, { color: card.color }]}>{card.tag}</Text>
          </View>
          <Text style={[styles.fyCardTitle, { color: theme.colors.text.primary }]} numberOfLines={2}>{card.title}</Text>
          <Text style={[styles.fyCardSub, { color: theme.colors.text.secondary }]} numberOfLines={2}>{card.subtitle}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={theme.isDark 
          ? ['rgba(59, 82, 73, 0.15)', theme.colors.background, theme.colors.backgroundSecondary]
          : ['rgba(59, 82, 73, 0.08)', theme.colors.background, theme.colors.backgroundSecondary]
        } 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title={t('resources.title')} 
          subtitle={t('resources.subtitle')}
          rightAction={
            <TouchableOpacity style={styles.searchBtn}>
              <Search color={theme.colors.plum} size={24} />
            </TouchableOpacity>
          }
        />

        <View style={{ height: 20 }} />

        {loading || !resources ? (
          <View>
            <View style={styles.section}>
              <SkeletonLoader width={120} height={24} borderRadius={4} style={{ marginBottom: 16 }} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forYouScroll}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={[styles.fyCard, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: 'transparent' }]}>
                    <SkeletonLoader width={46} height={46} borderRadius={16} style={{ marginBottom: 12 }} />
                    <SkeletonLoader width={60} height={16} borderRadius={8} style={{ marginBottom: 10 }} />
                    <SkeletonLoader width="100%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
                    <SkeletonLoader width="80%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                    <SkeletonLoader width="90%" height={12} borderRadius={4} />
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={{ height: 24 }} />

            <View style={styles.featuredContainer}>
              <View style={[styles.featuredCard, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                <SkeletonLoader width={80} height={24} borderRadius={8} style={{ marginBottom: 12 }} />
                <SkeletonLoader width="80%" height={28} borderRadius={4} style={{ marginBottom: 8 }} />
                <SkeletonLoader width="100%" height={16} borderRadius={4} style={{ marginBottom: 20 }} />
                <SkeletonLoader width={120} height={40} borderRadius={16} />
              </View>
            </View>
          </View>
        ) : (
          <>
        {/* ── For You Section ── */}
        {forYouCards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('resources.for_you')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.forYouScroll}
              snapToInterval={160 + 14}
              decelerationRate="fast"
            >
              {forYouCards.map((card, i) => <ForYouCard key={card.title} card={card} index={i} />)}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 24 }} />

        {/* Featured Section */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.featuredContainer}>
          <LinearGradient
            colors={[theme.colors.plum, '#4A3E4F']}
            style={styles.featuredCard}
          >
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>FEATURED</Text>
            </View>
            <Text style={styles.featuredTitle}>Quiet the Inner Critic</Text>
            <Text style={styles.featuredSubtitle}>A soothing 10-minute audio journey into the art of self-compassion.</Text>
            <TouchableOpacity style={styles.featuredBtn}>
              <Play color={theme.colors.plum} size={16} fill={theme.colors.plum} />
              <Text style={styles.featuredBtnText}>Listen Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              style={[styles.filterPill, activeCategory === cat && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Audio Guides */}
        {(activeCategory === 'All' || activeCategory === 'Audio') && audio.length > 0 && (
          <Animated.View entering={FadeInUp.delay(200).duration(500)}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Audio Journeys</Text>
              <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollPadding}
              snapToInterval={width * 0.48 + 16}
              decelerationRate="fast"
            >
              {audio.map((guide: any, index: number) => (
                <Animated.View key={guide.id} entering={FadeInUp.delay(300 + (index * 50)).duration(500)}>
                  <TouchableOpacity style={styles.audioCard} activeOpacity={0.8}>
                    <LinearGradient
                      colors={[theme.colors.surface, theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)']}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <View style={[styles.audioIconWrap, { backgroundColor: (guide.color || theme.colors.plum) + '20' }]}>
                      <Headphones color={guide.color || theme.colors.plum} size={20} />
                    </View>
                    <View>
                      <Text style={styles.audioTitle} numberOfLines={2}>{guide.title}</Text>
                      <Text style={styles.audioDuration}>{guide.duration || '15 min'}</Text>
                      {/* Progress Bar */}
                      <View style={styles.audioProgressBg}>
                        <View style={[styles.audioProgressFill, { width: `${Math.random() * 80}%`, backgroundColor: guide.color || theme.colors.plum }]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Quick Tools */}
        {(activeCategory === 'All' || activeCategory === 'Techniques') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Relief Tools</Text>
            <View style={styles.copingGrid}>
              {COPING_TOOLS.map((tool) => (
                <TouchableOpacity 
                  key={tool.id} 
                  style={styles.toolCard} 
                  activeOpacity={0.8}
                  onPress={() => {
                    if (tool.id === 'breath') {
                      router.push('/breathing');
                    } else if (tool.id === 'ground') {
                      router.push('/grounding');
                    }
                  }}
                >
                  <View style={[styles.toolIconWrap, { backgroundColor: tool.color + '20' }]}>
                    <tool.icon color={tool.color} size={24} />
                  </View>
                  <View style={styles.toolInfo}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Articles */}
        {(activeCategory === 'All' || activeCategory === 'Articles') && articles.length > 0 && (
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Curated Reads</Text>
            </View>
            <View style={styles.articleList}>
              {articles.map((article: any, index: number) => (
                <React.Fragment key={article.id}>
                  <TouchableOpacity style={styles.articleItem} activeOpacity={0.7}>
                    <View style={styles.articleInfo}>
                      <Text style={styles.articleCategory}>{article.category}</Text>
                      <Text style={styles.articleTitle}>{article.title}</Text>
                      <Text style={styles.articleReadTime}>{article.duration}</Text>
                    </View>
                    <View style={styles.articleIconWrap}>
                      <FileText color={theme.colors.text.disabled} size={24} />
                    </View>
                  </TouchableOpacity>
                  {index < articles.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))}
            </View>
          </Animated.View>
        )}
          </>
        )}

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
    paddingBottom: 100,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuredCard: {
    borderRadius: 32,
    padding: 28,
    minHeight: 200,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: theme.isDark ? 0.3 : 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '800',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  featuredSubtitle: {
    fontSize: 15,
    fontFamily: theme.typography.fonts.body,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 20,
  },
  featuredBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  featuredBtnText: {
    color: theme.colors.plum,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '800',
    fontSize: 15,
  },
  filterBar: {
    marginBottom: 32,
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
  filterPillActive: {
    backgroundColor: theme.colors.plum,
    borderColor: theme.colors.plum,
  },
  filterText: {
    fontSize: 14,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
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
  forYouScroll: {
    paddingHorizontal: 24,
    gap: 14,
    paddingBottom: 24,
  },
  horizontalScrollPadding: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 24,
  },
  audioCard: {
    width: width * 0.48,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  audioIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  audioTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
    height: 44,
  },
  audioDuration: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
    marginBottom: 12,
  },
  audioProgressBg: {
    height: 4,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  audioProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  copingGrid: {
    gap: 16,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  toolIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 17,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  toolSubtitle: {
    fontSize: 14,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
  articleList: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  articleInfo: {
    flex: 1,
    marginRight: 16,
  },
  articleCategory: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '800',
    color: theme.colors.plum,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  articleTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  articleReadTime: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.tertiary,
  },
  articleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    marginLeft: 20,
  },
  // Added ForYou styles
  fyCard: {
    width: 158,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  fyIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  fyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 10,
  },
  fyTagText: {
    fontSize: 10,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  fyCardTitle: {
    fontSize: 14,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
    lineHeight: 20,
  },
  fyCardSub: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.body,
    fontWeight: '500',
    lineHeight: 17,
  },
});
