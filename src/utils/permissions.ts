/**
 * Permissions Utilities
 * 
 * Handles usage stats permission checking and navigation to Settings
 */

import UsageStatsModule from '../native/UsageStatsModule';

export interface PermissionStatus {
  granted: boolean;
  canRequest: boolean;
}

/**
 * Check if usage stats permission is granted
 */
export async function checkUsageStatsPermission(): Promise<boolean> {
  try {
    if (!UsageStatsModule) {
      console.warn('UsageStatsModule is null - TurboModule may not be registered');
      return false;
    }
    console.log('Checking usage stats permission via native module...');
    const result = await UsageStatsModule.hasUsageStatsPermission();
    console.log('Permission check result:', result);
    return result;
  } catch (error) {
    console.error('Error checking usage stats permission:', error);
    return false;
  }
}

/**
 * Open Settings screen to grant usage stats permission
 */
export async function openUsageStatsSettings(): Promise<void> {
  try {
    if (!UsageStatsModule) {
      console.error('UsageStatsModule is null - TurboModule may not be registered');
      throw new Error('UsageStatsModule not available. Make sure the app is built with New Architecture enabled.');
    }
    console.log('Opening Usage Stats Settings via native module...');
    await UsageStatsModule.openUsageStatsSettings();
    console.log('Settings should be open now');
  } catch (error) {
    console.error('Error opening usage stats settings:', error);
    throw error;
  }
}

/**
 * Get permission status with details
 */
export async function getPermissionStatus(): Promise<PermissionStatus> {
  const granted = await checkUsageStatsPermission();
  return {
    granted,
    canRequest: true, // Always can request (opens Settings)
  };
}

