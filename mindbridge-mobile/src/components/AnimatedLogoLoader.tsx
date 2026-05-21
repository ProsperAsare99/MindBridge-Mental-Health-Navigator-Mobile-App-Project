import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { DURATIONS, easeInOut } from '../constants/animations';

const { width } = Dimensions.get('window');

export const AnimatedLogoLoader = () => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { 
        duration: DURATIONS.movement * 2, 
        easing: easeInOut 
      }),
      -1, // infinite loop
      true // reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[
        styles.circle, 
        { 
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.plum,
          shadowOpacity: theme.isDark ? 0.3 : 0.1,
        }
      ]}>
        <Animated.Image 
          source={require('../../assets/images/logo.png')} 
          style={[styles.logo, animatedStyle]} 
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
