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
} from 'lucide-react-native';

// ... (existing code up to ScrollView)

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title="Discovery Hub" 
          subtitle="Curated tools for your mental well-being."
          rightAction={
            <TouchableOpacity style={styles.searchBtn}>
              <Search color={theme.colors.plum} size={24} />
            </TouchableOpacity>
          }
        />

        <View style={{ height: 20 }} />

        {/* Featured Section */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.featuredContainer}>
          <LinearGradient
            colors={[theme.colors.plum, '#4A3E4F']}
            style={styles.featuredCard}
          >
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>FEATURED</Text>
            </View>
            <Text style={styles.featuredTitle}>The Art of Self-Compassion</Text>
            <Text style={styles.featuredSubtitle}>A 10-minute guided audio journey to quiet your inner critic.</Text>
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
              <Text style={styles.sectionTitle}>Guided Audio</Text>
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
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.section}>
            <Text style={styles.sectionTitle}>Coping Techniques</Text>
            <View style={styles.toolsGrid}>
              {COPING_TOOLS.map((tool) => (
                <TouchableOpacity key={tool.id} style={styles.toolCard} activeOpacity={0.8}>
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
          </Animated.View>
        )}

        {/* Articles */}
        {(activeCategory === 'All' || activeCategory === 'Articles') && articles.length > 0 && (
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Deep Dives</Text>
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
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
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
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
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
    fontWeight: '800',
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  featuredSubtitle: {
    fontSize: 15,
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
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
    height: 44,
  },
  audioDuration: {
    fontSize: 12,
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
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    marginLeft: 20,
  }
});
