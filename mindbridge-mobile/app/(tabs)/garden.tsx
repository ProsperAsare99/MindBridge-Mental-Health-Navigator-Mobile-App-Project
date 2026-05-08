import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { theme } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Leaf, Sun, CloudRain, Wind, CloudLightning, Flower2, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MOODS = [
  { id: 'joy', label: 'Joyful', icon: Sun, color: theme.colors.accents.gentlePeach, bg: theme.colors.accents.gentlePeach + '20' },
  { id: 'calm', label: 'Calm', icon: Leaf, color: theme.colors.accents.eucalyptus, bg: theme.colors.accents.eucalyptus + '20' },
  { id: 'anxious', label: 'Anxious', icon: Wind, color: theme.colors.accents.softLilac, bg: theme.colors.accents.softLilac + '30' },
  { id: 'sad', label: 'Sad', icon: CloudRain, color: theme.colors.accents.powderBlue, bg: theme.colors.accents.powderBlue + '30' },
  { id: 'stressed', label: 'Stressed', icon: CloudLightning, color: theme.colors.accents.slate, bg: theme.colors.accents.slate + '20' },
];

export default function GardenScreen() {
  const insets = useSafeAreaInsets();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isPlanted, setIsPlanted] = useState(false);

  const handlePlant = () => {
    if (!selectedMood) return;
    setIsPlanted(true);
    // Here we would typically save the mood to the backend
    setTimeout(() => {
      setIsPlanted(false);
      setSelectedMood(null);
    }, 3000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View style={styles.iconContainer}>
            <Flower2 color={theme.colors.accents.eucalyptus} size={32} />
          </View>
          <Text style={styles.title}>Mood Garden</Text>
          <Text style={styles.subtitle}>How is your inner garden growing today? Plant a seed to reflect your feelings.</Text>
        </Animated.View>

        {!isPlanted ? (
          <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.moodGrid}>
            {MOODS.map((mood, index) => {
              const isSelected = selectedMood === mood.id;
              return (
                <TouchableOpacity
                  key={mood.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedMood(mood.id)}
                  style={[
                    styles.moodCard,
                    { backgroundColor: mood.bg },
                    isSelected && { borderColor: mood.color, borderWidth: 2 }
                  ]}
                >
                  <mood.icon color={mood.color} size={36} style={styles.moodIcon} />
                  <Text style={[styles.moodLabel, { color: theme.colors.plum }]}>{mood.label}</Text>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Sparkles color={mood.color} size={14} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(800)} style={styles.successState}>
            <LinearGradient
              colors={[theme.colors.accents.eucalyptus + '20', theme.colors.background]}
              style={styles.successGlow}
            />
            <Leaf color={theme.colors.accents.eucalyptus} size={64} />
            <Text style={styles.successTitle}>Seed Planted!</Text>
            <Text style={styles.successSubtitle}>Your garden is growing beautifully. Take a deep breath and have a wonderful day.</Text>
          </Animated.View>
        )}
      </ScrollView>

      {!isPlanted && (
        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity 
            style={[styles.plantBtn, !selectedMood && styles.plantBtnDisabled]}
            disabled={!selectedMood}
            onPress={handlePlant}
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
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.accents.eucalyptus + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.plum,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  moodCard: {
    width: (width - 48 - 16) / 2, // 2 columns, minus padding and gap
    aspectRatio: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  moodIcon: {
    marginBottom: 12,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.accents.softLilac,
  },
  plantBtn: {
    backgroundColor: theme.colors.plum,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plantBtnDisabled: {
    opacity: 0.5,
  },
  plantBtnText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  successState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  successGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: 0,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.plum,
    marginTop: 24,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});
