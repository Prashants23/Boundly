/**
 * Boundly Design System - Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 */

import React, { useCallback } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Text } from './Text';
import { useTheme } from '../hooks/useTheme';
import { semanticRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';

// ============================================
// TYPES
// ============================================
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Button text */
  children: string;
  /** Left icon component */
  leftIcon?: React.ReactNode;
  /** Right icon component */
  rightIcon?: React.ReactNode;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button should take full width */
  fullWidth?: boolean;
  /** Custom style */
  style?: ViewStyle;
  /** NativeWind className */
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  className,
  onPress,
  ...props
}: ButtonProps) {
  const { colors, isDark, shadow } = useTheme();
  
  // Size configurations
  const sizeConfig = {
    sm: {
      paddingVertical: spacing.spacing['2'],
      paddingHorizontal: spacing.spacing['4'],
      fontSize: 14,
      iconSize: 16,
      borderRadius: semanticRadius.buttonSm,
      minHeight: 36,
    },
    md: {
      paddingVertical: spacing.spacing['3'],
      paddingHorizontal: spacing.spacing['6'],
      fontSize: 16,
      iconSize: 20,
      borderRadius: semanticRadius.button,
      minHeight: 48,
    },
    lg: {
      paddingVertical: spacing.spacing['4'],
      paddingHorizontal: spacing.spacing['8'],
      fontSize: 18,
      iconSize: 24,
      borderRadius: semanticRadius.buttonLg,
      minHeight: 56,
    },
  };
  
  const config = sizeConfig[size];
  
  // Get variant styles
  const getVariantStyles = useCallback((pressed: boolean): { container: ViewStyle; text: TextStyle } => {
    const baseOpacity = disabled ? 0.5 : pressed ? 0.8 : 1;
    
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: pressed ? colors.brand.goldDark : colors.brand.gold,
            opacity: baseOpacity,
          },
          text: {
            color: '#0A0A0A',
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.brand.gold,
            opacity: baseOpacity,
          },
          text: {
            color: colors.brand.gold,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: pressed ? colors.surface.hover : 'transparent',
            opacity: baseOpacity,
          },
          text: {
            color: colors.text.primary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: pressed ? '#DC2626' : colors.status.error,
            opacity: baseOpacity,
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'success':
        return {
          container: {
            backgroundColor: pressed ? '#16A34A' : colors.status.success,
            opacity: baseOpacity,
          },
          text: {
            color: '#0A0A0A',
          },
        };
      default:
        return {
          container: {},
          text: {},
        };
    }
  }, [variant, colors, disabled]);
  
  const isDisabled = disabled || loading;
  
  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      className={className}
      {...props}
    >
      {({ pressed }) => {
        const variantStyles = getVariantStyles(pressed);
        
        return (
          <View
            style={[
              styles.container,
              {
                paddingVertical: config.paddingVertical,
                paddingHorizontal: config.paddingHorizontal,
                borderRadius: config.borderRadius,
                minHeight: config.minHeight,
              },
              variantStyles.container,
              fullWidth && styles.fullWidth,
              variant === 'primary' && !pressed && shadow('sm'),
              style,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={variantStyles.text.color}
              />
            ) : (
              <>
                {leftIcon && (
                  <View style={styles.iconLeft}>{leftIcon}</View>
                )}
                <Text
                  style={[
                    styles.text,
                    { fontSize: config.fontSize },
                    variantStyles.text,
                  ]}
                >
                  {children}
                </Text>
                {rightIcon && (
                  <View style={styles.iconRight}>{rightIcon}</View>
                )}
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

// ============================================
// ICON BUTTON VARIANT
// ============================================
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  /** Icon element */
  icon: React.ReactNode;
  /** Accessible label */
  accessibilityLabel: string;
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  style,
  ...props
}: IconButtonProps) {
  const { colors, shadow } = useTheme();
  
  const sizeConfig = {
    sm: { size: 36, borderRadius: 18 },
    md: { size: 48, borderRadius: 24 },
    lg: { size: 56, borderRadius: 28 },
  };
  
  const config = sizeConfig[size];
  
  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: config.size,
      height: config.size,
      borderRadius: config.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
    };
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: pressed ? colors.brand.goldDark : colors.brand.gold,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.brand.gold,
        };
      case 'ghost':
      default:
        return {
          ...baseStyle,
          backgroundColor: pressed ? colors.surface.hover : 'transparent',
        };
    }
  };
  
  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <View style={[getContainerStyle(pressed), style]}>
          {icon}
        </View>
      )}
    </Pressable>
  );
}

export default Button;

