import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
  Modal,

} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import {
  Library,
  Headphones,
  Wind,
  Play,
  FileText,
  BookOpen,
  Brain,
  Waves,
  Sun,
  Users,
  MessageSquare,
  Shield,
  Globe,
  Moon,
  Heart,
  Activity,
  Compass,
  Zap,
  Star,
  Clock,
  ChevronRight,
  X,
  ExternalLink,
  Podcast,
  Video,
  Lightbulb,
  Coffee,
  Smile,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Library },
  { id: 'techniques', label: 'Techniques', icon: Zap },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'audio', label: 'Audio & Podcasts', icon: Headphones },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'crisis', label: 'Crisis Support', icon: AlertCircle },
];

const FEATURED = {
  title: 'The 5-Minute Mind Reset',
  subtitle: 'A quick science-backed technique to interrupt anxiety spirals and recenter yourself anywhere, anytime.',
  category: 'FEATURED · TECHNIQUE',
  color: ['#6366F1', '#8B5CF6'] as [string, string],
  readTime: '5 min read',
  content: `When anxiety or stress hits, your brain goes into "fight-or-flight" mode, flooding your body with cortisol. The 5-Minute Mind Reset uses three proven techniques to interrupt this cycle:

**1. Physiological Sigh (1 min)**
Take a double inhale through your nose (sniff-sniff), then a long slow exhale through your mouth. Repeat 3–5 times. This rapidly lowers heart rate.

**2. 5-4-3-2-1 Grounding (2 min)**
Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This activates your prefrontal cortex.

**3. Self-Compassion Statement (2 min)**
Place your hand on your heart and say: "This is a moment of difficulty. Many people feel this way. May I be kind to myself right now."

Practice this daily to build your stress resilience muscle.`,
};

const TECHNIQUES = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    subtitle: 'Calm your nervous system in 4 minutes',
    description: 'Used by Navy SEALs and elite athletes, box breathing (4-4-4-4) activates the parasympathetic nervous system to reduce acute stress and anxiety.',
    icon: Wind,
    color: '#06B6D4',
    tag: 'Anxiety Relief',
    duration: '4 min',
    steps: [
      'Breathe in through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale through your mouth for 4 counts',
      'Hold empty for 4 counts',
      'Repeat 4–8 cycles',
    ],
    route: '/breathing',
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    subtitle: 'Interrupt anxiety with your senses',
    description: 'This mindfulness technique grounds you in the present moment by activating all five senses, pulling attention away from anxious thoughts.',
    icon: Compass,
    color: '#10B981',
    tag: 'Mindfulness',
    duration: '5 min',
    steps: [
      'Name 5 things you can SEE',
      'Name 4 things you can TOUCH (and touch them)',
      'Name 3 things you can HEAR',
      'Name 2 things you can SMELL',
      'Name 1 thing you can TASTE',
    ],
    route: '/grounding',
  },
  {
    id: 'progressive-muscle',
    title: 'Progressive Muscle Relaxation',
    subtitle: 'Release physical tension from your body',
    description: 'Systematically tensing and releasing muscle groups trains your body to recognize and release tension — effective for anxiety, insomnia, and physical stress.',
    icon: Activity,
    color: '#F59E0B',
    tag: 'Body & Mind',
    duration: '10 min',
    steps: [
      'Find a comfortable seated or lying position',
      'Starting with your feet, tense each muscle group for 5 seconds',
      'Release and notice the sensation of relaxation for 10 seconds',
      'Move upward: calves, thighs, abdomen, chest, hands, arms, shoulders, face',
      'End with 3 deep breaths',
    ],
    route: null,
  },
  {
    id: 'thought-defusion',
    title: 'Cognitive Defusion',
    subtitle: 'Detach from unhelpful thoughts',
    description: 'An ACT (Acceptance & Commitment Therapy) technique that creates distance between you and your thoughts so you can respond rather than react.',
    icon: Brain,
    color: '#8B5CF6',
    tag: 'CBT / ACT',
    duration: '5 min',
    steps: [
      'Notice a troubling thought (e.g., "I\'m a failure")',
      'Add the prefix: "I\'m having the thought that I\'m a failure"',
      'Then add: "I notice I\'m having the thought that..."',
      'Observe the thought as just a thought — not a fact',
      'Ask: What would I do right now if this thought wasn\'t holding me back?',
    ],
    route: null,
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Reset Protocol',
    subtitle: 'Science-backed habits for better rest',
    description: 'Poor sleep dramatically worsens anxiety, depression, and cognitive performance. This protocol uses circadian science to rebuild healthy sleep patterns.',
    icon: Moon,
    color: '#6366F1',
    tag: 'Sleep',
    duration: '15 min read',
    steps: [
      'Set a consistent wake time (even weekends) — this is the most important step',
      'Get bright light within 30 minutes of waking',
      'Avoid caffeine after 2pm',
      'Keep your room cool (18–19°C / 65–67°F)',
      'Begin a 30-min wind-down routine: no screens, dim lights, journaling or light reading',
    ],
    route: null,
  },
  {
    id: 'behavioral-activation',
    title: 'Behavioral Activation',
    subtitle: 'Break the depression cycle',
    description: 'A first-line CBT technique for depression that combats the "withdrawal-low mood-more withdrawal" cycle by scheduling small, meaningful activities.',
    icon: Sun,
    color: '#F97316',
    tag: 'Depression',
    duration: '10 min',
    steps: [
      'List 10 activities that used to bring you joy or a sense of achievement',
      'Rate each on how much energy it requires (1-10)',
      'Schedule 1–2 low-energy activities for today',
      'After doing them, rate your mood before and after',
      'Gradually add more activities as momentum builds',
    ],
    route: null,
  },
];

