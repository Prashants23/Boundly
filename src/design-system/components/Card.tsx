/**
 * Boundly Design System - Card Component
 * 
 * A container component for grouping related content.
 */

import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  ViewStyle,
  Pressable,
  PressableProps,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { semanticRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';

// ============================================
// TYPES
// ============================================
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  /** Card variant */
  variant?: CardVariant;
  /** Card padding size */
  size?: CardSize;
  /** Whether card is pressable */
  pressable?: boolean;
  /** Press handler (only works if pressable is true) */
  onPress?: PressableProps['onPress'];
  /** Custom style */
  style?: ViewStyle;
  /** NativeWind className */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

// ============================================
// COMPONENT
// ============================================
export function Card({
  variant = 'default',
  size = 'md',
  pressable = false,
  onPress,
  style,
  className,
  children,
  ...props
}: CardProps) {
  const { colors, cardShadow, isDark } = useTheme();
  
  // Padding based on size
  const paddingConfig = {
    sm: spacing.spacing['3'],
    md: spacing.spacing['4'],
    lg: spacing.spacing['6'],
  };
  
  // Get variant styles
  const getVariantStyle = (pressed: boolean = false): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: semanticRadius.card,
      padding: paddingConfig[size],
    };
    
    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: colors.surface.DEFAULT,
          ...cardShadow,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: colors.background.secondary,
        };
      case 'default':
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.surface.DEFAULT,
        };
    }
  };
  
  if (pressable && onPress) {
    return (
      <Pressable onPress={onPress} className={className} {...props}>
        {({ pressed }) => (
          <View
            style={[
              getVariantStyle(pressed),
              pressed && { opacity: 0.9 },
              style,
            ]}
          >
            {children}
          </View>
        )}
      </Pressable>
    );
  }
  
  return (
    <View
      style={[getVariantStyle(), style]}
      className={className}
      {...props}
    >
      {children}
    </View>
  );
}

// ============================================
// CARD HEADER
// ============================================
export interface CardHeaderProps extends ViewProps {
  /** Title text */
  title?: React.ReactNode;
  /** Subtitle text */
  subtitle?: React.ReactNode;
  /** Right action element */
  action?: React.ReactNode;
  /** Custom style */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  style,
  children,
  ...props
}: CardHeaderProps) {
  const { colors } = useTheme();
  
  if (children) {
    return (
      <View style={[styles.header, style]} {...props}>
        {children}
      </View>
    );
  }
  
  return (
    <View style={[styles.header, style]} {...props}>
      <View style={styles.headerContent}>
        {title && (
          <View>
            {typeof title === 'string' ? (
              <View style={styles.title}>
                {/* Title handled by parent */}
              </View>
            ) : (
              title
            )}
          </View>
        )}
        {subtitle && (
          <View style={styles.subtitle}>
            {subtitle}
          </View>
        )}
      </View>
      {action && <View style={styles.headerAction}>{action}</View>}
    </View>
  );
}

// ============================================
// CARD CONTENT
// ============================================
export interface CardContentProps extends ViewProps {
  /** Custom style */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function CardContent({ style, children, ...props }: CardContentProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

// ============================================
// CARD FOOTER
// ============================================
export interface CardFooterProps extends ViewProps {
  /** Custom style */
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function CardFooter({ style, children, ...props }: CardFooterProps) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.spacing['3'],
  },
  headerContent: {
    flex: 1,
  },
  headerAction: {
    marginLeft: spacing.spacing['3'],
  },
  title: {
    marginBottom: spacing.spacing['1'],
  },
  subtitle: {},
  content: {
    // Default content has no extra margins
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.spacing['4'],
    paddingTop: spacing.spacing['3'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
});

export default Card;

