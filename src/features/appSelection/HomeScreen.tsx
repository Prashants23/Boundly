/**
 * Home Screen - Entry point
 * 
 * This will be the main screen where users:
 * - See current status
 * - Navigate to app selection
 * - View stats
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, AppState } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { checkUsageStatsPermission } from '../../utils/permissions';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppStore } from '../../stores/useAppStore';
import { useLimitsStore } from '../../stores/useLimitsStore';
import { useBlockingService } from '../blocking/useBlockingService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [isChecking, setIsChecking] = useState(true);
  const selectedApps = useAppStore((state) => state.selectedApps);
  const limits = useLimitsStore((state) => state.limits);
  const { isAccessibilityEnabled, checkAccessibilityStatus, openAccessibilitySettings } = useBlockingService();

  useEffect(() => {
    checkPermissionAndNavigate();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkPermissionAndNavigate();
      checkAccessibilityStatus();
    });
    return unsubscribe;
  }, [navigation, checkAccessibilityStatus]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkAccessibilityStatus();
      }
    });
    return () => subscription.remove();
  }, [checkAccessibilityStatus]);

  const checkPermissionAndNavigate = async () => {
    try {
      const hasPermission = await checkUsageStatsPermission();
      if (!hasPermission) {
        navigation.replace('Permissions', {
          returnTo: 'Home',
        });
      }
    } catch (error) {
      console.error('Error checking permission:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View 
        className="flex-1 items-center justify-center bg-bg-primary p-6 dark:bg-bg-primary"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-base text-text-secondary dark:text-text-secondary">
          Loading...
        </Text>
      </View>
    );
  }

  const activeAppsCount = selectedApps.filter(
    (app) => limits[app.packageName] && limits[app.packageName] > 0,
  ).length;

  const needsAccessibility = activeAppsCount > 0 && !isAccessibilityEnabled;

  return (
    <View 
      className="flex-1 items-center justify-center bg-bg-primary p-6 dark:bg-bg-primary"
      style={{ paddingTop: insets.top }}
    >
      <Text className="mb-2 text-[32px] font-bold text-text-primary dark:text-text-primary">
        Boundly
      </Text>
      <Text className="mb-8 text-center text-base text-text-secondary dark:text-text-secondary">
        {activeAppsCount > 0
          ? `${activeAppsCount} app${activeAppsCount !== 1 ? 's' : ''} being tracked`
          : 'Select apps and set limits to get started'}
      </Text>

      {needsAccessibility && (
        <View className="mb-6 w-full max-w-[300px] rounded-xl border-2 border-status-warning bg-surface p-4 dark:bg-surface">
          <Text className="mb-2 text-lg font-bold text-text-primary dark:text-text-primary">
            ⚠️ Enable App Blocking
          </Text>
          <Text className="mb-1 text-sm leading-5 text-text-secondary dark:text-text-secondary">
            To prevent blocked apps from launching, you need to enable the Accessibility Service.
          </Text>
          <Text className="mt-2 text-sm leading-5 text-text-secondary dark:text-text-secondary">
            Tap the button below, then find "Boundly" and enable it.
          </Text>
          <Pressable
            className="mt-3 items-center rounded-lg bg-brand-gold px-6 py-3 active:bg-brand-goldDark"
            onPress={openAccessibilitySettings}
          >
            <Text className="text-sm font-semibold text-bg-primary">
              Open Accessibility Settings
            </Text>
          </Pressable>
          <Pressable
            className="mt-2 items-center py-2"
            onPress={checkAccessibilityStatus}
          >
            <Text className="text-xs font-medium text-brand-gold">
              I've enabled it
            </Text>
          </Pressable>
        </View>
      )}

      <View className="w-full max-w-[300px] gap-3">
        <Pressable
          className="items-center rounded-lg bg-brand-gold px-8 py-4 active:bg-brand-goldDark"
          onPress={() => navigation.navigate('AppSelection')}
        >
          <Text className="text-base font-semibold text-bg-primary">
            Select Apps
          </Text>
        </Pressable>

        {selectedApps.length > 0 && (
          <Pressable
            className="items-center rounded-lg border border-border bg-surface px-8 py-4 active:bg-surface-hover dark:border-border dark:bg-surface"
            onPress={() => navigation.navigate('Limits')}
          >
            <Text className="text-base font-semibold text-text-primary dark:text-text-primary">
              Set Limits
            </Text>
          </Pressable>
        )}

        <Pressable
          className="items-center rounded-lg border border-border bg-surface px-8 py-4 active:bg-surface-hover dark:border-border dark:bg-surface"
          onPress={() => navigation.navigate('Stats')}
        >
          <Text className="text-base font-semibold text-text-primary dark:text-text-primary">
            View Stats
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
