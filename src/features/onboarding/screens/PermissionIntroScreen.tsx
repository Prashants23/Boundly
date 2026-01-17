/**
 * Permission Intro Screen - Onboarding Screen 3
 * 
 * Why this screen exists:
 * Android permissions feel scary.
 * This screen prepares the user BEFORE the OS takes over.
 * 
 * Design Principles:
 * - Explain permissions without requesting them
 * - Use reusable PermissionCard components
 * - Clearly state what the app does NOT do
 * - Build trust before system dialogs
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import OnboardingButton from '../components/OnboardingButton';
import PermissionCard from '../components/PermissionCard';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PermissionIntroScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    navigation.navigate('UsageAccessPermission');
  };

  return (
    <View 
      className="flex-1 bg-bg-primary dark:bg-bg-primary"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <Text className="mb-3 text-center text-[28px] font-bold text-text-primary dark:text-text-primary">
            Permissions We Need
          </Text>

          <Text className="mb-8 text-center text-base leading-6 text-text-secondary dark:text-text-secondary">
            To help you stay focused, we need a couple of permissions. Here's what they do:
          </Text>

          <View className="mb-6">
            <PermissionCard
              icon="📱"
              title="Usage Access"
              description="We use this to know which app you're currently using, so we can track time and show reminders when you reach your limit."
              whatWeDontDo="We don't see what you do inside apps, read your messages, or access your personal data."
            />

            <PermissionCard
              icon="🔔"
              title="Foreground Service"
              description="This keeps the app running in the background so we can monitor your app usage. Android requires a persistent notification when this is active."
              whatWeDontDo="We don't collect data in the background or share it with anyone. Everything stays on your device."
            />
          </View>
        </View>
      </ScrollView>

      <View 
        className="px-6 pb-8 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 32) }}
      >
        <OnboardingButton
          label="Continue"
          onPress={handleContinue}
          variant="primary"
        />
      </View>
    </View>
  );
}
