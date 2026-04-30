# MindBridge: The Ultimate Full-Stack Mobile Development Blueprint

This document is the absolute, comprehensive master guide for the MindBridge Mental Health Navigator. It contains everything needed to completely rebuild the application from scratch as a decoupled Mobile App (React Native/Expo) and Backend Server (Node.js/PostgreSQL).

## 1. Executive Summary & Vision
MindBridge is a premium, secure mental health companion application. The primary design language is "Luxury Midnight"—featuring dark themes, glassmorphism, 32pt corner radii, smooth 60fps animations, and a highly personalized user experience.

The goal of this rebuild is to discard the legacy monolithic structure, enforce strict type safety across the stack, and provide a native mobile experience with full offline capabilities, push notifications, and real-time backend synchronization.

## 2. Complete Technology Stack

**Backend Infrastructure**
* Runtime: Node.js v20+
* Framework: Express.js (REST API)
* Database: PostgreSQL (Hosted on Neon.tech - Serverless)
* ORM: Prisma Client
* Authentication: JWT (JSON Web Tokens) & Bcrypt (Password Hashing)
* Validation: Zod (for validating API request bodies)
* Hosting Target: Render or Railway (for persistent backend services)

**Frontend Mobile Application**
* Framework: React Native with Expo SDK 50+
* Language: TypeScript (Strict mode)
* Navigation: Expo Router (File-based navigation)
* Styling Engine: NativeWind (Tailwind CSS for React Native) & StyleSheet
* Animations: react-native-reanimated & react-native-gesture-handler
* State Management: React Context API (Auth) + React Query (Data Fetching/Caching)
* Local Storage: @react-native-async-storage/async-storage (for JWT and offline caching)
* Icons & Fonts: @expo/vector-icons, Google Fonts (Inter or Plus Jakarta Sans)
* Build System: EAS (Expo Application Services)

## 3. Comprehensive Feature Breakdown

**Phase 1: Core & Authentication**
* Splash Screen: Animated logo revealing the app.
* Welcome Carousel: Paged view of app benefits.
* Authentication: Email/Password Sign Up and Log In (Student ID is completely optional).
* The 12-Step Onboarding: Animated multi-step form capturing:
  * Primary goals (Anxiety reduction, Mood tracking, etc.)
  * Current mental state.
  * Sleep patterns & stress levels.
  * Crisis history.

**Phase 2: The Dashboard & Daily Features**
* Time-Aware Greeting: "Good Morning, [Name]" changing dynamically.
* Motivational Carousel: Rotating quotes/tips.
* Mood Garden (Core Feature): Visual UI where users log moods (1-10) and grow a "garden" representing their mental state.
* Quick Actions: Log Mood, Start Breathing Exercise, Emergency Call.

**Phase 3: Modules & Journey**
* Daily Perspective: Journaling interface.
* Wellness Journey: Long-term goal tracking.
* Care Plan Timeline: Scheduled activities (e.g., "Drink water", "Therapy at 4 PM").
* Support Resources Grid: Direct links to crisis hotlines, articles, and peer support.
* User Profile & Settings: Theme toggles, notification preferences, data export.

## 4. Phase 1: Backend & Database (Step-by-Step)

### Step 1: Project Initialization
```bash
mkdir mindbridge-backend
cd mindbridge-backend
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt zod
npm install -D typescript @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt ts-node nodemon prisma
npx tsc --init
npx prisma init
```

### Step 2: The Complete Prisma Schema (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Neon Connection String
}
model User {
  id             String      @id @default(uuid())
  email          String      @unique
  password       String
  name           String
  studentId      String?     
  profileImage   String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  onboarding     Onboarding?
  moodLogs       MoodLog[]
  journalEntries Journal[]
}
model Onboarding {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  primaryGoals    String[] 
  currentMood     String
  sleepPattern    String
  stressLevel     Int      // 1-10
  crisisHistory   Boolean  @default(false)
  completedAt     DateTime @default(now())
}
model MoodLog {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  score     Int      // 1-10 (1 = Terrible, 10 = Excellent)
  emotions  String[] // e.g., ["Anxious", "Tired"]
  note      String?
  createdAt DateTime @default(now())
}
model Journal {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String?
  content   String
  createdAt DateTime @default(now())
}
```

### Step 3: Backend Folder Structure
```text
/mindbridge-backend
  /prisma
  /src
    /controllers   # auth.controller.ts, mood.controller.ts
    /middleware    # auth.middleware.ts, error.middleware.ts
    /routes        # auth.routes.ts, user.routes.ts
    /utils         # jwt.ts, validation.ts
    index.ts       # Server entry point
