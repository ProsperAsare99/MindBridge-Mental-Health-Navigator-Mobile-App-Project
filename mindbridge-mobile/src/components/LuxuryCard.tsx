import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BlurView } from 'expo-blur';

interface LuxuryCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({ 
  children, 
  style, 
  variant = 'elevated',
  padding = 'md'
}) => {
  const { colors, spacing, borderRadius, isDark } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return spacing.sm;
      case 'lg': return spacing.lg;
      default: return spacing.md;
    }
  };

  const cardStyle = [
    styles.container,
    { 
      borderRadius: borderRadius.lg,
      padding: getPadding(),
    },
    variant === 'elevated' && {
      backgroundColor: colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.backgroundSecondary,
    },
    style,
  ];

  if (variant === 'glass' && Platform.OS === 'ios') {
    return (
      <BlurView 
        intensity={isDark ? 20 : 40} 
        tint={isDark ? 'dark' : 'light'}
        style={[cardStyle, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)' }]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[
      cardStyle, 
      variant === 'glass' && { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.85)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)'
      }
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
