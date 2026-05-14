import { Platform } from 'react-native';

export const lightColors = {
  // ─── Primary Brand Colors ─
  plum: '#2E4057',
  plumLight: '#6B7A8F',
  sage: '#6A8A82',
  mauve: '#967D87',
  
  // ─── Backgrounds ──────────────────
  background: '#F4F6F8',
  backgroundSecondary: '#EAEEF2',
  surface: '#FFFFFF',
  
  // ─── Standardized Text ────────────────────
  text: {
    primary: '#1A242F',
    secondary: '#556475',
    tertiary: '#8795A1',
    onPrimary: '#FFFFFF',
    disabled: '#CBD2D9',
  },

  // ─── Multi-Palette Accents ─────
  accents: {
    powderBlue: '#7EA8BE',
    blushPink: '#C49799',
    softMint: '#A3C4BC',
    sand: '#D6C7A1',
    terracotta: '#B86B5A',
    dustyRose: '#A8828D',
    softGray: '#B0BEC5',
    gentlePeach: '#D8A48F',
    slate: '#5C6B73',
    eucalyptus: '#5F8D7B',
    softLilac: '#9B9EBD',
    paleCoral: '#CB8A77',
    forestGreen: '#3B5249',
  },

  semantic: {
    success: '#5F8D7B',
    danger: '#B86B5A',
    warning: '#D6C7A1',
  }
};

export const darkColors = {
  // ─── Primary Brand Colors (Adjusted for Dark Mode) ─
  plum: '#8CA0B9', // Lighter slate for contrast against dark
  plumLight: '#4A5B70',
  sage: '#8AA69F',
  mauve: '#B39EAA',
  
  // ─── Backgrounds ──────────────────
  background: '#121212', // Deep true dark
  backgroundSecondary: '#1E1E1E', // Slightly elevated dark
  surface: '#262626', // Card surfaces
  
  // ─── Standardized Text ────────────────────
  text: {
    primary: '#F0F0F0',
    secondary: '#A8A8A8',
    tertiary: '#737373',
    onPrimary: '#121212',
    disabled: '#4A4A4A',
  },

  // ─── Multi-Palette Accents (Slightly more vibrant for dark contrast) ─────
  accents: {
    powderBlue: '#8CB8CF',
    blushPink: '#D6A8AA',
    softMint: '#B4D6CE',
    sand: '#E8D9B2',
    terracotta: '#D17A66',
    dustyRose: '#BA939E',
    softGray: '#C1CED6',
    gentlePeach: '#EDB49D',
    slate: '#748690',
    eucalyptus: '#6CA18C',
    softLilac: '#AFB2D1',
    paleCoral: '#DE9985',
    forestGreen: '#4A665A',
  },

  semantic: {
    success: '#6CA18C',
    danger: '#D17A66',
    warning: '#E8D9B2',
  }
};

// Structural tokens remain constant
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screen: 24,
};

export const borderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 100,
};

export const typography = {
  fonts: {
    header: 'Outfit-Bold',
    body: 'Outfit-Regular',
    accent: 'Outfit-SemiBold',
  },
  h1: {
    fontSize: 32,
    fontFamily: 'Outfit-ExtraBold',
    letterSpacing: -1,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
  },
  caption: {
    fontSize: 13,
    fontFamily: 'Outfit-Regular',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  }
};

// Legacy export to prevent app crash during refactor
export const theme = {
  colors: lightColors,
  spacing,
  borderRadius,
  typography
};
