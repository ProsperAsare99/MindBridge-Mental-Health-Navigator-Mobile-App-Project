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
  Activity,
  Leaf,
} from 'lucide-react-native';

const getToolGroups = (theme: any, t: any) => [
  {
    title: 'Daily Growth',
    items: [
      { id: 'ai-guide', title: 'AI Companion', subtitle: 'Your supportive mental health guide', icon: Bot, color: theme.colors.plum },
      { id: 'garden', title: 'Mindful Garden', subtitle: 'Nurture your peaceful mental space', icon: Leaf, color: theme.colors.accents.eucalyptus },
      { id: 'journal', title: 'Clarity Journal', subtitle: 'Write your way to deeper insight', icon: BookOpen, color: theme.colors.accents.powderBlue },
      { id: 'breathing', title: 'Deep Breathing', subtitle: '4-7-8 relaxing breathwork session', icon: Wind, color: theme.colors.accents.gentlePeach, isNotTab: true },
      { id: 'grounding', title: '5-4-3-2-1 Grounding', subtitle: 'Sensory awareness exercise', icon: Activity, color: theme.colors.accents.powderBlue, isNotTab: true },
    ]
  },
  {
    title: 'Knowledge & Exploration',
    items: [
      { id: 'assessments', title: 'Wellness Checks', subtitle: 'Track and understand your mood', icon: ClipboardList, color: theme.colors.accents.slate },
      { id: 'explore', title: 'Resource Library', subtitle: 'Curated articles, guides & audio', icon: Library, color: theme.colors.accents.forestGreen },
    ]
  },
  {
    title: 'Support & Connection',
    items: [
      { id: 'community', title: 'Community Spaces', subtitle: 'Connect with peers who understand', icon: Users, color: theme.colors.plum },
      { id: 'crisis', title: 'Crisis Support', subtitle: 'Immediate help and safe resources', icon: ShieldAlert, color: theme.colors.accents.terracotta },
    ]
  },
  {
    title: 'App Preferences',
    items: [
      { id: 'settings', title: 'Settings', subtitle: 'Manage your app experience', icon: Settings, color: theme.colors.text.secondary },
    ]
  }
];

export default function ToolsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { t } = theme;
  const styles = createStyles(theme);
  const TOOL_GROUPS = getToolGroups(theme, t);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary, theme.colors.backgroundSecondary]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title="All Tools" 
          subtitle="Discover exercises, resources, and support tailored to your journey."
          rightAction={
            <TouchableOpacity>
              <MoreVertical color={theme.colors.text.secondary} size={24} />
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
                    onPress={() => {
                      if (page.isNotTab) {
                        router.push(`/${page.id}` as any);
                      } else {
                        router.push(`/(tabs)/${page.id}` as any);
                      }
                    }}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: page.color + (theme.isDark ? '25' : '15') }]}>
                      <page.icon color={page.color} size={22} />
                    </View>
                    <View style={styles.textWrap}>
                      <Text style={styles.itemTitle}>{page.title}</Text>
                      <Text style={styles.itemSubtitle}>{page.subtitle}</Text>
                    </View>
                    <ChevronRight color={theme.colors.text.disabled} size={20} />
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
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '800',
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    letterSpacing: -0.3,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    marginLeft: 76,
  }
});
