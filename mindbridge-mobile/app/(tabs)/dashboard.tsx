// ─── Daily Progress Rings ───────────────────────────────────────────────────

const ProgressRings = ({ completed, total, theme }: any) => {
  const styles = createStyles(theme);
  const size = 50;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = completed / total;
  const offset = circumference - (progress * circumference);

  return (
    <View style={styles.ringsContainer}>
      <View style={styles.ringWrap}>
        <View style={[styles.ringBg, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: theme.colors.plum + '10' }]} />
        <View style={[styles.ringFill, { width: size, height: size, borderRadius: size / 2, borderTopColor: theme.colors.plum, borderRightColor: theme.colors.plum, borderBottomColor: progress > 0.5 ? theme.colors.plum : 'transparent', borderLeftColor: progress > 0.75 ? theme.colors.plum : 'transparent', borderTopWidth: strokeWidth, borderRightWidth: strokeWidth, borderBottomWidth: strokeWidth, borderLeftWidth: strokeWidth, transform: [{ rotate: '-45deg' }] }]} />
      </View>
      <View style={styles.ringsTextWrap}>
        <Text style={styles.ringsCount}>{completed}/{total}</Text>
        <Text style={styles.ringsLabel}>Today</Text>
      </View>
    </View>
  );
};

// ─── Weekly Pulse Widget ─────────────────────────────────────────────────────

const WeeklyPulse = ({ theme, t }: any) => {
  const styles = createStyles(theme);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const scores = [0.8, 0.6, 0.9, 0.4, 0.7, 0.8, 0.5]; // Mock data for pulse

  return (
    <Animated.View entering={FadeInUp.delay(200)} style={styles.pulseCard}>
      <BlurView intensity={theme.isDark ? 30 : 60} tint={theme.isDark ? 'dark' : 'light'} style={styles.pulseGlass}>
        <View style={styles.pulseHeader}>
          <View>
            <Text style={styles.pulseTitle}>Weekly Pulse</Text>
            <Text style={styles.pulseSubtitle}>Mostly Calm & Steady</Text>
          </View>
          <Sparkles color={theme.colors.plum} size={20} />
        </View>
        <View style={styles.pulseGraph}>
          {scores.map((score, i) => (
            <View key={i} style={styles.pulseCol}>
              <View style={styles.pulseBarBg}>
                <LinearGradient
                  colors={[theme.colors.plum, theme.colors.accents.powderBlue]}
                  style={[styles.pulseBarFill, { height: `${score * 100}%` }]}
                />
              </View>
              <Text style={styles.pulseDayLabel}>{days[i]}</Text>
            </View>
          ))}
        </View>
      </BlurView>
    </Animated.View>
  );
};

// ... (rest of existing components)

