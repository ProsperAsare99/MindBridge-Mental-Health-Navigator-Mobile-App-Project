import { Tabs } from 'expo-router';
import { theme } from '../../src/theme/colors';
import { LayoutDashboard, Leaf, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.plum,
      tabBarInactiveTintColor: theme.colors.text.secondary,
      tabBarStyle: { 
        backgroundColor: theme.colors.surface, 
        borderTopColor: theme.colors.accents.softLilac,
        elevation: 0,
        shadowOpacity: 0,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8
      },
      headerStyle: { backgroundColor: theme.colors.surface },
      headerTintColor: theme.colors.plum,
      headerTitleStyle: { fontWeight: '800' },
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />
        }} 
      />
      <Tabs.Screen 
        name="garden" 
        options={{ 
          title: 'Mood Garden',
          tabBarIcon: ({ color }) => <Leaf color={color} size={24} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />
        }} 
      />
      {/* Hidden Screens */}
      <Tabs.Screen name="ai-guide" options={{ href: null, title: 'AI Guide' }} />
      <Tabs.Screen name="crisis" options={{ href: null, title: 'Crisis Support' }} />
      <Tabs.Screen name="journal" options={{ href: null, title: 'Journal' }} />
      <Tabs.Screen name="assessments" options={{ href: null, title: 'Assessments' }} />
      <Tabs.Screen name="resources" options={{ href: null, title: 'Resources' }} />
      <Tabs.Screen name="community" options={{ href: null, title: 'Community' }} />
      <Tabs.Screen name="settings" options={{ href: null, title: 'Settings' }} />
    </Tabs>
  );
}
