import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language, TranslationSchema } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'English',
  setLanguage: () => {},
  t: (keyPath: string) => keyPath,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('English');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('userLanguage');
        if (storedLang && Object.keys(translations).includes(storedLang)) {
          setLanguageState(storedLang as Language);
        }
      } catch (error) {
        console.error('Failed to load language', error);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('userLanguage', lang);
    } catch (error) {
      console.error('Failed to save language', error);
    }
  };

  // Helper to get nested values like 'dashboard.greetingMorning'
  const t = (keyPath: string): string => {
    try {
      const keys = keyPath.split('.');
      let current: any = translations[language];
      
      for (const key of keys) {
        if (current[key] === undefined) {
          // Fallback to English if translation is missing
          let fallback: any = translations['English'];
          for (const k of keys) {
            if (fallback[k] === undefined) return keyPath;
            fallback = fallback[k];
          }
          return fallback;
        }
        current = current[key];
      }
      return current;
    } catch (e) {
      return keyPath;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
