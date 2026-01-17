/**
 * Boundly Design System - Responsive Hook
 * 
 * Provides responsive utilities for adapting layouts to different screen sizes.
 * Works with both NativeWind classes and StyleSheet values.
 */

import { useMemo } from 'react';
import { Dimensions, Platform, ScaledSize, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================
// BREAKPOINT DEFINITIONS
// ============================================
export const breakpoints = {
  /** iPhone SE, small phones */
  xs: 375,
  /** iPhone 14/15 */
  sm: 390,
  /** iPhone 14/15 Plus/Pro Max */
  md: 428,
  /** iPad Mini */
  lg: 744,
  /** iPad Pro 11" */
  xl: 1024,
  /** iPad Pro 12.9" */
  '2xl': 1366,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// ============================================
// DEVICE TYPE DEFINITIONS
// ============================================
export type DeviceType = 'phone' | 'tablet' | 'desktop';

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// ============================================
// RESPONSIVE HOOK RETURN TYPE
// ============================================
export interface UseResponsiveReturn {
  /** Current screen width */
  width: number;
  /** Current screen height */
  height: number;
  /** Whether device is in landscape orientation */
  isLandscape: boolean;
  /** Whether device is in portrait orientation */
  isPortrait: boolean;
  /** Current device type */
  deviceType: DeviceType;
  /** Whether device is a phone */
  isPhone: boolean;
  /** Whether device is a tablet */
  isTablet: boolean;
  /** Current breakpoint name */
  breakpoint: ScreenSize;
  /** Check if current width is at least the given breakpoint */
  isAtLeast: (bp: Breakpoint) => boolean;
  /** Check if current width is at most the given breakpoint */
  isAtMost: (bp: Breakpoint) => boolean;
  /** Check if current width is between two breakpoints */
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean;
  /** Safe area insets */
  safeArea: ReturnType<typeof useSafeAreaInsets>;
  /** Get responsive value based on breakpoint */
  responsive: <T>(values: Partial<Record<ScreenSize, T>> & { default: T }) => T;
  /** Get scaled value based on screen width */
  scale: (value: number) => number;
  /** Get vertically scaled value based on screen height */
  verticalScale: (value: number) => number;
  /** Get moderately scaled value (less aggressive scaling) */
  moderateScale: (value: number, factor?: number) => number;
  /** Platform info */
  platform: {
    isIOS: boolean;
    isAndroid: boolean;
    isWeb: boolean;
  };
}

// ============================================
// DESIGN REFERENCE DIMENSIONS
// ============================================
// Based on iPhone 14 Pro (390 x 844)
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

// ============================================
// RESPONSIVE HOOK
// ============================================

/**
 * Hook for responsive design utilities
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { breakpoint, responsive, scale, isTablet } = useResponsive();
 *   
 *   const fontSize = responsive({
 *     default: 16,
 *     sm: 18,
 *     lg: 24,
 *   });
 *   
 *   return (
 *     <View style={{ padding: scale(16) }}>
 *       <Text style={{ fontSize }}>
 *         Current breakpoint: {breakpoint}
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useResponsive(): UseResponsiveReturn {
  const { width, height } = useWindowDimensions();
  const safeArea = useSafeAreaInsets();
  
  // Orientation
  const isLandscape = width > height;
  const isPortrait = !isLandscape;
  
  // Device type detection
  const deviceType = useMemo<DeviceType>(() => {
    const minDimension = Math.min(width, height);
    if (minDimension >= 600) return 'tablet';
    return 'phone';
  }, [width, height]);
  
  const isPhone = deviceType === 'phone';
  const isTablet = deviceType === 'tablet';
  
  // Current breakpoint
  const breakpoint = useMemo<ScreenSize>(() => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [width]);
  
  // Breakpoint checkers
  const isAtLeast = (bp: Breakpoint): boolean => width >= breakpoints[bp];
  const isAtMost = (bp: Breakpoint): boolean => width <= breakpoints[bp];
  const isBetween = (min: Breakpoint, max: Breakpoint): boolean =>
    width >= breakpoints[min] && width <= breakpoints[max];
  
  // Responsive value getter
  const responsive = <T,>(
    values: Partial<Record<ScreenSize, T>> & { default: T }
  ): T => {
    const orderedBreakpoints: ScreenSize[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    
    for (const bp of orderedBreakpoints) {
      if (width >= breakpoints[bp] && values[bp] !== undefined) {
        return values[bp] as T;
      }
    }
    
    return values.default;
  };
  
  // Scaling functions (based on design reference)
  const scale = (value: number): number => {
    return (width / DESIGN_WIDTH) * value;
  };
  
  const verticalScale = (value: number): number => {
    return (height / DESIGN_HEIGHT) * value;
  };
  
  const moderateScale = (value: number, factor: number = 0.5): number => {
    return value + (scale(value) - value) * factor;
  };
  
  // Platform info
  const platform = useMemo(() => ({
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    isWeb: Platform.OS === 'web',
  }), []);
  
  return {
    width,
    height,
    isLandscape,
    isPortrait,
    deviceType,
    isPhone,
    isTablet,
    breakpoint,
    isAtLeast,
    isAtMost,
    isBetween,
    safeArea,
    responsive,
    scale,
    verticalScale,
    moderateScale,
    platform,
  };
}

// ============================================
// STATIC HELPERS
// ============================================

/**
 * Get current screen dimensions (non-reactive)
 */
export const getScreenDimensions = (): ScaledSize => {
  return Dimensions.get('window');
};

/**
 * Scale a value based on current screen width (non-reactive)
 */
export const scaleValue = (value: number): number => {
  const { width } = getScreenDimensions();
  return (width / DESIGN_WIDTH) * value;
};

/**
 * Vertically scale a value based on current screen height (non-reactive)
 */
export const verticalScaleValue = (value: number): number => {
  const { height } = getScreenDimensions();
  return (height / DESIGN_HEIGHT) * value;
};

/**
 * Moderately scale a value (non-reactive)
 */
export const moderateScaleValue = (value: number, factor: number = 0.5): number => {
  return value + (scaleValue(value) - value) * factor;
};

export default useResponsive;

