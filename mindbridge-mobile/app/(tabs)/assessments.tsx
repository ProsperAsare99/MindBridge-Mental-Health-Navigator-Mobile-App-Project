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
import { ScreenHeader } from '../../src/components/ScreenHeader';
import api from '../../src/services/api';
import { 
  ClipboardList, 
  Activity, 
  BrainCircuit, 
  GraduationCap, 
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const getAssessments = (theme: any, t: any) => [
  {
    id: 'phq9',
    title: 'PHQ-9',
    subtitle: t('assessments.depression_screening'),
    duration: `3 ${t('assessments.minutes')}`,
    icon: Activity,
    color: theme.colors.accents.powderBlue,
  },
  {
    id: 'gad7',
    title: 'GAD-7',
    subtitle: t('assessments.anxiety_screening'),
    duration: `2 ${t('assessments.minutes')}`,
    icon: BrainCircuit,
    color: theme.colors.accents.eucalyptus,
  },
  {
    id: 'burnout',
    title: t('assessments.burnout_test'),
    subtitle: 'Student Stress Test',
    duration: `4 ${t('assessments.minutes')}`,
    icon: GraduationCap,
    color: theme.colors.accents.terracotta,
  }
];

const getRecentResults = (theme: any) => [
  {
    id: '1',
    test: 'GAD-7',
    date: 'Oct 12',
    score: 'Mild Anxiety',
    trend: 'down',
    color: theme.colors.accents.eucalyptus,
  },
  {
    id: '2',
    test: 'PHQ-9',
    date: 'Sep 28',
    score: 'Minimal',
    trend: 'stable',
    color: theme.colors.accents.powderBlue,
  }
];

const AssessmentCard = ({ assessment, delay, theme }: any) => {
  const styles = createStyles(theme);
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
      <TouchableOpacity style={styles.assessmentCard} activeOpacity={0.8}>
        <View style={[styles.assessmentIconWrap, { backgroundColor: assessment.color + (theme.isDark ? '25' : '20') }]}>
          <assessment.icon color={assessment.color} size={28} />
        </View>
        <Text style={styles.assessmentTitle}>{assessment.title}</Text>
        <Text style={styles.assessmentSubtitle}>{assessment.subtitle}</Text>
        <View style={styles.assessmentFooter}>
          <Text style={styles.durationText}>{assessment.duration}</Text>
          <View style={[styles.startBtn, { backgroundColor: assessment.color }]}>
            <Text style={styles.startBtnText}>Start</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function AssessmentsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = theme;
  const styles = createStyles(theme);
  const assessments = getAssessments(theme, t);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get('/ai/oracle-context');
        setResults(response.data.assessments || []);
      } catch (error) {
        console.error('Error fetching assessment results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={theme.isDark 
          ? ['rgba(123, 97, 255, 0.1)', theme.colors.background, theme.colors.backgroundSecondary]
          : ['rgba(123, 97, 255, 0.08)', theme.colors.background, theme.colors.backgroundSecondary]
        } 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title={t('assessments.title')} 
          subtitle={t('assessments.subtitle')}
          rightAction={
            <TouchableOpacity 
              style={styles.infoBtn}
              onPress={() => Alert.alert(t('assessments.privacy_title'), t('assessments.privacy_msg'))}
            >
              <Info color={theme.colors.plum} size={24} />
            </TouchableOpacity>
          }
        />

        <Animated.View entering={FadeInUp.delay(100).duration(800)}>
          <Text style={styles.sectionTitle}>{t('assessments.available_tests')}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
            snapToInterval={width * 0.65 + 16}
            decelerationRate="fast"
          >
            {assessments.map((assessment, index) => (
              <AssessmentCard key={assessment.id} assessment={assessment} delay={200 + (index * 100)} theme={theme} />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('assessments.recent_results')}</Text>
          <View style={styles.resultsContainer}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.plum} style={{ padding: 40 }} />
            ) : results.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: themeContext.colors.text.secondary }}>No assessments taken yet.</Text>
              </View>
            ) : (
              results.map((result: any, index: number) => (
                <React.Fragment key={result.id}>
                  <TouchableOpacity style={styles.resultItem}>
                    <View style={[styles.resultIconWrap, { backgroundColor: themeContext.colors.accents.powderBlue + (themeContext.isDark ? '25' : '15') }]}>
                      {result.score > 10 ? <TrendingUp color={themeContext.colors.accents.terracotta} size={18} /> : <Minus color={themeContext.colors.accents.powderBlue} size={18} />}
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTest}>{result.type}</Text>
                      <Text style={[styles.resultScore, { color: result.score > 15 ? themeContext.colors.accents.terracotta : themeContext.colors.text.primary }]}>
                        {result.severity} ({result.score})
                      </Text>
                    </View>
                    <View style={styles.resultRight}>
                      <Text style={styles.resultDate}>{formatDate(result.createdAt)}</Text>
                      <ChevronRight color={themeContext.colors.text.disabled} size={18} />
                    </View>
                  </TouchableOpacity>
                  {index < results.length - 1 && <View style={styles.divider} />}
                </React.Fragment>
              ))
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.educationalCard}>
          <View style={styles.eduIconWrap}>
            <Info color={themeContext.colors.plum} size={20} />
          </View>
          <View style={styles.eduContent}>
            <Text style={styles.eduTitle}>Why take assessments?</Text>
            <Text style={styles.eduText}>These tools provide insights into your emotional state. They do not replace professional medical advice or formal diagnosis.</Text>
          </View>
        </Animated.View>

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
    paddingHorizontal: 0,
    paddingBottom: 100,
  },
  infoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
    paddingHorizontal: 24,
    letterSpacing: -0.5,
  },
  horizontalScrollPadding: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 24,
  },
  assessmentCard: {
    width: width * 0.65,
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: theme.isDark ? 0.2 : 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  assessmentIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  assessmentTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  assessmentSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 24,
  },
  assessmentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.disabled,
  },
  startBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  startBtnText: {
    color: theme.colors.text.onPrimary || '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  section: {
    marginBottom: 32,
  },
  resultsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  resultIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resultInfo: {
    flex: 1,
  },
  resultTest: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  resultScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
  },
  resultDate: {
    fontSize: 13,
    color: theme.colors.text.disabled,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    marginLeft: 76,
  },
  educationalCard: {
    flexDirection: 'row',
    backgroundColor: theme.isDark ? 'rgba(123, 97, 255, 0.1)' : 'rgba(123, 97, 255, 0.08)',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(123, 97, 255, 0.15)' : 'rgba(123, 97, 255, 0.15)',
  },
  eduIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  eduContent: {
    flex: 1,
  },
  eduTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.plum,
    marginBottom: 4,
  },
  eduText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});
