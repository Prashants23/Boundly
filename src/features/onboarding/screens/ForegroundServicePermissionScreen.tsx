/**
 * Foreground Service Permission Screen - Onboarding Screen 5
 * 
 * Why this screen exists:
 * Android requires a persistent notification for foreground services.
 * Users must know why it exists and what it means.
 * 
 * Android-Specific Behavior:
 * - Some Android versions auto-grant foreground service permission
 * - Notification is required by Android (not optional)
 * - Service type: FOREGROUND_SERVICE_SPECIAL_USE
 * - User can dismiss notification but service continues
 * 
 * Design Principles:
 * - Explain why notification is required
 * - Set expectations about what user will see
 * - Handle denial gracefully (don't block progress)
 * - Use non-alarming language
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OnboardingButton from '../components/OnboardingButton';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ForegroundServicePermissionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    navigation.navigate('OnboardingComplete');
  };

  return (
    <View 
      className="flex-1 justify-between bg-bg-primary p-6 dark:bg-bg-primary"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }}
    >
      <View className="flex-1 justify-center px-4">
        <Text className="mb-4 text-center text-[28px] font-bold text-text-primary dark:text-text-primary">
          Background Monitoring
        </Text>

        <Text className="mb-6 text-center text-base leading-6 text-text-secondary dark:text-text-secondary">
          To track your app usage, Boundly needs to run in the background. Android requires a persistent notification when this happens.
        </Text>

        <View className="mb-4 rounded-xl border border-border bg-surface p-5 dark:border-border dark:bg-surface">
          <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary">
            What you'll see:
          </Text>
          <Text className="text-sm leading-5 text-text-secondary dark:text-text-secondary">
            A notification will appear when you set app limits. This is required by Android and lets you know the service is running.
          </Text>
          <Text className="mt-2 text-sm leading-5 text-text-secondary dark:text-text-secondary">
            You can minimize or dismiss it, but the service will continue running to monitor your usage.
          </Text>
        </View>

        <View className="rounded-lg bg-surface/50 p-4 dark:bg-surface/50">
          <Text className="text-center text-sm leading-5 text-text-secondary dark:text-text-secondary">
            💡 Tip: The notification only appears when you have active app limits set.
          </Text>
        </View>
      </View>

      <View>
        <OnboardingButton
          label="Continue"
          onPress={handleContinue}
          variant="primary"
        />
      </View>
    </View>
  );
}
