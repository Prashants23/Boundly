/**
 * Onboarding State Hook
 * 
 * Manages onboarding completion state using MMKV storage.
 * 
 * Why MMKV:
 * - Synchronous reads (no async overhead)
 * - Fast and reliable
 * - Perfect for one-time flags
 * 
 * Play Store Compliance:
 * - Onboarding must only run once
 * - Never trap users in onboarding
 * - Completion flag persists across app restarts
 */

import { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

/**
 * Check if onboarding has been completed
 * 
 * Returns true if user has completed onboarding, false otherwise.
 * This is a synchronous check for fast initial render decisions.
 */
export function isOnboardingComplete(): boolean {
  try {
    return storage.getBoolean(ONBOARDING_COMPLETE_KEY) ?? false;
  } catch (error) {
    console.error('Error checking onboarding state:', error);
    // Default to false (show onboarding) on error
    return false;
  }
}

/**
 * Mark onboarding as complete
 * 
 * Persists the completion flag to MMKV.
 * This should only be called once, when user reaches the final screen.
 */
export function markOnboardingComplete(): void {
  try {
    storage.set(ONBOARDING_COMPLETE_KEY, true);
    console.log('Onboarding marked as complete');
  } catch (error) {
    console.error('Error marking onboarding complete:', error);
  }
}

/**
 * Reset onboarding (for testing/debugging only)
 * 
 * ⚠️ This should NOT be exposed to users in production.
 * Only use for development/testing purposes.
 */
export function resetOnboarding(): void {
  try {
    storage.delete(ONBOARDING_COMPLETE_KEY);
    console.log('Onboarding reset');
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
}

/**
 * Hook to get onboarding completion state
 * 
 * Returns the current onboarding state and a function to mark it complete.
 * Useful for components that need to react to onboarding state changes.
 */
export function useOnboardingState() {
  const [isComplete, setIsComplete] = useState(isOnboardingComplete);

  const complete = () => {
    markOnboardingComplete();
    setIsComplete(true);
  };

  return {
    isComplete,
    complete,
  };
}

