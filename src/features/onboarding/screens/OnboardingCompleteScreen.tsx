/**
 * Onboarding Complete Screen - Onboarding Screen 6
 * 
 * Why this screen exists:
 * - Signal completion
 * - Reduce cognitive load
 * - Avoid dopamine-driven "success" patterns
 * 
 * Design Principles:
 * - Calm confirmation message
 * - Explain permissions can be changed later
 * - Persist onboarding completion flag (MMKV)
 * - No upsells, confetti, or forced actions
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OnboardingButton from '../components/OnboardingButton';
import { markOnboardingComplete } from '../hooks/useOnboardingState';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OnboardingCompleteScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    markOnboardingComplete();
    
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  return (
    <View 
      className="flex-1 justify-between bg-bg-primary p-6 dark:bg-bg-primary"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }}
    >
      <View className="flex-1 justify-center px-4">
        <Text className="mb-4 text-center text-[32px] font-bold text-text-primary dark:text-text-primary">
          You're All Set
        </Text>

        <Text className="mb-8 text-center text-base leading-6 text-text-secondary dark:text-text-secondary">
          Boundly is ready to help you stay focused. You can change permissions anytime in your device settings.
        </Text>

        <View className="rounded-xl border border-border bg-surface p-5 dark:border-border dark:bg-surface">
          <Text className="text-[15px] leading-6 text-text-secondary dark:text-text-secondary">
            To get started:{'\n'}
            • Select apps you want to limit{'\n'}
            • Set daily time limits{'\n'}
            • Start tracking your usage
          </Text>
        </View>
      </View>

      <View>
        <OnboardingButton
          label="Get Started"
          onPress={handleContinue}
          variant="primary"
        />
      </View>
    </View>
  );
}
