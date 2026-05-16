import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { 
  Zap, 
  Users, 
  User, 
  Heart, 
  Users2, 
  Coffee, 
  Moon, 
  Sun, 
  CloudRain, 
  Thermometer,
  Activity,
  Waves,
  Brain
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// ─── Energy Level Selector ───────────────────────────────────────────────────
export const EnergySelector = ({ value, onChange, theme }: any) => {
  const levels = [
    { val: 2, emoji: '😴', label: 'Drained' },
    { val: 4, emoji: '🥱', label: 'Low' },
    { val: 6, emoji: '🙂', label: 'Neutral' },
    { val: 8, emoji: '⚡', label: 'Active' },
    { val: 10, emoji: '🔥', label: 'Peak' },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>Energy Level</Text>
      <View style={styles.energyRow}>
        {levels.map((l) => (
          <TouchableOpacity
            key={l.val}
            onPress={() => onChange(l.val)}
            style={[
              styles.energyItem,
              value === l.val && { backgroundColor: theme.colors.plum + '15', borderColor: theme.colors.plum }
            ]}
          >
            <Text style={styles.energyEmoji}>{l.emoji}</Text>
            <Text style={[styles.energyLabel, { color: theme.colors.text.secondary }]}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ─── Sleep Quality Selector ──────────────────────────────────────────────────
export const SleepTracker = ({ quality, hours, onQualityChange, onHoursChange, theme }: any) => {
  const qualities = [
    { id: 'poor', icon: CloudRain, label: 'Poor', color: '#EF4444' },
    { id: 'fair', icon: Moon, label: 'Fair', color: '#FBBF24' },
    { id: 'good', icon: Sun, label: 'Good', color: '#34D399' },
    { id: 'perfect', icon: Zap, label: 'Perfect', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>Sleep Quality</Text>
      <View style={styles.qualityRow}>
        {qualities.map((q) => (
          <TouchableOpacity
            key={q.id}
            onPress={() => onQualityChange(q.id)}
            style={[
              styles.qualityItem,
              quality === q.id && { backgroundColor: q.color + '20', borderColor: q.color }
            ]}
          >
            <q.icon color={quality === q.id ? q.color : theme.colors.text.tertiary} size={20} />
            <Text style={[styles.qualityLabel, { color: theme.colors.text.secondary }]}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.hoursRow}>
        <Text style={[styles.subLabel, { color: theme.colors.text.secondary }]}>Hours Slept</Text>
        <View style={styles.hoursControls}>
          <TouchableOpacity onPress={() => onHoursChange(Math.max(0, hours - 0.5))} style={styles.hourBtn}>
            <Text style={{ fontSize: 20, color: theme.colors.text.primary }}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.hoursValue, { color: theme.colors.text.primary }]}>{hours}h</Text>
          <TouchableOpacity onPress={() => onHoursChange(Math.min(15, hours + 0.5))} style={styles.hourBtn}>
            <Text style={{ fontSize: 20, color: theme.colors.text.primary }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Social Interaction Selector ──────────────────────────────────────────────
export const SocialPicker = ({ value, onChange, theme }: any) => {
  const options = [
    { id: 'alone', icon: User, label: 'Alone' },
    { id: 'partner', icon: Heart, label: 'Partner' },
    { id: 'friends', icon: Users, label: 'Friends' },
    { id: 'family', icon: Users2, label: 'Family' },
    { id: 'coworkers', icon: Coffee, label: 'Peers' },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>Social Setting</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.socialScroll}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onChange(opt.id)}
            style={[
              styles.socialItem,
              value === opt.id && { backgroundColor: theme.colors.plum, borderColor: theme.colors.plum }
            ]}
          >
            <opt.icon color={value === opt.id ? '#FFF' : theme.colors.text.tertiary} size={20} />
            <Text style={[styles.socialLabel, { color: value === opt.id ? '#FFF' : theme.colors.text.secondary }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// ─── Physical Symptoms Picker ─────────────────────────────────────────────────
export const SymptomCloud = ({ selected, onToggle, theme }: any) => {
  const symptoms = [
    { id: 'headache', icon: Brain, label: 'Headache' },
    { id: 'fatigue', icon: Coffee, label: 'Fatigue' },
    { id: 'tension', icon: Activity, label: 'Tension' },
    { id: 'nausea', icon: Waves, label: 'Nausea' },
    { id: 'pain', icon: Thermometer, label: 'Body Pain' },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>Physical Symptoms</Text>
      <View style={styles.symptomGrid}>
        {symptoms.map((s) => {
          const isSelected = selected.includes(s.id);
          return (
            <TouchableOpacity
              key={s.id}
              onPress={() => onToggle(s.id)}
              style={[
                styles.symptomChip,
                { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
                isSelected && { backgroundColor: theme.colors.plum + '20', borderColor: theme.colors.plum }
              ]}
            >
              <s.icon color={isSelected ? theme.colors.plum : theme.colors.text.tertiary} size={16} />
              <Text style={[styles.symptomLabel, { color: isSelected ? theme.colors.plum : theme.colors.text.secondary }]}>{s.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 28, width: '100%' },
  label: { fontSize: 18, fontWeight: '700', marginBottom: 16, letterSpacing: -0.5 },
  subLabel: { fontSize: 14, fontWeight: '600' },
  
  // Energy
  energyRow: { flexDirection: 'row', justifyContent: 'space-between' },
  energyItem: { alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1.5, borderColor: 'transparent', width: (width - 100) / 5 },
  energyEmoji: { fontSize: 24, marginBottom: 4 },
  energyLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

  // Quality
  qualityRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  qualityItem: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderColor: 'transparent', backgroundColor: 'rgba(0,0,0,0.02)' },
  qualityLabel: { fontSize: 12, fontWeight: '700', marginTop: 6 },
  
  hoursRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.03)', padding: 12, borderRadius: 16 },
  hoursControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  hourBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.05)', alignItems: 'center', justifyContent: 'center' },
  hoursValue: { fontSize: 18, fontWeight: '800' },

  // Social
  socialScroll: { gap: 12, paddingRight: 20 },
  socialItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.05)', gap: 8 },
  socialLabel: { fontSize: 14, fontWeight: '600' },

  // Symptoms
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  symptomChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5, borderColor: 'transparent', gap: 6 },
  symptomLabel: { fontSize: 13, fontWeight: '600' },
});
