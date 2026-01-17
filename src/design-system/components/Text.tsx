/**
 * Boundly Design System - Text Component
 * 
 * A themed text component with typography presets.
 * Supports both NativeWind className and style props.
 */

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import {
  typography,
  type TypographyPreset,
} from '../tokens/typography';
import { useTheme } from '../hooks/useTheme';

// ============================================
// PROPS
// ============================================
export interface TextProps extends RNTextProps {
  /** Typography preset to apply */
  variant?: TypographyPreset;
  /** Text color - semantic name or custom color */
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'brand' | 'success' | 'error' | 'warning' | string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'auto';
  /** Whether text should be uppercased */
  uppercase?: boolean;
  /** Whether text should be bold */
  bold?: boolean;
  /** Whether text should be italic */
  italic?: boolean;
  /** Whether text should be underlined */
  underline?: boolean;
  /** NativeWind className */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================
export function Text({
  variant,
  color,
  align,
  uppercase,
  bold,
  italic,
  underline,
  style,
  className,
  children,
  ...props
}: TextProps) {
  const { colors } = useTheme();
  
  // Get typography preset styles
  const variantStyles: TextStyle = variant && typography[variant] 
    ? typography[variant] 
    : {};
  
  // Resolve color value
  const resolveColor = (): string | undefined => {
    if (!color) return colors.text.primary;
    
    switch (color) {
      case 'primary':
        return colors.text.primary;
      case 'secondary':
        return colors.text.secondary;
      case 'tertiary':
        return colors.text.tertiary;
      case 'muted':
        return colors.text.muted;
      case 'brand':
        return colors.brand.gold;
      case 'success':
        return colors.status.success;
      case 'error':
        return colors.status.error;
      case 'warning':
        return colors.status.warning;
      default:
        // Allow custom color strings
        return color;
    }
  };
  
  // Build computed styles
  const computedStyles: TextStyle = {
    color: resolveColor(),
    textAlign: align,
    textTransform: uppercase ? 'uppercase' : undefined,
    fontWeight: bold ? 'bold' : variantStyles.fontWeight,
    fontStyle: italic ? 'italic' : undefined,
    textDecorationLine: underline ? 'underline' : undefined,
  };
  
  return (
    <RNText
      style={[variantStyles, computedStyles, style]}
      className={className}
      {...props}
    >
      {children}
    </RNText>
  );
}

// ============================================
// PRESET COMPONENTS
// ============================================

/**
 * Display text variants for headlines
 */
export function DisplayText(props: Omit<TextProps, 'variant'> & { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }) {
  const { size = 'md', ...rest } = props;
  const variantMap = {
    '2xl': 'display2xl',
    xl: 'displayXl',
    lg: 'displayLg',
    md: 'displayMd',
    sm: 'displaySm',
  } as const;
  
  return <Text variant={variantMap[size]} {...rest} />;
}

/**
 * Body text variants for content
 */
export function BodyText(props: Omit<TextProps, 'variant'> & { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const { size = 'md', ...rest } = props;
  const variantMap = {
    xl: 'bodyXl',
    lg: 'bodyLg',
    md: 'bodyMd',
    sm: 'bodySm',
    xs: 'bodyXs',
  } as const;
  
  return <Text variant={variantMap[size]} {...rest} />;
}

/**
 * Label text variants for UI elements
 */
export function LabelText(props: Omit<TextProps, 'variant'> & { size?: 'sm' | 'md' | 'lg' }) {
  const { size = 'md', ...rest } = props;
  const variantMap = {
    lg: 'labelLg',
    md: 'labelMd',
    sm: 'labelSm',
  } as const;
  
  return <Text variant={variantMap[size]} {...rest} />;
}

/**
 * Stat value text (monospace)
 */
export function StatText(props: Omit<TextProps, 'variant'>) {
  return <Text variant="statValue" color="brand" {...props} />;
}

/**
 * Section header text (uppercase label)
 */
export function SectionLabel(props: Omit<TextProps, 'variant'>) {
  return <Text variant="sectionLabel" color="tertiary" {...props} />;
}

export default Text;

