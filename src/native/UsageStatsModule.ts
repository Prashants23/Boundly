/**
 * UsageStatsModule TurboModule
 * 
 * This module provides access to Android UsageStatsManager API
 * to read daily app usage statistics.
 * 
 * Android Lifecycle Implications:
 * - UsageStatsManager requires PACKAGE_USAGE_STATS permission
 * - Permission must be granted via Settings (not runtime permission)
 * - Data is aggregated by Android system, so we query it (not poll)
 * - Battery-efficient: Android handles the tracking
 * 
 * Now using TurboModules for New Architecture support!
 */

import NativeUsageStatsModule, { type UsageStat, type Spec } from './NativeUsageStatsModule';

// Re-export types
export type { UsageStat };

// Export the module instance
export default NativeUsageStatsModule;

