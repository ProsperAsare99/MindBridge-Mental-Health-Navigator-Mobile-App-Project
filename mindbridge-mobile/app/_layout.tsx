import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

const InitialLayout = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const theme = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!userToken && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (userToken && inAuthGroup) {
      router.replace('/(tabs)/dashboard');
    }
  }, [userToken, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.plum} />
      </View>
    );
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
