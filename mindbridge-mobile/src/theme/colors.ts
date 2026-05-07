export const theme = {
  colors: {
    // ─── Primary Brand Colors (High Contrast) ──────────────────
    plum: '#5D4D63',               // Slightly darker Plum for better text visibility
    plumLight: '#8E7E96',          
    sage: '#95A391',               // Darker Sage for clearer accents
    mauve: '#BCA8C0',              // Darker Mauve for visible borders
    
    // ─── Backgrounds ──────────────────────────────────────────
    background: '#E8E4F3',         // Soft Lavender
    backgroundSecondary: '#F5F0E8', // Warm Beige
    surface: '#FFFDF7',            // Cream (for cards/inputs)
    
    // ─── Standardized Text ────────────────────────────────────
    text: {
      primary: '#5D4D63',          // Standard high-visibility Plum
      secondary: '#7A6B81',        // Medium visibility
      tertiary: '#95A391',         // Sage for special accents
      onPrimary: '#FFFDF7',        // Cream text on dark buttons
      disabled: '#BCA8C0',         
    },

    // ─── Multi-Palette Accents (Refined for Visibility) ────────
    accents: {
      powderBlue: '#D1E3EB',       // Slightly deeper for visibility
      blushPink: '#EBD8D8',
      softMint: '#D8EBE0',
      sand: '#EBDED1',
      terracotta: '#D9C2BC',
      dustyRose: '#C9B1B8',
      softGray: '#D1D5D9',
      gentlePeach: '#EBDCCF',
      slate: '#5D6D7E',
      eucalyptus: '#CBD9D4',
      softLilac: '#D8D1EB',
      paleCoral: '#EBCFB8',
      forestGreen: '#5D7365',
    },

    semantic: {
      success: '#95A391',
      danger: '#D9C2BC',
      warning: '#EBCFB8',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    screen: 24,
  },
  borderRadius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    pill: 100,
  },
};
