/**
 * ForegroundAppModule TurboModule Spec
 * 
 * This is the TypeScript spec for the TurboModule.
 * React Native Codegen will generate the native interfaces from this.
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface ForegroundAppInfo {
  packageName: string;
  appName: string;
}

export interface Spec extends TurboModule {
  getCurrentForegroundApp(): Promise<ForegroundAppInfo | null>;
  addForegroundAppListener(callback: (appInfo: ForegroundAppInfo) => void): void;
  removeForegroundAppListener(): void;
}

const module = TurboModuleRegistry.get<Spec>('ForegroundAppModule');

if (!module) {
  console.warn('ForegroundAppModule TurboModule not found. Make sure it is properly registered.');
}

export default module;

