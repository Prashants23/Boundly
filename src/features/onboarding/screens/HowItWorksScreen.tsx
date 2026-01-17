/**
 * How It Works Screen - Onboarding Screen 2
 * 
 * Why this screen exists:
 * - Give the user a simple, accurate mental model
 * - Reduce fear around "blocking apps"
 * - Avoid technical language
 * 
 * Design Principles:
 * - Exactly 3 static steps, text-only
 * - Neutral, non-authoritative language
 * - No permissions requested
 * - No system state checks
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OnboardingButton from '../components/OnboardingButton';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const STEPS = [
  {
    number: 1,
    text: 'Select the apps you want to limit',
  },
  {
    number: 2,
    text: 'Set daily time limits for each app',
  },
  {
    number: 3,
    text: 'Get a gentle reminder when you reach your limit',
  },
];

export default function HowItWorksScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    navigation.navigate('PermissionIntro');
  };

  return (
    <View 
      className="flex-1 justify-between bg-bg-primary p-6 dark:bg-bg-primary"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }}
    >
      <View className="flex-1 justify-center px-4">
        <Text className="mb-10 text-center text-[28px] font-bold text-text-primary dark:text-text-primary">
          How It Works
        </Text>

        <View className="gap-6">
          {STEPS.map((step) => (
            <View key={step.number} className="flex-row items-center gap-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-gold">
                <Text className="text-xl font-bold text-bg-primary">
                  {step.number}
                </Text>
              </View>
              <Text className="flex-1 text-base leading-6 text-text-primary dark:text-text-primary">
                {step.text}
              </Text>
            </View>
          ))}
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
