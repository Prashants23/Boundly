/**
 * Limits Store - Daily Usage Limits
 * 
 * Why separate store:
 * - Limits are independent of selected apps (can change without affecting apps)
 * - Easy to update individual limits
 * - Persisted separately for better performance
 * 
 * Store Structure:
 * - limits: Map of packageName -> limit in milliseconds
 * - Simple get/set operations
 * - Persisted with MMKV
 */

import { create } from 'zustand';
import { storage, StorageKeys } from '../utils/storage';

export interface AppLimit {
  packageName: string;
  limitMs: number; // Daily limit in milliseconds
}

interface LimitsStore {
  limits: Record<string, number>; // packageName -> limitMs
  setLimit: (packageName: string, limitMs: number) => void;
  getLimit: (packageName: string) => number | undefined;
  removeLimit: (packageName: string) => void;
  clearLimits: () => void;
  loadFromStorage: () => void;
}

export const useLimitsStore = create<LimitsStore>((set, get) => ({
  limits: {},

  setLimit: (packageName: string, limitMs: number) => {
    set((state) => {
      const newLimits = { ...state.limits, [packageName]: limitMs };
      // Persist to MMKV
      storage.set(StorageKeys.APP_LIMITS, JSON.stringify(newLimits));
      return { limits: newLimits };
    });
  },

  getLimit: (packageName: string) => {
    return get().limits[packageName];
  },

  removeLimit: (packageName: string) => {
    set((state) => {
      const { [packageName]: removed, ...newLimits } = state.limits;
      // Persist to MMKV
      storage.set(StorageKeys.APP_LIMITS, JSON.stringify(newLimits));
      return { limits: newLimits };
    });
  },

  clearLimits: () => {
    set({ limits: {} });
    storage.delete(StorageKeys.APP_LIMITS);
  },

  loadFromStorage: () => {
    try {
      const stored = storage.getString(StorageKeys.APP_LIMITS);
      if (stored) {
        const limits = JSON.parse(stored) as Record<string, number>;
        set({ limits });
      }
    } catch (error) {
      console.error('Error loading limits from storage:', error);
    }
  },
}));

