/**
 * Store Index
 * 
 * Central export for all stores
 * Also initializes stores from MMKV on app start
 */

import { useAppStore } from './useAppStore';
import { useLimitsStore } from './useLimitsStore';
import { useUsageStore } from './useUsageStore';

/**
 * Initialize all stores from persistent storage
 * Call this once on app startup
 */
export function initializeStores() {
  useAppStore.getState().loadFromStorage();
  useLimitsStore.getState().loadFromStorage();
  useUsageStore.getState().loadFromStorage();
}

export { useAppStore, useLimitsStore, useUsageStore };

