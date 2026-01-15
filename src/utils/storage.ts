/**
 * MMKV Storage Configuration
 * 
 * Why MMKV:
 * - 30-50x faster than AsyncStorage
 * - Synchronous API (no async/await overhead)
 * - Thread-safe and efficient for frequent reads/writes
 * - Perfect for storing app limits and usage stats
 */

import { createMMKV } from 'react-native-mmkv';

// Create a single storage instance - reuse throughout the app
// createMMKV is the correct API for react-native-mmkv v4+
export const storage = createMMKV({
  id: 'daily-focus-storage',
  // Encrypted storage for sensitive data (optional, but good for privacy)
  // In production, generate encryption key securely
  encryptionKey: 'daily-focus-encryption-key',
});

/**
 * Type-safe storage helpers
 */
export const StorageKeys = {
  SELECTED_APPS: 'selected_apps',
  APP_LIMITS: 'app_limits',
  USAGE_STATS: 'usage_stats',
  PERMISSIONS_GRANTED: 'permissions_granted',
} as const;

