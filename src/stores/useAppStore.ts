/**
 * App Store - Selected Apps
 * 
 * Why separate store:
 * - Single responsibility (selected apps only)
 * - Easy to persist independently
 * - Minimal re-renders (only components using this store update)
 * 
 * Store Structure:
 * - selectedApps: Set of package names
 * - Simple add/remove operations
 * - Persisted with MMKV
 */

import { create } from 'zustand';
import { storage, StorageKeys } from '../utils/storage';

export interface SelectedApp {
  packageName: string;
  appName: string;
}

interface AppStore {
  selectedApps: SelectedApp[];
  addApp: (app: SelectedApp) => void;
  removeApp: (packageName: string) => void;
  clearApps: () => void;
  isSelected: (packageName: string) => boolean;
  loadFromStorage: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  selectedApps: [],

  addApp: (app: SelectedApp) => {
    set((state) => {
      // Avoid duplicates
      if (state.selectedApps.some((a) => a.packageName === app.packageName)) {
        return state;
      }
      const newApps = [...state.selectedApps, app];
      // Persist to MMKV
      storage.set(StorageKeys.SELECTED_APPS, JSON.stringify(newApps));
      return { selectedApps: newApps };
    });
  },

  removeApp: (packageName: string) => {
    set((state) => {
      const newApps = state.selectedApps.filter(
        (app) => app.packageName !== packageName,
      );
      // Persist to MMKV
      storage.set(StorageKeys.SELECTED_APPS, JSON.stringify(newApps));
      return { selectedApps: newApps };
    });
  },

  clearApps: () => {
    set({ selectedApps: [] });
    storage.delete(StorageKeys.SELECTED_APPS);
  },

  isSelected: (packageName: string) => {
    return get().selectedApps.some((app) => app.packageName === packageName);
  },

  loadFromStorage: () => {
    try {
      const stored = storage.getString(StorageKeys.SELECTED_APPS);
      if (stored) {
        const apps = JSON.parse(stored) as SelectedApp[];
        set({ selectedApps: apps });
      }
    } catch (error) {
      console.error('Error loading selected apps from storage:', error);
    }
  },
}));

