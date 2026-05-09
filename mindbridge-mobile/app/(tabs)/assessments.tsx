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

const ASSESSMENTS = [
  {
    id: 'phq9',
    title: 'PHQ-9',
    subtitle: 'Depression Screening',
    duration: '3 mins',
    icon: Activity,
    color: theme.colors.accents.powderBlue,
  },
  {
    id: 'gad7',
    title: 'GAD-7',
    subtitle: 'Anxiety Screening',
    duration: '2 mins',
    icon: BrainCircuit,
    color: theme.colors.accents.eucalyptus,
  },
  {
    id: 'burnout',
    title: 'Academic Burnout',
    subtitle: 'Student Stress Test',
    duration: '4 mins',
    icon: GraduationCap,
    color: theme.colors.accents.terracotta,
  }
];

const RECENT_RESULTS = [
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

const AssessmentCard = ({ assessment, delay }: any) => {
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify().damping(14)}>
      <TouchableOpacity style={styles.assessmentCard} activeOpacity={0.8}>
        <View style={[styles.assessmentIconWrap, { backgroundColor: assessment.color + '20' }]}>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['rgba(123, 97, 255, 0.08)', theme.colors.background, theme.colors.backgroundSecondary]} 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(800)} style={styles.header}>
          <View style={styles.headerIconContainer}>
            <ClipboardList color={theme.colors.plum} size={32} />
          </View>
          <Text style={styles.title}>Assessments</Text>
          <Text style={styles.subtitle}>Clinically validated tools to measure and track your mental well-being over time.</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).duration(800)}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollPadding}
            snapToInterval={width * 0.65 + 16}
            decelerationRate="fast"
          >
            {ASSESSMENTS.map((assessment, index) => (
              <AssessmentCard key={assessment.id} assessment={assessment} delay={200 + (index * 100)} />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).springify().damping(14)} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Results</Text>
          <View style={styles.resultsContainer}>
            {RECENT_RESULTS.map((result, index) => (
              <React.Fragment key={result.id}>
                <TouchableOpacity style={styles.resultItem}>
                  <View style={[styles.resultIconWrap, { backgroundColor: result.color + '15' }]}>
                    {result.trend === 'down' ? <TrendingDown color={result.color} size={18} /> :
                     result.trend === 'up' ? <TrendingUp color={result.color} size={18} /> :
                     <Minus color={result.color} size={18} />}
                  </View>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTest}>{result.test}</Text>
                    <Text style={[styles.resultScore, { color: result.color }]}>{result.score}</Text>
                  </View>
                  <View style={styles.resultRight}>
                    <Text style={styles.resultDate}>{result.date}</Text>
                    <ChevronRight color={theme.colors.text.disabled} size={18} />
                  </View>
                </TouchableOpacity>
                {index < RECENT_RESULTS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).springify().damping(14)} style={styles.educationalCard}>
          <View style={styles.eduIconWrap}>
            <Info color={theme.colors.plum} size={20} />
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
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
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
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
    color: theme.colors.surface,
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
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 76,
  },
  educationalCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(123, 97, 255, 0.08)',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(123, 97, 255, 0.15)',
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
    shadowOpacity: 0.1,
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