// ─── Dashboard Screen ────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { userData: authData } = useContext(AuthContext) as any;
  
  const [rituals, setRituals] = useState({ garden: false, journal: false, breathing: false });
  const [userData, setUserData] = useState({
    name: authData?.name || 'Friend',
    language: 'English' as Language
  });

  const t: TranslationSchema = translations[userData.language] || translations.English;
  const completedCount = Object.values(rituals).filter(Boolean).length;

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const todayStr = new Date().toDateString();
        const res = await api.get('/ai/oracle-context');
        const { latestMood, recentJournal } = res.data;
        
        setRituals({
          garden: latestMood && new Date(latestMood.createdAt).toDateString() === todayStr,
          journal: recentJournal && recentJournal.some((log: any) => new Date(log.createdAt).toDateString() === todayStr),
          breathing: await AsyncStorage.getItem(`breathing_${todayStr}`) === 'true'
        });

        if (res.data.onboarding?.firstName) {
          setUserData(prev => ({ ...prev, name: res.data.onboarding.firstName }));
        }
      } catch (e) {}
    };
    checkStatus();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.greetingMorning;
    if (hour < 18) return t.dashboard.greetingAfternoon;
    return t.dashboard.greetingEvening;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={theme.isDark 
            ? ['#121212', '#1A1A1A', '#0D0D0D'] 
            : ['#FDFCFB', '#F4F7F9', '#E6E9EF']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.bgBlob, { top: -50, right: -50, backgroundColor: theme.colors.plum + '08' }]} />
        <View style={[styles.bgBlob, { bottom: 100, left: -50, backgroundColor: theme.colors.accents.powderBlue + '05' }]} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <ScreenHeader 
              title={`${getGreeting()}, ${userData.name}`}
              subtitle="Nurture your peace today"
              noPadding
            />
          </View>
          <ProgressRings completed={completedCount} total={3} theme={theme} />
        </View>

        <View style={styles.section}>
          <QuoteSlideshow />
        </View>

        <View style={styles.section}>
          <WeeklyPulse theme={theme} t={t} />
        </View>

        <Animated.View entering={FadeInUp.delay(300)} style={styles.ritualsContainer}>
          <View style={styles.ritualHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Leaf color={theme.colors.plum} size={20} strokeWidth={2.5} />
              <Text style={styles.ritualTitle}>{t.dashboard.nurtureTitle}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/journey')}>
              <Text style={styles.viewAllText}>View Journey</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.ritualRow}>
            <RitualItem label="Mood Seed" done={rituals.garden} icon={Leaf} color={theme.colors.accents.eucalyptus} theme={theme} onPress={() => router.push('/(tabs)/garden')} />
            <RitualItem label="Reflect" done={rituals.journal} icon={BookOpen} color={theme.colors.accents.powderBlue} theme={theme} onPress={() => router.push('/(tabs)/journal')} />
            <RitualItem label="Breathe" done={rituals.breathing} icon={Wind} color={theme.colors.accents.softLilac} theme={theme} onPress={() => router.push('/breathing')} />
          </View>
        </Animated.View>

        <View style={styles.section}>
          <AppleWidget title={t.ai.title} subtitle={t.ai.subtitle} icon={Bot} color={theme.colors.plum} size="wide" delay={400} onPress={() => router.push('/(tabs)/ai-guide')} />
        </View>

        <View style={styles.sectionCompact}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleText}>{t.dashboard.toolsTitle}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll} snapToInterval={152} decelerationRate="fast">
            <AppleWidget title="Assessments" subtitle="Daily check" icon={ClipboardList} color={theme.colors.accents.slate} size="fixed" delay={450} onPress={() => router.push('/(tabs)/assessments')} />
            <AppleWidget title="Resources" subtitle="Library" icon={Library} color={theme.colors.accents.forestGreen} size="fixed" delay={500} onPress={() => router.push('/(tabs)/resources')} />
            <AppleWidget title="Community" subtitle="Connect" icon={Users} color={theme.colors.accents.dustyRose} size="fixed" delay={550} onPress={() => router.push('/(tabs)/community')} />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleText}>{t.dashboard.supportTitle}</Text>
          <View style={styles.listContainer}>
            <AppleWidget title="Wellness Journey" subtitle="Your personalized roadmap" icon={Clock} color={theme.colors.plum} size="list" delay={600} onPress={() => router.push('/(tabs)/journey')} />
            <View style={styles.divider} />
            <AppleWidget title="Crisis Support" subtitle="Immediate assistance 24/7" icon={ShieldAlert} color={theme.colors.accents.terracotta} size="list" delay={700} onPress={() => router.push('/(tabs)/crisis')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  bgBlob: { position: 'absolute', width: 400, height: 400, borderRadius: 200, opacity: 0.6 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 24 },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 24 },
  sectionTitleText: { fontSize: 20, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, marginBottom: 16, paddingHorizontal: 24 },
  sectionCompact: { marginBottom: 32 },
  horizontalScroll: { paddingLeft: 24, paddingRight: 8 },
  
  // Progress Rings
  ringsContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)', padding: 10, borderRadius: 25, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,1)' },
  ringWrap: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  ringBg: { position: 'absolute' },
  ringFill: { position: 'absolute' },
  ringsTextWrap: { marginRight: 4 },
  ringsCount: { fontSize: 15, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, lineHeight: 18 },
  ringsLabel: { fontSize: 10, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Weekly Pulse
  pulseCard: { marginBottom: 32 },
  pulseGlass: { borderRadius: 32, overflow: 'hidden', padding: 24, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  pulseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  pulseTitle: { fontSize: 18, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  pulseSubtitle: { fontSize: 13, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, marginTop: 2 },
  pulseGraph: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, paddingHorizontal: 8 },
  pulseCol: { alignItems: 'center', gap: 10 },
  pulseBarBg: { width: 14, height: 80, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderRadius: 7, overflow: 'hidden', justifyContent: 'flex-end' },
  pulseBarFill: { width: '100%', borderRadius: 7 },
  pulseDayLabel: { fontSize: 11, fontFamily: theme.typography.fonts.header, color: theme.colors.text.tertiary },

  quoteCardContainer: { shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  quoteCard: { borderRadius: 32, padding: 32, minHeight: 200, justifyContent: 'center', overflow: 'hidden' },
  quoteMarkContainer: { position: 'absolute', top: -20, left: 20, opacity: 0.1 },
  largeQuoteMark: { fontSize: 140, color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  quoteText: { fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#FFF', lineHeight: 28, textAlign: 'center', fontStyle: 'italic', marginBottom: 16 },
  quoteAuthor: { fontSize: 11, fontFamily: theme.typography.fonts.header, color: 'rgba(255,255,255,0.7)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 },
  ritualsContainer: { marginHorizontal: 24, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  ritualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  ritualTitle: { fontSize: 18, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  viewAllText: { fontSize: 13, fontFamily: theme.typography.fonts.header, color: theme.colors.plum },
  ritualRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ritualItem: { alignItems: 'center', width: (width - 48 - 48) / 3 },
  ritualIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  checkBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', borderRadius: 10, padding: 2 },
  ritualLabel: { fontSize: 11, fontFamily: theme.typography.fonts.header, color: theme.colors.text.tertiary, textAlign: 'center' },
  widget: { borderRadius: 28, overflow: 'hidden', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  widgetSquare: { aspectRatio: 1, padding: 20 },
  widgetWide: { padding: 24, minHeight: 110 },
  widgetFixed: { width: 140, aspectRatio: 1, padding: 16 },
  squareContent: { flex: 1, justifyContent: 'space-between' },
  wideContent: { flexDirection: 'row', alignItems: 'center', height: '100%' },
  widgetIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  wideTextWrap: { flex: 1, marginLeft: 16 },
  widgetTitle: { fontSize: 15, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  widgetSubtitle: { fontSize: 12, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, marginTop: 2 },
  listContainer: { backgroundColor: theme.colors.surface, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
  listWidget: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  listIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  listTextWrap: { flex: 1 },
  listTitle: { fontSize: 16, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  listSubtitle: { fontSize: 13, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginLeft: 72 },
});
rney" subtitle="Your personalized roadmap" icon={Clock} color={theme.colors.plum} size="list" delay={500} onPress={() => router.push('/(tabs)/journey')} />
            <View style={styles.divider} />
            <AppleWidget title="Crisis Support" subtitle="Immediate assistance 24/7" icon={ShieldAlert} color={theme.colors.accents.terracotta} size="list" delay={600} onPress={() => router.push('/(tabs)/crisis')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  bgBlob: { position: 'absolute', width: 300, height: 300, borderRadius: 150, opacity: 0.6 },
  section: { marginBottom: 32, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 20, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary, marginBottom: 16, paddingHorizontal: 24 },
  sectionCompact: { marginBottom: 32 },
  horizontalScroll: { paddingLeft: 24, paddingRight: 8 },
  quoteCardContainer: { shadowColor: theme.colors.plum, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  quoteCard: { borderRadius: 32, padding: 32, minHeight: 200, justifyContent: 'center', overflow: 'hidden' },
  quoteMarkContainer: { position: 'absolute', top: -20, left: 20, opacity: 0.1 },
  largeQuoteMark: { fontSize: 140, color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  quoteText: { fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: '#FFF', lineHeight: 28, textAlign: 'center', fontStyle: 'italic', marginBottom: 16 },
  quoteAuthor: { fontSize: 11, fontFamily: theme.typography.fonts.header, color: 'rgba(255,255,255,0.7)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 },
  ritualsContainer: { marginHorizontal: 24, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)', borderRadius: 32, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  ritualHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  ritualTitle: { fontSize: 18, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  progressBadge: { backgroundColor: theme.colors.plum + '15', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  ritualProgress: { fontSize: 13, fontFamily: theme.typography.fonts.header, color: theme.colors.plum },
  ritualRow: { flexDirection: 'row', justifyContent: 'space-between' },
  ritualItem: { alignItems: 'center', width: (width - 48 - 48) / 3 },
  ritualIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  checkBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FFF', borderRadius: 10, padding: 2 },
  ritualLabel: { fontSize: 11, fontFamily: theme.typography.fonts.header, color: theme.colors.text.tertiary, textAlign: 'center' },
  widget: { borderRadius: 28, overflow: 'hidden', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)' },
  widgetSquare: { aspectRatio: 1, padding: 20 },
  widgetWide: { padding: 24, minHeight: 110 },
  widgetFixed: { width: 140, aspectRatio: 1, padding: 16 },
  squareContent: { flex: 1, justifyContent: 'space-between' },
  wideContent: { flexDirection: 'row', alignItems: 'center', height: '100%' },
  widgetIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  wideTextWrap: { flex: 1, marginLeft: 16 },
  widgetTitle: { fontSize: 15, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  widgetSubtitle: { fontSize: 12, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary, marginTop: 2 },
  listContainer: { backgroundColor: theme.colors.surface, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
  listWidget: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  listIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  listTextWrap: { flex: 1 },
  listTitle: { fontSize: 16, fontFamily: theme.typography.fonts.header, color: theme.colors.text.primary },
  listSubtitle: { fontSize: 13, fontFamily: theme.typography.fonts.body, color: theme.colors.text.secondary },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginLeft: 72 },
});