const ARTICLES = [
  {
    id: 'burnout-signs',
    title: 'The 7 Warning Signs of Student Burnout',
    subtitle: 'Recognize it before it floors you',
    category: 'Burnout',
    color: '#EF4444',
    icon: AlertCircle,
    readTime: '6 min',
    content: `Student burnout is more than being tired. It's a state of chronic stress that leads to physical and emotional exhaustion, cynicism, and feelings of ineffectiveness.

**7 Warning Signs:**

1. **Emotional Exhaustion** — Feeling drained even after sleeping
2. **Cynicism & Detachment** — Not caring about academics or relationships you once valued
3. **Reduced Academic Efficacy** — Feeling like nothing you do matters
4. **Physical Symptoms** — Frequent headaches, getting sick often, appetite changes
5. **Cognitive Fog** — Difficulty concentrating, forgetting things, poor decision-making
6. **Social Withdrawal** — Avoiding friends and family
7. **Loss of Enjoyment** — Things that used to bring pleasure feel hollow

**What to do:** If you identify with 4 or more, consider speaking to your university counseling center. Recovery from burnout takes intentional rest, not just a weekend off.`,
  },
  {
    id: 'anxiety-vs-stress',
    title: 'Anxiety vs. Stress: Know the Difference',
    subtitle: 'They feel similar but require different approaches',
    category: 'Anxiety',
    color: '#06B6D4',
    icon: Waves,
    readTime: '4 min',
    content: `Many students use "stressed" and "anxious" interchangeably — but they're different, and treating one like the other can backfire.

**Stress** is a response to an external trigger (an exam, a deadline). It resolves when the trigger is removed.

**Anxiety** is worry that persists even when there's no immediate threat. It's often future-oriented ("What if...") and can exist without a clear cause.

**Key difference:** After your exam is over, does the worry stop? If yes, that's stress. If it lingers or shifts to a new worry immediately, it may be anxiety.

**Both can be managed with:**
- Breathing exercises
- Regular exercise
- Sleep hygiene
- Social support

**Anxiety may also need:**
- Cognitive-behavioral therapy (CBT)
- Medication (consult a professional)
- Mindfulness-based stress reduction (MBSR)`,
  },
  {
    id: 'social-media-mental-health',
    title: 'Social Media & Your Mental Health',
    subtitle: 'The science behind the scroll',
    category: 'Digital Wellbeing',
    color: '#EC4899',
    icon: Globe,
    readTime: '5 min',
    content: `Research from the University of Pennsylvania (Hunt et al., 2018) found that limiting social media to 30 minutes per day led to significant reductions in loneliness and depression in young adults.

**Why it affects us:**
- **Social comparison** activates the same brain regions as physical pain
- **Variable reward loops** (likes, comments) create dopamine-driven compulsive checking
- **Highlight reel effect** — you see everyone's best moments vs your own everyday reality

**Evidence-based strategies:**
1. Turn off notifications and check at set times
2. Unfollow accounts that make you feel worse about yourself
3. Use screen time trackers (iOS Screen Time / Android Digital Wellbeing)
4. Replace 10 minutes of scrolling with a real-world activity
5. Practice intentional use: set a purpose before opening any app`,
  },
  {
    id: 'self-compassion',
    title: 'Why Self-Compassion Outperforms Self-Esteem',
    subtitle: 'The research is clear',
    category: 'Self-Care',
    color: '#8B5CF6',
    icon: Heart,
    readTime: '7 min',
    content: `Dr. Kristin Neff's research shows that self-compassion — being kind to yourself when you fail — is more psychologically healthy than high self-esteem.

**Why self-esteem can backfire:**
High self-esteem requires feeling special or above average. When you fail, self-esteem crashes. It also promotes defensiveness and narcissism.

**Self-compassion has 3 components (Neff):**
1. **Self-kindness** — Treat yourself as you'd treat a good friend
2. **Common humanity** — Recognize that struggle is part of being human
3. **Mindfulness** — Hold painful thoughts and feelings in balanced awareness

**The evidence:**
- Lower depression and anxiety
- Greater emotional resilience
- More motivation after failure
- Better physical health behaviors

**Try:** When you make a mistake, ask "What would I say to a friend in this exact situation?" Then say that to yourself.`,
  },
  {
    id: 'study-mental-health',
    title: 'How to Study Without Sacrificing Mental Health',
    subtitle: 'The Pomodoro method and beyond',
    category: 'Academic Stress',
    color: '#10B981',
    icon: BookOpen,
    readTime: '5 min',
    content: `Academic pressure is real — but your study habits can either protect or destroy your mental health. Here's what science says:

**The Pomodoro Technique:**
25 minutes of focused work → 5-minute break → repeat. After 4 rounds, take a 15-30 minute break. This matches the brain's natural attention cycles.

**Spaced Repetition:**
Reviewing material at increasing intervals (1 day → 3 days → 7 days) dramatically improves retention, meaning less total study time.

**The most important habits:**
- **Sleep first** — Studying on 5 hours sleep is like being legally drunk
- **Move daily** — Even a 20-minute walk improves focus and mood
- **Single-tasking** — Multitasking reduces productivity by 40%
- **Start before you're ready** — The hardest part is beginning; momentum follows

**Warning sign:** If you're studying 12+ hours daily and still feel behind, the problem isn't effort — it's strategy or workload. Talk to an academic counselor.`,
  },
  {
    id: 'grief-loss',
    title: 'Navigating Grief at University',
    subtitle: 'Loss doesn\'t pause for exam season',
    category: 'Grief',
    color: '#F59E0B',
    icon: Smile,
    readTime: '6 min',
    content: `Grief is a natural response to loss — not just death, but breakups, moving away from home, losing a friendship, or even the gap between who you expected to be and who you are.

**The Kübler-Ross model (5 stages) isn't linear:**
Denial → Anger → Bargaining → Depression → Acceptance can happen in any order, and you can revisit stages multiple times.

**What helps:**
- Allow yourself to feel — suppression prolongs grief
- Maintain basic routines (eating, sleeping, moving)
- Reach out; isolation amplifies pain
- Give yourself permission to experience joy without guilt

**What doesn't help:**
- "Getting over it" on a timeline
- Comparing your grief to others' ("at least...")
- Substance use as coping

**University accommodations:** Most universities offer bereavement leave and exam deferrals. Don't suffer in silence — contact your student services office.`,
  },
];

