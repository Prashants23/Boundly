/**
 * Boundly Design System - Divider Component
 * 
 * Visual separators for content sections.
 */

import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../tokens/spacing';

// ============================================
// TYPES
// ============================================
export type DividerVariant = 'full' | 'inset' | 'middle';
export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  /** Divider variant */
  variant?: DividerVariant;
  /** Orientation */
  orientation?: DividerOrientation;
  /** Custom color */
  color?: string;
  /** Thickness */
  thickness?: number;
  /** Spacing around divider */
  spacing?: number;
  /** Label text (centered on divider) */
  label?: string;
  /** Custom style */
  style?: ViewStyle;
}

// ============================================
// COMPONENT
// ============================================
export function Divider({
  variant = 'full',
  orientation = 'horizontal',
  color,
  thickness = StyleSheet.hairlineWidth,
  spacing: spacingProp,
  label,
  style,
}: DividerProps) {
  const { colors } = useTheme();
  
  const dividerColor = color || colors.border.DEFAULT;
  const marginValue = spacingProp ?? (orientation === 'horizontal' ? spacing.spacing['3'] : spacing.spacing['2']);
  
  // Get margin based on variant
  const getMargins = (): ViewStyle => {
    if (orientation === 'vertical') {
      return {
        marginHorizontal: marginValue,
      };
    }
    
    switch (variant) {
      case 'inset':
        return {
          marginVertical: marginValue,
          marginLeft: spacing.spacing['16'],
        };
      case 'middle':
        return {
          marginVertical: marginValue,
          marginHorizontal: spacing.spacing['4'],
        };
      case 'full':
      default:
        return {
          marginVertical: marginValue,
        };
    }
  };
  
  // Render divider with label
  if (label && orientation === 'horizontal') {
    return (
      <View style={[styles.labelContainer, { marginVertical: marginValue }, style]}>
        <View
          style={[
            styles.labelLine,
            {
              height: thickness,
              backgroundColor: dividerColor,
            },
          ]}
        />
        <Text
          variant="labelMd"
          color="tertiary"
          style={styles.labelText}
        >
          {label}
        </Text>
        <View
          style={[
            styles.labelLine,
            {
              height: thickness,
              backgroundColor: dividerColor,
            },
          ]}
        />
      </View>
    );
  }
  
  // Simple divider
  if (orientation === 'vertical') {
    return (
      <View
        style={[
          {
            width: thickness,
            backgroundColor: dividerColor,
            alignSelf: 'stretch',
          },
          getMargins(),
          style,
        ]}
      />
    );
  }
  
  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: dividerColor,
        },
        getMargins(),
        style,
      ]}
    />
  );
}

// ============================================
// SECTION DIVIDER
// ============================================
export interface SectionDividerProps {
  /** Section title */
  title?: string;
  /** Right action element */
  action?: React.ReactNode;
  /** Custom style */
  style?: ViewStyle;
}

export function SectionDivider({
  title,
  action,
  style,
}: SectionDividerProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.sectionDivider, style]}>
      <View
        style={[
          styles.sectionDividerLine,
          { backgroundColor: colors.border.DEFAULT },
        ]}
      />
      {(title || action) && (
        <View style={styles.sectionDividerContent}>
          {title && (
            <Text
              variant="sectionLabel"
              color="tertiary"
            >
              {title}
            </Text>
          )}
          {action && <View style={styles.sectionDividerAction}>{action}</View>}
        </View>
      )}
    </View>
  );
}

// ============================================
// SPACER (invisible spacing)
// ============================================
export interface SpacerProps {
  /** Size of the spacer */
  size?: keyof typeof spacing.spacing;
  /** Custom size in pixels */
  height?: number;
  /** Horizontal spacer width */
  width?: number;
}

export function Spacer({ size = '4', height, width }: SpacerProps) {
  const h = height ?? spacing.spacing[size];
  const w = width;
  
  return <View style={{ height: h, width: w }} />;
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelLine: {
    flex: 1,
  },
  labelText: {
    paddingHorizontal: spacing.spacing['3'],
  },
  sectionDivider: {
    marginVertical: spacing.spacing['4'],
  },
  sectionDividerLine: {
    height: StyleSheet.hairlineWidth,
    marginBottom: spacing.spacing['2'],
  },
  sectionDividerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionDividerAction: {
    marginLeft: spacing.spacing['3'],
  },
});

export default Divider;

