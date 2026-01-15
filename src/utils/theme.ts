/**
 * Theme Configuration
 * 
 * Why separate theme file:
 * - Centralized color management
 * - Easy dark mode support
 * - No magic color values scattered in code
 * - Accessibility-friendly contrast ratios
 */

import { useColorScheme } from 'react-native';

export type ColorScheme = 'light' | 'dark';

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

const lightTheme: Theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#2196F3',
    primaryDark: '#1976D2',
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    border: '#E0E0E0',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

const darkTheme: Theme = {
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    primary: '#64B5F6',
    primaryDark: '#42A5F5',
    error: '#EF5350',
    warning: '#FFB74D',
    success: '#66BB6A',
    border: '#333333',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

export const getTheme = (colorScheme: ColorScheme): Theme => {
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export const useTheme = (): Theme => {
  const colorScheme = useColorScheme() || 'light';
  return getTheme(colorScheme);
};

