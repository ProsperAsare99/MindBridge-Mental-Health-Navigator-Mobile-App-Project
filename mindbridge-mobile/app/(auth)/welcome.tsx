import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/theme/colors';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(1000).delay(300)} style={styles.iconContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.textContainer}>
          <Animated.Text entering={FadeInDown.delay(400).duration(800).springify()} style={styles.title}>
            MindBridge
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(600).duration(800).springify()} style={styles.subtitle}>
            Your personal compass for mental clarity and emotional resilience.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInDown.delay(800).duration(800).springify()} style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Begin Journey</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.6}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 100,
    marginLeft: -20, // Align with the left padding visually
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -20, // Visual balance push up slightly
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -1.2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    lineHeight: 28,
    letterSpacing: -0.2,
    paddingRight: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 64,
    borderRadius: 32, // Apple-style pill button
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  secondaryButton: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
    fontWeight: '500',
  }
});
