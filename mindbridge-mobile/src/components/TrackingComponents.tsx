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
  Brain,
  Droplet,
  Wind,
  AlertCircle
} from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// ─── Energy Level Selector ───────────────────────────────────────────────────
import { Meh, Smile, Frown, Flame } from 'lucide-react-native';

export const EnergySelector = ({ value, onChange, theme }: any) => {
  const levels = [
    { val: 2, icon: Frown, label: 'Drained', color: theme.colors.accents?.slate || '#64748B' },
    { val: 4, icon: Meh, label: 'Low', color: theme.colors.accents?.powderBlue || '#0EA5E9' },
    { val: 6, icon: Smile, label: 'Neutral', color: theme.colors.accents?.eucalyptus || '#10B981' },
    { val: 8, icon: Zap, label: 'Active', color: theme.colors.accents?.softMint || '#34D399' },
    { val: 10, icon: Flame, label: 'Peak', color: '#EF4444' },
  ];

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>Energy Level</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.energyScroll}>
        {levels.map((l) => {
          const IconComponent = l.icon;
          const isSelected = value === l.val;
          return (
            <TouchableOpacity
              key={l.val}
              activeOpacity={0.8}
              onPress={() => onChange(l.val)}
              style={[
                styles.energyItem,
                { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
                isSelected && { backgroundColor: l.color + '15', borderColor: l.color }
              ]}
            >
              <View style={[
                styles.energyIconWrap, 
                { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
                isSelected && { backgroundColor: l.color }
              ]}>
                <IconComponent color={isSelected ? '#FFF' : theme.colors.text.tertiary} size={20} />
              </View>
              <Text style={[
                styles.energyLabel, 
                { color: isSelected ? theme.colors.text.primary : theme.colors.text.secondary }
              ]}>{l.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
              { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
              quality === q.id && { backgroundColor: q.color + '15', borderColor: q.color }
            ]}
          >
            <q.icon color={quality === q.id ? q.color : theme.colors.text.tertiary} size={20} />
            <Text style={[styles.qualityLabel, { color: theme.colors.text.secondary }]}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={[styles.hoursRow, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
        <Text style={[styles.subLabel, { color: theme.colors.text.secondary }]}>Hours Slept</Text>
        <View style={styles.hoursControls}>
          <TouchableOpacity onPress={() => onHoursChange(Math.max(0, hours - 0.5))} style={[styles.hourBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
            <Text style={{ fontSize: 20, color: theme.colors.text.primary }}>-</Text>
          </TouchableOpacity>
          <Text style={[styles.hoursValue, { color: theme.colors.text.primary }]}>{hours}h</Text>
          <TouchableOpacity onPress={() => onHoursChange(Math.min(15, hours + 0.5))} style={[styles.hourBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}>
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
              { 
                backgroundColor: theme.isDark ? 'rgba(255,255,255,0.02)' : '#FFF',
                borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
              },
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
    { id: 'cramps', icon: Droplet, label: 'Cramps' },
    { id: 'bloating', icon: Wind, label: 'Bloating' },
    { id: 'breakouts', icon: AlertCircle, label: 'Breakouts' },
    { id: 'backpain', icon: Thermometer, label: 'Back Pain' },
    { id: 'brainfog', icon: Brain, label: 'Brain Fog' },
    { id: 'insomnia', icon: Moon, label: 'Insomnia' },
    { id: 'tension', icon: Activity, label: 'Tension' },
    { id: 'nausea', icon: Waves, label: 'Nausea' },
    { id: 'flutter', icon: Heart, label: 'Heart Flutter' },
    { id: 'restless', icon: Zap, label: 'Restless' },
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
  section: { marginBottom: 24, width: '100%' },
  label: { fontSize: 16, fontFamily: 'Outfit-Bold', marginBottom: 12, letterSpacing: -0.3 },
  subLabel: { fontSize: 13, fontFamily: 'Outfit-Bold' },
  
  // Energy
  energyScroll: { gap: 10, paddingRight: 20 },
  energyItem: { width: 80, alignItems: 'center', paddingVertical: 10, borderRadius: 16, borderWidth: 1.5, borderColor: 'transparent' },
  energyIconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  energyLabel: { fontSize: 9, fontFamily: 'Outfit-Bold', textTransform: 'uppercase', textAlign: 'center' },

  // Quality
  qualityRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  qualityItem: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 16, borderWidth: 1.5, borderColor: 'transparent' },
  qualityLabel: { fontSize: 12, fontFamily: 'Outfit-Bold', marginTop: 6 },
  
  hoursRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 16 },
  hoursControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  hourBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  hoursValue: { fontSize: 18, fontFamily: 'Outfit-Bold' },

  // Social
  socialScroll: { gap: 10, paddingRight: 20 },
  socialItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, gap: 8 },
  socialLabel: { fontSize: 14, fontFamily: 'Outfit-Bold' },

  // Symptoms
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5, borderColor: 'transparent', gap: 6 },
  symptomLabel: { fontSize: 13, fontFamily: 'Outfit-Bold' },
});
