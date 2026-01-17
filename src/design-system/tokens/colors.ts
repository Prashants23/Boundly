/**
 * Boundly Design System - Color Tokens
 * 
 * This file contains all color definitions as TypeScript constants.
 * These can be used with NativeWind classes or directly in StyleSheet.
 * 
 * Naming Convention:
 * - Brand colors: brand-{name}
 * - Background: bg-{semantic-name}
 * - Text: text-{semantic-name}
 * - Status: status-{state}
 * - Surface: surface-{state}
 */

// ============================================
// BRAND COLORS
// ============================================
export const brand = {
  /** Primary accent color - warm gold */
  gold: '#E5C547',
  /** Lighter variant for hover states */
  goldLight: '#F0D76B',
  /** Darker variant for pressed states */
  goldDark: '#C9A92D',
  /** Muted gold for backgrounds and tints */
  goldMuted: 'rgba(229, 197, 71, 0.15)',
  /** Gold with varying opacity */
  goldAlpha: (opacity: number) => `rgba(229, 197, 71, ${opacity})`,
} as const;

// ============================================
// BACKGROUND COLORS
// ============================================
export const backgrounds = {
  // Dark theme (default)
  dark: {
    /** Main background - deepest black */
    primary: '#0A0A0A',
    /** Elevated surfaces like headers */
    secondary: '#121212',
    /** Cards, modals, containers */
    tertiary: '#1A1A1A',
    /** Hover/elevated states */
    elevated: '#1E1E1E',
  },
  // Light theme
  light: {
    /** Main background */
    primary: '#FAFAFA',
    /** Elevated surfaces */
    secondary: '#F5F5F5',
    /** Cards, modals, containers */
    tertiary: '#FFFFFF',
    /** Hover/elevated states */
    elevated: '#EBEBEB',
  },
} as const;

// ============================================
// TEXT COLORS
// ============================================
export const text = {
  // Dark theme (default)
  dark: {
    /** Primary text - highest contrast */
    primary: '#FFFFFF',
    /** Secondary text - descriptions */
    secondary: '#B0B0B0',
    /** Tertiary text - hints, placeholders */
    tertiary: '#6B6B6B',
    /** Muted text - disabled states */
    muted: '#4A4A4A',
  },
  // Light theme
  light: {
    /** Primary text - highest contrast */
    primary: '#0A0A0A',
    /** Secondary text - descriptions */
    secondary: '#555555',
    /** Tertiary text - hints, placeholders */
    tertiary: '#888888',
    /** Muted text - disabled states */
    muted: '#AAAAAA',
  },
} as const;

// ============================================
// SEMANTIC/STATUS COLORS
// ============================================
export const status = {
  /** Success state - positive feedback */
  success: '#4ADE80',
  successBg: '#1A3A1A',
  successBgLight: '#E8F5E9',
  
  /** Error state - negative feedback */
  error: '#EF5350',
  errorBg: '#3A1A1A',
  errorBgLight: '#FFEBEE',
  
  /** Warning state - caution feedback */
  warning: '#FFB74D',
  warningBg: '#3A2A1A',
  warningBgLight: '#FFF3E0',
  
  /** Info state - neutral feedback */
  info: '#64B5F6',
  infoBg: '#1A2A3A',
  infoBgLight: '#E3F2FD',
} as const;

// ============================================
// BORDER COLORS
// ============================================
export const borders = {
  // Dark theme
  dark: {
    /** Default border */
    DEFAULT: '#2A2A2A',
    /** Lighter border for subtle dividers */
    light: '#3A3A3A',
    /** Stronger border for emphasis */
    strong: '#4A4A4A',
  },
  // Light theme
  light: {
    /** Default border */
    DEFAULT: '#E0E0E0',
    /** Lighter border for subtle dividers */
    light: '#EBEBEB',
    /** Stronger border for emphasis */
    strong: '#CCCCCC',
  },
} as const;

// ============================================
// SURFACE COLORS
// ============================================
export const surfaces = {
  // Dark theme
  dark: {
    /** Default surface color */
    DEFAULT: '#1A1A1A',
    /** Hover state */
    hover: '#252525',
    /** Pressed/active state */
    pressed: '#0F0F0F',
    /** Disabled state */
    disabled: '#151515',
  },
  // Light theme
  light: {
    /** Default surface color */
    DEFAULT: '#FFFFFF',
    /** Hover state */
    hover: '#F5F5F5',
    /** Pressed/active state */
    pressed: '#EBEBEB',
    /** Disabled state */
    disabled: '#FAFAFA',
  },
} as const;

// ============================================
// APP BRAND COLORS (for usage tracking)
// ============================================
export const appBrands = {
  instagram: '#E1306C',
  twitter: '#1DA1F2',
  tiktok: '#FF0050',
  youtube: '#FF0000',
  facebook: '#1877F2',
  snapchat: '#FFFC00',
  discord: '#5865F2',
  twitch: '#9146FF',
  reddit: '#FF4500',
  whatsapp: '#25D366',
  telegram: '#0088CC',
  netflix: '#E50914',
  spotify: '#1DB954',
  pinterest: '#E60023',
  linkedin: '#0A66C2',
} as const;

// ============================================
// GRADIENT DEFINITIONS
// ============================================
export const gradients = {
  /** Primary gold gradient */
  gold: {
    colors: ['#E5C547', '#F0D76B', '#C9A92D'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  /** Dark overlay gradient (for cards) */
  darkOverlay: {
    colors: ['transparent', 'rgba(10, 10, 10, 0.8)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  /** Success gradient */
  success: {
    colors: ['#4ADE80', '#22C55E'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  /** Danger gradient */
  danger: {
    colors: ['#EF5350', '#DC2626'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  /** Premium dark gradient (for backgrounds) */
  darkPremium: {
    colors: ['#0A0A0A', '#1A1A1A', '#0A0A0A'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

// ============================================
// THEME HELPER TYPES
// ============================================
export type ColorScheme = 'light' | 'dark';

export type BrandColor = keyof typeof brand;
export type StatusColor = keyof typeof status;
export type AppBrandColor = keyof typeof appBrands;

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Get background colors based on color scheme
 */
export const getBackgrounds = (scheme: ColorScheme) => backgrounds[scheme];

/**
 * Get text colors based on color scheme
 */
export const getText = (scheme: ColorScheme) => text[scheme];

/**
 * Get border colors based on color scheme
 */
export const getBorders = (scheme: ColorScheme) => borders[scheme];

/**
 * Get surface colors based on color scheme
 */
export const getSurfaces = (scheme: ColorScheme) => surfaces[scheme];

/**
 * Get all theme colors based on color scheme
 */
export const getThemeColors = (scheme: ColorScheme) => ({
  brand,
  background: backgrounds[scheme],
  text: text[scheme],
  status,
  border: borders[scheme],
  surface: surfaces[scheme],
  appBrands,
});

export default {
  brand,
  backgrounds,
  text,
  status,
  borders,
  surfaces,
  appBrands,
  gradients,
};

