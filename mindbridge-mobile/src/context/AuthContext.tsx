import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface AuthContextType {
  userToken: string | null;
  userData: { name?: string, email?: string, preferredLanguage?: string } | null;
  signIn: (token: string, user?: any) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ name?: string, email?: string, preferredLanguage?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on app launch
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');
      if (token) setUserToken(token);
      if (user) setUserData(JSON.parse(user));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const signIn = async (token: string, user?: any) => {
    await AsyncStorage.setItem('userToken', token);
    if (user) {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      setUserData(user);
    }
    setUserToken(token);
    router.replace('/(tabs)/dashboard');
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    setUserToken(null);
    setUserData(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ userToken, userData, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
