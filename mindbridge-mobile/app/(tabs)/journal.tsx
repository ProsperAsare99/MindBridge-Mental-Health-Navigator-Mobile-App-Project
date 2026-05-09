import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BookOpen, 
  Plus, 
  X, 
  Calendar,
  Wind,
  Sun,
  CloudRain
} from 'lucide-react-native';
import api from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case 'calm': return <Wind color={theme.colors.accents.eucalyptus} size={16} />;
      case 'anxious': return <CloudRain color={theme.colors.accents.powderBlue} size={16} />;
      default: return <Sun color={theme.colors.accents.gentlePeach} size={16} />;
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await api.get('/journal');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    if (!newContent.trim()) return;
    
    try {
      const response = await api.post('/journal', {
        title: newTitle.trim() || 'Untitled Entry',
        content: newContent.trim(),
      });
      
      setEntries([response.data, ...entries]);
      setIsWriting(false);
      setNewTitle('');
      setNewContent('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={theme.isDark 
          ? ['rgba(123, 97, 255, 0.15)', theme.colors.background, theme.colors.backgroundSecondary]
          : ['rgba(123, 97, 255, 0.08)', theme.colors.background, theme.colors.backgroundSecondary]
        } 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {!isWriting ? (
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.title}>Journal</Text>
                <Text style={styles.subtitle}>{entries.length} entries</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.newBtn}
                onPress={() => setIsWriting(true)}
              >
                <Plus color={theme.colors.text.onPrimary || '#FFF'} size={24} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.plum} style={{ marginTop: 40 }} />
          ) : entries.length === 0 ? (
            <View style={{ padding: 24, alignItems: 'center', marginTop: 40 }}>
              <BookOpen color={theme.colors.text.disabled} size={48} style={{ marginBottom: 16 }} />
              <Text style={{ color: theme.colors.text.secondary, textAlign: 'center' }}>
                Your journal is empty. Tap the + button to capture your thoughts.
              </Text>
            </View>
          ) : (
            <View style={styles.entriesList}>
              {entries.map((entry, index) => (
                <Animated.View 
                  key={entry.id}
                  entering={FadeInUp.delay(index * 50).duration(500)}
                  style={styles.entryCard}
                >
                  <View style={styles.entryHeader}>
                    <View style={styles.dateRow}>
                      <Calendar color={theme.colors.text.tertiary} size={14} />
                      <Text style={styles.dateText}>{formatDate(entry.createdAt)}</Text>
                    </View>
                    <View style={styles.moodBadge}>
                      {getMoodIcon(entry.mood || 'calm')}
                    </View>
                  </View>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryContent} numberOfLines={4}>{entry.content}</Text>
                </Animated.View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : (
        <Animated.View 
          entering={SlideInDown.duration(500)} 
          exiting={SlideOutDown}
          style={[styles.composerContainer, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}
        >
          <View style={styles.composerHeader}>
            <TouchableOpacity onPress={() => setIsWriting(false)} style={styles.iconBtn}>
              <X color={theme.colors.plum} size={24} />
            </TouchableOpacity>
            <Text style={styles.composerTitle}>New Entry</Text>
            <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, !newContent.trim() && styles.saveBtnDisabled]}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.composerBody}
          >
            <TextInput
              style={styles.titleInput}
              placeholder="Title (Optional)"
              placeholderTextColor={theme.colors.text.disabled}
              value={newTitle}
              onChangeText={setNewTitle}
              maxLength={50}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="What's on your mind?"
              placeholderTextColor={theme.colors.text.secondary}
              value={newContent}
              onChangeText={setNewContent}
              multiline
              autoFocus
              textAlignVertical="top"
            />
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.backgroundSecondary, 
  },
  scrollContent: { 
    paddingHorizontal: 24, 
    paddingBottom: 120 
  },
  header: { 
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: theme.colors.text.primary, 
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  newBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.5 : 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  entriesList: {
    gap: 16,
  },
  entryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moodBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  entryContent: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  // Composer Styles
  composerContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  composerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.2)' : 'rgba(123, 97, 255, 0.1)',
    borderRadius: 16,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: theme.colors.plum,
    fontWeight: '800',
    fontSize: 15,
  },
  composerBody: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    fontSize: 17,
    color: theme.colors.text.primary,
    lineHeight: 26,
  }
});
