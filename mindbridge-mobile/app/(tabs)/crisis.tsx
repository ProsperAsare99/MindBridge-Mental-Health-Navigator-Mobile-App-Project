import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  StatusBar,
  Alert
} from 'react-native';
import { AuthContext } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { 
  Phone, 
  Building2,
  PhoneForwarded,
  MapPin,
  ChevronRight,
  Stethoscope,
  Users,
  BriefcaseMedical
} from 'lucide-react-native';

const UNIVERSITY_COUNSELING_CENTERS: Record<string, any> = {
  'Kwame Nkrumah University of Science and Technology (KNUST)': {
    name: 'KNUST Counseling Center',
    number: '+233 24 123 4567',
    description: 'Professional support for students & staff',
    address: 'Dean of Students Office, Campus'
  },
  'University of Ghana (UG)': {
    name: 'UG Counseling & Placement Center',
    number: '+233 30 250 0381',
    description: 'Confidential psychological support',
    address: 'Legon Campus'
  },
  'University of Cape Coast (UCC)': {
    name: 'UCC Counseling Center',
    number: '+233 24 485 5411',
    description: 'Mental health and career guidance services',
    address: 'North Campus, Cape Coast'
  },
  'Ashesi University': {
    name: 'Ashesi Health & Wellbeing',
    number: '+233 30 261 0330',
    description: 'Holistic support for Ashesi students',
    address: 'Berekuso Campus'
  },
  'Academic City University College': {
    name: 'Academic City Student Support',
    number: '+233 30 277 2222',
    description: 'Wellness and counseling for ACity students',
    address: 'Haatso, Accra'
  },
  'University of Professional Studies, Accra (UPSA)': {
    name: 'UPSA Counseling Services',
    number: '+233 30 250 1181',
    description: 'Professional guidance and counseling unit',
    address: 'Legon, Accra'
  },
  'GIMPA': {
    name: 'GIMPA Counseling Unit',
    number: '+233 30 240 1681',
    description: 'Support for the GIMPA community',
    address: 'Greenhill, Accra'
  },
  'Other': {
    name: 'National Counseling Center',
    number: '0800 678 678',
    description: 'General institutional support',
    address: 'Head Office, Accra'
  }
};

export default function CrisisSupportScreen() {
  const insets = useSafeAreaInsets();
  const themeContext = useTheme();
  const { userData } = useContext(AuthContext) as any;
  const userUni = userData?.academic?.institution || 'Other';
  
  const styles = createStyles(themeContext);
  const institution = UNIVERSITY_COUNSELING_CENTERS[userUni] || UNIVERSITY_COUNSELING_CENTERS['Other'];

  const NEARBY_SERVICES = [
    {
      id: 'therapy',
      title: 'Private Therapy Clinics',
      description: 'Licensed psychologists and therapists for continued care',
      icon: Stethoscope,
      query: 'therapy+clinics+near+me',
      color: themeContext.colors.ocean,
    },
    {
      id: 'hospital',
      title: 'Mental Health Facilities',
      description: 'Psychiatric hospitals and intensive care units',
      icon: BriefcaseMedical,
      query: 'psychiatric+hospital+near+me',
      color: themeContext.colors.plum,
    },
    {
      id: 'support',
      title: 'Community Support Groups',
      description: 'Peer support, group therapy, and rehabilitation',
      icon: Users,
      query: 'mental+health+support+groups+near+me',
      color: themeContext.colors.accents.mossVelvet,
    }
  ];

  const handleCall = async (number: string) => {
    try {
      const url = `tel:${number.replace(/\s+/g, '')}`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Unavailable', 'Your device does not support calling at this time.');
      }
    } catch (error) {
      console.warn('Error opening dialer:', error);
    }
  };

  const handleMap = async (query: string) => {
    try {
      const url = `https://www.google.com/maps/search/${query}`;
      await Linking.openURL(url);
    } catch (error) {
      console.warn('Error opening maps:', error);
      Alert.alert('Map Unavailable', 'Unable to open maps. Please search manually for local services.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={themeContext.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={themeContext.isDark 
          ? ['rgba(110, 136, 176, 0.15)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
          : ['rgba(110, 136, 176, 0.1)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
        } 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title="Care Navigator" 
          subtitle="Institutional support & local mental health services allocation"
        />

        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>Your Institutional Care</Text>
          
          <View style={styles.institutionCard}>
            <View style={styles.instHeader}>
              <View style={[styles.iconWrap, { backgroundColor: themeContext.colors.plum + '20' }]}>
                <Building2 color={themeContext.colors.plum} size={28} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.instTitle}>{institution.name}</Text>
                <Text style={styles.instDesc}>{institution.description}</Text>
              </View>
            </View>

            <View style={styles.instDetails}>
              <View style={styles.detailRow}>
                <MapPin size={16} color={themeContext.colors.text.tertiary} />
                <Text style={styles.detailText}>{institution.address}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.primaryCallBtn}
              onPress={() => handleCall(institution.number)}
              activeOpacity={0.8}
            >
              <Phone color="#FFF" size={20} style={{ marginRight: 8 }} />
              <Text style={styles.primaryCallText}>Contact Counseling Services</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Services & Therapy</Text>
          <Text style={styles.sectionSubtitle}>Allocated community services for extended support outside campus.</Text>
          
          {NEARBY_SERVICES.map((service, index) => (
            <Animated.View key={service.id} entering={FadeInUp.delay(400 + (index * 100)).duration(500)}>
              <TouchableOpacity 
                style={styles.serviceCard}
                onPress={() => handleMap(service.query)}
                activeOpacity={0.8}
              >
                <View style={[styles.serviceIconWrap, { backgroundColor: service.color + (themeContext.isDark ? '25' : '15') }]}>
                  <service.icon color={service.color} size={24} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceDesc}>{service.description}</Text>
                </View>
                <ChevronRight color={themeContext.colors.text.disabled} size={20} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>National Crisis Fallbacks</Text>
          
          <TouchableOpacity 
            style={styles.fallbackCard}
            onPress={() => handleCall('112')}
            activeOpacity={0.8}
          >
            <View style={[styles.serviceIconWrap, { backgroundColor: themeContext.colors.semantic.danger + '20' }]}>
              <Phone color={themeContext.colors.semantic.danger} size={22} />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>National Emergency (112)</Text>
              <Text style={styles.serviceDesc}>Police, Fire, Ambulance (24/7)</Text>
            </View>
            <PhoneForwarded color={themeContext.colors.text.disabled} size={20} />
          </TouchableOpacity>

        </Animated.View>

      </ScrollView>
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  institutionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: theme.isDark ? 0.2 : 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  instHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  instTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  instDesc: {
    fontSize: 14,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  instDetails: {
    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  primaryCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.plum,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: theme.colors.plum,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCallText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.isDark ? 0.2 : 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  fallbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.semantic.danger + '30',
  }
});
