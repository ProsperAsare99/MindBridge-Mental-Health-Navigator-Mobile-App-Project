import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { ZoomIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { Flame, Trophy, CheckCircle2 } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  milestone: number;
  type: 'STREAK' | 'JOURNAL';
}

export const CelebrationModal = ({ visible, onClose, milestone, type }: Props) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const getDetails = () => {
    if (type === 'STREAK') {
      return {
        icon: Flame,
        color: '#FF9800',
        title: `${milestone}-Day Streak!`,
        desc: "You're building amazing wellness habits. Keep up the great work!",
      };
    }
    return {
      icon: Trophy,
      color: theme.colors.plum,
      title: `${milestone} Journals Logged`,
      desc: "Reflecting on your thoughts is a powerful step. Amazing job!",
    };
  };

  const details = getDetails();
  const Icon = details.icon;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <BlurView intensity={20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        </Pressable>
        
        <Animated.View entering={ZoomIn.springify().damping(15)} style={styles.cardContainer}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.header}>
              <View style={[styles.iconWrap, { backgroundColor: details.color + '20' }]}>
                <Icon color={details.color} size={40} />
              </View>
              <Text style={styles.title}>{details.title}</Text>
              <Text style={styles.subtitle}>{details.desc}</Text>
            </View>

            <TouchableOpacity style={[styles.btn, { backgroundColor: details.color }]} onPress={onClose}>
              <CheckCircle2 color="#FFF" size={20} />
              <Text style={styles.btnText}>Awesome!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  cardContainer: { alignItems: 'center' },
  card: { width: '100%', borderRadius: 32, padding: 32, overflow: 'hidden', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  iconWrap: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontFamily: theme.typography.fonts.header, fontWeight: '900', color: theme.colors.text.primary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 24 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18, paddingHorizontal: 32, borderRadius: 24, width: '100%' },
  btnText: { color: '#FFF', fontSize: 18, fontFamily: theme.typography.fonts.header, fontWeight: '800' },
});
