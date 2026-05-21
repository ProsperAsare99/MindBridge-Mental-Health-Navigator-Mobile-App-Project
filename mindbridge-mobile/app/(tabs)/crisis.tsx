import React from 'react';
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
import { useContext, useEffect, useState } from 'react';
import { useTheme } from '../../src/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { 
  ShieldAlert, 
  Phone, 
  MessageSquare, 
  HeartHandshake, 
  MapPin,
  ChevronRight,
  ShieldCheck,
  Building2,
  PhoneForwarded
} from 'lucide-react-native';

const UNIVERSITY_COUNSELING_CENTERS: Record<string, any> = {
  'KNUST': {
    name: 'KNUST Counseling Center',
    number: '+233 24 123 4567',
    description: 'Professional support for students & staff (24/7)'
  },
  'University of Ghana (UG)': {
    name: 'UG Counseling & Placement Center',
    number: '+233 30 250 0381',
    description: 'Confidential psychological support at Legon'
  },
  'University of Cape Coast (UCC)': {
    name: 'UCC Counseling Center',
    number: '+233 24 485 5411',
    description: 'Mental health and career guidance services'
  },
  'Ashesi University': {
    name: 'Ashesi Health & Wellbeing',
    number: '+233 30 261 0330',
    description: 'Holistic support for Ashesi students'
  },
  'Academic City': {
    name: 'Academic City Student Support',
    number: '+233 30 277 2222',
    description: 'Wellness and counseling for ACity students'
  },
  'UPSA': {
    name: 'UPSA Counseling Services',
    number: '+233 30 250 1181',
    description: 'Professional guidance and counseling unit'
  },
  'GIMPA': {
    name: 'GIMPA Counseling Unit',
    number: '+233 30 240 1681',
    description: 'Support for the GIMPA community'
  },
  'Other': {
    name: 'National Counseling Line',
    number: '0800 678 678',
    description: 'Toll-free national psychological support'
  }
};

const getEmergencyContacts = (theme: any, t: any, userUni: string) => {
  const uniCenter = UNIVERSITY_COUNSELING_CENTERS[userUni] || UNIVERSITY_COUNSELING_CENTERS['Other'];
  
  return [
    {
      id: 'national',
      title: t('crisis.national_emergency'),
      number: '112',
      description: 'Police, Fire, Ambulance (24/7)',
      icon: Phone,
      color: theme.colors.semantic.danger,
      primary: true,
    },
    {
      id: 'counseling',
      title: uniCenter.name,
      number: uniCenter.number,
      description: uniCenter.description,
      icon: Building2,
      color: theme.colors.plum,
    },
    {
      id: 'mental_health_authority',
      title: t('crisis.mental_health_helpline'),
      number: '0800 678 678',
      description: 'Mental Health Authority Support Line',
      icon: PhoneForwarded,
      color: theme.colors.accents.terracotta,
    }
  ];
};

const SAFETY_PLAN = [
  { id: '1', text: 'Call my best friend or sibling' },
  { id: '2', text: 'Listen to my "Calm Down" playlist' },
  { id: '3', text: 'Do the 5-4-3-2-1 grounding exercise' },
  { id: '4', text: 'Go for a walk outside' },
];