```

### Step 4: Authentication Controller Example (src/controllers/auth.controller.ts)
```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, studentId } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, studentId }
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
```

## 5. Phase 2: Mobile Application (Step-by-Step)

### Step 1: Project Initialization
```bash
npx create-expo-app@latest mindbridge-mobile --template tabs
cd mindbridge-mobile
npx expo install expo-router react-native-reanimated react-native-gesture-handler @expo/vector-icons react-native-safe-area-context
npm install axios @react-native-async-storage/async-storage lucide-react-native
```

### Step 2: Mobile Folder Structure
```text
/mindbridge-mobile
  /app                  # Expo Router Files
    _layout.tsx         # Root layout (Auth Provider wrapper)
    /(auth)             # Public screens
      login.tsx
      register.tsx
      onboarding.tsx
    /(tabs)             # Protected screens
      _layout.tsx       # Bottom Tab Navigator
      dashboard.tsx
      garden.tsx
      profile.tsx
  /src
    /components
      /ui               # Buttons, Inputs, Cards
      /dashboard        # MoodGarden, QuickActions
    /context
      AuthContext.tsx   # Manages global user state
    /services
      api.ts            # Axios configuration
    /theme
      colors.ts         # Centralized design tokens
```

### Step 3: The "Luxury Midnight" Design System (src/theme/colors.ts)
```typescript
export const theme = {
  colors: {
    background: '#050505',     // Absolute deep dark
    surface: '#121212',        // Elevated cards
    surfaceHighlight: '#1E1E1E', 
    primary: '#8B5CF6',        // Vibrant Purple
    primaryGradient: ['#8B5CF6', '#6D28D9'],
    success: '#10B981',        // Calming Green
    danger: '#EF4444',         // Alert Red
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      disabled: '#52525B'
    }
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    screen: 24, // Global horizontal padding
  },
  borderRadius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32, // The signature MindBridge curve
  }
};
```

### Step 4: AuthContext Implementation (src/context/AuthContext.tsx)
```typescript
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface AuthContextType {
  userToken: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token on app launch
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setUserToken(token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
    setUserToken(token);
    router.replace('/(tabs)/dashboard');
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    setUserToken(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ userToken, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Step 5: Connecting Axios (src/services/api.ts)
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // Use your local IP for development! e.g., http://192.168.1.5:5000/api
  baseURL: 'http://YOUR_LOCAL_IP:5000/api', 
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 6: Root Layout Logic (app/_layout.tsx)
```typescript
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useContext } from 'react';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../src/theme/colors';

const InitialLayout = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!userToken && !inAuthGroup) {
      // Redirect to login
      router.replace('/(auth)/login');
    } else if (userToken && inAuthGroup) {
      // Redirect to dashboard
      router.replace('/(tabs)/dashboard');
    }
  }, [userToken, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <Slot />; // Renders the matched route
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
```

## 6. Animations (Reanimated)
Since the web app used Framer Motion, the mobile app MUST use react-native-reanimated to achieve the same fluid, 60fps luxury feel.

Example: A Fade-In Up Component (Used across all screens)
```typescript
import React from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

export const FadeInView = ({ children, delay = 0 }) => {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(600).springify()}>
      {children}
    </Animated.View>
  );
};
```

## 7. Deployment Strategy
**Backend Deployment (Render or Railway)**
* Push your mindbridge-backend folder to a GitHub repository.
* Link the repository to Render/Railway as a "Web Service".
* Provide the Environment Variables (DATABASE_URL, JWT_SECRET).
* Set the Build Command: npm install && npx prisma generate && npx tsc
* Set the Start Command: npm start (pointing to dist/index.js).

**Frontend Build (Expo EAS)**
* Install EAS CLI: npm install -g eas-cli
* Login: eas login
* Configure: eas build:configure
* Build for Android/iOS: eas build --profile preview (or production for app stores).
