import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import {
  BookOpen,
  ClipboardList,
  Library,
  ShieldAlert,
  Users,
  Settings,
  Bot,
  Wind,
  ChevronRight,
  MoreVertical,
} from 'lucide-react-native';

const getToolGroups = (theme: any) => [
  {
    title: 'Daily Growth',
    items: [
      { id: 'ai-guide', title: 'MindBridge Oracle', subtitle: 'Your private safe space', icon: Bot, color: theme.colors.plum },
      { id: 'garden', title: 'Mood Tracker', subtitle: 'Log your feelings', icon: Wind, color: theme.colors.accents.eucalyptus },
      { id: 'journal', title: 'Unified Journal', subtitle: 'Write your thoughts', icon: BookOpen, color: theme.colors.accents.powderBlue },
    ]
  },
  {
    title: 'Knowledge & Checks',
    items: [
      { id: 'assessments', title: 'Clinical Assessments', subtitle: 'Check your wellness', icon: ClipboardList, color: theme.colors.accents.slate },
      { id: 'resources', title: 'Resource Library', subtitle: 'Articles & audio guides', icon: Library, color: theme.colors.accents.forestGreen },
    ]
  },
  {
    title: 'Support & Connection',
    items: [
      { id: 'community', title: 'Support Community', subtitle: 'Connect anonymously', icon: Users, color: theme.colors.plum },
      { id: 'crisis', title: 'Crisis Support', subtitle: 'Get immediate help', icon: ShieldAlert, color: theme.colors.accents.terracotta },
    ]
  },
  {
    title: 'App',
    items: [
      { id: 'settings', title: 'Settings', subtitle: 'App preferences & account', icon: Settings, color: theme.colors.text.secondary },
    ]
  }
];

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const themeContext = useTheme();
  const styles = createStyles(themeContext);
  const TOOL_GROUPS = getToolGroups(themeContext);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={themeContext.isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={[themeContext.colors.background, themeContext.colors.backgroundSecondary, themeContext.colors.backgroundSecondary]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title="Explore" 
          subtitle="All your MindBridge tools in one place."
          rightAction={
            <TouchableOpacity>
              <MoreVertical color={themeContext.colors.text.secondary} size={24} />
            </TouchableOpacity>
          }
        />

        <View style={{ height: 20 }} />

        {TOOL_GROUPS.map((group, groupIndex) => (
          <Animated.View
            key={group.title}
            style={styles.groupContainer}
            entering={FadeInUp.duration(600).delay(groupIndex * 100)}
          >
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.listContainer}>
              {group.items.map((page, index) => (
                <View key={page.id}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.listItem}
                    onPress={() => router.push(`/(tabs)/${page.id}` as any)}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: page.color + (themeContext.isDark ? '25' : '15') }]}>
                      <page.icon color={page.color} size={22} />
                    </View>
                    <View style={styles.textWrap}>
                      <Text style={styles.itemTitle}>{page.title}</Text>
                      <Text style={styles.itemSubtitle}>{page.subtitle}</Text>
                    </View>
                    <ChevronRight color={themeContext.colors.text.disabled} size={20} />
                  </TouchableOpacity>
                  {index < group.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: 0, // Reset padding for ScreenHeader to handle it
    paddingBottom: 120
  },
  groupContainer: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  listContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.2 : 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  itemSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    marginLeft: 76,
  }
});
