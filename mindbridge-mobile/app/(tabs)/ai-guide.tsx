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
import { AuthContext } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Bot,
  MessageCircle,
  Mic,
  StopCircle,
  Activity,
  Send,
  AlertTriangle,
  ArrowRight,
  Info,
  RefreshCw,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

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
const MessageItem = ({ item, theme, router, t }: any) => {
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
  const { t } = theme;
  const router = useRouter();
  const { userData: authData } = useContext(AuthContext) as any;

  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputHeight, setInputHeight] = useState(44);

  const bottomPad = TAB_BAR_HEIGHT + insets.bottom;
  const INPUT_AREA_HEIGHT = inputHeight + 32;

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const response = await api.get('/ai/oracle-context');
        const data = response.data;
        let rawName = data.onboarding?.firstName || data.userName || authData?.name || 'Friend';
        const firstName = rawName.split(' ')[0];
        
        let greeting = t('ai.greetingStandard');
        if (data.latestMood) {
          const emotions = data.latestMood.emotions?.join(', ') || 'something meaningful';
          const score = data.latestMood.score;
          if (score <= 4) {
            greeting = t('ai.greetingHeavy').replace('{name}', firstName).replace('{emotions}', emotions.toLowerCase());
          } else if (score >= 8) {
            greeting = t('ai.greetingGlowing').replace('{name}', firstName).replace('{emotions}', emotions.toLowerCase());
          } else {
            greeting = t('ai.greetingRecent').replace('{name}', firstName).replace('{emotions}', emotions.toLowerCase());
          }
        } else {
          greeting = t('ai.greetingWelcome').replace('{name}', firstName);
        }

        const historyMessages = (data.history || []).reverse().map((msg: any, idx: number) => ({
          id: `hist-${idx}`,
          isAi: msg.role === 'model',
          text: msg.content,
          time: 'Past'
        }));

        setMessages([
          { id: 'welcome', isAi: true, text: greeting, time: 'Now', suggestCrisis: false },
          ...historyMessages
        ]);
      } catch {
        setMessages([{ id: 'initial', text: t('ai.greetingWelcome').replace('{name}', authData?.name || 'Friend'), isAi: true, time: 'Now' }]);
      }
    };
    fetchContext();
  }, []);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Could not start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setRecording(null);
    handleSend("I'm feeling a bit exhausted today, but trying to keep my head up.");
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || message;
    if (!textToSend.trim()) return;
    
    const userMsg = { id: Date.now().toString(), text: textToSend, isAi: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { message: textToSend });
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        text: res.data.response,
        isAi: true,
        suggestCrisis: res.data.suggestCrisis,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      Alert.alert('Oracle is resting', 'Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleClearChat = () => {
    Alert.alert('New Conversation', 'Start fresh with the Oracle?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete('/ai/history');
            setMessages([{ id: 'reset', isAi: true, text: "Conversation cleared. I've refreshed my memory. What's on your mind?", time: 'Now' }]);
          } catch (error) {
            Alert.alert('Error', 'Failed to clear history.');
          }
        },
      },
    ]);
  };

  const listData = loading ? [...messages, { id: '__typing__', type: 'typing' }] : messages;
  const showPrompts = messages.length <= 1 && !loading;

  return (
    <View style={[S.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />

      <LinearGradient
        colors={theme.isDark ? ['rgba(123,97,255,0.10)', theme.colors.background] : ['rgba(123,97,255,0.06)', theme.colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <BlurView intensity={theme.isDark ? 60 : 80} tint={theme.isDark ? 'dark' : 'light'} style={[S.header, { paddingTop: insets.top + 10 }]}>
        <View style={S.headerInner}>
          <View style={[S.headerAvatar, { backgroundColor: theme.colors.plum }]}>
            <Bot color="#FFF" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[S.headerTitle, { color: theme.colors.text.primary }]}>{t('ai.title')}</Text>
            <View style={S.statusRow}>
              <View style={S.dot} />
              <Text style={[S.headerSub, { color: theme.colors.text.secondary }]}>{loading ? 'Reflecting…' : 'Always here for you'}</Text>
            </View>
          </View>
          <TouchableOpacity style={S.headerBtn} onPress={handleClearChat}>
            <RefreshCw color={theme.colors.text.tertiary} size={19} />
          </TouchableOpacity>
        </View>
      </BlurView>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={[S.disclaimer, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(123,97,255,0.06)', borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(123,97,255,0.14)' }]}>
          <Info color={theme.isDark ? theme.colors.accents.powderBlue : theme.colors.plum} size={13} />
          <Text style={[S.disclaimerText, { color: theme.isDark ? theme.colors.text.secondary : theme.colors.text.tertiary }]}>{t('ai.disclaimer')}</Text>
        </View>

        {showPrompts && (
          <Animated.View entering={FadeInUp.delay(300).duration(500)} style={S.prompts}>
            <View style={S.promptsHeader}>
              <Text style={[S.promptsLabel, { color: theme.colors.text.tertiary }]}>Suggested Starters</Text>
            </View>
            <View style={S.promptsGrid}>
              {SUGGESTED_PROMPTS.map((p, i) => (
                <TouchableOpacity key={i} style={[S.chip, { backgroundColor: theme.colors.surface, borderColor: theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }]} onPress={() => handleSend(p)}>
                  <Text style={[S.chipText, { color: theme.colors.text.secondary }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageItem item={item} theme={theme} router={router} t={t} />}
          contentContainerStyle={[S.listContent, { paddingBottom: bottomPad + INPUT_AREA_HEIGHT + 12 }]}
          showsVerticalScrollIndicator={false}
          onLayout={scrollToEnd}
          onContentSizeChange={scrollToEnd}
        />

        <View style={[S.inputPanel, { paddingBottom: bottomPad + 8, backgroundColor: theme.isDark ? 'rgba(18,18,18,0.97)' : 'rgba(255,255,255,0.97)' }]}>
          <View style={[S.inputRow, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderColor: message.trim() ? theme.colors.plum : (theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)') }]}>
            <TextInput
              ref={inputRef}
              style={[S.input, { color: theme.colors.text.primary }]}
              placeholder={t('ai.placeholder')}
              placeholderTextColor={theme.colors.text.disabled}
              value={message}
              onChangeText={setMessage}
              multiline
              onContentSizeChange={e => setInputHeight(Math.min(Math.max(44, e.nativeEvent.contentSize.height), 120))}
            />
            <View style={S.inputActions}>
              <TouchableOpacity style={[S.micBtn, isRecording && { backgroundColor: '#EF4444' }]} onPress={isRecording ? stopRecording : startRecording}>
                {isRecording ? <StopCircle color="#FFF" size={20} /> : <Mic color={theme.colors.plum} size={20} />}
              </TouchableOpacity>
              <TouchableOpacity style={[S.sendBtn, { backgroundColor: theme.colors.plum }, !message.trim() && !isRecording && { opacity: 0.5 }]} onPress={() => handleSend()} disabled={!message.trim() || loading}>
                <Send color="#FFF" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const S = StyleSheet.create({
  root: { flex: 1 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(123,97,255,0.1)', zIndex: 10 },
  headerInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, gap: 12 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#34D399' },
  headerSub: { fontSize: 12, fontWeight: '500' },
  headerBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 14, marginBottom: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  disclaimerText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '500' },
  prompts: { paddingHorizontal: 20, marginVertical: 12 },
  promptsHeader: { marginBottom: 10 },
  promptsLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  promptsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 14, fontWeight: '500' },
  listContent: { paddingTop: 8 },
  inputPanel: { paddingHorizontal: 20, paddingTop: 12 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 28, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 6, gap: 8 },
  input: { flex: 1, fontSize: 16, lineHeight: 22, paddingTop: 10, paddingBottom: 10, minHeight: 44, maxHeight: 120 },
  inputActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  micBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.03)', alignItems: 'center', justifyContent: 'center' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
