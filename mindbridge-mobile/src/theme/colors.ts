export const theme = {
  colors: {
    // ─── Primary Brand Colors (Colorblind Safe & High Contrast) ─
    plum: '#2E4057',               // Deep Slate Navy (Premium, highly visible)
    plumLight: '#6B7A8F',          // Soft Slate Blue
    sage: '#6A8A82',               // Muted Teal/Sage
    mauve: '#967D87',              // Dusty Orchid
    
    // ─── Backgrounds (Cool, Premium Neutrals) ──────────────────
    background: '#F4F6F8',         // Premium cool off-white
    backgroundSecondary: '#EAEEF2', // Slightly deeper gray-white
    surface: '#FFFFFF',            // Pure white for crisp cards
    
    // ─── Standardized Text (High Contrast) ────────────────────
    text: {
      primary: '#1A242F',          // Near black slate
      secondary: '#556475',        // Highly readable gray
      tertiary: '#8795A1',         // Muted gray
      onPrimary: '#FFFFFF',        // White on dark buttons
      disabled: '#CBD2D9',         
    },

    // ─── Multi-Palette Accents (Okabe-Ito Inspired Luxury) ─────
    accents: {
      powderBlue: '#7EA8BE',       // Soft Sky Blue
      blushPink: '#C49799',        // Muted Rose
      softMint: '#A3C4BC',         // Soft Mint
      sand: '#D6C7A1',             // Soft Gold/Ochre
      terracotta: '#B86B5A',       // Muted Brick (Accessible Red/Vermillion)
      dustyRose: '#A8828D',        // Dusty Rose
      softGray: '#B0BEC5',         // Soft Gray
      gentlePeach: '#D8A48F',      // Soft Orange
      slate: '#5C6B73',            // Slate Gray
      eucalyptus: '#5F8D7B',       // Accessible Bluish-Green
      softLilac: '#9B9EBD',        // Soft Lilac
      paleCoral: '#CB8A77',        // Pale Coral
      forestGreen: '#3B5249',      // Deep Forest Green
    },

    semantic: {
      success: '#5F8D7B',          // Eucalyptus Green
      danger: '#B86B5A',           // Brick Red
      warning: '#D6C7A1',          // Soft Gold
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
