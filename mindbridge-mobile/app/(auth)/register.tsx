import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Dimensions,
  Image,
  Modal,
  FlatList
} from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';
import { theme } from '../../src/theme/colors';
import { useRouter } from 'expo-router';
import api from '../../src/services/api';
import { FadeInUp, FadeInDown } from 'react-native-reanimated';
import Reanimated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, ChevronLeft, GraduationCap, Heart, User, AlertCircle, Search, Check, X } from 'lucide-react-native';
import AuthCharacters, { AuthField } from '../../src/components/AuthCharacters';

const { height, width } = Dimensions.get('window');

// ─── Data: Ghanaian Tertiary Institutions ───────────────────────────────────
const GHANA_INSTITUTIONS = [
  "University of Ghana (UG)",
  "Kwame Nkrumah University of Science and Technology (KNUST)",
  "University of Cape Coast (UCC)",
  "University of Education, Winneba (UEW)",
  "University for Development Studies (UDS)",
  "University of Professional Studies, Accra (UPSA)",
  "Ghana Communication Technology University (GCTU)",
  "Ashesi University",
  "Central University",
  "Valley View University",
  "Academic City University College",
  "Lancaster University Ghana",
  "Accra Technical University",
  "Kumasi Technical University",
  "Ho Technical University",
  "Takoradi Technical University",
  "Tamale Technical University",
  "Koforidua Technical University",
  "Sunyani Technical University",
  "Cape Coast Technical University",
  "Presbyterian University College",
  "Methodist University College",
  "Pentecost University",
  "Wisconsin International University College",
  "Regent University College",
  "All Nations University",
  "Ghana Institute of Journalism (GIJ)",
  "GIMPA",
  "UHS (University of Health and Allied Sciences)",
  "UENR (University of Energy and Natural Resources)",
  "AAMUSTED",
  "BlueCrest University College",
  "Kings University College",
  "Mountcrest University College",
  "Garden City University College",
  "Radford University College",
  "Others"
].sort();

// ─── Custom Components ───────────────────────────────────────────────────────

const ErrorMessage = ({ message }: { message: string | undefined }) => {
  if (!message) return null;
  return (
    <Reanimated.View entering={FadeInDown} style={styles.errorRow}>
      <AlertCircle color={theme.colors.semantic.danger} size={14} style={{ marginRight: 4 }} />
      <Text style={styles.errorText}>{message}</Text>
    </Reanimated.View>
  );
};

const FormSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Icon color={theme.colors.plum} size={20} style={{ marginRight: 8 }} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const SelectGroup = ({ label, options, selectedValue, onSelect }: { label: string; options: string[]; selectedValue: string; onSelect: (val: string) => void }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.chipContainer}>
      {options.map((opt) => (
        <TouchableOpacity 
          key={opt}
          style={[styles.chip, selectedValue === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}
        >
          <Text style={[styles.chipText, selectedValue === opt && styles.chipTextActive]}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Searchable Dropdown Modal
const InstitutionPicker = ({ value, onSelect, error }: { value: string; onSelect: (val: string) => void; error?: string }) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  
  const filtered = GHANA_INSTITUTIONS.filter(i => 
    i.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>Institution / University</Text>
      <TouchableOpacity 
        style={[styles.input, styles.pickerTrigger, error && styles.inputError]} 
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.pickerValue, !value && { color: theme.colors.text.disabled }]}>
          {value || "Select your institution"}
        </Text>
        <ChevronLeft color={theme.colors.plum} size={20} style={{ transform: [{ rotate: '-90deg' }] }} />
      </TouchableOpacity>
      <ErrorMessage message={error} />

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Institution</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
                <X color={theme.colors.plum} size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search color={theme.colors.plum} size={20} style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search institution..."
                placeholderTextColor={theme.colors.text.disabled}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <FlatList 
              data={filtered}
              keyExtractor={item => item}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.listItem, value === item && styles.listItemActive]} 
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.listItemText, value === item && styles.listItemTextActive]}>{item}</Text>
                  {value === item && <Check color={theme.colors.surface} size={18} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default function RegisterScreen() {
  const { signIn } = useContext(AuthContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Basic Info
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Academic Info
  const [institution, setInstitution] = useState('');
  const [faculty, setFaculty] = useState('');
  const [level, setLevel] = useState('Level 100');
  const [status, setStatus] = useState('Full-time');
  
  // Mental Health Info
  const [stressSource, setStressSource] = useState('Academics');
  const [supportType, setSupportType] = useState('Self-help');
  const [reminders, setReminders] = useState('Yes');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<AuthField>('none');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validate = () => {
    let newErrors: Record<string, string> = {};
    let valid = true;

    if (!username) { newErrors.username = 'Username is required'; valid = false; }
    if (!email) { newErrors.email = 'Email is required'; valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { newErrors.email = 'Enter a valid email'; valid = false; }
    
    if (!phoneNumber) { newErrors.phoneNumber = 'Phone number is required'; valid = false; }
    
    if (!password) { newErrors.password = 'Password is required'; valid = false; }
    else if (password.length < 6) { newErrors.password = 'Min 6 characters'; valid = false; }
    
    if (password !== confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; valid = false; }
    
    if (!institution) { newErrors.institution = 'Please select your institution'; valid = false; }

    setErrors(newErrors);
    if (!valid) Alert.alert('Check Fields', 'Please correct the errors in the form.');
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name, username, email, phoneNumber, password,
        academic: { institution, faculty, level, status },
        preferences: { stressSource, supportType, reminders: reminders === 'Yes' }
      };
      const response = await api.post('/auth/register', payload);
      await signIn(response.data.token);
      router.replace('/(auth)/onboarding');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Unable to connect to server';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[theme.colors.background, theme.colors.accents.softLilac]} 
        style={[styles.topSection, { paddingTop: insets.top }]}
      >
        <View style={[styles.blurCircle, styles.circle1]} />
        <View style={[styles.blurCircle, styles.circle2]} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color={theme.colors.plum} size={30} />
          </TouchableOpacity>
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="cover" />
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.charactersWrapper}>
          <AuthCharacters focusedField={focusedField} showPassword={showPassword} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.bottomSectionWrapper}
      >
        <View style={styles.bottomSection}>
          <ScrollView 
            contentContainerStyle={[styles.formScrollContent, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Reanimated.View entering={FadeInUp.duration(600).springify()} style={styles.titleContainer}>
              <Text style={styles.title}>Join MindBridge</Text>
              <Text style={styles.subtitle}>Let's personalize your experience</Text>
            </Reanimated.View>

            <Reanimated.View entering={FadeInDown.duration(600).delay(200).springify()} style={styles.formContainer}>
              
              <FormSection title="Account Information" icon={User}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Full Name (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Prosper Shaibu Asare"
                    placeholderTextColor={theme.colors.text.disabled}
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('none')}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="asare09"
                    placeholderTextColor={theme.colors.text.disabled}
                    autoCapitalize="none"
                    value={username}
                    onChangeText={(txt) => { setUsername(txt); if (errors.username) setErrors({...errors, username: undefined}); }}
                  />
                  <ErrorMessage message={errors.username} />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="asareprosper143@gmail.com"
                    placeholderTextColor={theme.colors.text.disabled}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(txt) => { setEmail(txt); if (errors.email) setErrors({...errors, email: undefined}); }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('none')}
                  />
                  <ErrorMessage message={errors.email} />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={[styles.input, errors.phoneNumber && styles.inputError]}
                    placeholder="+233 55 123 4567"
                    placeholderTextColor={theme.colors.text.disabled}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(txt) => { setPhoneNumber(txt); if (errors.phoneNumber) setErrors({...errors, phoneNumber: undefined}); }}
                    onFocus={() => setFocusedField('none')}
                    onBlur={() => setFocusedField('none')}
                  />
                  <ErrorMessage message={errors.phoneNumber} />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                    <TextInput
                      style={[styles.input, { flex: 1, borderWidth: 0, backgroundColor: 'transparent' }]}
                      placeholder="••••••••"
                      placeholderTextColor={theme.colors.text.disabled}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={(txt) => { setPassword(txt); if (errors.password) setErrors({...errors, password: undefined}); }}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('none')}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                      {showPassword ? <EyeOff color={theme.colors.plum} size={22} /> : <Eye color={theme.colors.plum} size={22} />}
                    </TouchableOpacity>
                  </View>
                  <ErrorMessage message={errors.password} />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <TextInput
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.text.disabled}
                    secureTextEntry={!showPassword}
                    value={confirmPassword}
                    onChangeText={(txt) => { setConfirmPassword(txt); if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined}); }}
                  />
                  <ErrorMessage message={errors.confirmPassword} />
                </View>
              </FormSection>

              <FormSection title="Academic Context" icon={GraduationCap}>
                <InstitutionPicker 
                  value={institution} 
                  onSelect={setInstitution} 
                  error={errors.institution}
                />

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Faculty / Department</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Computer Science"
                    placeholderTextColor={theme.colors.text.disabled}
                    value={faculty}
                    onChangeText={setFaculty}
                  />
                </View>

                <SelectGroup 
                  label="Level / Year of Study"
                  options={['Level 100', 'Level 200', 'Level 300', 'Level 400', 'Postgrad']}
                  selectedValue={level}
                  onSelect={setLevel}
                />

                <SelectGroup 
                  label="Student Status"
                  options={['Full-time', 'Part-time']}
                  selectedValue={status}
                  onSelect={setStatus}
                />
              </FormSection>

              <FormSection title="Support Preferences" icon={Heart}>
                <SelectGroup 
                  label="Primary Source of Stress"
                  options={['Academics', 'Financial', 'Relationships', 'Social', 'Other']}
                  selectedValue={stressSource}
                  onSelect={setStressSource}
                />

                <SelectGroup 
                  label="Preferred Support Type"
                  options={['Self-help', 'Mood tracking', 'Chat', 'Crisis', 'All']}
                  selectedValue={supportType}
                  onSelect={setSupportType}
                />

                <SelectGroup 
                  label="Daily Reminder Preference"
                  options={['Yes', 'No']}
                  selectedValue={reminders}
                  onSelect={setReminders}
                />
              </FormSection>

              <View style={styles.personalizationNote}>
                <Heart color={theme.colors.plum} size={16} />
                <Text style={styles.personalizationText}>
                  This information helps us shape a supportive experience tailored just for you.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator color={theme.colors.surface} />
                    <Text style={styles.loadingText}>Personalizing...</Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Already have an account? <Text style={styles.signUpLink}>Log In</Text></Text>
              </TouchableOpacity>
            </Reanimated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundSecondary },
  topSection: { height: height * 0.4, overflow: 'hidden' },
  blurCircle: { position: 'absolute', borderRadius: 150, opacity: 0.5 },
  circle1: { top: '10%', right: '-10%', width: 200, height: 200, backgroundColor: theme.colors.accents.softMint },
  circle2: { bottom: '5%', left: '-15%', width: 250, height: 250, backgroundColor: theme.colors.accents.powderBlue },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10, zIndex: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  brandContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', backgroundColor: theme.colors.surface, borderWidth: 2.5, borderColor: theme.colors.mauve, elevation: 8 },
  logoImage: { width: '100%', height: '100%' },
  charactersWrapper: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 },
  bottomSectionWrapper: { flex: 1, marginTop: -30 },
  bottomSection: { flex: 1, backgroundColor: theme.colors.backgroundSecondary, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  formScrollContent: { paddingHorizontal: 24, paddingTop: 32 },
  titleContainer: { marginBottom: 24, alignItems: 'center' },
  title: { color: theme.colors.plum, fontSize: 30, fontWeight: '900', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { color: theme.colors.text.primary, fontSize: 16, fontWeight: '600', opacity: 0.7 },
  formContainer: { gap: 32 },
  sectionContainer: { gap: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.plum, letterSpacing: -0.3 },
  inputWrapper: { gap: 6 },
  label: { color: theme.colors.plum, fontSize: 14, fontWeight: '800', marginLeft: 4 },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.plum, fontSize: 16, height: 56, borderRadius: 16, paddingHorizontal: 16, borderWidth: 2, borderColor: theme.colors.mauve },
  inputError: { borderColor: theme.colors.semantic.danger },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 4, marginTop: 2 },
  errorText: { color: theme.colors.semantic.danger, fontSize: 12, fontWeight: '600' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 2, borderColor: theme.colors.mauve, height: 56 },
  eyeIcon: { padding: 16 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: theme.colors.surface, borderWidth: 1.5, borderColor: theme.colors.mauve },
  chipActive: { backgroundColor: theme.colors.plum, borderColor: theme.colors.plum },
  chipText: { fontSize: 14, color: theme.colors.plum, fontWeight: '600' },
  chipTextActive: { color: theme.colors.surface },
  
  // Picker Styles
  pickerTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerValue: { fontSize: 16, fontWeight: '600', color: theme.colors.plum },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: theme.colors.backgroundSecondary, borderTopLeftRadius: 32, borderTopRightRadius: 32, height: height * 0.8, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: theme.colors.plum },
  closeBtn: { padding: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 2, borderColor: theme.colors.mauve, paddingHorizontal: 16, marginBottom: 16 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, color: theme.colors.plum, fontWeight: '600', fontSize: 15 },
  listContent: { paddingBottom: 40 },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.accents.softLilac, paddingHorizontal: 4 },
  listItemActive: { backgroundColor: theme.colors.plum, borderRadius: 12, paddingHorizontal: 16, marginVertical: 4, borderBottomWidth: 0 },
  listItemText: { fontSize: 15, color: theme.colors.text.primary, fontWeight: '600', flex: 1 },
  listItemTextActive: { color: theme.colors.surface, fontWeight: '700' },

  personalizationNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.accents.softLilac, padding: 12, borderRadius: 12, marginTop: 8, gap: 10, borderWidth: 1, borderColor: theme.colors.mauve },
  personalizationText: { flex: 1, fontSize: 13, color: theme.colors.plum, fontWeight: '600', lineHeight: 18 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingText: { color: theme.colors.surface, fontWeight: '800', fontSize: 16 },
  primaryButton: { backgroundColor: theme.colors.plum, height: 62, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginTop: 4, elevation: 6 },
  primaryButtonText: { color: theme.colors.surface, fontWeight: '800', fontSize: 17 },
  signUpContainer: { marginTop: 8, alignItems: 'center' },
  signUpText: { color: theme.colors.text.primary, fontSize: 14, fontWeight: '500' },
  signUpLink: { color: theme.colors.plum, fontWeight: '800' },
});
