export const theme = {
  colors: {
    // Core backgrounds — Yale Blue family
    background: '#0d2b3e',        // Deep midnight blue
    surface: '#1b4965',           // Yale Blue — elevated cards
    surfaceHighlight: '#1e5575',  // Slightly lighter for hover/pressed

    // Primary accent — Fresh Sky teal
    primary: '#5fa8d3',           // Fresh Sky
    primaryLight: '#62b6cb',      // Pacific Blue
    primaryGradient: ['#5fa8d3', '#1b4965'],

    // Semantic colours
    success: '#99e1d9',           // Pearl Aqua
    danger: '#e27396',            // Petal Rouge
    warning: '#fffae3',           // Cornsilk

    // Text hierarchy
    text: {
      primary: '#cae9ff',         // Pale Sky — headlines
      secondary: '#62b6cb',       // Pacific Blue — body
      tertiary: '#5fa8d3',        // Fresh Sky — hints
      disabled: '#1b4965',        // Yale Blue — disabled
      onPrimary: '#0d2b3e',       // Dark text on light surfaces
    },

    // Additional palette colours
    frozen: '#bee9e8',            // Frozen Water — subtle highlights
    petalRouge: '#e27396',        // Warm accent
    palesky: '#cae9ff',           // Pale Sky
    pearAqua: '#99e1d9',          // Pearl Aqua
    taupeGrey: '#5d576b',         // Taupe Grey — muted neutral
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
