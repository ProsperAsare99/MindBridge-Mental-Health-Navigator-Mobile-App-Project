import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Settings, Moon, Sun, Smartphone } from 'lucide-react-native';

export default function SettingsScreen() {
  const themeContext = useTheme();
  const styles = createStyles(themeContext);
  const { mode, setMode, colors } = themeContext;

  const ThemeOption = ({ optionMode, icon: Icon, label }: any) => (
    <TouchableOpacity 
      style={[
        styles.optionBtn, 
        mode === optionMode && styles.optionBtnActive
      ]}
      onPress={() => setMode(optionMode)}
      activeOpacity={0.8}
    >
      <Icon 
        color={mode === optionMode ? colors.onPrimary || '#FFF' : colors.text.secondary} 
        size={24} 
      />
      <Text style={[
        styles.optionText,
        mode === optionMode && styles.optionTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Settings color={colors.text.secondary} size={64} style={{ marginBottom: 24 }} />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage your app preferences and theme.</Text>
      
      <View style={styles.themeSection}>
        <Text style={styles.sectionTitle}>App Theme</Text>
        <View style={styles.optionsRow}>
          <ThemeOption optionMode="system" icon={Smartphone} label="System" />
          <ThemeOption optionMode="light" icon={Sun} label="Light" />
          <ThemeOption optionMode="dark" icon={Moon} label="Dark" />
        </View>
      </View>
    </View>
  );
}

const createStyles = (themeContext: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: themeContext.colors.background, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: themeContext.colors.plum, 
    marginTop: 16, 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: themeContext.colors.text.secondary, 
    textAlign: 'center',
    marginBottom: 48
  },
  themeSection: {
    width: '100%',
    backgroundColor: themeContext.colors.surface,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: themeContext.isDark ? 0.2 : 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: themeContext.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: themeContext.colors.text.primary,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: themeContext.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionBtnActive: {
    backgroundColor: themeContext.colors.plum,
    borderColor: themeContext.colors.plumLight,
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: themeContext.colors.text.secondary,
  },
  optionTextActive: {
    color: themeContext.colors.onPrimary || '#FFF',
  }
});
