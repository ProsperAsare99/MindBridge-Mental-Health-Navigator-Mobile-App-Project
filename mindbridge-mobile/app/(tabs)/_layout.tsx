import { Tabs } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { LayoutDashboard, User, Compass, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.plum,
      tabBarInactiveTintColor: theme.colors.text.secondary,
      tabBarStyle: { 
        backgroundColor: theme.colors.surface, 
        borderTopColor: theme.isDark ? 'rgba(255,255,255,0.05)' : theme.colors.accents.softLilac,
        elevation: 0,
        shadowOpacity: 0,
        height: 60 + insets.bottom,
        paddingBottom: 8 + insets.bottom,
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
        name="tools" 
        options={{ 
          title: 'Explore',
          tabBarIcon: ({ color }) => <Compass color={color} size={24} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />
        }} 
      />
      {/* Hidden Screens */}
      <Tabs.Screen name="journey" options={{ href: null, title: 'Wellness Journey' }} />
      <Tabs.Screen name="garden" options={{ href: null, title: 'Mood Garden' }} />
      <Tabs.Screen name="ai-guide" options={{ href: null, title: 'AI Guide' }} />
      <Tabs.Screen name="crisis" options={{ href: null, title: 'Crisis Support' }} />
      <Tabs.Screen name="journal" options={{ href: null, title: 'Journal' }} />
      <Tabs.Screen name="assessments" options={{ href: null, title: 'Assessments' }} />
      <Tabs.Screen name="resources" options={{ href: null, title: 'Resources' }} />
      <Tabs.Screen name="community" options={{ href: null, title: 'Community' }} />
    </Tabs>
  );
}
