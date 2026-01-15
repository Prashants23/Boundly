/**
 * UsageStatsModule TurboModule Spec
 * 
 * This is the TypeScript spec for the TurboModule.
 * React Native Codegen will generate the native interfaces from this.
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface UsageStat {
  packageName: string;
  appName: string;
  totalTimeInForeground: number; // milliseconds
}

export interface Spec extends TurboModule {
  getTodayUsageStats(): Promise<UsageStat[]>;
  getAppUsageToday(packageName: string): Promise<UsageStat | null>;
  hasUsageStatsPermission(): Promise<boolean>;
  openUsageStatsSettings(): Promise<void>;
}

const module = TurboModuleRegistry.get<Spec>('UsageStatsModule');

if (!module) {
  console.warn('UsageStatsModule TurboModule not found. Make sure it is properly registered.');
}

export default module;

