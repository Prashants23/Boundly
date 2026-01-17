/**
 * Usage Access Permission Screen - Onboarding Screen 4
 * 
 * Why this screen exists:
 * Usage Access is a HIGH-RISK permission and is closely reviewed on Play Store.
 * 
 * Android-Specific Behavior:
 * - Special permission (not runtime)
 * - Must be granted via Settings app
 * - Cannot be requested programmatically
 * - User must manually toggle in Settings
 * 
 * Play Store Compliance:
 * - Must explain why it's required
 * - Must allow skipping
 * - Must not create retry loops
 * - Must detect return from Settings
 * 
 * User Freedom:
 * - "Skip for now" option always available
 * - Skipping allows app continuation
 */

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OnboardingButton from '../components/OnboardingButton';
import { useUsageAccessPermission } from '../hooks/useUsageAccessPermission';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function UsageAccessPermissionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handlePermissionGranted = () => {
    navigation.navigate('ForegroundServicePermission');
  };

  const {
    hasPermission,
    isChecking,
    hasCheckedInitial,
    checkPermission,
    openSettings,
  } = useUsageAccessPermission(handlePermissionGranted);

  useEffect(() => {
    if (hasCheckedInitial && hasPermission && !isChecking) {
      const timer = setTimeout(() => {
        navigation.navigate('ForegroundServicePermission');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasCheckedInitial, hasPermission, isChecking, navigation]);

  const handleOpenSettings = () => {
    openSettings();
  };

  const handleSkip = () => {
    navigation.navigate('ForegroundServicePermission');
  };

  const handleCheckAgain = () => {
    checkPermission();
  };

  // Loading state
  if (isChecking && !hasCheckedInitial) {
    return (
      <View 
        className="flex-1 items-center justify-center bg-bg-primary dark:bg-bg-primary"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#E5C547" />
        <Text className="mt-4 text-sm text-text-secondary dark:text-text-secondary">
          Checking permission...
        </Text>
      </View>
    );
  }

  return (
    <View 
      className="flex-1 justify-between bg-bg-primary p-6 dark:bg-bg-primary"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }}
    >
      <View className="flex-1 justify-center px-4">
        <Text className="mb-4 text-center text-[28px] font-bold text-text-primary dark:text-text-primary">
          Usage Access Permission
        </Text>

        <Text className="mb-6 text-center text-base leading-6 text-text-secondary dark:text-text-secondary">
          Boundly needs access to your app usage data to track how much time you spend in each app.
        </Text>

        <View className="mb-4 rounded-xl border border-border bg-surface p-5 dark:border-border dark:bg-surface">
          <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary">
            How to grant permission:
          </Text>
          <Text className="text-sm leading-5 text-text-secondary dark:text-text-secondary">
            1. Tap "Open Settings" below{'\n'}
            2. Find "Boundly" in the list{'\n'}
            3. Toggle the switch to enable
          </Text>
        </View>

        {hasPermission && (
          <View className="items-center rounded-lg bg-status-successBg p-4">
            <Text className="text-base font-semibold text-status-success">
              ✓ Permission granted
            </Text>
          </View>
        )}
      </View>

      <View className="gap-3">
        {!hasPermission ? (
          <>
            <OnboardingButton
              label="Open Settings"
              onPress={handleOpenSettings}
              variant="primary"
              loading={isChecking}
            />
            <OnboardingButton
              label="I've granted permission"
              onPress={handleCheckAgain}
              variant="secondary"
              loading={isChecking}
            />
            <OnboardingButton
              label="Skip for now"
              onPress={handleSkip}
              variant="secondary"
            />
          </>
        ) : (
          <OnboardingButton
            label="Continue"
            onPress={() => navigation.navigate('ForegroundServicePermission')}
            variant="primary"
          />
        )}
      </View>
    </View>
  );
}
