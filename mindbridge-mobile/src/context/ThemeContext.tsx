import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, spacing, borderRadius, typography } from '../theme/colors';
import { translations, Language as TransLanguage } from '../utils/translations';

type ThemeMode = 'system' | 'light' | 'dark';
type Language = TransLanguage;

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  language: Language;
  setMode: (mode: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  colors: typeof lightColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [language, setLanguageState] = useState<Language>('English');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('@theme_mode');
        const savedLang = await AsyncStorage.getItem('@app_language');
        
        if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
          setModeState(savedMode as ThemeMode);
        }
        if (savedLang && ['English', 'French', 'Twi', 'Ga', 'Ewe', 'Hausa'].includes(savedLang)) {
          setLanguageState(savedLang as Language);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem('@theme_mode', newMode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    try {
      await AsyncStorage.setItem('@app_language', newLang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (path: string): any => {
    try {
      const keys = path.split('.');
      let result: any = translations[language];
      for (const key of keys) {
        if (result === undefined || result === null) return undefined;
        result = result[key];
      }
      return result !== undefined ? result : undefined;
    } catch {
      return undefined;
    }
  };

  const isDark = mode === 'system' ? deviceColorScheme === 'dark' : mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = {
    mode,
    isDark,
    language,
    setMode,
    setLanguage,
    t,
    colors,
    spacing,
    borderRadius,
    typography,
  };

  if (!isLoaded) {
    return null; // Or a splash screen
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
