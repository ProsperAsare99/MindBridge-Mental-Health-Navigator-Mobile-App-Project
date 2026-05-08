import { Redirect } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../src/theme/colors';

export default function Index() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.plum} />
      </View>
    );
  }

  if (userToken) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
