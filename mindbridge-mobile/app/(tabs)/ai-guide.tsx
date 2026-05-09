import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bot,
  Send,
  MoreVertical
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SUGGESTED_PROMPTS = [
  "I'm feeling overwhelmed",
  "Help me calm down",
  "I can't sleep",
  "I need to vent"
];

const INITIAL_MESSAGES = [
  {
    id: '1',
    isAi: true,
    text: "Hello! I'm your MindBridge Guide. I'm here to listen, support, and help you navigate your feelings. How are you doing today?",
    time: 'Now'
  }
];

export default function AIGuideScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      isAi: false,
      text: input.trim(),
      time: 'Now'
    };

    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate AI typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        isAi: true,
        text: "I hear you. It's completely valid to feel that way. I'm here to listen.",
        time: 'Now'
      }]);
    }, 1500);
  };

  const handlePromptPress = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={theme.isDark 
          ? ['rgba(46, 64, 87, 0.15)', theme.colors.background, theme.colors.backgroundSecondary]
          : ['rgba(46, 64, 87, 0.05)', theme.colors.background, theme.colors.backgroundSecondary]
        } 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <Animated.View entering={FadeIn.duration(600)} style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <Bot color={theme.colors.onPrimary || '#FFF'} size={24} />
          </View>
          <View>
            <Text style={styles.headerTitle}>MindBridge Guide</Text>
            <Text style={styles.headerSubtitle}>Always here to listen</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreVertical color={theme.colors.text.secondary} size={24} />
        </TouchableOpacity>
      </Animated.View>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <Animated.View 
              key={msg.id} 
              entering={FadeInUp.duration(400)} 
              style={[
                styles.messageRow,
                msg.isAi ? styles.messageRowAi : styles.messageRowUser
              ]}
            >
              {msg.isAi && (
                <View style={[styles.messageAvatar, { backgroundColor: theme.colors.plumLight }]}>
                  <Bot color={theme.colors.onPrimary || '#FFF'} size={16} />
                </View>
              )}
              <View style={[
                styles.messageBubble,
                msg.isAi ? styles.bubbleAi : styles.bubbleUser
              ]}>
                <Text style={[
                  styles.messageText,
                  msg.isAi ? styles.textAi : styles.textUser
                ]}>
                  {msg.text}
                </Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(300).duration(600)} style={[styles.inputArea, { paddingBottom: insets.bottom || 24 }]}>
          {messages.length === 1 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promptsContent}
              style={styles.promptsScroll}
            >
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={styles.promptChip}
                  onPress={() => handlePromptPress(prompt)}
                >
                  <Text style={styles.promptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.text.disabled}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <Send color={theme.colors.onPrimary || '#FFF'} size={20} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    backgroundColor: theme.isDark ? 'rgba(36,36,36,0.8)' : 'rgba(255,255,255,0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  moreBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleAi: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.2 : 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  bubbleUser: {
    backgroundColor: theme.colors.plum,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  textAi: {
    color: theme.colors.text.primary,
  },
  textUser: {
    color: theme.colors.onPrimary || '#FFF',
  },
  inputArea: {
    backgroundColor: theme.colors.surface,
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  promptsScroll: {
    marginBottom: 16,
  },
  promptsContent: {
    gap: 8,
    paddingRight: 24,
  },
  promptChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
  promptText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  }
});