const AUDIO_RESOURCES = [
  {
    id: 'self-compassion-audio',
    title: 'Quiet the Inner Critic',
    subtitle: 'A guided meditation on self-compassion',
    host: 'MindBridge Guided Series',
    duration: '10 min',
    icon: Heart,
    color: '#F59E0B',
    tag: 'Meditation',
    url: 'https://insighttimer.com',
  },
  {
    id: 'anxiety-podcast',
    title: 'Therapy in a Nutshell',
    subtitle: 'Science-based mental health education',
    host: 'Emma McAdam, LMFT',
    duration: 'Podcast · YouTube',
    icon: Podcast,
    color: '#EC4899',
    tag: 'Psychology',
    url: 'https://youtube.com/@TherapyinaNutshell',
  },
  {
    id: 'sleep-meditation',
    title: 'Body Scan for Sleep',
    subtitle: 'Fall asleep with progressive relaxation',
    host: 'MindBridge Guided Series',
    duration: '20 min',
    icon: Moon,
    color: '#6366F1',
    tag: 'Sleep',
    url: 'https://insighttimer.com',
  },
  {
    id: 'huberman',
    title: 'Huberman Lab',
    subtitle: 'Neuroscience tools for everyday life',
    host: 'Dr. Andrew Huberman, Stanford',
    duration: 'Podcast · Spotify',
    icon: Brain,
    color: '#06B6D4',
    tag: 'Neuroscience',
    url: 'https://hubermanlab.com',
  },
  {
    id: 'morning-mindfulness',
    title: '5-Minute Morning Mindfulness',
    subtitle: 'Start your day with clarity and intention',
    host: 'MindBridge Guided Series',
    duration: '5 min',
    icon: Sun,
    color: '#10B981',
    tag: 'Mindfulness',
    url: 'https://insighttimer.com',
  },
  {
    id: 'feeling-good',
    title: 'Feeling Good Podcast',
    subtitle: 'Live CBT therapy sessions with commentary',
    host: 'Dr. David Burns',
    duration: 'Podcast · Free',
    icon: Smile,
    color: '#F97316',
    tag: 'CBT',
    url: 'https://feelinggood.com/category/podcasts',
  },
];

const CRISIS_RESOURCES = [
  {
    id: 'befrienders',
    title: 'Befrienders Ghana',
    subtitle: 'Crisis listening service — you are not alone',
    detail: 'Free, confidential emotional support for anyone in distress',
    phone: '+233 50 165 6789',
    color: '#EF4444',
    icon: Heart,
    available: '24/7',
  },
  {
    id: 'ug-counseling',
    title: 'UG Careers & Counselling Services',
    subtitle: 'University of Ghana official counseling',
    detail: 'Mental health, academic, and career counseling',
    phone: '+233 (0) 245 945 752',
    color: '#8B5CF6',
    icon: Users,
    available: 'Mon–Fri, 8am–5pm',
  },
  {
    id: 'knust-counseling',
    title: 'KNUST Counseling Centre',
    subtitle: 'Kwame Nkrumah University counseling',
    detail: 'Professional psychological support for students',
    phone: '+233 50 644 9747',
    color: '#06B6D4',
    icon: Shield,
    available: 'Mon–Fri, 9am–4pm',
  },
  {
    id: 'mental-health-authority',
    title: 'Mental Health Authority Ghana',
    subtitle: 'National mental health regulatory body',
    detail: 'Referrals to mental health facilities nationwide',
    phone: '+233 302 664 646',
    color: '#10B981',
    icon: Globe,
    available: 'Mon–Fri, 8am–5pm',
  },
];

