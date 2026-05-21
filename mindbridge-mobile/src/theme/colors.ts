// ─────────────────────────────────────────────────────────────────────────────
// MindBridge Official Colour Palette
// Every colour below maps directly to the 10-colour design board.
// Do NOT introduce colours outside this set.
// ─────────────────────────────────────────────────────────────────────────────
//
//  Cloud Milk    #F8F5F2   Light bg — primary screen background
//  Dreamy        #EAEBED   Light bg — secondary / tab bar background
//  Amber Smoke   #F2E0D0   Warm card surface (journals, mood cards)
//  Frost         #E4F0F6   Cool card surface (stats, explore cards)
//  Blue Mirage   #6E88B0   Primary brand — buttons, active states, CTAs
//  Matcha Mist   #C2D8C4   Soft green — chips, tags, success badges (light)
//  Moss Velvet   #385144   Deep green — secondary brand, success, icons
//  Ocean         #006989   Teal — links, tertiary highlights
//  Dusty Coal    #222222   Dark mode — card/surface colour
//  Abyss         #0A0F1E   Dark mode — primary screen background
//
// ─────────────────────────────────────────────────────────────────────────────

// ── Palette constants ─────────────────────────────────────────────────────────
const P = {
  cloudMilk:   '#F8F5F2',
  dreamy:      '#EAEBED',
  amberSmoke:  '#F2E0D0',
  frost:       '#E4F0F6',
  blueMirage:  '#6E88B0',
  matchaMist:  '#C2D8C4',
  mossVelvet:  '#385144',
  ocean:       '#006989',
  dustyCoal:   '#222222',
  abyss:       '#0A0F1E',
};

// ── Light Mode ────────────────────────────────────────────────────────────────
export const lightColors = {
  // Primary brand
  plum:      P.blueMirage,          // Blue Mirage — every CTA, active tab, button fill
  plumLight: '#9EB4CC',             // Blue Mirage at 60% — hover / pressed state
  sage:      P.mossVelvet,          // Moss Velvet — secondary actions, success icons
  ocean:     P.ocean,               // Ocean — teal links, tertiary highlights

  // Backgrounds — Cloud Milk + Dreamy
  background:          P.cloudMilk,
  backgroundSecondary: P.dreamy,
  surface:             '#FFFFFF',   // Pure white for elevated cards

  // Named surface variants — Amber Smoke + Frost
  surfaceWarm: P.amberSmoke,        // Warm toned card bg (journal, mood)
  surfaceCool: P.frost,             // Cool toned card bg (stats, explore)

  // Text — derived from Abyss/Dusty Coal family for warm neutrals
  text: {
    primary:   '#1A1F2B',           // Near-Abyss — maximum legibility
    secondary: '#3D4A58',           // Dark slate — supporting text
    tertiary:  '#6B7A8A',           // Mid slate — labels, timestamps
    onPrimary: '#FFFFFF',           // Text on Blue Mirage buttons
    onWarm:    P.mossVelvet,        // Text on Amber Smoke surfaces
    onCool:    P.ocean,             // Text on Frost surfaces
    disabled:  '#B8C4CE',
  },

  // Accent palette — all 10 colours accessible as named tokens
  accents: {
    // Direct palette entries
    cloudMilk:  P.cloudMilk,
    dreamy:     P.dreamy,
    amberSmoke: P.amberSmoke,
    frost:      P.frost,
    blueMirage: P.blueMirage,
    matchaMist: P.matchaMist,
    mossVelvet: P.mossVelvet,
    ocean:      P.ocean,
    dustyCoal:  P.dustyCoal,
    abyss:      P.abyss,

    // Tonal derivatives (still within palette spirit)
    blueMirageLight: '#9EB4CC',
    mossVelvetLight: '#4A7060',
    oceanLight:      '#0090B8',
    matchaMistDark:  '#8AAA8C',

    // Legacy aliases — keeps existing screens working without rewrites
    powderBlue:   '#9EB4CC',
    softMint:     P.matchaMist,
    dustyRose:    '#C49E9E',        // warm neutral, close to Amber Smoke family
    sand:         '#D8C8B0',
    terracotta:   '#B87060',
    softGray:     '#B0BEC5',
    gentlePeach:  '#E8B49A',
    slate:        P.blueMirage,
    eucalyptus:   P.mossVelvet,
    softLilac:    '#A0A4C0',
    paleCoral:    '#D09080',
    forestGreen:  '#2E4A3A',
  },

  semantic: {
    success: P.mossVelvet,          // Moss Velvet
    danger:  '#B87060',             // Terracotta — warm red
    warning: P.amberSmoke,          // Amber Smoke — muted warning
    info:    P.ocean,               // Ocean — informational
  },
};

