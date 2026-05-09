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
  Sun
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
          <Text style={styles.subtitle}>Curated audio guides, coping tools, and reading materials for your journey.</Text>
        </Animated.View>

        {/* Audio Guides */}
        <Animated.View entering={FadeInUp.delay(100).duration(600)}>
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
              <Animated.View key={guide.id} entering={FadeInUp.delay(150 + (index * 50)).duration(600)}>
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

        {/* Quick Tools */}
        <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.section}>
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

        {/* Articles */}
        <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reading Materials</Text>
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
