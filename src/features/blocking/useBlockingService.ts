/**
 * Blocking Service Hook
 * 
 * Controls the Android foreground service that monitors and blocks apps.
 * 
 * How it works:
 * 1. Starts a foreground service that runs continuously
 * 2. Service monitors foreground app every 2 seconds
 * 3. When blocked app detected, service brings Boundly to foreground
 * 4. This hook shows the blocking screen when app is brought to foreground
 */

import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import BlockingServiceModule from '../../native/BlockingServiceModule';
import ForegroundAppModule from '../../native/ForegroundAppModule';
import { useAppStore } from '../../stores/useAppStore';
import { useLimitsStore } from '../../stores/useLimitsStore';
import { useUsageStore } from '../../stores/useUsageStore';

export interface BlockedApp {
  packageName: string;
  appName: string;
  usageMs: number;
  limitMs: number;
}

export function useBlockingService() {
  const [blockedApp, setBlockedApp] = useState<BlockedApp | null>(null);
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);
  
  const selectedApps = useAppStore((state) => state.selectedApps);
  const limits = useLimitsStore((state) => state.limits);

  // Check if service and accessibility are enabled on mount
  useEffect(() => {
    checkServiceStatus();
    checkAccessibilityStatus();
  }, []);

  const checkServiceStatus = async () => {
    try {
      if (!BlockingServiceModule) {
        console.log('BlockingService: Module not available');
        return;
      }
      const running = await BlockingServiceModule.isBlockingServiceRunning();
      setIsServiceRunning(running);
      console.log('BlockingService: Service running:', running);
    } catch (error) {
      console.error('BlockingService: Error checking service status:', error);
    }
  };

  const checkAccessibilityStatus = async () => {
    try {
      if (!BlockingServiceModule) {
        return;
      }
      const enabled = await BlockingServiceModule.isAccessibilityServiceEnabled();
      setIsAccessibilityEnabled(enabled);
      console.log('BlockingService: Accessibility enabled:', enabled);
    } catch (error) {
      console.error('BlockingService: Error checking accessibility status:', error);
    }
  };

  const openAccessibilitySettings = async () => {
    try {
      if (!BlockingServiceModule) {
        return;
      }
      await BlockingServiceModule.openAccessibilitySettings();
      console.log('BlockingService: Opened accessibility settings');
    } catch (error) {
      console.error('BlockingService: Error opening accessibility settings:', error);
    }
  };

  // Start/stop service when selected apps or limits change
  useEffect(() => {
    if (!BlockingServiceModule) {
      return;
    }

    // Check if we have active limits
    const hasActiveLimits = selectedApps.some((app) => {
      const limit = limits[app.packageName];
      return limit !== undefined && limit > 0;
    });

    if (hasActiveLimits) {
      startService();
    } else {
      stopService();
    }
  }, [selectedApps, limits]);

  // Check for blocked app when app comes to foreground (brought here by service)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkForBlockedApp();
      }
    });

    // Also check immediately if app is already active
    if (AppState.currentState === 'active') {
      checkForBlockedApp();
    }

    return () => subscription.remove();
  }, [selectedApps, limits]);

  const checkForBlockedApp = async () => {
    try {
      if (!ForegroundAppModule) {
        return;
      }

      const hasActiveLimits = selectedApps.some((app) => {
        const limit = limits[app.packageName];
        return limit !== undefined && limit > 0;
      });

      if (!hasActiveLimits) {
        setBlockedApp(null);
        return;
      }

      // Refresh usage to get latest data
      const { refreshUsage } = useUsageStore.getState();
      if (refreshUsage) {
        await refreshUsage();
      }

      // Check all selected apps to see if any are blocked
      const usageStoreState = useUsageStore.getState();
      const currentUsage = usageStoreState?.todayUsage || {};

      for (const app of selectedApps) {
        const limitMs = limits[app.packageName];
        if (!limitMs || limitMs === 0) {
          continue;
        }

        const usageMs = currentUsage[app.packageName] || 0;

        if (usageMs >= limitMs) {
          // Check if this app is currently in foreground
          const foregroundApp = await ForegroundAppModule.getCurrentForegroundApp();
          
          // If service brought us here, the blocked app might not be foreground anymore
          // But we should still show blocking screen if usage exceeds limit
          // Check if the blocked app was recently in foreground or if we were brought here by service
          if (foregroundApp?.packageName === app.packageName || !foregroundApp) {
            // Show blocking screen for this app
            console.log('BlockingService: Showing blocking screen for:', app.packageName);
            setBlockedApp({
              packageName: app.packageName,
              appName: app.appName,
              usageMs,
              limitMs,
            });
            return; // Show blocking for first blocked app found
          }
        }
      }

      // No blocked apps found
      setBlockedApp(null);
    } catch (error) {
      console.error('BlockingService: Error checking for blocked app:', error);
    }
  };

  const startService = async () => {
    try {
      if (!BlockingServiceModule) {
        console.error('BlockingService: Module not available');
        return;
      }

      // Prepare data for service
      const appPackageNames = selectedApps.map((app) => app.packageName);
      const limitsArray: Array<{ packageName: string; limitMs: number }> = [];
      
      selectedApps.forEach((app) => {
        const limit = limits[app.packageName];
        if (limit && limit > 0) {
          limitsArray.push({
            packageName: app.packageName,
            limitMs: limit,
          });
        }
      });

      if (appPackageNames.length === 0 || limitsArray.length === 0) {
        console.log('BlockingService: No apps to block, stopping service');
        await stopService();
        return;
      }

      console.log('BlockingService: Starting service with', {
        apps: appPackageNames.length,
        limits: limitsArray.length,
      });

      // Use TurboModule - pass as array
      await BlockingServiceModule.startBlockingService(appPackageNames, limitsArray);
      setIsServiceRunning(true);
      console.log('BlockingService: Service started successfully');
    } catch (error) {
      console.error('BlockingService: Error starting service:', error);
      setIsServiceRunning(false);
    }
  };

  const stopService = async () => {
    try {
      if (!BlockingServiceModule) {
        return;
      }

      console.log('BlockingService: Stopping service');
      await BlockingServiceModule.stopBlockingService();
      setIsServiceRunning(false);
      setBlockedApp(null);
      console.log('BlockingService: Service stopped');
    } catch (error) {
      console.error('BlockingService: Error stopping service:', error);
    }
  };

  return {
    blockedApp,
    isServiceRunning,
    isAccessibilityEnabled,
    clearBlock: () => setBlockedApp(null),
    startService,
    stopService,
    checkAccessibilityStatus,
    openAccessibilitySettings,
  };
}
