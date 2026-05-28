import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Activity, Flame, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = theme;
  const router = useRouter();
  const styles = createStyles(theme);

  const [loading, setLoading] = useState(true);
  const [insightData, setInsightData] = useState<any>(null);

  useEffect(() => {
    fetchDetailedInsights();
  }, []);

  const fetchDetailedInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mood/insights/detailed');
      setInsightData(res.data);
    } catch (error) {
      // Offline mock data
      setInsightData({
        sleepData: [
          { value: 6, label: 'Mon', frontColor: theme.colors.accents.powderBlue },
          { value: 4, label: 'Tue', frontColor: theme.colors.accents.dustyRose },
          { value: 7, label: 'Wed', frontColor: theme.colors.accents.powderBlue },
          { value: 8, label: 'Thu', frontColor: theme.colors.accents.eucalyptus },
          { value: 5, label: 'Fri', frontColor: theme.colors.accents.powderBlue },
          { value: 9, label: 'Sat', frontColor: theme.colors.accents.softMint },
          { value: 7, label: 'Sun', frontColor: theme.colors.accents.powderBlue },
        ],
        stressData: [
          { value: 8, label: 'M' },
          { value: 6, label: 'T' },
          { value: 9, label: 'W' },
          { value: 4, label: 'T' },
          { value: 3, label: 'F' },
          { value: 2, label: 'S' },
          { value: 3, label: 'S' },
        ],
        activityData: [
          { value: 2, label: 'M', frontColor: theme.colors.accents.slate },
          { value: 6, label: 'T', frontColor: theme.colors.accents.gentlePeach },
          { value: 8, label: 'W', frontColor: theme.colors.accents.sand },
          { value: 10, label: 'T', frontColor: theme.colors.semantic.danger },
          { value: 4, label: 'F', frontColor: theme.colors.accents.powderBlue },
          { value: 6, label: 'S', frontColor: theme.colors.accents.gentlePeach },
          { value: 8, label: 'S', frontColor: theme.colors.accents.sand },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient 
          colors={theme.isDark 
            ? [theme.colors.background, theme.colors.backgroundSecondary, '#080C18'] 
            : [theme.colors.background, theme.colors.backgroundSecondary, '#E0E3EB']
          } 
          style={StyleSheet.absoluteFillObject} 
        />
        <View style={[styles.bgBlob, { top: -100, right: -100, backgroundColor: theme.colors.accents.powderBlue + '0A' }]} />
        <View style={[styles.bgBlob, { bottom: 0, left: -100, backgroundColor: theme.colors.accents.softLilac + '0A' }]} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color={theme.colors.text.primary} size={24} />
          </TouchableOpacity>
          <ScreenHeader 
            title="Detailed Analytics" 
            subtitle="Visualize your progress over time"
          />
        </View>

        {/* Sleep Chart */}
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={[styles.chartIconWrap, { backgroundColor: theme.colors.accents.slate + '15' }]}>
              <Moon color={theme.colors.accents.slate} size={20} />
            </View>
            <View>
              <Text style={styles.chartTitle}>Sleep Pattern</Text>
              <Text style={styles.chartSubtitle}>Hours slept per night (Last 7 Days)</Text>
            </View>
          </View>
          <View style={styles.chartWrapper}>
            <BarChart
              data={insightData?.sleepData || []}
              width={CHART_WIDTH}
              height={140}
              barWidth={22}
              spacing={15}
              roundedTop
              roundedBottom
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.colors.text.tertiary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.colors.text.tertiary, fontSize: 10 }}
              noOfSections={4}
              maxValue={12}
              rulesColor={theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              isAnimated
            />
          </View>
        </Animated.View>

        {/* Stress Area Chart */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={[styles.chartIconWrap, { backgroundColor: theme.colors.semantic.danger + '15' }]}>
              <Activity color={theme.colors.semantic.danger} size={20} />
            </View>
            <View>
              <Text style={styles.chartTitle}>Stress Levels</Text>
              <Text style={styles.chartSubtitle}>Self-reported stress out of 10</Text>
            </View>
          </View>
          <View style={styles.chartWrapper}>
            <LineChart
              areaChart
              data={insightData?.stressData || []}
              width={CHART_WIDTH}
              height={140}
              spacing={CHART_WIDTH / 8}
              initialSpacing={10}
              color={theme.colors.semantic.danger}
              thickness={3}
              startFillColor={theme.colors.semantic.danger}
              endFillColor={theme.colors.semantic.danger}
              startOpacity={0.3}
              endOpacity={0.0}
              yAxisColor={'transparent'}
              xAxisColor={theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
              hideDataPoints
              maxValue={10}
              noOfSections={5}
              yAxisTextStyle={{ color: theme.colors.text.tertiary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.colors.text.tertiary, fontSize: 10 }}
              rulesColor={theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              isAnimated
              curved
            />
          </View>
        </Animated.View>

        {/* Energy Level Bar Chart */}
        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={[styles.chartIconWrap, { backgroundColor: theme.colors.accents.gentlePeach + '15' }]}>
              <Flame color={theme.colors.accents.gentlePeach} size={20} />
            </View>
            <View>
              <Text style={styles.chartTitle}>Energy Levels</Text>
              <Text style={styles.chartSubtitle}>Self-reported energy (0-10)</Text>
            </View>
          </View>
          <View style={styles.chartWrapper}>
            <BarChart
              data={insightData?.activityData || []}
              width={CHART_WIDTH}
              height={140}
              barWidth={22}
              spacing={15}
              roundedTop
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: theme.colors.text.tertiary, fontSize: 10 }}
              xAxisLabelTextStyle={{ color: theme.colors.text.tertiary, fontSize: 10 }}
              noOfSections={5}
              maxValue={10}
              rulesColor={theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              isAnimated
            />
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  bgBlob: { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.8 },
  scrollContent: { paddingBottom: 100 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginRight: 10 },
  chartCard: { backgroundColor: theme.colors.surface, marginHorizontal: 20, marginBottom: 20, padding: 20, borderRadius: 28, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', overflow: 'hidden' },
  chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  chartIconWrap: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  chartTitle: { fontSize: 16, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  chartSubtitle: { fontSize: 12, fontFamily: theme.typography.fonts.body, color: theme.colors.text.tertiary, marginTop: 2 },
  chartWrapper: { alignItems: 'center' },
});
