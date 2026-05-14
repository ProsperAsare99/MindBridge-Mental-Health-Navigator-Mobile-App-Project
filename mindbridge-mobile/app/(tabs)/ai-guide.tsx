import React, { useState, useEffect, useRef, useContext } from 'react';
import api from '../../src/services/api';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Alert,
  Clipboard,
} from 'react-native';
import { translations, Language, TranslationSchema } from '../../src/utils/translations';
import { AuthContext } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Bot,
  Send,
  AlertTriangle,
  ArrowRight,
  Info,
  RefreshCw,
  MessageCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 64;

const SUGGESTED_PROMPTS = [
  "I'm feeling overwhelmed",
  "Help me calm down",
  "I can't sleep",
  "I need to vent",
  "How do I handle exam stress?",
  "I feel lonely",
];

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = ({ theme }: any) => (
  <Animated.View entering={FadeIn.duration(300)} style={[typingStyles.row]}>
    <View style={[typingStyles.avatar, { backgroundColor: theme.colors.plum }]}>
      <Bot color="#FFF" size={13} />
    </View>
    <View style={[typingStyles.bubble, {
      backgroundColor: theme.colors.surface,
      borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    }]}>
      <View style={typingStyles.dots}>
        <View style={[typingStyles.dot, { backgroundColor: theme.colors.plum, opacity: 0.4 }]} />
        <View style={[typingStyles.dot, { backgroundColor: theme.colors.plum, opacity: 0.7 }]} />
        <View style={[typingStyles.dot, { backgroundColor: theme.colors.plum }]} />
      </View>
    </View>
  </Animated.View>
);

const typingStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 16 },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 },
  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 18, borderBottomLeftRadius: 4, borderWidth: 1 },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});

