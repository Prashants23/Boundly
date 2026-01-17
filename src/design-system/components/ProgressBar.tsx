/**
 * Boundly Design System - Progress Bar Component
 * 
 * Visual progress indicators for usage tracking.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { semanticRadius } from '../tokens/radius';

// ============================================
// TYPES
// ============================================
export type ProgressVariant = 'default' | 'success' | 'warning' | 'error' | 'brand';

export interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Progress bar variant */
  variant?: ProgressVariant;
  /** Bar height */
  height?: number;
  /** Whether to animate changes */
  animated?: boolean;
  /** Custom track color */
  trackColor?: string;
  /** Custom fill color (overrides variant) */
  fillColor?: string;
  /** Whether to show glow effect */
  glow?: boolean;
  /** Custom style */
  style?: ViewStyle;
}

// ============================================
// COMPONENT
// ============================================
export function ProgressBar({
  value,
  max = 100,
  variant = 'default',
  height = 8,
  animated = true,
  trackColor,
  fillColor,
  glow = false,
  style,
}: ProgressBarProps) {
  const { colors, isDark } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;
  
  // Calculate percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Animate width changes
  useEffect(() => {
    if (animated) {
      Animated.spring(animatedWidth, {
        toValue: percentage,
        useNativeDriver: false,
        tension: 50,
        friction: 9,
      }).start();
    } else {
      animatedWidth.setValue(percentage);
    }
  }, [percentage, animated, animatedWidth]);
  
  // Get fill color based on variant
  const getFillColor = (): string => {
    if (fillColor) return fillColor;
    
    switch (variant) {
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      case 'brand':
        return colors.brand.gold;
      case 'default':
      default:
        return colors.brand.gold;
    }
  };
  
  // Get track color
  const getTrackColor = (): string => {
    if (trackColor) return trackColor;
    return isDark ? colors.surface.hover : colors.surface.pressed;
  };
  
  const color = getFillColor();
  
  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: getTrackColor(),
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: color,
            borderRadius: height / 2,
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
          glow && {
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
          },
        ]}
      />
    </View>
  );
}

// ============================================
// CIRCULAR PROGRESS
// ============================================
export interface CircularProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Size of the circle */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Progress variant */
  variant?: ProgressVariant;
  /** Custom track color */
  trackColor?: string;
  /** Custom fill color */
  fillColor?: string;
  /** Center content */
  children?: React.ReactNode;
  /** Custom style */
  style?: ViewStyle;
}

export function CircularProgress({
  value,
  size = 100,
  strokeWidth = 6,
  variant = 'brand',
  trackColor,
  fillColor,
  children,
  style,
}: CircularProgressProps) {
  const { colors, isDark } = useTheme();
  
  // Note: For actual SVG-based circular progress, you'd use react-native-svg
  // This is a simplified version using View transforms
  
  const getFillColor = (): string => {
    if (fillColor) return fillColor;
    
    switch (variant) {
      case 'success':
        return colors.status.success;
      case 'warning':
        return colors.status.warning;
      case 'error':
        return colors.status.error;
      case 'brand':
      default:
        return colors.brand.gold;
    }
  };
  
  const getTrackColor = (): string => {
    if (trackColor) return trackColor;
    return isDark ? colors.surface.hover : colors.surface.pressed;
  };
  
  const innerSize = size - strokeWidth * 2;
  
  return (
    <View
      style={[
        styles.circularContainer,
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >
      {/* Track */}
      <View
        style={[
          styles.circularTrack,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: getTrackColor(),
          },
        ]}
      />
      
      {/* Progress indicator - simplified visual */}
      <View
        style={[
          styles.circularProgress,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: getFillColor(),
            borderTopColor: value > 25 ? getFillColor() : 'transparent',
            borderRightColor: value > 50 ? getFillColor() : 'transparent',
            borderBottomColor: value > 75 ? getFillColor() : 'transparent',
            borderLeftColor: value > 0 ? getFillColor() : 'transparent',
            transform: [{ rotate: '-90deg' }],
          },
        ]}
      />
      
      {/* Center content */}
      {children && (
        <View
          style={[
            styles.circularCenter,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

// ============================================
// USAGE BAR (for app usage display)
// ============================================
export interface UsageBarProps {
  /** App name */
  appName: string;
  /** Usage time in minutes */
  usageMinutes: number;
  /** Limit in minutes */
  limitMinutes: number;
  /** App brand color */
  color: string;
  /** Custom style */
  style?: ViewStyle;
}

export function UsageBar({
  appName,
  usageMinutes,
  limitMinutes,
  color,
  style,
}: UsageBarProps) {
  const { colors } = useTheme();
  const percentage = Math.min((usageMinutes / limitMinutes) * 100, 100);
  const isOverLimit = usageMinutes >= limitMinutes;
  
  return (
    <View style={[styles.usageBarContainer, style]}>
      <View style={styles.usageBarHeader}>
        <View style={styles.usageBarLabel}>
          <View style={[styles.usageBarDot, { backgroundColor: color }]} />
          <View>
            {/* App name text handled by parent */}
          </View>
        </View>
        <View>
          {/* Time text handled by parent */}
        </View>
      </View>
      <ProgressBar
        value={percentage}
        variant={isOverLimit ? 'error' : 'default'}
        fillColor={isOverLimit ? undefined : color}
        height={6}
      />
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  circularContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTrack: {
    position: 'absolute',
  },
  circularProgress: {
    position: 'absolute',
  },
  circularCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usageBarContainer: {
    gap: 8,
  },
  usageBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageBarLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  usageBarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ProgressBar;

