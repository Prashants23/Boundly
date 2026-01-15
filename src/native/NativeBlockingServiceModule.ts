/**
 * BlockingServiceModule TurboModule Spec
 * 
 * This is the TypeScript spec for the TurboModule.
 * React Native Codegen will generate the native interfaces from this.
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface AppLimit {
  packageName: string;
  limitMs: number;
}

export interface Spec extends TurboModule {
  startBlockingService(selectedApps: string[], limits: AppLimit[]): Promise<void>;
  stopBlockingService(): Promise<void>;
  isBlockingServiceRunning(): Promise<boolean>;
  isAccessibilityServiceEnabled(): Promise<boolean>;
  openAccessibilitySettings(): Promise<void>;
}

const module = TurboModuleRegistry.get<Spec>('BlockingServiceModule');

if (!module) {
  console.warn('BlockingServiceModule TurboModule not found. Make sure it is properly registered.');
}

export default module;

