/**
 * Boundly Design System - Container Components
 * 
 * Layout containers for consistent spacing and structure.
 */

import React from 'react';
import {
  View,
  ViewProps,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { spacing, semanticSpacing } from '../tokens/spacing';

// ============================================
// SCREEN CONTAINER
// ============================================
export interface ScreenContainerProps extends ViewProps {
  /** Whether to include safe area insets */
  safeArea?: boolean | { top?: boolean; bottom?: boolean };
  /** Background variant */
  background?: 'primary' | 'secondary' | 'tertiary';
  /** Horizontal padding */
  padding?: boolean;
  /** Custom style */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function ScreenContainer({
  safeArea = true,
  background = 'primary',
  padding = true,
  style,
  children,
  ...props
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Resolve safe area settings
  const safeAreaConfig = typeof safeArea === 'boolean'
    ? { top: safeArea, bottom: safeArea }
    : { top: safeArea?.top ?? true, bottom: safeArea?.bottom ?? true };
  
  // Get background color
  const getBackgroundColor = (): string => {
    switch (background) {
      case 'secondary':
        return colors.background.secondary;
      case 'tertiary':
        return colors.background.tertiary;
      case 'primary':
      default:
        return colors.background.primary;
    }
  };
  
  return (
    <View
      style={[
        styles.screenContainer,
        {
          backgroundColor: getBackgroundColor(),
          paddingTop: safeAreaConfig.top ? insets.top : 0,
          paddingBottom: safeAreaConfig.bottom ? insets.bottom : 0,
          paddingHorizontal: padding ? semanticSpacing.screen.horizontal : 0,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

// ============================================
// SCROLL CONTAINER
// ============================================
export interface ScrollContainerProps extends ScrollViewProps {
  /** Whether to include safe area insets */
  safeArea?: boolean | { top?: boolean; bottom?: boolean };
  /** Background variant */
  background?: 'primary' | 'secondary' | 'tertiary';
  /** Horizontal padding */
  padding?: boolean;
  /** Content container style */
  contentStyle?: ViewStyle;
  children?: React.ReactNode;
}

export function ScrollContainer({
  safeArea = true,
  background = 'primary',
  padding = true,
  style,
  contentStyle,
  children,
  ...props
}: ScrollContainerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const safeAreaConfig = typeof safeArea === 'boolean'
    ? { top: safeArea, bottom: safeArea }
    : { top: safeArea?.top ?? true, bottom: safeArea?.bottom ?? true };
  
  const getBackgroundColor = (): string => {
    switch (background) {
      case 'secondary':
        return colors.background.secondary;
      case 'tertiary':
        return colors.background.tertiary;
      default:
        return colors.background.primary;
    }
  };
  
  return (
    <ScrollView
      style={[
        styles.scrollContainer,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      contentContainerStyle={[
        {
          paddingTop: safeAreaConfig.top ? insets.top : 0,
          paddingBottom: safeAreaConfig.bottom ? insets.bottom + spacing.spacing['8'] : spacing.spacing['8'],
          paddingHorizontal: padding ? semanticSpacing.screen.horizontal : 0,
        },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

// ============================================
// FLEX CONTAINERS
// ============================================

/**
 * Horizontal stack container
 */
export interface HStackProps extends ViewProps {
  /** Gap between items */
  gap?: keyof typeof spacing.spacing;
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Distribution */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Whether to wrap items */
  wrap?: boolean;
  /** Custom style */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function HStack({
  gap = '3',
  align = 'center',
  justify = 'start',
  wrap = false,
  style,
  children,
  ...props
}: HStackProps) {
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  } as const;
  
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  } as const;
  
  return (
    <View
      style={[
        styles.hStack,
        {
          gap: spacing.spacing[gap],
          alignItems: alignMap[align],
          justifyContent: justifyMap[justify],
          flexWrap: wrap ? 'wrap' : 'nowrap',
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Vertical stack container
 */
export interface VStackProps extends ViewProps {
  /** Gap between items */
  gap?: keyof typeof spacing.spacing;
  /** Alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Distribution */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Custom style */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function VStack({
  gap = '3',
  align = 'stretch',
  justify = 'start',
  style,
  children,
  ...props
}: VStackProps) {
  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  } as const;
  
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  } as const;
  
  return (
    <View
      style={[
        styles.vStack,
        {
          gap: spacing.spacing[gap],
          alignItems: alignMap[align],
          justifyContent: justifyMap[justify],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Center container
 */
export interface CenterProps extends ViewProps {
  /** Custom style */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function Center({ style, children, ...props }: CenterProps) {
  return (
    <View style={[styles.center, style]} {...props}>
      {children}
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  hStack: {
    flexDirection: 'row',
  },
  vStack: {
    flexDirection: 'column',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default {
  ScreenContainer,
  ScrollContainer,
  HStack,
  VStack,
  Center,
};