// ─── ARTICLE MODAL COMPONENT ──────────────────────────────────────────────────
const ArticleModal = ({ article, visible, onClose, theme }: any) => {
  if (!article) return null;
  const styles = createStyles(theme);
  const IconComponent = article.icon;

  const renderContent = (content: string) => {
    const lines = content.split('\n').filter(l => l.trim() !== '');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Text key={i} style={[styles.articleModalHeading, { color: theme.colors.text.primary }]}>
            {line.slice(2, -2)}
          </Text>
        );
      }
      const boldPattern = /\*\*(.*?)\*\*/g;
      const parts: any[] = [];
      let lastIndex = 0;
      let match;
      while ((match = boldPattern.exec(line)) !== null) {
        if (match.index > lastIndex) parts.push({ text: line.slice(lastIndex, match.index), bold: false });
        parts.push({ text: match[1], bold: true });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) parts.push({ text: line.slice(lastIndex), bold: false });

      return (
        <Text key={i} style={[styles.articleModalBody, { color: theme.colors.text.secondary }]}>
          {parts.map((p, j) => (
            <Text key={j} style={p.bold ? { fontWeight: '700', color: theme.colors.text.primary } : {}}>
              {p.text}
            </Text>
          ))}
        </Text>
      );
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <X color={theme.colors.text.secondary} size={22} />
          </TouchableOpacity>
          <View style={[styles.modalCategoryBadge, { backgroundColor: article.color + '20' }]}>
            <Text style={[styles.modalCategoryText, { color: article.color }]}>{article.category}</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.modalIconWrap, { backgroundColor: article.color + '15' }]}>
            <IconComponent color={article.color} size={32} />
          </View>
          <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>{article.title}</Text>
          <View style={styles.modalMeta}>
            <Clock color={theme.colors.text.tertiary} size={14} />
            <Text style={[styles.modalMetaText, { color: theme.colors.text.tertiary }]}>{article.readTime} read</Text>
          </View>
          <View style={[styles.modalDivider, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]} />
          <View style={styles.modalContentWrap}>
            {renderContent(article.content)}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// ─── TECHNIQUE MODAL COMPONENT ────────────────────────────────────────────────
