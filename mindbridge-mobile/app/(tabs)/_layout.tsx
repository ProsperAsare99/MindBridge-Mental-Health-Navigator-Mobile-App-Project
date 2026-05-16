import { Tabs } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { LayoutDashboard, User, Flower2, MessageCircle, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.plum,
      tabBarInactiveTintColor: theme.colors.text.secondary,
      tabBarShowLabel: true,
      tabBarLabelStyle: { 
        fontFamily: theme.typography.fonts.header, 
        fontSize: 10,
        marginBottom: 4
      },
      tabBarStyle: { 
        position: 'absolute',
        backgroundColor: theme.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)',
        borderTopWidth: 0,
        height: 64 + insets.bottom,
        paddingBottom: insets.bottom,
        elevation: 0,
      },
      tabBarBackground: () => (
        <BlurView 
          intensity={theme.isDark ? 50 : 80} 
          tint={theme.isDark ? 'dark' : 'light'} 
          style={StyleSheet.absoluteFill} 
        />
      ),
      headerShown: false,
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Today',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} strokeWidth={2} />
        }} 
      />
      <Tabs.Screen 
        name="garden" 
        options={{ 
          title: 'Garden',
          tabBarIcon: ({ color }) => <Flower2 color={color} size={24} strokeWidth={2} />
        }} 
      />
      <Tabs.Screen 
        name="ai-guide" 
        options={{ 
          title: 'Oracle',
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} strokeWidth={2} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} strokeWidth={2} />
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} size={24} strokeWidth={2} />
        }} 
      />
      
      {/* Hidden Utility Screens */}
      <Tabs.Screen name="journey" options={{ href: null }} />
      <Tabs.Screen name="crisis" options={{ href: null }} />
      <Tabs.Screen name="journal" options={{ href: null }} />
      <Tabs.Screen name="assessments" options={{ href: null }} />
      <Tabs.Screen name="resources" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="tools" options={{ href: null }} />
    </Tabs>
  );
}
