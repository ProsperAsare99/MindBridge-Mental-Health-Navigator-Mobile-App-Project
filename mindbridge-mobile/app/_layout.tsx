import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../src/theme/colors';

const InitialLayout = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!userToken && !inAuthGroup) {
      // Redirect to welcome screen
      router.replace('/(auth)/welcome');
    } else if (userToken && inAuthGroup) {
      // Redirect to dashboard
      router.replace('/(tabs)/dashboard');
    }
  }, [userToken, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <Slot />; // Renders the matched route
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
