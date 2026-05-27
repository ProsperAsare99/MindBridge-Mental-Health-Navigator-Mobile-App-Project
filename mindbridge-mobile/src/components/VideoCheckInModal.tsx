import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { X, Check, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Constants, { ExecutionEnvironment } from 'expo-constants';

interface Props {
  visible: boolean;
  onClose: () => void;
  onComplete: (metrics: { smileProbability: number; eyeOpenProbability: number }) => void;
  theme: any;
}

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export const VideoCheckInModal = ({ visible, onClose, onComplete, theme }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visible && isExpoGo) {
      // Simulate the scan for Expo Go users
      setProgress(0);
      setIsProcessing(false);
      
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setIsProcessing(true);
          setTimeout(() => {
            onComplete({ smileProbability: 0.85, eyeOpenProbability: 0.92 });
          }, 500);
        }
      }, 200);

      return () => clearInterval(interval);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Video Check-in</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          </View>

          {isExpoGo ? (
            <View style={styles.cameraContainer}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }]}>
                <AlertCircle size={48} color={theme.colors.text.tertiary} style={{ marginBottom: 16 }} />
                <Text style={{ color: theme.colors.text.tertiary, textAlign: 'center', paddingHorizontal: 32 }}>
                  Camera native modules (NitroModules) are not supported in Expo Go.{"\n\n"}
                  Simulating face scan...
                </Text>
              </View>
              <LinearGradient 
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}
              >
                {!isProcessing ? (
                  <>
                    <ActivityIndicator size="small" color="#FFF" style={{ marginBottom: 8 }} />
                    <Text style={styles.overlayText}>
                      Analyzing expression... {progress}%
                    </Text>
                  </>
                ) : (
                  <>
                    <Check size={24} color="#34D399" style={{ marginBottom: 8 }} />
                    <Text style={styles.overlayText}>Analysis Complete!</Text>
                  </>
                )}
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.permissionBox}>
              <Text style={{ color: theme.colors.text.primary, textAlign: 'center' }}>
                Please run a development build (npx expo run:ios) to use the real Vision Camera.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, minHeight: 400 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800' },
  closeBtn: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(150,150,150,0.1)' },
  permissionBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  cameraContainer: { flex: 1, borderRadius: 24, overflow: 'hidden', backgroundColor: '#000' },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 24 },
  overlayText: { color: '#FFF', fontSize: 14, fontWeight: '600' }
});
