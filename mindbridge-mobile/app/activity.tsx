import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Footprints, Target, Flame, Activity as ActivityIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Pedometer } from 'expo-sensors';
import Svg, { Circle } from 'react-native-svg';
import Animated, { FadeInUp, useSharedValue, useAnimatedProps, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { BarChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = 90;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [weeklySteps, setWeeklySteps] = useState<any[]>([]);
  const goal = 10000;
  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);
        
        if (available) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          
          // 1. Fetch Today's Real Steps
          const todayRes = await Pedometer.getStepCountAsync(start, end);
          const todaySteps = todayRes ? todayRes.steps : 0;
          setSteps(todaySteps);
          
          // Animate the progress ring
          const progress = Math.min(todaySteps / goal, 1);
          animatedProgress.value = withDelay(300, withTiming(progress, {
            duration: 1500,
            easing: Easing.out(Easing.cubic)
          }));

          // 2. Fetch Last 7 Days of Real Steps
          const weekData = [];
          let maxSteps = 1000; // default for scaling
          
          for (let i = 6; i >= 0; i--) {
            const dStart = new Date();
            dStart.setDate(dStart.getDate() - i);
            dStart.setHours(0, 0, 0, 0);
            
            const dEnd = new Date(dStart);
            dEnd.setHours(23, 59, 59, 999);
            if (i === 0) dEnd.setTime(end.getTime());

            try {
              const res = await Pedometer.getStepCountAsync(dStart, dEnd);
              const dailySteps = res ? res.steps : 0;
              if (dailySteps > maxSteps) maxSteps = dailySteps;
              
              weekData.push({
                value: dailySteps,
                label: dStart.toLocaleDateString('en-US', { weekday: 'narrow' }),
                frontColor: dailySteps >= goal ? theme.colors.plum : theme.colors.plum + '60',
                topLabelComponent: () => (
                  <Text style={{ color: theme.colors.text.tertiary, fontSize: 10, marginBottom: 4, fontWeight: '600' }}>
                    {dailySteps > 0 ? (dailySteps > 999 ? (dailySteps/1000).toFixed(1)+'k' : dailySteps) : ''}
                  </Text>
                )
              });
            } catch (e) {
              // Fallback if that specific day fails
              weekData.push({
                value: 0,
                label: dStart.toLocaleDateString('en-US', { weekday: 'narrow' }),
                frontColor: theme.colors.plum + '40'
              });
            }
          }
          setWeeklySteps(weekData);
        }
      } catch (e) {
        setIsAvailable(false);
        console.log('Pedometer error:', e);
      }
    };
    
    fetchRealData();
  }, []);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  const styles = createStyles(theme);

  // Calorie calculation: roughly 0.04 calories per step
  const calories = Math.round(steps * 0.04);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={theme.isDark 
          ? [theme.colors.background, theme.colors.backgroundSecondary] 
          : [theme.colors.background, theme.colors.backgroundSecondary]
        } 
        style={StyleSheet.absoluteFillObject} 
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn} activeOpacity={0.85}>
          <X color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.ringContainer}>
          <Svg width={CIRCLE_RADIUS * 2 + 40} height={CIRCLE_RADIUS * 2 + 40} style={styles.svg}>
            {/* Background Circle */}
            <Circle
              cx={(CIRCLE_RADIUS * 2 + 40) / 2}
              cy={(CIRCLE_RADIUS * 2 + 40) / 2}
              r={CIRCLE_RADIUS}
              stroke={theme.colors.plum + '15'}
              strokeWidth={18}
              fill="none"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={(CIRCLE_RADIUS * 2 + 40) / 2}
              cy={(CIRCLE_RADIUS * 2 + 40) / 2}
              r={CIRCLE_RADIUS}
              stroke={theme.colors.plum}
              strokeWidth={18}
              fill="none"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${(CIRCLE_RADIUS * 2 + 40) / 2} ${(CIRCLE_RADIUS * 2 + 40) / 2})`}
            />
          </Svg>

          <View style={styles.ringContent}>
            <Footprints color={theme.colors.plum} size={28} style={{ marginBottom: 4 }} />
            <Text style={[styles.stepsText, { color: theme.colors.text.primary }]}>
              {steps.toLocaleString()}
            </Text>
            <Text style={[styles.stepsLabel, { color: theme.colors.text.secondary }]}>
              Steps Today
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: theme.colors.accents.powderBlue + '20' }]}>
              <Target color={theme.colors.accents.powderBlue} size={20} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{goal.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Daily Goal</Text>
          </View>
          
          <View style={[styles.statBox, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
            <View style={[styles.statIconWrap, { backgroundColor: theme.colors.accents.terracotta + '20' }]}>
              <Flame color={theme.colors.accents.terracotta} size={20} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{calories}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Calories (kcal)</Text>
          </View>
        </Animated.View>

        {/* Weekly Chart */}
        {weeklySteps.length > 0 && (
          <Animated.View entering={FadeInUp.delay(400).duration(800)} style={[styles.chartCard, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)' }]}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={[styles.chartTitle, { color: theme.colors.text.primary }]}>Weekly Activity</Text>
                <Text style={[styles.chartSubtitle, { color: theme.colors.text.tertiary }]}>Last 7 days of real steps</Text>
              </View>
              <ActivityIcon color={theme.colors.plum} size={20} />
            </View>
            
            <View style={{ marginTop: 24, marginLeft: -10 }}>
              <BarChart
                data={weeklySteps}
                width={width - 80}
                height={160}
                barWidth={24}
                spacing={16}
                roundedTop
                roundedBottom={false}
                hideRules
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: theme.colors.text.tertiary, fontSize: 10 }}
                noOfSections={3}
                maxValue={Math.max(...weeklySteps.map(d => d.value), 2000)}
                formatYLabel={(label: string) => {
                  const val = parseInt(label);
                  if (val >= 1000) return (val/1000).toFixed(0) + 'k';
                  return label;
                }}
                isAnimated
                animationDuration={1000}
                xAxisLabelTextStyle={{ color: theme.colors.text.secondary, fontSize: 12, fontWeight: '600', marginTop: 4 }}
              />
            </View>
          </Animated.View>
        )}

        {!isAvailable && (
          <Animated.View entering={FadeInUp.delay(500).duration(800)}>
            <View style={[styles.errorCard, { backgroundColor: theme.colors.semantic.danger + '15' }]}>
              <Text style={[styles.errorText, { color: theme.colors.semantic.danger }]}>
                Pedometer data is unavailable. Please ensure physical activity permissions are granted on your device.
              </Text>
            </View>
          </Animated.View>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
    paddingBottom: 10,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.colors.text.primary,
    fontSize: 18,
    fontFamily: theme.typography.fonts.header,
    letterSpacing: 0.5,
  },
  content: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  ringContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsText: {
    fontSize: 38,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '800',
  },
  stepsLabel: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.ui,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fonts.ui,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartCard: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '800',
  },
  chartSubtitle: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    marginTop: 4,
  },
  errorCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    lineHeight: 20,
  }
});