export default function CrisisSupportScreen() {
  const insets = useSafeAreaInsets();
  const themeContext = useTheme();
  const { t } = themeContext;
  const { userData } = useContext(AuthContext) as any;
  const userUni = userData?.onboarding?.university || 'Other';
  
  const styles = createStyles(themeContext);
  const EMERGENCY_CONTACTS = getEmergencyContacts(themeContext, t, userUni);

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number.replace(/\s+/g, '')}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={themeContext.isDark ? "light-content" : "dark-content"} />
      <LinearGradient 
        colors={themeContext.isDark 
          ? ['rgba(239, 68, 68, 0.1)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
          : ['rgba(239, 68, 68, 0.05)', themeContext.colors.background, themeContext.colors.backgroundSecondary]
        } 
        locations={[0, 0.2, 1]}
        style={StyleSheet.absoluteFillObject} 
      />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader 
          title={t('crisis.title')} 
          subtitle={t('crisis.subtitle')}
          rightAction={
            <TouchableOpacity 
              style={styles.emergencyBtn}
              onPress={() => handleCall('112')}
            >
              <Phone color={themeContext.colors.semantic.danger} size={24} />
            </TouchableOpacity>
          }
        />

        <Animated.View entering={FadeInUp.delay(100).duration(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('crisis.immediate_help')}</Text>
          
          {EMERGENCY_CONTACTS.map((contact, index) => (
            <Animated.View key={contact.id} entering={FadeInUp.delay(200 + (index * 100)).duration(500)}>
              <TouchableOpacity 
                style={[
                  styles.contactCard, 
                  contact.primary && styles.contactCardPrimary
                ]}
                onPress={() => handleCall(contact.number)}
                activeOpacity={0.8}
              >
                <View style={[styles.contactIconWrap, { backgroundColor: contact.primary ? 'rgba(255,255,255,0.2)' : contact.color + (themeContext.isDark ? '25' : '15') }]}>
                  <contact.icon color={contact.primary ? themeContext.colors.text.onPrimary || '#FFF' : contact.color} size={24} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, contact.primary && { color: themeContext.colors.text.onPrimary || '#FFF' }]}>{contact.title}</Text>
                  <Text style={[styles.contactDesc, contact.primary && { color: 'rgba(255,255,255,0.8)' }]}>{contact.description}</Text>
                </View>
                <View style={styles.callAction}>
                  <Text style={[styles.contactNumber, contact.primary && { color: themeContext.colors.text.onPrimary || '#FFF' }]}>{contact.number}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.section}>
          <View style={styles.safetyHeader}>
            <Text style={styles.sectionTitle}>{t('crisis.safety_plan')}</Text>
            <TouchableOpacity>
              <Text style={styles.editPlanText}>{t('crisis.edit')}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.safetyCard}>
            <View style={styles.safetyBanner}>
              <ShieldCheck color={themeContext.colors.accents.eucalyptus} size={20} />
              <Text style={styles.safetyBannerText}>{t('crisis.safety_steps')}</Text>
            </View>
            
            {SAFETY_PLAN.map((step, index) => (
              <View key={step.id} style={styles.safetyStep}>
                <View style={styles.stepNumberWrap}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(800).duration(500)}>
          <TouchableOpacity 
            style={styles.locationCard}
            onPress={() => Linking.openURL('https://www.google.com/maps/search/counseling+services+near+me')}
            activeOpacity={0.7}
          >
            <View style={styles.locationIconWrap}>
              <MapPin color={themeContext.colors.plum} size={24} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>{t('crisis.find_hospital')}</Text>
              <Text style={styles.locationDesc}>{t('crisis.find_hospital_desc')}</Text>
            </View>
            <ChevronRight color={themeContext.colors.text.disabled} size={20} />
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
  emergencyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  contactCard: {
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
  contactCardPrimary: {
    backgroundColor: theme.colors.semantic.danger,
    borderColor: theme.colors.semantic.danger,
    shadowColor: '#000',
    shadowOpacity: theme.isDark ? 0.3 : 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  contactIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 17,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  contactDesc: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  callAction: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  contactNumber: {
    fontSize: 15,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '800',
    color: theme.colors.plum,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  editPlanText: {
    fontSize: 15,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '700',
    color: theme.colors.plum,
  },
  safetyCard: {
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
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.isDark ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.1)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 20,
  },
  safetyBannerText: {
    fontSize: 14,
    fontFamily: theme.typography.fonts.body,
    fontWeight: '600',
    color: theme.colors.accents.eucalyptus,
    marginLeft: 8,
  },
  safetyStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumberWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.15)' : 'rgba(123, 97, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.accent,
    fontWeight: '700',
    color: theme.colors.plum,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.primary,
    fontWeight: '500',
    lineHeight: 22,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 20,
    marginHorizontal: 24,
  },
  locationIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.isDark ? 'rgba(140, 160, 185, 0.15)' : 'rgba(123, 97, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 17,
    fontFamily: theme.typography.fonts.header,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  locationDesc: {
    fontSize: 13,
    fontFamily: theme.typography.fonts.body,
    color: theme.colors.text.secondary,
  },
});
