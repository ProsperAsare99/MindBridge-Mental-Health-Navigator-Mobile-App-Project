import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { DURATIONS } from '../constants/animations';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) => {
  const theme = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { 
        duration: DURATIONS.movement, 
        easing: Easing.inOut(Easing.ease) 
      }),
      -1, // infinite loop
      true // reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
        },
        animatedStyle,
        style
      ]} 
    />
  );
};
