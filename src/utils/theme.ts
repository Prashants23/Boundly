/**
 * Theme Configuration
 * 
 * Legacy theme file - maintained for backward compatibility.
 * For new code, prefer using the design system directly:
 * 
 * @example
 * ```tsx
 * import { useTheme, colors, spacing } from '@/design-system';
 * ```
 * 
 * Why separate theme file:
 * - Centralized color management
 * - Easy dark mode support
 * - No magic color values scattered in code
 * - Accessibility-friendly contrast ratios
 */

import { useColorScheme } from 'react-native';
import {
  brand,
  backgrounds,
  text as textColors,
  status,
  borders,
  surfaces,
} from '../design-system/tokens/colors';
import { spacing as spacingTokens } from '../design-system/tokens/spacing';

export type ColorScheme = 'light' | 'dark';

/**
 * @deprecated Use design system tokens directly
 */
export interface Theme {
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryDark: string;
    error: string;
    warning: string;
    success: string;
    border: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

/**
 * Light theme - now using design system tokens
 */
const lightTheme: Theme = {
  colors: {
    background: backgrounds.light.primary,
    surface: surfaces.light.DEFAULT,
    text: textColors.light.primary,
    textSecondary: textColors.light.secondary,
    primary: brand.gold,
    primaryDark: brand.goldDark,
    error: status.error,
    warning: status.warning,
    success: status.success,
    border: borders.light.DEFAULT,
  },
  spacing: {
    xs: spacingTokens['1'],
    sm: spacingTokens['2'],
    md: spacingTokens['4'],
    lg: spacingTokens['6'],
    xl: spacingTokens['8'],
  },
};

/**
 * Dark theme - now using design system tokens
 */
const darkTheme: Theme = {
  colors: {
    background: backgrounds.dark.primary,
    surface: surfaces.dark.DEFAULT,
    text: textColors.dark.primary,
    textSecondary: textColors.dark.secondary,
    primary: brand.gold,
    primaryDark: brand.goldDark,
    error: status.error,
    warning: status.warning,
    success: status.success,
    border: borders.dark.DEFAULT,
  },
  spacing: {
    xs: spacingTokens['1'],
    sm: spacingTokens['2'],
    md: spacingTokens['4'],
    lg: spacingTokens['6'],
    xl: spacingTokens['8'],
  },
};

/**
 * Get theme for a specific color scheme
 * @deprecated Use design system's useTheme hook instead
 */
export const getTheme = (colorScheme: ColorScheme): Theme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

/**
 * Hook to get current theme
 * @deprecated Use design system's useTheme hook instead:
 * ```tsx
 * import { useTheme } from '@/design-system';
 * const { colors, isDark } = useTheme();
 * ```
 */
export const useTheme = (): Theme => {
  const colorScheme = useColorScheme() || 'light';
  return getTheme(colorScheme);
};

// Re-export design system theme for gradual migration
export { useTheme as useDesignSystemTheme } from '../design-system/hooks/useTheme';

