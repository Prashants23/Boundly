/**
 * Boundly Design System - Theme Hook
 * 
 * Provides theme-aware colors and utilities for components.
 * Integrates with NativeWind's color scheme detection.
 */

import { useColorScheme } from 'nativewind';
import { useCallback, useMemo } from 'react';
import {
  brand,
  backgrounds,
  text,
  status,
  borders,
  surfaces,
  appBrands,
  gradients,
  type ColorScheme,
} from '../tokens/colors';
import { getShadow, getCardShadow, getGlow, type ShadowLevel } from '../tokens/shadows';

/**
 * Theme colors object type
 */
export interface ThemeColors {
  brand: typeof brand;
  background: typeof backgrounds.dark | typeof backgrounds.light;
  text: typeof text.dark | typeof text.light;
  status: typeof status;
  border: typeof borders.dark | typeof borders.light;
  surface: typeof surfaces.dark | typeof surfaces.light;
  appBrands: typeof appBrands;
  gradients: typeof gradients;
}

/**
 * Theme hook return type
 */
export interface UseThemeReturn {
  /** Current color scheme ('light' | 'dark') */
  colorScheme: ColorScheme;
  /** Whether dark mode is active */
  isDark: boolean;
  /** Whether light mode is active */
  isLight: boolean;
  /** Toggle color scheme function */
  toggleColorScheme: () => void;
  /** Set specific color scheme */
  setColorScheme: (scheme: ColorScheme) => void;
  /** All theme colors */
  colors: ThemeColors;
  /** Get shadow style for level */
  shadow: (level: ShadowLevel) => ReturnType<typeof getShadow>;
  /** Get card shadow */
  cardShadow: ReturnType<typeof getCardShadow>;
  /** Get glow effect */
  glow: (type: 'gold' | 'success' | 'error', size?: 'default' | 'lg') => ReturnType<typeof getGlow>;
}

/**
 * Custom hook for accessing theme values
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, isDark, shadow } = useTheme();
 *   
 *   return (
 *     <View style={[styles.card, shadow('md')]}>
 *       <Text style={{ color: colors.text.primary }}>
 *         Hello World
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  const { colorScheme: rawColorScheme, setColorScheme: setNativeWindScheme } = useColorScheme();
  
  // Normalize color scheme (default to 'dark' if undefined)
  const colorScheme: ColorScheme = rawColorScheme === 'light' ? 'light' : 'dark';
  const isDark = colorScheme === 'dark';
  const isLight = colorScheme === 'light';
  
  // Memoize theme colors
  const colors = useMemo<ThemeColors>(() => ({
    brand,
    background: isDark ? backgrounds.dark : backgrounds.light,
    text: isDark ? text.dark : text.light,
    status,
    border: isDark ? borders.dark : borders.light,
    surface: isDark ? surfaces.dark : surfaces.light,
    appBrands,
    gradients,
  }), [isDark]);
  
  // Toggle function
  const toggleColorScheme = useCallback(() => {
    setNativeWindScheme(isDark ? 'light' : 'dark');
  }, [isDark, setNativeWindScheme]);
  
  // Set color scheme function
  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setNativeWindScheme(scheme);
  }, [setNativeWindScheme]);
  
  // Shadow helper
  const shadow = useCallback((level: ShadowLevel) => {
    return getShadow(level, isDark);
  }, [isDark]);
  
  // Card shadow
  const cardShadow = useMemo(() => {
    return getCardShadow(isDark);
  }, [isDark]);
  
  // Glow helper
  const glow = useCallback((
    type: 'gold' | 'success' | 'error',
    size: 'default' | 'lg' = 'default'
  ) => {
    return getGlow(type, size);
  }, []);
  
  return {
    colorScheme,
    isDark,
    isLight,
    toggleColorScheme,
    setColorScheme,
    colors,
    shadow,
    cardShadow,
    glow,
  };
}

export default useTheme;

