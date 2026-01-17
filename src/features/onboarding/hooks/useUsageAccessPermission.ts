/**
 * Usage Access Permission Hook
 * 
 * Manages Usage Access permission state and navigation to Settings.
 * 
 * Android-Specific Behavior:
 * - Usage Access is a special permission (not runtime)
 * - Must be granted via Settings app
 * - Cannot be requested programmatically
 * - Requires user to manually toggle in Settings
 * 
 * Play Store Compliance:
 * - Must explain why permission is needed
 * - Must allow skipping
 * - Must not create retry loops
 * - Must detect return from Settings
 */

import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { checkUsageStatsPermission, openUsageStatsSettings } from '../../../utils/permissions';

export interface UsageAccessPermissionState {
  hasPermission: boolean;
  isChecking: boolean;
  hasCheckedInitial: boolean;
}

/**
 * Hook to manage Usage Access permission flow
 * 
 * Features:
 * - Checks permission on mount
 * - Auto-navigates if already granted
 * - Detects return from Settings
 * - Provides openSettings function
 * 
 * @param onPermissionGranted - Callback when permission is granted
 */
export function useUsageAccessPermission(
  onPermissionGranted?: () => void
) {
  const [state, setState] = useState<UsageAccessPermissionState>({
    hasPermission: false,
    isChecking: false,
    hasCheckedInitial: false,
  });

  const checkPermission = useCallback(async () => {
    setState((prev) => ({ ...prev, isChecking: true }));
    try {
      const granted = await checkUsageStatsPermission();
      setState((prev) => ({
        ...prev,
        hasPermission: granted,
        isChecking: false,
        hasCheckedInitial: true,
      }));

      if (granted && onPermissionGranted) {
        // Small delay to show success state before navigation
        setTimeout(() => {
          onPermissionGranted();
        }, 300);
      }
    } catch (error) {
      console.error('Error checking usage access permission:', error);
      setState((prev) => ({
        ...prev,
        isChecking: false,
        hasCheckedInitial: true,
      }));
    }
  }, [onPermissionGranted]);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Detect return from Settings
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && state.hasCheckedInitial && !state.hasPermission) {
        // User might have returned from Settings - re-check
        checkPermission();
      }
    });

    return () => subscription.remove();
  }, [state.hasCheckedInitial, state.hasPermission, checkPermission]);

  const openSettings = useCallback(async () => {
    try {
      await openUsageStatsSettings();
    } catch (error) {
      console.error('Error opening usage access settings:', error);
    }
  }, []);

  return {
    ...state,
    checkPermission,
    openSettings,
  };
}

