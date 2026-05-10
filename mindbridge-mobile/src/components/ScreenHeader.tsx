import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const ScreenHeader = ({ 
  title, 
  subtitle, 
  showBack = false, 
  onBack, 
  rightAction 
}: ScreenHeaderProps) => {
  const theme = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <ChevronLeft color={theme.colors.plum} size={28} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        {rightAction && (
          <View style={styles.rightActionContainer}>
            {rightAction}
          </View>
        )}
      </View>

      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </Animated.View>

      {/* Subtle bottom separator gradient */}
      <LinearGradient 
        colors={[
          theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          'transparent'
        ]}
        style={styles.separator}
      />
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    marginBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    marginLeft: -12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 44,
  },
  rightActionContainer: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  content: {
    marginTop: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 22,
  },
  separator: {
    height: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 24,
  }
});
