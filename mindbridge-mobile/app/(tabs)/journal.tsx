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
  ActivityIndicator,
  Alert
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn, SlideInDown, SlideOutDown, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { 
  BookOpen, 
  Plus, 
  X, 
  Calendar,
  Wind,
  Sun,
  CloudRain,
  PenLine,
  Trash2,
  Mic,
  StopCircle,
  Play,
  Pause
} from 'lucide-react-native';

import api from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const [entries, setEntries] = useState<any[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('calm');
  const [filterMood, setFilterMood] = useState('all');
  
  // Audio State
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const micScale = useSharedValue(1);
  const animatedMicStyle = useAnimatedStyle(() => ({ transform: [{ scale: micScale.value }] }));

  const MOOD_OPTIONS = [
    { id: 'joy', icon: Sun, color: theme.colors.accents.gentlePeach, label: 'Joyful' },
    { id: 'calm', icon: Wind, color: theme.colors.accents.eucalyptus, label: 'Calm' },
    { id: 'anxious', icon: CloudRain, color: theme.colors.accents.powderBlue, label: 'Anxious' },
  ];

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case 'calm': return <Wind color={theme.colors.accents.eucalyptus} size={16} />;
      case 'anxious': return <CloudRain color={theme.colors.accents.powderBlue} size={16} />;
      case 'joy': return <Sun color={theme.colors.accents.gentlePeach} size={16} />;
      default: return <Sun color={theme.colors.accents.gentlePeach} size={16} />;
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await api.get('/journal');
      setEntries(response.data);
      setFilteredEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (filterMood === 'all') {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(e => e.mood === filterMood));
    }
  }, [filterMood, entries]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
        setIsRecording(true);
        micScale.value = withRepeat(withSequence(withTiming(1.2), withTiming(1)), -1, true);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecording(null);
    micScale.value = withTiming(1);
    await recording?.stopAndUnloadAsync();
    const uri = recording?.getURI();
    setAudioUri(uri || null);
  };

  const playSound = async (uri: string, id: string) => {
    if (isPlaying === id) {
      await sound?.pauseAsync();
      setIsPlaying(null);
      return;
    }
    
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    setIsPlaying(id);
    await newSound.playAsync();
    newSound.setOnPlaybackStatusUpdate((status: any) => {
      if (status.didJustFinish) setIsPlaying(null);
    });
  };

  const handleSave = async () => {
    if (!newContent.trim()) return;
    
    try {
      const response = await api.post('/journal', {
        title: newTitle.trim() || 'Untitled Entry',
        content: newContent.trim(),
        mood: selectedMood,
        audioUrl: audioUri,
      });
      
      setEntries([response.data, ...entries]);
      setIsWriting(false);
      setNewTitle('');
      setNewContent('');
      setSelectedMood('calm');
      setAudioUri(null);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to remove this reflection? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/journal/${id}`);
              setEntries(entries.filter(e => e.id !== id));
            } catch (error) {
              console.error('Error deleting journal entry:', error);
              Alert.alert("Error", "Could not delete entry. Please try again.");
            }
          }
        }
      ]
    );
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
          <ScreenHeader 
            title="Journal" 
            subtitle={`${entries.length} reflections captured`}
            rightAction={
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={styles.newBtn}
                onPress={() => setIsWriting(true)}
              >
                <Plus color={theme.colors.text.onPrimary || '#FFF'} size={24} />
              </TouchableOpacity>
            }
          />

          <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
            {/* Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
              <TouchableOpacity 
                onPress={() => setFilterMood('all')}
                style={[styles.filterPill, filterMood === 'all' && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, filterMood === 'all' && styles.filterTextActive]}>All</Text>
              </TouchableOpacity>
              {MOOD_OPTIONS.map(mood => (
                <TouchableOpacity 
                  key={mood.id}
                  onPress={() => setFilterMood(mood.id)}
                  style={[styles.filterPill, filterMood === mood.id && styles.filterPillActive]}
                >
                  <mood.icon size={14} color={filterMood === mood.id ? '#FFF' : mood.color} />
                  <Text style={[styles.filterText, filterMood === mood.id && styles.filterTextActive]}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.plum} style={{ marginTop: 40 }} />
          ) : filteredEntries.length === 0 ? (
            <View style={{ padding: 24, alignItems: 'center', marginTop: 40 }}>
              <BookOpen color={theme.colors.text.disabled} size={48} style={{ marginBottom: 16 }} />
              <Text style={{ color: theme.colors.text.secondary, textAlign: 'center' }}>
                {filterMood === 'all' ? 'Your journal is empty. Tap the + button to capture your thoughts.' : `No ${filterMood} entries found.`}
              </Text>
            </View>
          ) : (
            <View style={styles.entriesList}>
              {filteredEntries.map((entry, index) => (
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <TouchableOpacity 
                        activeOpacity={0.7} 
                        onPress={() => handleDelete(entry.id)}
                        style={styles.deleteBtn}
                      >
                        <Trash2 color={theme.colors.accents.terracotta} size={16} />
                      </TouchableOpacity>
                      <View style={styles.moodBadge}>
                        {getMoodIcon(entry.mood || 'calm')}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.entryTitle}>{entry.title}</Text>
                  <Text style={styles.entryContent} numberOfLines={4}>{entry.content}</Text>
                  
                  {entry.audioUrl && (
                    <TouchableOpacity 
                      style={[styles.audioPreview, { backgroundColor: theme.colors.plum + '10' }]}
                      onPress={() => playSound(entry.audioUrl, entry.id)}
                    >
                      {isPlaying === entry.id ? <Pause size={14} color={theme.colors.plum} /> : <Play size={14} color={theme.colors.plum} />}
                      <Text style={[styles.audioText, { color: theme.colors.plum }]}>Voice Reflection</Text>
                      <View style={styles.audioWaveform}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <View 
                            key={i} 
                            style={[
                              styles.waveBar, 
                              { height: Math.random() * 12 + 4, backgroundColor: isPlaying === entry.id ? theme.colors.plum : theme.colors.text.disabled }
                            ]} 
                          />
                        ))}
                      </View>
                    </TouchableOpacity>
                  )}
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
            {/* Mood Selector in Composer */}
            <View style={styles.moodSelector}>
              <Text style={styles.moodSelectorLabel}>How are you feeling?</Text>
              <View style={styles.moodOptionsRow}>
                {MOOD_OPTIONS.map(mood => (
                  <TouchableOpacity 
                    key={mood.id}
                    onPress={() => setSelectedMood(mood.id)}
                    style={[
                      styles.moodOption, 
                      selectedMood === mood.id && { backgroundColor: mood.color + '20', borderColor: mood.color }
                    ]}
                  >
                    <mood.icon size={20} color={mood.color} />
                    <Text style={[styles.moodOptionText, { color: mood.color }]}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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

            {/* Audio Recording UI */}
            <View style={styles.audioComposer}>
              {audioUri ? (
                <View style={styles.audioPreviewActive}>
                  <TouchableOpacity onPress={() => playSound(audioUri, 'new')} style={styles.playIconBtn}>
                    {isPlaying === 'new' ? <Pause color="#FFF" size={20} /> : <Play color="#FFF" size={20} />}
                  </TouchableOpacity>
                  <Text style={styles.audioPreviewText}>Voice recorded</Text>
                  <TouchableOpacity onPress={() => setAudioUri(null)} style={styles.removeAudioBtn}>
                    <X color={theme.colors.text.tertiary} size={16} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.recordingSection}>
                  <TouchableOpacity 
                    onPress={isRecording ? stopRecording : startRecording}
                    style={[styles.micBtn, isRecording && styles.micBtnRecording]}
                  >
                    <Animated.View style={animatedMicStyle}>
                      {isRecording ? <StopCircle color="#FFF" size={28} /> : <Mic color="#FFF" size={28} />}
                    </Animated.View>
                  </TouchableOpacity>
                  <Text style={styles.recordingLabel}>
                    {isRecording ? "Recording... Tap to stop" : "Tap to add voice"}
                  </Text>
                </View>
              )}
            </View>
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
    paddingHorizontal: 0, 
    paddingBottom: 120 
  },
  header: { 
    marginBottom: 32,
    paddingHorizontal: 24,
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
    paddingHorizontal: 24,
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
    borderColor: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.8)',
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
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,0,0,0.03)',
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
  },
  filterBar: {
    marginTop: 16,
    flexDirection: 'row',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: theme.colors.plum,
    borderColor: theme.colors.plum,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  moodSelector: {
    marginBottom: 24,
  },
  moodSelectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  moodOptionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    gap: 8,
  },
  moodOptionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginTop: 16,
    gap: 10,
  },
  audioText: {
    fontSize: 13,
    fontWeight: '700',
  },
  audioWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    justifyContent: 'flex-end',
  },
  waveBar: {
    width: 2,
    borderRadius: 1,
  },
  audioComposer: {
    marginTop: 20,
    alignItems: 'center',
  },
  recordingSection: {
    alignItems: 'center',
    gap: 8,
  },
  micBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  micBtnRecording: {
    backgroundColor: theme.colors.accents.terracotta,
    shadowColor: theme.colors.accents.terracotta,
  },
  recordingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
  },
  audioPreviewActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.plum + '10',
    padding: 12,
    borderRadius: 20,
    gap: 12,
    width: '100%',
  },
  playIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPreviewText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  removeAudioBtn: {
    padding: 4,
  }
});
