import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useFaceDetector, FaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { Worklets, useRunOnJS } from 'react-native-worklets-core';
import { X, Check, Shield, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  visible: boolean;
  onClose: () => void;
  onComplete: (metrics: { smileProbability: number; eyeOpenProbability: number }) => void;
  theme: any;
}

export const VideoCheckInModal = ({ visible, onClose, onComplete, theme }: Props) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');
  
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Stats
  const [framesProcessed, setFramesProcessed] = useState(0);
  const smileSum = useRef(0);
  const eyeSum = useRef(0);

  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: 'fast',
    classificationMode: 'all',
  }).current;
  
  const { detectFaces } = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    if (visible && hasPermission) {
      setIsActive(true);
      setFramesProcessed(0);
      smileSum.current = 0;
      eyeSum.current = 0;
      setIsProcessing(false);
    } else {
      setIsActive(false);
    }
  }, [visible, hasPermission]);

  const handleDetectedFaces = useRunOnJS((faces: any[]) => {
    if (isProcessing) return;
    
    if (faces.length > 0) {
      const face = faces[0];
      if (face.smilingProbability !== undefined && face.leftEyeOpenProbability !== undefined) {
        smileSum.current += face.smilingProbability;
        eyeSum.current += (face.leftEyeOpenProbability + face.rightEyeOpenProbability) / 2;
        setFramesProcessed(prev => {
          const next = prev + 1;
          if (next >= 30) {
            // Done capturing
            setIsProcessing(true);
            completeCapture();
          }
          return next;
        });
      }
    }
  });

  const completeCapture = () => {
    const total = Math.max(framesProcessed, 1);
    const avgSmile = smileSum.current / total;
    const avgEye = eyeSum.current / total;
    setIsActive(false);
    setTimeout(() => {
      onComplete({
        smileProbability: avgSmile,
        eyeOpenProbability: avgEye
      });
    }, 500);
  };

  const handleFrame = (frame: any) => {
    'worklet';
    const faces = detectFaces(frame);
    handleDetectedFaces(faces);
  };

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

          {!hasPermission ? (
            <View style={styles.permissionBox}>
              <Shield size={32} color={theme.colors.plum} style={{ marginBottom: 16 }} />
              <Text style={[styles.permText, { color: theme.colors.text.secondary }]}>
                We need camera access to analyze your facial expressions. 
                Your video is processed STRICTLY on your device and is never uploaded.
              </Text>
              <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.plum }]} onPress={requestPermission}>
                <Text style={styles.btnText}>Allow Camera Access</Text>
              </TouchableOpacity>
            </View>
          ) : !device ? (
            <View style={styles.permissionBox}>
              <AlertCircle size={32} color="#EF4444" style={{ marginBottom: 16 }} />
              <Text style={[styles.permText, { color: theme.colors.text.secondary }]}>No camera device found.</Text>
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                frameProcessor={handleFrame}
              />
              <LinearGradient 
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}
              >
                {!isProcessing ? (
                  <>
                    <ActivityIndicator size="small" color="#FFF" style={{ marginBottom: 8 }} />
                    <Text style={styles.overlayText}>
                      Analyzing expression... {Math.round((framesProcessed / 30) * 100)}%
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
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  permissionBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  overlayText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  }
});
