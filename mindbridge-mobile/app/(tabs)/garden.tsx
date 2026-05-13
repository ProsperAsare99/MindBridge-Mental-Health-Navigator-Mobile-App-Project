import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInUp, 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { Leaf, Sun, CloudRain, Wind, CloudLightning, Flower2, CheckCircle2, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import api from '../../src/services/api';

const { width } = Dimensions.get('window');

const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

const getMoods = (theme: any) => [
  { id: 'joy', label: 'Joyful', icon: Sun, color: theme.colors.accents.gentlePeach, bg: theme.colors.accents.gentlePeach + '15', score: 10 },
  { id: 'calm', label: 'Calm', icon: Leaf, color: theme.colors.accents.eucalyptus, bg: theme.colors.accents.eucalyptus + '15', score: 8 },
  { id: 'anxious', label: 'Anxious', icon: Wind, color: theme.colors.accents.softLilac, bg: theme.colors.accents.softLilac + '20', score: 4 },
  { id: 'sad', label: 'Sad', icon: CloudRain, color: theme.colors.accents.powderBlue, bg: theme.colors.accents.powderBlue + '20', score: 2 },
  { id: 'stressed', label: 'Stressed', icon: CloudLightning, color: theme.colors.accents.slate, bg: theme.colors.accents.slate + '15', score: 3 },
];

const MoodCard = ({ mood, isSelected, onPress, delay, theme }: any) => {
  const scale = useSharedValue(1);
  const styles = createStyles(theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.95, springConfig); };
  const handlePressOut = () => { scale.value = withSpring(1, springConfig); };

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[
          styles.moodCard, 
          { backgroundColor: mood.bg }, 
          animatedStyle,
          isSelected && { 
            borderColor: mood.color, 
            borderWidth: 2, 
            shadowColor: mood.color, 
            shadowOffset: { width: 0, height: 8 }, 
            shadowOpacity: theme.isDark ? 0.3 : 0.2, 
            shadowRadius: 16, 
            elevation: 8 
          }
        ]}>
          <mood.icon color={mood.color} size={36} style={styles.moodIcon} />
          <Text style={[styles.moodLabel, { color: theme.colors.plum }]}>{mood.label}</Text>
          {isSelected && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.selectedIndicator}>
              <CheckCircle2 color={mood.color} size={16} />
            </Animated.View>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function GardenScreen() {
  const insets = useSafeAreaInsets();
  const themeContext = useTheme();
  const styles = createStyles(themeContext);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isPlanted, setIsPlanted] = useState(false);
  const [loading, setLoading] = useState(false);
  const MOODS = getMoods(themeContext);

  const handlePlant = async () => {
    if (!selectedMood) return;
    
    const moodData = MOODS.find(m => m.id === selectedMood);
    if (!moodData) return;

    setLoading(true);
    try {
      await api.post('/mood', {
        score: moodData.score,
        emotions: [moodData.label],
        note: `Feeling ${moodData.label.toLowerCase()} today.`
      });

      setIsPlanted(true);
      
      // Keep the success state for 4 seconds
      setTimeout(() => {
        setIsPlanted(false);
        setSelectedMood(null);
      }, 4000);
    } catch (error) {
      console.error('Error logging mood:', error);
      Alert.alert('Connection Issue', 'We couldn\'t plant your seed right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={themeContext.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={themeContext.isDark 
          ? ['rgba(123, 97, 255, 0.15)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
          : ['rgba(123, 97, 255, 0.12)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
        } 
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]} showsVerticalScrollIndicator={false}>
        <ScreenHeader 
          title="Mood Garden" 
          subtitle="How is your inner garden growing today? Plant a seed to reflect your feelings."
          rightAction={
            <TouchableOpacity 
              style={styles.historyBtn}
              onPress={() => Alert.alert('Coming Soon', 'Garden history and trends are arriving in the next update!')}
            >
              <Clock color={themeContext.colors.plum} size={24} />
            </TouchableOpacity>
          }
        />

        {!isPlanted ? (
          <View style={styles.moodGrid}>
            {MOODS.map((mood, index) => (
              <MoodCard 
                key={mood.id}
                mood={mood}
                isSelected={selectedMood === mood.id}
                onPress={() => setSelectedMood(mood.id)}
                delay={200 + (index * 100)}
                theme={themeContext}
              />
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(800)} style={styles.successState}>
            <LinearGradient
              colors={[themeContext.colors.accents.eucalyptus + '20', 'transparent']}
              style={styles.successGlow}
            />
            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
              <Leaf color={themeContext.colors.accents.eucalyptus} size={64} />
            </Animated.View>
            <Animated.View entering={FadeInUp.delay(500).duration(500)}>
              <Text style={styles.successTitle}>Seed Planted!</Text>
              <Text style={styles.successSubtitle}>Your garden is growing beautifully. Take a deep breath and have a wonderful day.</Text>
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>

      {!isPlanted && (
        <Animated.View entering={FadeInUp.delay(800).duration(800)} style={[styles.footer, { paddingBottom: insets.bottom + 20, backgroundColor: themeContext.colors.surface }]}>
          <TouchableOpacity 
            style={[styles.plantBtn, (!selectedMood || loading) && styles.plantBtnDisabled]}
            disabled={!selectedMood || loading}
            onPress={handlePlant}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={themeContext.colors.text.onPrimary || '#FFF'} />
            ) : (
              <Text style={styles.plantBtnText}>Plant Seed</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
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
  historyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 24,
  },
  moodCard: {
    width: (width - 48 - 16) / 2, 
    aspectRatio: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.03,
    shadowRadius: 12,
  },
  moodIcon: {
    marginBottom: 12,
  },
  moodLabel: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  plantBtn: {
    backgroundColor: theme.colors.plum,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.isDark ? 0.4 : 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  plantBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  plantBtnText: {
    color: theme.colors.text.onPrimary || '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  successState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  successGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    top: 0,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
