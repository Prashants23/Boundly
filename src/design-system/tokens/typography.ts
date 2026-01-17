/**
 * Boundly Design System - Typography Tokens
 * 
 * Typography scale and font definitions for consistent text styling.
 * Uses system fonts with fallbacks for cross-platform compatibility.
 */

import { Platform, TextStyle } from 'react-native';

// ============================================
// FONT FAMILIES
// ============================================
export const fontFamilies = {
  /** Display font - for headlines and app name */
  display: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  /** Body font - for content */
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  /** Mono font - for stats/numbers */
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

// ============================================
// FONT WEIGHTS
// ============================================
export const fontWeights = {
  thin: '100' as TextStyle['fontWeight'],
  extraLight: '200' as TextStyle['fontWeight'],
  light: '300' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extraBold: '800' as TextStyle['fontWeight'],
  black: '900' as TextStyle['fontWeight'],
} as const;

// ============================================
// FONT SIZES
// ============================================
export const fontSizes = {
  // Display sizes (for headlines)
  display2xl: 48,
  displayXl: 40,
  displayLg: 32,
  displayMd: 28,
  displaySm: 24,
  
  // Body sizes
  bodyXl: 20,
  bodyLg: 18,
  bodyMd: 16,
  bodySm: 14,
  bodyXs: 12,
  
  // Label sizes
  labelLg: 14,
  labelMd: 12,
  labelSm: 10,
} as const;

// ============================================
// LINE HEIGHTS
// ============================================
export const lineHeights = {
  // Display line heights
  display2xl: 52,
  displayXl: 44,
  displayLg: 38,
  displayMd: 34,
  displaySm: 30,
  
  // Body line heights
  bodyXl: 28,
  bodyLg: 26,
  bodyMd: 24,
  bodySm: 20,
  bodyXs: 16,
  
  // Label line heights
  labelLg: 20,
  labelMd: 16,
  labelSm: 14,
  
  // Tight/Loose modifiers
  tight: 1.1,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// ============================================
// LETTER SPACING
// ============================================
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
  
  // Semantic spacing
  headline: -0.02,
  body: 0,
  label: 0.02,
  button: 0.02,
  uppercase: 0.1,
} as const;

// ============================================
// TYPOGRAPHY PRESETS
// ============================================

/**
 * Display typography presets - for headlines and titles
 */
export const displayStyles: Record<string, TextStyle> = {
  /** Largest display - hero sections */
  display2xl: {
    fontSize: fontSizes.display2xl,
    lineHeight: lineHeights.display2xl,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.headline,
    fontFamily: fontFamilies.display,
  },
  /** Extra large display */
  displayXl: {
    fontSize: fontSizes.displayXl,
    lineHeight: lineHeights.displayXl,
    fontWeight: fontWeights.bold,
    letterSpacing: letterSpacing.headline,
    fontFamily: fontFamilies.display,
  },
  /** Large display - section headers */
  displayLg: {
    fontSize: fontSizes.displayLg,
    lineHeight: lineHeights.displayLg,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.headline,
    fontFamily: fontFamilies.display,
  },
  /** Medium display - card titles */
  displayMd: {
    fontSize: fontSizes.displayMd,
    lineHeight: lineHeights.displayMd,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.headline,
    fontFamily: fontFamilies.display,
  },
  /** Small display - subtitles */
  displaySm: {
    fontSize: fontSizes.displaySm,
    lineHeight: lineHeights.displaySm,
    fontWeight: fontWeights.medium,
    letterSpacing: letterSpacing.headline,
    fontFamily: fontFamilies.display,
  },
};

/**
 * Body typography presets - for content
 */
export const bodyStyles: Record<string, TextStyle> = {
  /** Extra large body - lead paragraphs */
  bodyXl: {
    fontSize: fontSizes.bodyXl,
    lineHeight: lineHeights.bodyXl,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.body,
    fontFamily: fontFamilies.sans,
  },
  /** Large body - important text */
  bodyLg: {
    fontSize: fontSizes.bodyLg,
    lineHeight: lineHeights.bodyLg,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.body,
    fontFamily: fontFamilies.sans,
  },
  /** Medium body - default content */
  bodyMd: {
    fontSize: fontSizes.bodyMd,
    lineHeight: lineHeights.bodyMd,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.body,
    fontFamily: fontFamilies.sans,
  },
  /** Small body - secondary text */
  bodySm: {
    fontSize: fontSizes.bodySm,
    lineHeight: lineHeights.bodySm,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.body,
    fontFamily: fontFamilies.sans,
  },
  /** Extra small body - captions */
  bodyXs: {
    fontSize: fontSizes.bodyXs,
    lineHeight: lineHeights.bodyXs,
    fontWeight: fontWeights.regular,
    letterSpacing: letterSpacing.label,
    fontFamily: fontFamilies.sans,
  },
};

/**
 * Label typography presets - for UI elements
 */
export const labelStyles: Record<string, TextStyle> = {
  /** Large label - button text */
  labelLg: {
    fontSize: fontSizes.labelLg,
    lineHeight: lineHeights.labelLg,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.label,
    fontFamily: fontFamilies.sans,
  },
  /** Medium label - badges, tags */
  labelMd: {
    fontSize: fontSizes.labelMd,
    lineHeight: lineHeights.labelMd,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.label,
    fontFamily: fontFamilies.sans,
  },
  /** Small label - micro text */
  labelSm: {
    fontSize: fontSizes.labelSm,
    lineHeight: lineHeights.labelSm,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.uppercase,
    fontFamily: fontFamilies.sans,
    textTransform: 'uppercase',
  },
};

/**
 * Special typography presets
 */
export const specialStyles: Record<string, TextStyle> = {
  /** Monospace numbers - for stats */
  statValue: {
    fontSize: fontSizes.displayMd,
    lineHeight: lineHeights.displayMd,
    fontWeight: fontWeights.bold,
    fontFamily: fontFamilies.mono,
    letterSpacing: letterSpacing.normal,
  },
  /** Uppercase label - section headers */
  sectionLabel: {
    fontSize: fontSizes.labelSm,
    lineHeight: lineHeights.labelSm,
    fontWeight: fontWeights.semiBold,
    letterSpacing: letterSpacing.widest,
    fontFamily: fontFamilies.sans,
    textTransform: 'uppercase',
  },
  /** App name style */
  appName: {
    fontSize: 28,
    fontWeight: fontWeights.light,
    letterSpacing: 6,
    textTransform: 'uppercase',
    fontFamily: fontFamilies.display,
  },
};

// ============================================
// ALL TYPOGRAPHY PRESETS
// ============================================
export const typography = {
  ...displayStyles,
  ...bodyStyles,
  ...labelStyles,
  ...specialStyles,
};

// ============================================
// TYPE DEFINITIONS
// ============================================
export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;
export type TypographyPreset = keyof typeof typography;

export default {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography,
  displayStyles,
  bodyStyles,
  labelStyles,
  specialStyles,
};