// ── Dark Mode ─────────────────────────────────────────────────────────────────
export const darkColors = {
  // Primary brand — brightened slightly for dark contrast
  plum:      '#9EB4CC',             // Blue Mirage light
  plumLight: P.blueMirage,
  sage:      '#5A8A70',             // Moss Velvet lightened
  ocean:     '#0099C0',             // Ocean brightened for dark

  // Backgrounds — Abyss + Dusty Coal
  background:          P.abyss,           // Abyss — deepest dark
  backgroundSecondary: '#111520',          // Between Abyss and Dusty Coal
  surface:             P.dustyCoal,       // Dusty Coal — card surfaces on Abyss

  // Named surface variants — muted dark versions of Amber Smoke & Frost
  surfaceWarm: '#2E2218',           // Amber Smoke darkened → warm dark card
  surfaceCool: '#141C28',           // Frost darkened → cool dark card

  // Text — cool-white on Abyss
  text: {
    primary:   '#EEF2F7',           // Near-white, cool toned
    secondary: '#A8B8C8',           // Muted slate
    tertiary:  '#708090',           // Dim slate
    onPrimary: P.abyss,             // Text on Blue Mirage buttons in dark
    onWarm:    '#E8C8A8',           // Text on warm dark surfaces
    onCool:    '#90C8E0',           // Text on cool dark surfaces
    disabled:  '#3A4A5A',
  },

  // Accent palette — all 10 colours, muted for dark (guideline: limit saturation)
  accents: {
    // Direct palette entries (darkened/muted)
    cloudMilk:  '#2A2A2A',          // Cloud Milk → used sparingly in dark
    dreamy:     '#1E2228',          // Dreamy → dark chip backgrounds
    amberSmoke: '#2E2218',          // Amber Smoke → warm dark surface
    frost:      '#141C28',          // Frost → cool dark surface
    blueMirage: '#9EB4CC',          // Blue Mirage light
    matchaMist: '#2A3C2C',          // Matcha Mist → muted dark chip
    mossVelvet: '#4A7060',          // Moss Velvet lightened
    ocean:      '#0080A8',          // Ocean — slightly brighter
    dustyCoal:  P.dustyCoal,        // Dusty Coal — cards
    abyss:      P.abyss,            // Abyss — background

    // Tonal derivatives
    blueMirageLight: '#B0C8E0',
    mossVelvetLight: '#5A8070',
    oceanLight:      '#00A8C8',
    matchaMistDark:  '#3A5040',

    // Legacy aliases
    powderBlue:   '#7090B0',
    softMint:     '#6A9C7A',
    dustyRose:    '#A07878',
    sand:         '#A08060',
    terracotta:   '#C07858',
    softGray:     '#6A7880',
    gentlePeach:  '#C09080',
    slate:        '#7090B0',
    eucalyptus:   '#508068',
    softLilac:    '#7880A8',
    paleCoral:    '#B07868',
    forestGreen:  '#3A5A48',
  },

  semantic: {
    success: '#5A8A70',             // Moss Velvet lightened
    danger:  '#C07858',             // Terracotta muted
    warning: '#8A7050',             // Amber Smoke muted
    info:    '#0080A8',             // Ocean muted
  },
};

// ─── Structural tokens (unchanged) ───────────────────────────────────────────
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

// ─── Typography System ────────────────────────────────────────────────────────
// Montserrat  — headings, UI labels, buttons, body content (unified geometry)
export const typography = {
  fonts: {
    header:   'Montserrat-Bold',       // Headings, screen titles
    accent:   'Montserrat-SemiBold',   // Sub-headings, button text
    ui:       'Montserrat-Medium',     // Navigation, labels
    body:     'Montserrat-Regular',    // Body reading text, journal content
    bodyBold: 'Montserrat-Bold',       // Emphasized body text
    caption:  'Montserrat-Medium',     // Metadata, timestamps, helper text
    captionMedium: 'Montserrat-SemiBold', // Semi-prominent captions
  },
  h1: { fontSize: 34, fontFamily: 'Montserrat-ExtraBold', letterSpacing: -1 },
  h2: { fontSize: 26, fontFamily: 'Montserrat-Bold',      letterSpacing: -0.5 },
  h3: { fontSize: 20, fontFamily: 'Montserrat-Bold',      letterSpacing: -0.3 },
  h4: { fontSize: 17, fontFamily: 'Montserrat-SemiBold',  letterSpacing: -0.2 },
  body: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 26,
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 26,
  },
  ui: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
  },
  // Legacy aliases — keeps existing code working
  content: { fontSize: 16, fontFamily: 'Montserrat-Regular', lineHeight: 26 },
  secondary: { fontSize: 15, fontFamily: 'Montserrat-Regular', lineHeight: 22 },
  humanist: { fontSize: 15, fontFamily: 'Montserrat-Medium', lineHeight: 22 },
};

// Legacy export
export const theme = {
  colors: lightColors,
  spacing,
  borderRadius,
  typography,
};
