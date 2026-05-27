import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { HeartPulse, X, Users, BookOpen } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConnectPeer: () => void;
  onViewResources: () => void;
}

export const InterventionModal = ({ visible, onClose, onConnectPeer, onViewResources }: Props) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <BlurView intensity={20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        </Pressable>
        
        <Animated.View entering={ZoomIn.duration(400)} style={styles.cardContainer}>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color={theme.colors.text.tertiary} size={20} />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={[styles.iconWrap, { backgroundColor: theme.colors.semantic.danger + '15' }]}>
                <HeartPulse color={theme.colors.semantic.danger} size={32} />
              </View>
              <Text style={styles.title}>You are not alone.</Text>
              <Text style={styles.subtitle}>
                We noticed you've been feeling down lately. It's perfectly okay to have hard days. If you need support, we are here for you.
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.colors.plum }]} onPress={onConnectPeer}>
                <Users color="#FFF" size={20} />
                <Text style={styles.actionBtnTextPrimary}>Talk to a Peer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn, { borderColor: theme.colors.plum }]} onPress={onViewResources}>
                <BookOpen color={theme.colors.plum} size={20} />
                <Text style={[styles.actionBtnTextSecondary, { color: theme.colors.plum }]}>View Resources</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  cardContainer: { alignItems: 'center' },
  card: { width: '100%', borderRadius: 28, padding: 24, overflow: 'hidden' },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10, padding: 4 },
  header: { alignItems: 'center', marginBottom: 24 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontFamily: theme.typography.fonts.header, fontWeight: '800', color: theme.colors.text.primary, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 22 },
  actions: { gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 20 },
  secondaryBtn: { backgroundColor: 'transparent', borderWidth: 1 },
  actionBtnTextPrimary: { color: '#FFF', fontSize: 16, fontFamily: theme.typography.fonts.header, fontWeight: '700' },
  actionBtnTextSecondary: { fontSize: 16, fontFamily: theme.typography.fonts.header, fontWeight: '700' },
});