// ─── Individual Message ────────────────────────────────────────────────────────
const MessageItem = ({ item, theme, router }: any) => {
  const onLongPress = () => {
    Clipboard.setString(item.text);
    Alert.alert('Copied', 'Message copied to clipboard.');
  };

  if (item.type === 'typing') return <TypingIndicator theme={theme} />;

  if (item.isAi) {
    return (
      <Animated.View entering={FadeInDown.duration(350).springify()} style={msgStyles.rowAi}>
        <View style={[msgStyles.avatarSmall, { backgroundColor: theme.colors.plum }]}>
          <Bot color="#FFF" size={13} />
        </View>
        <View style={{ flex: 1 }}>
          {item.suggestCrisis ? (
            <View style={msgStyles.crisisBubble}>
              <View style={msgStyles.crisisTop}>
                <AlertTriangle color="#EF4444" size={13} />
                <Text style={msgStyles.crisisLabel}>IMMEDIATE SUPPORT AVAILABLE</Text>
              </View>
              <Text style={[msgStyles.textAi, { color: theme.colors.text.primary }]}>{item.text}</Text>
              <TouchableOpacity
                style={msgStyles.crisisBtn}
                onPress={() => router.push('/(tabs)/crisis')}
                activeOpacity={0.85}
              >
                <Text style={msgStyles.crisisBtnText}>Open Crisis Support</Text>
                <ArrowRight color="#FFF" size={15} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              onLongPress={onLongPress}
              style={[msgStyles.bubbleAi, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }]}
            >
              <Text style={[msgStyles.textAi, { color: theme.colors.text.primary }]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={[msgStyles.time, { color: theme.colors.text.tertiary }]}>{item.time}</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(250).springify()} style={msgStyles.rowUser}>
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={onLongPress}
        style={[msgStyles.bubbleUser, { backgroundColor: theme.colors.plum }]}
      >
        <Text style={msgStyles.textUser}>{item.text}</Text>
      </TouchableOpacity>
      <Text style={[msgStyles.timeUser, { color: theme.colors.text.tertiary }]}>{item.time}</Text>
    </Animated.View>
  );
};

const msgStyles = StyleSheet.create({
  rowAi: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 16 },
  rowUser: { alignItems: 'flex-end', paddingHorizontal: 20, paddingBottom: 16 },
  avatarSmall: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 },
  bubbleAi: { maxWidth: width * 0.74, paddingHorizontal: 16, paddingVertical: 13, borderRadius: 20, borderBottomLeftRadius: 4, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  bubbleUser: { maxWidth: width * 0.74, paddingHorizontal: 16, paddingVertical: 13, borderRadius: 20, borderBottomRightRadius: 4 },
  textAi: { fontSize: 15.5, lineHeight: 23 },
  textUser: { fontSize: 15.5, lineHeight: 23, color: '#FFF' },
  time: { fontSize: 11, fontWeight: '500', marginTop: 5, marginLeft: 2 },
  timeUser: { fontSize: 11, fontWeight: '500', marginTop: 5 },
  crisisBubble: { maxWidth: width * 0.78, borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 20, borderBottomLeftRadius: 4, padding: 16, backgroundColor: 'rgba(239,68,68,0.06)' },
  crisisTop: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  crisisLabel: { fontSize: 10, fontWeight: '800', color: '#EF4444', letterSpacing: 0.8 },
  crisisBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EF4444', paddingVertical: 11, borderRadius: 12, marginTop: 12, gap: 8 },
  crisisBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function AIGuideScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { userData: authData } = useContext(AuthContext);
  const preferredLanguage = (authData?.preferredLanguage as Language) || 'English';
  const t: TranslationSchema = translations[preferredLanguage] || translations.English;

  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);

  // Bottom padding = tab bar + safe area
  const bottomPad = TAB_BAR_HEIGHT + insets.bottom;
  // Input area visual height
  const INPUT_AREA_HEIGHT = inputHeight + 32; // 16px top + 16px bottom padding

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await api.get('/ai/oracle-context');
        const data = response.data;
        let greeting = "Hello! I'm the MindBridge Oracle. I'm here to listen, support, and help you navigate your feelings. How are you doing today?";

        if (data.latestMood) {
          const emotions = data.latestMood.emotions?.join(', ') || 'something meaningful';
          const score = data.latestMood.score;
          const name = data.onboarding?.firstName ? `, ${data.onboarding.firstName}` : '';
          if (score <= 4) {
            greeting = `Hey${name}. I noticed your last check-in felt heavy — feeling ${emotions.toLowerCase()}. That takes courage to name. What's been weighing on you most?`;
          } else if (score >= 8) {
            greeting = `Hello${name}! Your last seed was glowing with ${emotions.toLowerCase()} 🌱 What's been contributing to that good energy?`;
          } else {
            greeting = `Hi${name}. I see your recent mood reflected ${emotions.toLowerCase()}. How are you really doing today?`;
          }
        } else if (data.onboarding?.firstName) {
          greeting = `Welcome, ${data.onboarding.firstName}. I'm the MindBridge Oracle — your personal guide. What's on your mind today?`;
        }

        setMessages([{ id: 'welcome', isAi: true, text: greeting, time: 'Now', suggestCrisis: false }]);
      } catch {
        setMessages([{ id: 'welcome', isAi: true, text: "Hello! I'm the MindBridge Oracle. I'm here to listen and support you. How are you feeling today?", time: 'Now', suggestCrisis: false }]);
      }
    };
    fetchContext();
  }, []);

  // Build list data: messages + typing indicator if needed
  const listData = isTyping
    ? [...messages, { id: '__typing__', type: 'typing' }]
    : messages;

  const scrollToEnd = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now().toString(), isAi: false, text: trimmed, time: now, suggestCrisis: false };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    scrollToEnd();

    try {
      const response = await api.post('/ai/chat', { message: trimmed });
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        isAi: true,
        text: response.data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestCrisis: !!response.data.suggestCrisis,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        isAi: true,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestCrisis: false,
      }]);
    } finally {
      setIsTyping(false);
      scrollToEnd();
    }
  };

  const handleClearChat = () => {
    Alert.alert('New Conversation', 'Start fresh with the Oracle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => setMessages([{
          id: 'reset',
          isAi: true,
          text: "Conversation cleared. I'm here whenever you're ready. What's on your mind?",
          time: 'Now',
          suggestCrisis: false,
        }]),
      },
    ]);
  };

  const showPrompts = messages.length <= 1 && !isTyping;

  return (
    <View style={[S.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      {/* Background gradient */}
      <LinearGradient
        colors={theme.isDark
          ? ['rgba(123,97,255,0.10)', theme.colors.background]
          : ['rgba(123,97,255,0.06)', theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ── Header ────────────────────────────────────── */}
      <BlurView
        intensity={theme.isDark ? 60 : 80}
        tint={theme.isDark ? 'dark' : 'light'}
        style={[S.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={S.headerInner}>
          <View style={[S.headerAvatar, { backgroundColor: theme.colors.plum }]}>
            <Bot color="#FFF" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[S.headerTitle, { color: theme.colors.text.primary }]}>
              {t.ai?.title || 'The Oracle'}
            </Text>
            <View style={S.statusRow}>
              <View style={S.dot} />
              <Text style={[S.headerSub, { color: theme.colors.text.secondary }]}>
                {isTyping ? 'Reflecting…' : 'Always here for you'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={S.headerBtn} onPress={handleClearChat} activeOpacity={0.7}>
            <RefreshCw color={theme.colors.text.tertiary} size={19} />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* ── Content area (FlatList + input) inside KeyboardAvoidingView ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Disclaimer banner */}
        <View style={[S.disclaimer, {
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(123,97,255,0.06)',
          borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(123,97,255,0.14)',
        }]}>
          <Info color={theme.colors.plum} size={13} />
          <Text style={[S.disclaimerText, { color: theme.colors.text.tertiary }]}>
            {t.ai?.disclaimer || 'The Oracle supports your wellbeing but is not a substitute for professional care.'}
          </Text>
        </View>

        {/* Suggested prompts */}
        {showPrompts && (
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={S.prompts}>
            <View style={S.promptsHeader}>
              <MessageCircle color={theme.colors.text.tertiary} size={13} />
              <Text style={[S.promptsLabel, { color: theme.colors.text.tertiary }]}>Quick starts</Text>
            </View>
            <View style={S.promptsGrid}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[S.chip, {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  }]}
                  onPress={() => sendMessage(p)}
                  activeOpacity={0.75}
                >
                  <Text style={[S.chipText, { color: theme.colors.text.secondary }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageItem item={item} theme={theme} router={router} />}
          contentContainerStyle={[S.listContent, { paddingBottom: bottomPad + INPUT_AREA_HEIGHT + 12 }]}
          showsVerticalScrollIndicator={false}
          onLayout={scrollToEnd}
          onContentSizeChange={scrollToEnd}
          keyboardShouldPersistTaps="handled"
        />

        {/* ── Input Panel ─────────────────────────────── */}
        <View style={[S.inputPanel, {
          paddingBottom: bottomPad + 8,
          backgroundColor: theme.isDark ? 'rgba(18,18,18,0.97)' : 'rgba(255,255,255,0.97)',
          borderTopColor: theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
        }]}>
          <View style={[S.inputRow, {
            backgroundColor: theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
            borderColor: input.trim()
              ? theme.colors.plum
              : (theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'),
          }]}>
            <TextInput
              ref={inputRef}
              style={[S.input, { color: theme.colors.text.primary }]}
              placeholder={t.ai?.placeholder || "Share what's on your mind…"}
              placeholderTextColor={theme.colors.text.disabled}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={600}
              textAlignVertical="center"
              onContentSizeChange={e => {
                const h = Math.min(Math.max(44, e.nativeEvent.contentSize.height), 120);
                setInputHeight(h);
              }}
            />
            <TouchableOpacity
              style={[S.sendBtn, {
                backgroundColor: input.trim() && !isTyping ? theme.colors.plum : theme.colors.plum + '35',
              }]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              activeOpacity={0.8}
            >
              <Send color="#FFF" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    zIndex: 10,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 12,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#34D399' },
  headerSub: { fontSize: 12, fontWeight: '500' },
  headerBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '500' },

  // Prompts
  prompts: { paddingHorizontal: 20, marginVertical: 12 },
  promptsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  promptsLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  promptsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '500' },

  // Messages
  listContent: { paddingTop: 8 },

  // Input Panel
  inputPanel: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 28,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 44,
    maxHeight: 120,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
