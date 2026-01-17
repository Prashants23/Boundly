/**
 * Onboarding Button Component
 * 
 * Standardized button component for onboarding screens.
 * 
 * Design Principles:
 * - Consistent styling across all screens
 * - Clear visual hierarchy
 * - Respectful of user's time (no unnecessary animations)
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, View } from 'react-native';

export interface OnboardingButtonProps {
  /**
   * Button text
   */
  label: string;
  
  /**
   * Callback when button is pressed
   */
  onPress: () => void;
  
  /**
   * Whether button is in loading state
   */
  loading?: boolean;
  
  /**
   * Whether button is disabled
   */
  disabled?: boolean;
  
  /**
   * Button variant
   * - primary: Main action (default)
   * - secondary: Secondary action (e.g., "Skip for now")
   */
  variant?: 'primary' | 'secondary';
}

/**
 * OnboardingButton Component
 * 
 * Standard button for onboarding flow.
 * Handles loading and disabled states gracefully.
 */
export default function OnboardingButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: OnboardingButtonProps) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`
        min-h-[52px] items-center justify-center rounded-xl px-8 py-4
        ${isPrimary 
          ? 'bg-brand-gold active:bg-brand-goldDark' 
          : 'bg-transparent border border-border dark:border-border'
        }
        ${isDisabled ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? '#0A0A0A' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text
          className={`
            text-base font-semibold
            ${isPrimary 
              ? 'text-bg-primary' 
              : 'text-text-primary dark:text-text-primary'
            }
          `}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