const TechniqueModal = ({ technique, visible, onClose, theme, router }: any) => {
  if (!technique) return null;
  const styles = createStyles(theme);
  const IconComponent = technique.icon;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <X color={theme.colors.text.secondary} size={22} />
          </TouchableOpacity>
          <View style={[styles.modalCategoryBadge, { backgroundColor: technique.color + '20' }]}>
            <Text style={[styles.modalCategoryText, { color: technique.color }]}>{technique.tag}</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.modalIconWrap, { backgroundColor: technique.color + '15' }]}>
            <IconComponent color={technique.color} size={32} />
          </View>
          <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>{technique.title}</Text>
          <View style={styles.modalMeta}>
            <Clock color={theme.colors.text.tertiary} size={14} />
            <Text style={[styles.modalMetaText, { color: theme.colors.text.tertiary }]}>{technique.duration}</Text>
          </View>
          <Text style={[styles.techniqueDesc, { color: theme.colors.text.secondary }]}>{technique.description}</Text>
          <View style={[styles.modalDivider, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]} />
          <Text style={[styles.stepsTitle, { color: theme.colors.text.primary }]}>How to do it</Text>
          {technique.steps.map((step: string, i: number) => (
            <View key={i} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: technique.color + '20' }]}>
                <Text style={[styles.stepNumText, { color: technique.color }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.colors.text.secondary }]}>{step}</Text>
            </View>
          ))}
          {technique.route && (
            <TouchableOpacity
              style={[styles.practiceBtn, { backgroundColor: technique.color }]}
              onPress={() => { onClose(); router.push(technique.route); }}
            >
              <Play color="#FFF" size={18} fill="#FFF" />
              <Text style={styles.practiceBtnText}>Start Guided Practice</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};


// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null);
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const [techniqueModalVisible, setTechniqueModalVisible] = useState(false);
  const [featuredExpanded, setFeaturedExpanded] = useState(false);

  const openArticle = (article: any) => {
    setSelectedArticle(article);
    setArticleModalVisible(true);
  };

  const openTechnique = (technique: any) => {
    setSelectedTechnique(technique);
    setTechniqueModalVisible(true);
  };

  const showTechniques = activeCategory === 'all' || activeCategory === 'techniques';
  const showArticles = activeCategory === 'all' || activeCategory === 'articles';
  const showAudio = activeCategory === 'all' || activeCategory === 'audio';
  const showCrisis = activeCategory === 'all' || activeCategory === 'crisis';

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={
          theme.isDark
            ? ['rgba(99, 102, 241, 0.08)', theme.colors.background, theme.colors.backgroundSecondary]
            : ['rgba(99, 102, 241, 0.05)', theme.colors.background, theme.colors.backgroundSecondary]
        }
        locations={[0, 0.25, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      <ArticleModal
        article={selectedArticle}
        visible={articleModalVisible}
        onClose={() => setArticleModalVisible(false)}
        theme={theme}
      />
      <TechniqueModal
        technique={selectedTechnique}
        visible={techniqueModalVisible}
        onClose={() => setTechniqueModalVisible(false)}
        theme={theme}
        router={router}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Resource Hub"
          subtitle="Evidence-based tools and knowledge for your mental wellness"
          rightAction={
            <TouchableOpacity style={styles.searchBtn}>
              <Library color={theme.colors.plum} size={22} />
            </TouchableOpacity>
          }
        />

        {/* ── Category Tabs ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catBar}
          contentContainerStyle={styles.catBarContent}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const IconComponent = cat.icon;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[styles.catPill, isActive && styles.catPillActive]}
              >
                <IconComponent
                  color={isActive ? '#FFF' : theme.colors.text.secondary}
                  size={14}
                  strokeWidth={2.5}
                />
                <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Featured Card (shown only on All) ── */}
        {activeCategory === 'all' && (
          <Animated.View entering={FadeInUp.delay(80).duration(600)} style={styles.featuredWrap}>
            <LinearGradient colors={FEATURED.color} style={styles.featuredCard}>
              <View style={styles.featuredBadge}>
                <Star color="#FFD700" size={11} fill="#FFD700" />
                <Text style={styles.featuredBadgeText}>{FEATURED.category}</Text>
              </View>
              <Text style={styles.featuredTitle}>{FEATURED.title}</Text>
              <Text style={styles.featuredSubtitle} numberOfLines={featuredExpanded ? undefined : 2}>
                {FEATURED.subtitle}
              </Text>
              <View style={styles.featuredRow}>
                <View style={styles.featuredMeta}>
                  <Clock color="rgba(255,255,255,0.7)" size={13} />
                  <Text style={styles.featuredMetaText}>{FEATURED.readTime}</Text>
                </View>
                <TouchableOpacity
                  style={styles.featuredBtn}
                  onPress={() => setFeaturedExpanded(!featuredExpanded)}
                >
                  <Text style={styles.featuredBtnText}>{featuredExpanded ? 'Collapse' : 'Read Now'}</Text>
                  <ChevronRight color={FEATURED.color[0]} size={16} />
                </TouchableOpacity>
              </View>
              {featuredExpanded && (
                <View style={styles.featuredExpandedContent}>
                  {FEATURED.content.split('\n').filter(l => l.trim()).map((line, i) => {
                    const boldPattern = /\*\*(.*?)\*\*/g;
                    const parts: any[] = [];
                    let lastIndex = 0;
                    let match;
                    while ((match = boldPattern.exec(line)) !== null) {
                      if (match.index > lastIndex) parts.push({ text: line.slice(lastIndex, match.index), bold: false });
                      parts.push({ text: match[1], bold: true });
                      lastIndex = match.index + match[0].length;
                    }
                    if (lastIndex < line.length) parts.push({ text: line.slice(lastIndex), bold: false });
                    return (
                      <Text key={i} style={styles.featuredBodyText}>
                        {parts.map((p, j) => (
                          <Text key={j} style={p.bold ? styles.featuredBodyBold : {}}>
                            {p.text}
                          </Text>
                        ))}
                      </Text>
                    );
                  })}
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        )}

        {/* ── Techniques Section ── */}
        {showTechniques && (
          <Animated.View entering={FadeInUp.delay(100).duration(500)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Zap color={theme.colors.plum} size={18} strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>Evidence-Based Techniques</Text>
              </View>
              <Text style={styles.sectionSubheading}>Clinically validated practices you can use today</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScrollContent}
              snapToInterval={width * 0.7 + 16}
              decelerationRate="fast"
            >
              {TECHNIQUES.map((t, i) => {
                const IconComponent = t.icon;
                return (
                  <Animated.View key={t.id} entering={FadeInUp.delay(150 + i * 60).duration(450)}>
                    <TouchableOpacity
                      style={[styles.techniqueCard, { borderColor: t.color + '30' }]}
                      activeOpacity={0.82}
                      onPress={() => openTechnique(t)}
                    >
                      <LinearGradient
                        colors={[t.color + '15', 'transparent']}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                      <View style={styles.techniqueCardTop}>
                        <View style={[styles.techniqueIconWrap, { backgroundColor: t.color + '20' }]}>
                          <IconComponent color={t.color} size={22} strokeWidth={2} />
                        </View>
                        <View style={[styles.techniqueTagBadge, { backgroundColor: t.color + '20' }]}>
                          <Text style={[styles.techniqueTagText, { color: t.color }]}>{t.tag}</Text>
                        </View>
                      </View>
                      <Text style={[styles.techniqueCardTitle, { color: theme.colors.text.primary }]}>{t.title}</Text>
                      <Text style={[styles.techniqueCardSub, { color: theme.colors.text.secondary }]} numberOfLines={2}>{t.subtitle}</Text>
                      <View style={styles.techniqueCardFooter}>
                        <View style={styles.techDurationRow}>
                          <Clock color={theme.colors.text.tertiary} size={12} />
                          <Text style={[styles.techDurationText, { color: theme.colors.text.tertiary }]}>{t.duration}</Text>
                        </View>
                        <View style={[styles.techniqueReadMore, { backgroundColor: t.color + '20' }]}>
                          <Text style={[styles.techniqueReadMoreText, { color: t.color }]}>Learn More</Text>
                          <ChevronRight color={t.color} size={12} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── Quick Tools (always visible in All / Techniques) ── */}
        {showTechniques && (
          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.section}>
            <Text style={[styles.sectionTitle, { paddingHorizontal: 24, marginBottom: 12 }]}>Quick Relief Tools</Text>
            <View style={styles.quickToolsGrid}>
              <TouchableOpacity
                style={[styles.quickToolCard, { borderColor: '#06B6D4' + '30', backgroundColor: '#06B6D4' + '10' }]}
                onPress={() => router.push('/breathing')}
              >
                <Wind color="#06B6D4" size={26} />
                <Text style={[styles.quickToolTitle, { color: theme.colors.text.primary }]}>Box Breathing</Text>
                <Text style={[styles.quickToolSub, { color: theme.colors.text.secondary }]}>4 min guided</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickToolCard, { borderColor: '#10B981' + '30', backgroundColor: '#10B981' + '10' }]}
                onPress={() => router.push('/grounding')}
              >
                <Compass color="#10B981" size={26} />
                <Text style={[styles.quickToolTitle, { color: theme.colors.text.primary }]}>5-4-3-2-1 Grounding</Text>
                <Text style={[styles.quickToolSub, { color: theme.colors.text.secondary }]}>5 min guided</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickToolCard, { borderColor: '#8B5CF6' + '30', backgroundColor: '#8B5CF6' + '10' }]}
                onPress={() => router.push('/(tabs)/journal')}
              >
                <BookOpen color="#8B5CF6" size={26} />
                <Text style={[styles.quickToolTitle, { color: theme.colors.text.primary }]}>Reflective Journal</Text>
                <Text style={[styles.quickToolSub, { color: theme.colors.text.secondary }]}>Write it out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickToolCard, { borderColor: '#F59E0B' + '30', backgroundColor: '#F59E0B' + '10' }]}
                onPress={() => router.push('/(tabs)/assessments')}
              >
                <Activity color="#F59E0B" size={26} />
                <Text style={[styles.quickToolTitle, { color: theme.colors.text.primary }]}>Self-Assessment</Text>
                <Text style={[styles.quickToolSub, { color: theme.colors.text.secondary }]}>Check your mood</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ── Articles Section ── */}
        {showArticles && (
          <Animated.View entering={FadeInUp.delay(250).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <FileText color={theme.colors.plum} size={18} strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>Curated Reads</Text>
              </View>
              <Text style={styles.sectionSubheading}>Evidence-based articles written for students</Text>
            </View>
            {ARTICLES.map((article, i) => {
              const IconComponent = article.icon;
              return (
                <Animated.View key={article.id} entering={FadeInUp.delay(300 + i * 50).duration(450)}>
                  <TouchableOpacity
                    style={[styles.articleCard, { borderLeftColor: article.color, borderLeftWidth: 3 }]}
                    onPress={() => openArticle(article)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.articleIconWrap, { backgroundColor: article.color + '15' }]}>
                      <IconComponent color={article.color} size={20} />
                    </View>
                    <View style={styles.articleText}>
                      <View style={styles.articleTopRow}>
                        <Text style={[styles.articleCategory, { color: article.color }]}>{article.category.toUpperCase()}</Text>
                        <View style={styles.articleReadTime}>
                          <Clock color={theme.colors.text.tertiary} size={11} />
                          <Text style={[styles.articleReadTimeText, { color: theme.colors.text.tertiary }]}>{article.readTime}</Text>
                        </View>
                      </View>
                      <Text style={[styles.articleTitle, { color: theme.colors.text.primary }]} numberOfLines={2}>{article.title}</Text>
                      <Text style={[styles.articleSubtitle, { color: theme.colors.text.secondary }]} numberOfLines={1}>{article.subtitle}</Text>
                    </View>
                    <ChevronRight color={theme.colors.text.disabled} size={18} />
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}

        {/* ── Audio & Podcasts Section ── */}
        {showAudio && (
          <Animated.View entering={FadeInUp.delay(300).duration(500)}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Headphones color={theme.colors.plum} size={18} strokeWidth={2.5} />
                <Text style={styles.sectionTitle}>Audio & Podcasts</Text>
              </View>
              <Text style={styles.sectionSubheading}>Listen to guided meditations and expert podcasts</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScrollContent}
              snapToInterval={width * 0.62 + 16}
              decelerationRate="fast"
            >
              {AUDIO_RESOURCES.map((a, i) => {
                const IconComponent = a.icon;
                return (
                  <Animated.View key={a.id} entering={FadeInUp.delay(350 + i * 50).duration(450)}>
                    <TouchableOpacity
                      style={[styles.audioCard, { borderColor: a.color + '25' }]}
                      activeOpacity={0.82}
                      onPress={() => Linking.openURL(a.url).catch(() => {})}
                    >
                      <LinearGradient
                        colors={[a.color + '20', 'transparent']}
                        style={StyleSheet.absoluteFillObject}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      />
                      <View style={[styles.audioIconWrap, { backgroundColor: a.color + '25' }]}>
                        <IconComponent color={a.color} size={24} />
                      </View>
                      <View style={[styles.audioTagBadge, { backgroundColor: a.color + '20' }]}>
                        <Text style={[styles.audioTagText, { color: a.color }]}>{a.tag}</Text>
                      </View>
                      <Text style={[styles.audioTitle, { color: theme.colors.text.primary }]} numberOfLines={2}>{a.title}</Text>
                      <Text style={[styles.audioHost, { color: theme.colors.text.secondary }]} numberOfLines={1}>{a.host}</Text>
                      <View style={styles.audioFooter}>
                        <View style={styles.audioDurationRow}>
                          <Clock color={theme.colors.text.tertiary} size={12} />
                          <Text style={[styles.audioDuration, { color: theme.colors.text.tertiary }]}>{a.duration}</Text>
                        </View>
                        <View style={[styles.audioPlayBtn, { backgroundColor: a.color }]}>
                          <ExternalLink color="#FFF" size={14} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}

        {/* ── Crisis Resources Section ── */}
        {showCrisis && (
          <Animated.View entering={FadeInUp.delay(350).duration(500)} style={[styles.section, { marginTop: 8 }]}>
            <View style={[styles.crisisHeader, { backgroundColor: '#EF4444' + '10', borderColor: '#EF4444' + '25' }]}>
              <AlertCircle color="#EF4444" size={20} />
              <Text style={[styles.crisisHeaderText, { color: theme.colors.text.primary }]}>
                In crisis? Immediate support is available
              </Text>
            </View>
            {CRISIS_RESOURCES.map((r, i) => {
              const IconComponent = r.icon;
              return (
                <Animated.View key={r.id} entering={FadeInUp.delay(400 + i * 60).duration(450)}>
                  <TouchableOpacity
                    style={[styles.crisisCard, { borderColor: r.color + '20' }]}
                    onPress={() => Linking.openURL(`tel:${r.phone.replace(/\s+/g, '')}`).catch(() => {})}
                    activeOpacity={0.82}
                  >
                    <View style={[styles.crisisIconWrap, { backgroundColor: r.color + '15' }]}>
                      <IconComponent color={r.color} size={22} />
                    </View>
                    <View style={styles.crisisInfo}>
                      <Text style={[styles.crisisName, { color: theme.colors.text.primary }]}>{r.title}</Text>
                      <Text style={[styles.crisisSubtitle, { color: theme.colors.text.secondary }]} numberOfLines={1}>{r.subtitle}</Text>
                      <View style={styles.crisisMetaRow}>
                        <View style={[styles.crisisAvailBadge, { backgroundColor: r.color + '15' }]}>
                          <CheckCircle color={r.color} size={11} />
                          <Text style={[styles.crisisAvailText, { color: r.color }]}>{r.available}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={[styles.crisisCallBtn, { backgroundColor: r.color }]}>
                      <Text style={styles.crisisCallText}>Call</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
            <TouchableOpacity
              style={[styles.viewCrisisAllBtn, { borderColor: theme.colors.plum + '40' }]}
              onPress={() => router.push('/(tabs)/crisis')}
            >
              <Shield color={theme.colors.plum} size={16} />
              <Text style={[styles.viewCrisisAllText, { color: theme.colors.plum }]}>View Full Crisis Support Page</Text>
              <ChevronRight color={theme.colors.plum} size={16} />
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.backgroundSecondary },
    scrollContent: { paddingBottom: 100 },
    searchBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Category bar
    catBar: { marginBottom: 24 },
    catBarContent: { paddingHorizontal: 24, gap: 8 },
    catPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    },
    catPillActive: { backgroundColor: theme.colors.plum, borderColor: theme.colors.plum },
    catText: { fontSize: 13, fontFamily: theme.typography.fonts.accent, fontWeight: '700', color: theme.colors.text.secondary },
    catTextActive: { color: '#FFF' },

    // Featured card
    featuredWrap: { paddingHorizontal: 24, marginBottom: 32 },
    featuredCard: { borderRadius: 28, padding: 24, overflow: 'hidden' },
    featuredBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      marginBottom: 14,
    },
    featuredBadgeText: { color: '#FFF', fontSize: 10, fontFamily: theme.typography.fonts.accent, fontWeight: '800', letterSpacing: 0.8 },
    featuredTitle: { fontSize: 22, fontFamily: theme.typography.fonts.header, fontWeight: '800', color: '#FFF', letterSpacing: -0.5, marginBottom: 8 },
    featuredSubtitle: { fontSize: 14, fontFamily: theme.typography.fonts.body, color: 'rgba(255,255,255,0.85)', lineHeight: 21, marginBottom: 16 },
    featuredRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    featuredMetaText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: theme.typography.fonts.body },
    featuredBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#FFF',
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 12,
    },
    featuredBtnText: { fontSize: 13, fontFamily: theme.typography.fonts.accent, fontWeight: '800', color: '#6366F1' },
    featuredExpandedContent: { marginTop: 20, gap: 6 },
    featuredBodyText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 22, fontFamily: theme.typography.fonts.body },
    featuredBodyBold: { fontWeight: '700', color: '#FFF' },

    // Section
    section: { marginBottom: 32, paddingHorizontal: 24 },
    sectionHeader: { paddingHorizontal: 24, marginBottom: 16 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    sectionTitle: { fontSize: 19, fontFamily: theme.typography.fonts.header, fontWeight: '800', color: theme.colors.text.primary, letterSpacing: -0.5 },
    sectionSubheading: { fontSize: 13, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, lineHeight: 19 },
    hScrollContent: { paddingHorizontal: 24, gap: 14, paddingBottom: 16 },

    // Technique cards
    techniqueCard: {
      width: width * 0.68,
      borderRadius: 24,
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.15 : 0.05,
      shadowRadius: 12,
      elevation: 4,
    },
    techniqueCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
    techniqueIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    techniqueTagBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
    techniqueTagText: { fontSize: 11, fontFamily: theme.typography.fonts.accent, fontWeight: '800', letterSpacing: 0.3 },
    techniqueCardTitle: { fontSize: 16, fontFamily: theme.typography.fonts.header, fontWeight: '800', letterSpacing: -0.3, marginBottom: 6 },
    techniqueCardSub: { fontSize: 13, fontFamily: theme.typography.fonts.body, lineHeight: 18, marginBottom: 14 },
    techniqueCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    techDurationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    techDurationText: { fontSize: 12, fontFamily: theme.typography.fonts.body },
    techniqueReadMore: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
    techniqueReadMoreText: { fontSize: 12, fontFamily: theme.typography.fonts.accent, fontWeight: '700' },

    // Quick tools grid
    quickToolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    quickToolCard: {
      width: (width - 48 - 12) / 2,
      borderRadius: 20,
      padding: 18,
      alignItems: 'center',
      borderWidth: 1.5,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.1 : 0.03,
      shadowRadius: 8,
      elevation: 2,
    },
    quickToolTitle: { fontSize: 13, fontFamily: theme.typography.fonts.header, fontWeight: '800', textAlign: 'center', letterSpacing: -0.2 },
    quickToolSub: { fontSize: 11, fontFamily: theme.typography.fonts.body, textAlign: 'center' },

    // Articles
    articleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: 16,
      marginBottom: 10,
      gap: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.1 : 0.03,
      shadowRadius: 8,
      elevation: 2,
    },
    articleIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    articleText: { flex: 1 },
    articleTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    articleCategory: { fontSize: 10, fontFamily: theme.typography.fonts.accent, fontWeight: '800', letterSpacing: 0.8 },
    articleReadTime: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    articleReadTimeText: { fontSize: 11, fontFamily: theme.typography.fonts.body },
    articleTitle: { fontSize: 14, fontFamily: theme.typography.fonts.header, fontWeight: '700', letterSpacing: -0.2, marginBottom: 3 },
    articleSubtitle: { fontSize: 12, fontFamily: theme.typography.fonts.body },

    // Audio cards
    audioCard: {
      width: width * 0.58,
      borderRadius: 24,
      padding: 18,
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.15 : 0.04,
      shadowRadius: 12,
      elevation: 3,
    },
    audioIconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
    audioTagBadge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
    audioTagText: { fontSize: 10, fontFamily: theme.typography.fonts.accent, fontWeight: '800', letterSpacing: 0.3 },
    audioTitle: { fontSize: 15, fontFamily: theme.typography.fonts.header, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
    audioHost: { fontSize: 12, fontFamily: theme.typography.fonts.body, marginBottom: 12 },
    audioFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    audioDurationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    audioDuration: { fontSize: 12, fontFamily: theme.typography.fonts.body },
    audioPlayBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

    // Crisis section
    crisisHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 14,
    },
    crisisHeaderText: { fontSize: 14, fontFamily: theme.typography.fonts.accent, fontWeight: '700', flex: 1 },
    crisisCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: 14,
      marginBottom: 10,
      gap: 12,
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.1 : 0.03,
      shadowRadius: 8,
      elevation: 2,
    },
    crisisIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    crisisInfo: { flex: 1 },
    crisisName: { fontSize: 14, fontFamily: theme.typography.fonts.header, fontWeight: '700', marginBottom: 2 },
    crisisSubtitle: { fontSize: 12, fontFamily: theme.typography.fonts.body, marginBottom: 5 },
    crisisMetaRow: { flexDirection: 'row', alignItems: 'center' },
    crisisAvailBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    crisisAvailText: { fontSize: 10, fontFamily: theme.typography.fonts.accent, fontWeight: '700' },
    crisisCallBtn: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, flexShrink: 0 },
    crisisCallText: { color: '#FFF', fontSize: 13, fontFamily: theme.typography.fonts.accent, fontWeight: '800' },
    viewCrisisAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1.5,
      marginTop: 4,
    },
    viewCrisisAllText: { fontSize: 14, fontFamily: theme.typography.fonts.accent, fontWeight: '700' },

    // Modal
    modalContainer: { flex: 1 },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    modalCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalCategoryBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
    modalCategoryText: { fontSize: 12, fontFamily: theme.typography.fonts.accent, fontWeight: '800', letterSpacing: 0.5 },
    modalScroll: { padding: 24, paddingBottom: 60 },
    modalIconWrap: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 24, fontFamily: theme.typography.fonts.header, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
    modalMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 16 },
    modalMetaText: { fontSize: 13, fontFamily: theme.typography.fonts.body },
    modalDivider: { height: 1, marginBottom: 20 },
    modalContentWrap: { gap: 10 },
    articleModalHeading: { fontSize: 16, fontFamily: theme.typography.fonts.header, fontWeight: '800', marginTop: 12, marginBottom: 4 },
    articleModalBody: { fontSize: 15, fontFamily: theme.typography.fonts.body, lineHeight: 24 },

    // Technique modal
    techniqueDesc: { fontSize: 15, fontFamily: theme.typography.fonts.body, lineHeight: 23, marginBottom: 20 },
    stepsTitle: { fontSize: 17, fontFamily: theme.typography.fonts.header, fontWeight: '800', marginBottom: 14 },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
    stepNum: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
    stepNumText: { fontSize: 13, fontFamily: theme.typography.fonts.accent, fontWeight: '800' },
    stepText: { flex: 1, fontSize: 15, fontFamily: theme.typography.fonts.body, lineHeight: 22 },
    practiceBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 16,
      borderRadius: 18,
      marginTop: 24,
    },
    practiceBtnText: { color: '#FFF', fontSize: 16, fontFamily: theme.typography.fonts.accent, fontWeight: '800' },
  });
