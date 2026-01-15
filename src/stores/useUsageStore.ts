/**
 * Usage Store - App Usage Statistics
 * 
 * Why separate store:
 * - Usage stats update frequently (need fast reads)
 * - Can be large (many apps)
 * - Separate from app selection/limits for performance
 * 
 * Store Structure:
 * - todayUsage: Map of packageName -> usage in milliseconds (today)
 * - yesterdayUsage: Map of packageName -> usage in milliseconds (yesterday)
 * - Last updated timestamp
 * - Persisted with MMKV (cached, refreshed from native module)
 */

import { create } from 'zustand';
import { storage, StorageKeys } from '../utils/storage';
import UsageStatsModule from '../native/UsageStatsModule';
import type { UsageStat } from '../native/UsageStatsModule';

interface UsageStore {
  todayUsage: Record<string, number>; // packageName -> usageMs
  yesterdayUsage: Record<string, number>; // packageName -> usageMs
  lastUpdated: number | null;
  isLoading: boolean;
  refreshUsage: () => Promise<void>;
  getTodayUsage: (packageName: string) => number;
  getYesterdayUsage: (packageName: string) => number;
  getTimeSaved: (packageName: string) => number; // vs yesterday
  loadFromStorage: () => void;
}

export const useUsageStore = create<UsageStore>((set, get) => ({
  todayUsage: {},
  yesterdayUsage: {},
  lastUpdated: null,
  isLoading: false,

  refreshUsage: async () => {
    if (!UsageStatsModule) {
      return;
    }

    set({ isLoading: true });
    try {
      const stats = await UsageStatsModule.getTodayUsageStats();
      
      // Convert array to map
      const todayUsage: Record<string, number> = {};
      stats.forEach((stat) => {
        todayUsage[stat.packageName] = stat.totalTimeInForeground;
      });

      // For MVP, we'll calculate yesterday from stored data
      // In production, you'd query UsageStatsManager for yesterday's range
      const previousTodayUsage = get().todayUsage;
      
      set({
        todayUsage,
        yesterdayUsage: previousTodayUsage, // Simple: yesterday = previous today
        lastUpdated: Date.now(),
        isLoading: false,
      });

      // Persist to MMKV
      storage.set(StorageKeys.USAGE_STATS, JSON.stringify({
        todayUsage,
        yesterdayUsage: previousTodayUsage,
        lastUpdated: Date.now(),
      }));
    } catch (error) {
      console.error('Error refreshing usage stats:', error);
      set({ isLoading: false });
    }
  },

  getTodayUsage: (packageName: string) => {
    return get().todayUsage[packageName] || 0;
  },

  getYesterdayUsage: (packageName: string) => {
    return get().yesterdayUsage[packageName] || 0;
  },

  getTimeSaved: (packageName: string) => {
    const today = get().getTodayUsage(packageName);
    const yesterday = get().getYesterdayUsage(packageName);
    return Math.max(0, yesterday - today);
  },

  loadFromStorage: () => {
    try {
      const stored = storage.getString(StorageKeys.USAGE_STATS);
      if (stored) {
        const data = JSON.parse(stored) as {
          todayUsage: Record<string, number>;
          yesterdayUsage: Record<string, number>;
          lastUpdated: number;
        };
        set({
          todayUsage: data.todayUsage || {},
          yesterdayUsage: data.yesterdayUsage || {},
          lastUpdated: data.lastUpdated || null,
        });
      }
    } catch (error) {
      console.error('Error loading usage stats from storage:', error);
    }
  },
}));

