/**
 * Boundly Design System - Badge Component
 * 
 * Small status indicators and labels.
 */

import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../hooks/useTheme';
import { semanticRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';

// ============================================
// TYPES
// ============================================
export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'brand';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Badge text */
  children: string;
  /** Badge variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Whether badge should be pill-shaped */
  pill?: boolean;
  /** Left icon element */
  icon?: React.ReactNode;
  /** Custom style */
  style?: ViewStyle;
  /** NativeWind className */
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  pill = false,
  icon,
  style,
  className,
}: BadgeProps) {
  const { colors, isDark } = useTheme();
  
  // Size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: 2,
      paddingHorizontal: 6,
      fontSize: 10,
      iconSize: 10,
    },
    md: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      fontSize: 12,
      iconSize: 12,
    },
    lg: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: 14,
      iconSize: 14,
    },
  };
  
  const config = sizeConfig[size];
  
  // Get variant styles
  const getVariantStyles = (): { bg: string; text: string } => {
    switch (variant) {
      case 'success':
        return {
          bg: colors.status.successBg,
          text: colors.status.success,
        };
      case 'error':
        return {
          bg: colors.status.errorBg,
          text: colors.status.error,
        };
      case 'warning':
        return {
          bg: colors.status.warningBg,
          text: colors.status.warning,
        };
      case 'info':
        return {
          bg: colors.status.infoBg,
          text: colors.status.info,
        };
      case 'brand':
        return {
          bg: colors.brand.goldMuted,
          text: colors.brand.gold,
        };
      case 'default':
      default:
        return {
          bg: isDark ? colors.surface.hover : colors.surface.DEFAULT,
          text: colors.text.secondary,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.bg,
          paddingVertical: config.paddingVertical,
          paddingHorizontal: config.paddingHorizontal,
          borderRadius: pill ? semanticRadius.badgePill : semanticRadius.badge,
        },
        style,
      ]}
      className={className}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
            color: variantStyles.text,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

// ============================================
// DOT BADGE
// ============================================
export interface DotBadgeProps {
  /** Dot color variant */
  variant?: BadgeVariant;
  /** Dot size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom style */
  style?: ViewStyle;
}

export function DotBadge({
  variant = 'default',
  size = 'md',
  style,
}: DotBadgeProps) {
  const { colors, isDark } = useTheme();
  
  const sizeConfig = {
    sm: 6,
    md: 8,
    lg: 10,
  };
  
  const getColor = (): string => {
    switch (variant) {
      case 'success':
        return colors.status.success;
      case 'error':
        return colors.status.error;
      case 'warning':
        return colors.status.warning;
      case 'info':
        return colors.status.info;
      case 'brand':
        return colors.brand.gold;
      default:
        return colors.text.muted;
    }
  };
  
  const dotSize = sizeConfig[size];
  
  return (
    <View
      style={[
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: getColor(),
        },
        style,
      ]}
    />
  );
}

// ============================================
// COUNT BADGE (for notifications)
// ============================================
export interface CountBadgeProps {
  /** Count value */
  count: number;
  /** Maximum count to display (shows "99+" if exceeded) */
  max?: number;
  /** Badge color variant */
  variant?: 'error' | 'brand';
  /** Custom style */
  style?: ViewStyle;
}

export function CountBadge({
  count,
  max = 99,
  variant = 'error',
  style,
}: CountBadgeProps) {
  const { colors } = useTheme();
  
  if (count <= 0) return null;
  
  const displayCount = count > max ? `${max}+` : count.toString();
  const bgColor = variant === 'brand' ? colors.brand.gold : colors.status.error;
  const textColor = variant === 'brand' ? '#0A0A0A' : '#FFFFFF';
  
  // Dynamic width based on character count
  const minWidth = displayCount.length > 2 ? 24 : displayCount.length > 1 ? 20 : 18;
  
  return (
    <View
      style={[
        styles.countBadge,
        {
          backgroundColor: bgColor,
          minWidth,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.countText,
          { color: textColor },
        ]}
      >
        {displayCount}
      </Text>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  countBadge: {
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default Badge;

