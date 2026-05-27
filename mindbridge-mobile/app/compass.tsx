import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { useTheme } from '../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Compass as CompassIcon, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function CompassScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const [heading, setHeading] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const targets = [
    { label: 'North', angle: 0 },
    { label: 'East', angle: 90 },
    { label: 'South', angle: 180 },
    { label: 'West', angle: 270 }
  ];

  useEffect(() => {
    let subscription: any;
    Magnetometer.setUpdateInterval(100);

    const subscribe = async () => {
      subscription = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = angle - 90; // Adjust for device orientation
        if (angle < 0) {
          angle += 360;
        }
        setHeading(Math.round(angle));
      });
    };

    subscribe();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // Check if we hit the target
  useEffect(() => {
    if (targetIndex >= targets.length) return;
    const target = targets[targetIndex];
    const diff = Math.abs(heading - target.angle);
    // Give 15 degrees of leeway
    if (diff < 15 || diff > 345) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTargetIndex(prev => prev + 1);
    }
  }, [heading, targetIndex]);

  const isComplete = targetIndex >= targets.length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
          <X color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Physical Grounding</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        {isComplete ? (
          <View style={styles.centerBox}>
            <CheckCircle2 color={theme.colors.accents.eucalyptus} size={64} style={{ marginBottom: 20 }} />
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>You are Grounded</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              By engaging your body in physical space, you've helped break the cycle of anxiety.
            </Text>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: theme.colors.plum }]}
              onPress={() => router.back()}
            >
              <Text style={styles.btnText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.centerBox}>
            <CompassIcon color={theme.colors.plum} size={64} style={{ marginBottom: 30, transform: [{ rotate: `${-heading}deg` }] }} />
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              Slowly turn your body to face:
            </Text>
            <Text style={[styles.title, { color: theme.colors.plum, fontSize: 32 }]}>
              {targets[targetIndex].label}
            </Text>
            
            <View style={{ marginTop: 40, alignItems: 'center' }}>
              <Text style={[styles.subtitle, { color: theme.colors.text.tertiary, fontSize: 14 }]}>Current Heading: {heading}°</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  closeBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  centerBox: { alignItems: 'center', width: '100%' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, lineHeight: 24, textAlign: 'center', marginBottom: 20 },
  btn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, marginTop: 20 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '700' }
});
