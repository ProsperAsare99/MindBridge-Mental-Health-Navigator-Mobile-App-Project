import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { ThemeProvider as NavigationProvider } from '@react-navigation/native';
import { AnimatedLogoLoader } from '../src/components/AnimatedLogoLoader';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
} from '@expo-google-fonts/montserrat';
import {
  Lora_400Regular,
  Lora_700Bold,
} from '@expo-google-fonts/lora';
import {
  DMSans_400Regular,
  DMSans_500Medium,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { userToken, userData, isLoading } = useContext(AuthContext);
  const theme = useTheme();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    // Montserrat — headings, UI, buttons
    'Montserrat-Regular':    Montserrat_400Regular,
    'Montserrat-Medium':     Montserrat_500Medium,
    'Montserrat-SemiBold':   Montserrat_600SemiBold,
    'Montserrat-Bold':       Montserrat_700Bold,
    'Montserrat-ExtraBold':  Montserrat_800ExtraBold,
    // Lora — body content, journal text
    'Lora-Regular':          Lora_400Regular,
    'Lora-Bold':             Lora_700Bold,
    // DM Sans — captions, metadata, secondary UI
    'DMSans-Regular':        DMSans_400Regular,
    'DMSans-Medium':         DMSans_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (isLoading || !fontsLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';
    const isOnboarding = segments[1] === 'onboarding';

    if (!userToken) {
      // Not logged in, redirect to welcome if not in auth group
      if (!inAuthGroup) {
        router.replace('/(auth)/welcome');
      }
    } else {
      // Logged in
      if (!userData?.isOnboarded) {
        // Not onboarded, redirect to onboarding if not already there
        if (!isOnboarding) {
          router.replace('/(auth)/onboarding');
        }
      } else {
        // Onboarded, redirect to tabs if still in auth group
        if (inAuthGroup) {
          router.replace('/(tabs)/dashboard');
        }
      }
    }
  }, [userToken, isLoading, userData, segments]);

  if (isLoading || !fontsLoaded) {
    return <AnimatedLogoLoader />;
  }

  const navigationTheme = {
    dark: theme.isDark,
    colors: {
      primary: theme.colors.plum,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text.primary,
      border: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      notification: theme.colors.semantic.danger,
    },
  };

  return (
    <NavigationProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </NavigationProvider>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
