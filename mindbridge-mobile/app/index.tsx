import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../src/context/AuthContext';
import { AnimatedLogoLoader } from '../src/components/AnimatedLogoLoader';

export default function Index() {
  const { userToken, isLoading } = useContext(AuthContext);
  const theme = useTheme();

  if (isLoading) {
    return <AnimatedLogoLoader />;
  }

  if (userToken) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
