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
  Library,
  Headphones,
  Wind,
  Play,
  FileText,
  ChevronRight,
  Sun,
  BookOpen,
  Youtube,
  Download
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AUDIO_GUIDES = [
  { id: '1', title: 'Deep Sleep Release', duration: '15 min', color: theme.colors.accents.powderBlue },
  { id: '2', title: 'Morning Clarity', duration: '10 min', color: theme.colors.accents.eucalyptus },
  { id: '3', title: 'Exam Focus', duration: '5 min', color: theme.colors.accents.sand },
];

const COPING_TOOLS = [
  { id: 'breath', title: 'Box Breathing', subtitle: 'Calm your nervous system', icon: Wind, color: theme.colors.accents.softMint },
  { id: 'ground', title: '5-4-3-2-1 Method', subtitle: 'Instant grounding technique', icon: Play, color: theme.colors.accents.dustyRose },
];

const ARTICLES = [
  { id: 'a1', title: 'Understanding Academic Burnout', readTime: '4 min read', category: 'Stress' },
  { id: 'a2', title: 'The Science of Deep Breathing', readTime: '3 min read', category: 'Science' },
  { id: 'a3', title: 'Navigating Social Anxiety on Campus', readTime: '6 min read', category: 'Anxiety' },
];

const BOOKS_AND_PDFS = [
  { id: 'b1', title: 'The Body Keeps the Score (Summary)', author: 'Bessel van der Kolk', type: 'PDF Guide', icon: Download },
  { id: 'b2', title: 'Atomic Habits for Students', author: 'James Clear', type: 'Free Guide', icon: FileText },
  { id: 'b3', title: 'MindBridge Anxiety Workbook', author: 'Clinical Team', type: 'Workbook', icon: BookOpen },
];

const VIDEOS = [
  { id: 'v1', title: 'How to Manage Stress as a Student', channel: 'Thomas Frank', duration: '12:45', color: theme.colors.accents.slate },
  { id: 'v2', title: 'A 10-Minute Meditation for Anxiety', channel: 'Goodful', duration: '10:20', color: theme.colors.accents.blushPink },
  { id: 'v3', title: 'The Neuroscience of Sleep', channel: 'Huberman Lab', duration: '18:30', color: theme.colors.accents.forestGreen },
];

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['rgba(59, 82, 73, 0.05)', theme.colors.background, theme.colors.backgroundSecondary]} 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Library color={theme.colors.accents.forestGreen} size={32} />
          </View>
          <Text style={styles.title}>Learn & Grow</Text>
          <Text style={styles.subtitle}>Curated books, articles, videos, and coping tools for your journey.</Text>
        </Animated.View>

        {/* Audio Guides */}
        <Animated.View entering={FadeInUp.delay(50).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Guided Audio</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
            snapToInterval={width * 0.45 + 16}
            decelerationRate="fast"
          >
            {AUDIO_GUIDES.map((guide, index) => (
              <Animated.View key={guide.id} entering={FadeInUp.delay(100 + (index * 50)).duration(600)}>
                <TouchableOpacity style={[styles.audioCard, { backgroundColor: guide.color + '15', borderColor: guide.color + '30' }]} activeOpacity={0.8}>
                  <View style={[styles.audioIconWrap, { backgroundColor: guide.color }]}>
                    <Headphones color={theme.colors.surface} size={20} />
                  </View>
                  <Text style={styles.audioTitle} numberOfLines={2}>{guide.title}</Text>
                  <Text style={styles.audioDuration}>{guide.duration}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Videos (YouTube Style) */}
        <Animated.View entering={FadeInUp.delay(150).duration(600)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Helpful Videos</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
            snapToInterval={width * 0.7 + 16}
            decelerationRate="fast"
          >
            {VIDEOS.map((video, index) => (
              <Animated.View key={video.id} entering={FadeInUp.delay(200 + (index * 50)).duration(600)}>
                <TouchableOpacity style={styles.videoCard} activeOpacity={0.8}>
                  <View style={[styles.videoThumbnail, { backgroundColor: video.color + '20' }]}>
                    <Youtube color={video.color} size={32} />
                    <View style={styles.videoDurationBadge}>
                      <Text style={styles.videoDurationText}>{video.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
                    <Text style={styles.videoChannel}>{video.channel}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Tools */}
        <Animated.View entering={FadeInUp.delay(250).duration(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Coping Tools</Text>
          <View style={styles.toolsGrid}>
            {COPING_TOOLS.map((tool) => (
              <TouchableOpacity key={tool.id} style={styles.toolCard} activeOpacity={0.8}>
                <View style={[styles.toolIconWrap, { backgroundColor: tool.color + '20' }]}>
                  <tool.icon color={theme.colors.text.primary} size={24} />
                </View>
                <View style={styles.toolInfo}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Books & PDFs */}
        <Animated.View entering={FadeInUp.delay(350).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Books & Free PDFs</Text>
          </View>
          <View style={styles.articleList}>
            {BOOKS_AND_PDFS.map((book, index) => (
              <React.Fragment key={book.id}>
                <TouchableOpacity style={styles.articleItem} activeOpacity={0.7}>
                  <View style={styles.articleInfo}>
                    <Text style={[styles.articleCategory, { color: theme.colors.accents.powderBlue }]}>{book.type}</Text>
                    <Text style={styles.articleTitle}>{book.title}</Text>
                    <Text style={styles.articleReadTime}>By {book.author}</Text>
                  </View>
                  <View style={styles.articleIconWrap}>
                    <book.icon color={theme.colors.text.disabled} size={24} />
                  </View>
                </TouchableOpacity>
                {index < BOOKS_AND_PDFS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Articles */}
        <Animated.View entering={FadeInUp.delay(450).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Articles & Journals</Text>
          </View>
          <View style={styles.articleList}>
            {ARTICLES.map((article, index) => (
              <React.Fragment key={article.id}>
                <TouchableOpacity style={styles.articleItem} activeOpacity={0.7}>
                  <View style={styles.articleInfo}>
                    <Text style={styles.articleCategory}>{article.category}</Text>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleReadTime}>{article.readTime}</Text>
                  </View>
                  <View style={styles.articleIconWrap}>
                    <FileText color={theme.colors.text.disabled} size={24} />
                  </View>
                </TouchableOpacity>
                {index < ARTICLES.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

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
    paddingBottom: 100,
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
    shadowColor: theme.colors.accents.forestGreen,
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
  audioCard: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  audioIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  audioTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  videoCard: {
    width: width * 0.7,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  videoThumbnail: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoDurationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  videoDurationText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
    lineHeight: 22,
  },
  videoChannel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  toolsGrid: {
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
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  toolSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  articleList: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
    fontWeight: '800',
    color: theme.colors.plum,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  articleReadTime: {
    fontSize: 13,
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 20,
  }
});
