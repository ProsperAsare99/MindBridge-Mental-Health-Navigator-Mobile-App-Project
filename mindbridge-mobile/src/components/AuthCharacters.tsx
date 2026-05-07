import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface EyeProps {
  size: number;
  pupilSize: number;
  isBlinking: boolean;
  lookAt: { x: number; y: number };
}

const Eye = ({ size, pupilSize, isBlinking, lookAt }: EyeProps) => {
  const pupilAnimX = useRef(new Animated.Value(0)).current;
  const pupilAnimY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pupilAnimX, {
      toValue: lookAt.x,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
    Animated.spring(pupilAnimY, {
      toValue: lookAt.y,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  }, [lookAt]);

  return (
    <View
      style={[
        styles.eyeBase,
        {
          width: size,
          height: isBlinking ? 2 : size,
          backgroundColor: 'white',
          borderRadius: size / 2,
        },
      ]}
    >
      {!isBlinking && (
        <Animated.View
          style={[
            styles.pupil,
            {
              width: pupilSize,
              height: pupilSize,
              borderRadius: pupilSize / 2,
              transform: [{ translateX: pupilAnimX }, { translateY: pupilAnimY }],
            },
          ]}
        />
      )}
    </View>
  );
};

interface SimplePupilProps {
  size: number;
  lookAt: { x: number; y: number };
}

const SimplePupil = ({ size, lookAt }: SimplePupilProps) => {
  const pupilAnimX = useRef(new Animated.Value(0)).current;
  const pupilAnimY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pupilAnimX, {
      toValue: lookAt.x,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
    Animated.spring(pupilAnimY, {
      toValue: lookAt.y,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  }, [lookAt]);

  return (
    <Animated.View
      style={[
        styles.pupil,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateX: pupilAnimX }, { translateY: pupilAnimY }],
        },
      ]}
    />
  );
};

export type AuthField = 'name' | 'email' | 'password' | 'none';

interface AuthCharactersProps {
  focusedField: AuthField;
  showPassword?: boolean;
}

const AuthCharacters = ({ focusedField, showPassword }: AuthCharactersProps) => {
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  
  // Idle breathing animation
  const breatheAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Blinking logic
  useEffect(() => {
    const blink = (setter: (v: boolean) => void) => {
      setter(true);
      setTimeout(() => setter(false), 150);
    };

    const purpleInterval = setInterval(() => {
      if (Math.random() > 0.7) blink(setIsPurpleBlinking);
    }, 3000);

    const blackInterval = setInterval(() => {
      if (Math.random() > 0.7) blink(setIsBlackBlinking);
    }, 4000);

    return () => {
      clearInterval(purpleInterval);
      clearInterval(blackInterval);
    };
  }, []);

  const getLookAt = (field: AuthField) => {
    switch (field) {
      case 'name': return { x: -2, y: -4 };
      case 'email': return { x: 0, y: -2 };
      case 'password': return { x: 2, y: 2 };
      default: return { x: 0, y: 0 };
    }
  };

  const lookAt = getLookAt(focusedField);

  // Peeking logic for purple
  const purpleLookAt = (showPassword && focusedField === 'password') ? { x: 4, y: 4 } : lookAt;

  return (
    <View style={styles.container}>
      <View style={styles.characterContainer}>
        {/* Purple Character (Back) */}
        <Animated.View
          style={[
            styles.purpleChar,
            {
              transform: [
                { translateY: breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
                { skewX: focusedField === 'password' ? '-5deg' : '0deg' }
              ],
            },
          ]}
        >
          <View style={styles.eyeRow}>
            <Eye size={14} pupilSize={6} isBlinking={isPurpleBlinking} lookAt={purpleLookAt} />
            <Eye size={14} pupilSize={6} isBlinking={isPurpleBlinking} lookAt={purpleLookAt} />
          </View>
        </Animated.View>

        {/* Black Character (Middle) */}
        <Animated.View
          style={[
            styles.blackChar,
            {
              transform: [
                { translateY: breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
                { skewX: focusedField === 'password' ? '5deg' : '0deg' }
              ],
            },
          ]}
        >
          <View style={styles.eyeRowSm}>
            <Eye size={12} pupilSize={5} isBlinking={isBlackBlinking} lookAt={lookAt} />
            <Eye size={12} pupilSize={5} isBlinking={isBlackBlinking} lookAt={lookAt} />
          </View>
        </Animated.View>

        {/* Orange Character (Front Left) */}
        <Animated.View
          style={[
            styles.orangeChar,
            {
              transform: [
                { translateY: breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
              ],
            },
          ]}
        >
          <View style={styles.pupilRow}>
            <SimplePupil size={8} lookAt={lookAt} />
            <SimplePupil size={8} lookAt={lookAt} />
          </View>
        </Animated.View>

        {/* Yellow Character (Front Right) */}
        <Animated.View
          style={[
            styles.yellowChar,
            {
              transform: [
                { translateY: breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) },
              ],
            },
          ]}
        >
          <View style={styles.pupilRowSm}>
            <SimplePupil size={8} lookAt={lookAt} />
            <SimplePupil size={8} lookAt={lookAt} />
          </View>
          <View style={styles.mouth} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 280,
    height: 160,
  },
  purpleChar: {
    position: 'absolute',
    bottom: 0,
    left: 40,
    width: 90,
    height: 150,
    backgroundColor: '#6C3FF5',
    borderRadius: 12,
    zIndex: 1,
    paddingTop: 25,
    alignItems: 'center',
  },
  blackChar: {
    position: 'absolute',
    bottom: 0,
    left: 110,
    width: 70,
    height: 120,
    backgroundColor: '#2D2D2D',
    borderRadius: 10,
    zIndex: 2,
    paddingTop: 20,
    alignItems: 'center',
  },
  orangeChar: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: 120,
    height: 80,
    backgroundColor: '#FF9B6B',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    zIndex: 3,
    paddingTop: 30,
    alignItems: 'center',
  },
  yellowChar: {
    position: 'absolute',
    bottom: 0,
    left: 150,
    width: 80,
    height: 100,
    backgroundColor: '#E8D754',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 4,
    paddingTop: 20,
    alignItems: 'center',
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 15,
  },
  eyeRowSm: {
    flexDirection: 'row',
    gap: 10,
  },
  pupilRow: {
    flexDirection: 'row',
    gap: 25,
  },
  pupilRowSm: {
    flexDirection: 'row',
    gap: 12,
  },
  eyeBase: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pupil: {
    backgroundColor: '#2D2D2D',
  },
  mouth: {
    width: 30,
    height: 3,
    backgroundColor: '#2D2D2D',
    borderRadius: 2,
    marginTop: 15,
  },
});

export default AuthCharacters;
