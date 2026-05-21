import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { View } from 'react-native';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { AnimatedLogoLoader } from '../src/components/AnimatedLogoLoader';
import { 
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold 
} from '@expo-google-fonts/poppins';
import { OpenSans_400Regular, OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const { userToken, userData, isLoading } = useContext(AuthContext);
  const theme = useTheme();
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-ExtraBold': Poppins_800ExtraBold,
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Lato-Regular': Lato_400Regular,
    'Lato-Bold': Lato_700Bold,
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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
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
