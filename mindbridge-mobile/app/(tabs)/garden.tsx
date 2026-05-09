import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Pressable,
  StatusBar
} from 'react-native';
import { theme } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeInUp, 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { Leaf, Sun, CloudRain, Wind, CloudLightning, Flower2, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };

const MOODS = [
  { id: 'joy', label: 'Joyful', icon: Sun, color: theme.colors.accents.gentlePeach, bg: theme.colors.accents.gentlePeach + '15' },
  { id: 'calm', label: 'Calm', icon: Leaf, color: theme.colors.accents.eucalyptus, bg: theme.colors.accents.eucalyptus + '15' },
  { id: 'anxious', label: 'Anxious', icon: Wind, color: theme.colors.accents.softLilac, bg: theme.colors.accents.softLilac + '20' },
  { id: 'sad', label: 'Sad', icon: CloudRain, color: theme.colors.accents.powderBlue, bg: theme.colors.accents.powderBlue + '20' },
  { id: 'stressed', label: 'Stressed', icon: CloudLightning, color: theme.colors.accents.slate, bg: theme.colors.accents.slate + '15' },
];

const MoodCard = ({ mood, isSelected, onPress, delay }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.95, springConfig); };
  const handlePressOut = () => { scale.value = withSpring(1, springConfig); };

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify().damping(14)}>
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
            shadowOpacity: 0.2, 
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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isPlanted, setIsPlanted] = useState(false);

  const handlePlant = () => {
    if (!selectedMood) return;
    setIsPlanted(true);
    setTimeout(() => {
      setIsPlanted(false);
      setSelectedMood(null);
    }, 4000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['rgba(123, 97, 255, 0.12)', theme.colors.background, theme.colors.backgroundSecondary]} 
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View style={styles.iconContainer}>
            <Flower2 color={theme.colors.accents.eucalyptus} size={32} />
          </View>
          <Text style={styles.title}>Mood Garden</Text>
          <Text style={styles.subtitle}>How is your inner garden growing today? Plant a seed to reflect your feelings.</Text>
        </Animated.View>

        {!isPlanted ? (
          <View style={styles.moodGrid}>
            {MOODS.map((mood, index) => (
              <MoodCard 
                key={mood.id}
                mood={mood}
                isSelected={selectedMood === mood.id}
                onPress={() => setSelectedMood(mood.id)}
                delay={200 + (index * 100)}
              />
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(800)} style={styles.successState}>
            <LinearGradient
              colors={[theme.colors.accents.eucalyptus + '20', 'transparent']}
              style={styles.successGlow}
            />
            <Animated.View entering={FadeInUp.delay(300).springify()}>
              <Leaf color={theme.colors.accents.eucalyptus} size={64} />
            </Animated.View>
            <Animated.View entering={FadeInUp.delay(500).springify()}>
              <Text style={styles.successTitle}>Seed Planted!</Text>
              <Text style={styles.successSubtitle}>Your garden is growing beautifully. Take a deep breath and have a wonderful day.</Text>
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>

      {!isPlanted && (
        <Animated.View entering={FadeInUp.delay(800).duration(800)} style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity 
            style={[styles.plantBtn, !selectedMood && styles.plantBtnDisabled]}
            disabled={!selectedMood}
            onPress={handlePlant}
            activeOpacity={0.8}
          >
            <Text style={styles.plantBtnText}>Plant Seed</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.accents.eucalyptus,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
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
    shadowOpacity: 0.03,
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
    shadowOpacity: 0.1,
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
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  plantBtn: {
    backgroundColor: theme.colors.plum,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  plantBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  plantBtnText: {
    color: theme.colors.surface,
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
