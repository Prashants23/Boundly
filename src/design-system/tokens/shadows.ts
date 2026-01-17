/**
 * Boundly Design System - Shadow Tokens
 * 
 * Elevation and shadow definitions for depth hierarchy.
 * Includes both dark and light mode variants.
 */

import { Platform, ViewStyle } from 'react-native';

// ============================================
// SHADOW DEFINITIONS (iOS)
// ============================================

/**
 * iOS Shadow style type
 */
interface IOSShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
}

/**
 * Dark mode shadows (iOS)
 */
export const shadowsDarkIOS: Record<string, IOSShadow> = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.6,
    shadowRadius: 48,
  },
};

/**
 * Light mode shadows (iOS)
 */
export const shadowsLightIOS: Record<string, IOSShadow> = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  '2xl': {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.2,
    shadowRadius: 48,
  },
};

// ============================================
// ELEVATION (Android)
// ============================================

/**
 * Android elevation values
 */
export const elevations: Record<string, number> = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 24,
};

// ============================================
// GLOW SHADOWS
// ============================================

/**
 * Gold accent glow (for buttons, highlights)
 */
export const glowGold: IOSShadow = {
  shadowColor: '#E5C547',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
};

export const glowGoldLg: IOSShadow = {
  shadowColor: '#E5C547',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.4,
  shadowRadius: 40,
};

/**
 * Success glow
 */
export const glowSuccess: IOSShadow = {
  shadowColor: '#4ADE80',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
};

/**
 * Error glow
 */
export const glowError: IOSShadow = {
  shadowColor: '#EF5350',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
};

// ============================================
// CARD SHADOWS
// ============================================

export const cardShadowDark: IOSShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 12,
};

export const cardShadowLight: IOSShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
};

export const cardShadowHoverDark: IOSShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.4,
  shadowRadius: 20,
};

export const cardShadowHoverLight: IOSShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 20,
};

// ============================================
// CROSS-PLATFORM SHADOW HELPER
// ============================================

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Get shadow styles for the current platform
 */
export const getShadow = (
  level: ShadowLevel,
  isDarkMode: boolean = true
): ViewStyle => {
  const iosShadows = isDarkMode ? shadowsDarkIOS : shadowsLightIOS;
  
  if (Platform.OS === 'android') {
    return {
      elevation: elevations[level],
    };
  }
  
  return iosShadows[level];
};

/**
 * Get card shadow for the current theme
 */
export const getCardShadow = (isDarkMode: boolean = true): ViewStyle => {
  if (Platform.OS === 'android') {
    return { elevation: 4 };
  }
  return isDarkMode ? cardShadowDark : cardShadowLight;
};

/**
 * Get card hover shadow for the current theme
 */
export const getCardHoverShadow = (isDarkMode: boolean = true): ViewStyle => {
  if (Platform.OS === 'android') {
    return { elevation: 8 };
  }
  return isDarkMode ? cardShadowHoverDark : cardShadowHoverLight;
};

/**
 * Get glow effect (only visible on iOS)
 */
export const getGlow = (
  type: 'gold' | 'success' | 'error',
  size: 'default' | 'lg' = 'default'
): ViewStyle => {
  if (Platform.OS === 'android') {
    // Android doesn't support colored shadows
    return {};
  }
  
  switch (type) {
    case 'gold':
      return size === 'lg' ? glowGoldLg : glowGold;
    case 'success':
      return glowSuccess;
    case 'error':
      return glowError;
    default:
      return {};
  }
};

// ============================================
// EXPORTS
// ============================================

export default {
  shadowsDarkIOS,
  shadowsLightIOS,
  elevations,
  glowGold,
  glowGoldLg,
  glowSuccess,
  glowError,
  cardShadowDark,
  cardShadowLight,
  getShadow,
  getCardShadow,
  getCardHoverShadow,
  getGlow,
};

