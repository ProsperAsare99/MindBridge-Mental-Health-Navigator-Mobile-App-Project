import { Tabs } from 'expo-router';
import { theme } from '../../src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: '#333' },
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.text.primary,
    }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="garden" options={{ title: 'Mood Garden' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
