import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { theme } from '../../src/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
} from 'lucide-react-native';

const TOOL_GROUPS = [
  {
    title: 'Daily Growth',
    items: [
      { id: 'ai-guide', title: 'Personalized AI Guide', subtitle: 'Your private safe space', icon: Bot, color: theme.colors.plum },
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary, theme.colors.backgroundSecondary]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>All your MindBridge tools{'\n'}in one place.</Text>
        </Animated.View>

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
                    <View style={[styles.iconWrap, { backgroundColor: page.color + '15' }]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: theme.colors.text.primary,
    letterSpacing: -1,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 22
  },
  groupContainer: {
    marginBottom: 32,
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
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginLeft: 76,
  }
});
