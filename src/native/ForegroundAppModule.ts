/**
 * ForegroundAppModule TurboModule
 * 
 * This module detects the current foreground app.
 * 
 * Android Lifecycle Implications:
 * - Uses ActivityManager to get current foreground app
 * - Battery-efficient: We check on-demand, not continuous polling
 * - Requires PACKAGE_USAGE_STATS permission for accurate detection
 * - Can be called from JS when needed (e.g., when app comes to foreground)
 * 
 * Now using TurboModules for New Architecture support!
 */

import NativeForegroundAppModule, { type ForegroundAppInfo, type Spec } from './NativeForegroundAppModule';

// Re-export types
export type { ForegroundAppInfo };

// Export the module instance
export default NativeForegroundAppModule;

