import React, { useState } from 'react';
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
  Dimensions
} from 'react-native';
import { theme } from '../../src/theme/colors';
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

const { width } = Dimensions.get('window');

// Mock Data for Journal Entries
const INITIAL_ENTRIES = [
  {
    id: '1',
    date: 'Today, 8:45 AM',
    title: 'Morning Reflection',
    content: 'Woke up feeling surprisingly refreshed. The new breathing exercises before bed seem to be helping. I want to carry this calm energy into my study session later.',
    mood: 'calm',
  },
  {
    id: '2',
    date: 'Yesterday, 9:20 PM',
    title: 'Exam Anxiety',
    content: 'Feeling overwhelmed by the amount of reading left for my finals. Need to remember to take it one step at a time. I am capable.',
    mood: 'anxious',
  }
];

const getMoodIcon = (mood: string) => {
  switch(mood) {
    case 'calm': return <Wind color={theme.colors.accents.eucalyptus} size={16} />;
    case 'anxious': return <CloudRain color={theme.colors.accents.powderBlue} size={16} />;
    default: return <Sun color={theme.colors.accents.gentlePeach} size={16} />;
  }
};

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSave = () => {
    if (!newContent.trim()) return;
    
    const newEntry = {
      id: Date.now().toString(),
      date: 'Just now',
      title: newTitle.trim() || 'Untitled Entry',
      content: newContent.trim(),
      mood: 'calm'
    };

    setEntries([newEntry, ...entries]);
    setIsWriting(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['rgba(123, 97, 255, 0.08)', theme.colors.background, theme.colors.backgroundSecondary]} 
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
                <Plus color={theme.colors.surface} size={24} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.entriesList}>
            {entries.map((entry, index) => (
              <Animated.View 
                key={entry.id}
                entering={FadeInUp.delay(index * 150).springify().damping(14)}
                style={styles.entryCard}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.dateRow}>
                    <Calendar color={theme.colors.text.tertiary} size={14} />
                    <Text style={styles.dateText}>{entry.date}</Text>
                  </View>
                  <View style={styles.moodBadge}>
                    {getMoodIcon(entry.mood)}
                  </View>
                </View>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entryContent} numberOfLines={4}>{entry.content}</Text>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Animated.View 
          entering={SlideInDown.springify().damping(16)} 
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
    shadowOpacity: 0.3,
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
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
    backgroundColor: 'rgba(123, 97, 255, 0.1)',
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
