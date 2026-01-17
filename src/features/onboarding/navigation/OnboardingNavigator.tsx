/**
 * Onboarding Navigator
 * 
 * Separate navigation stack for onboarding flow.
 * 
 * Why separate navigator:
 * - Clean separation of concerns
 * - Easy to conditionally render
 * - Can be replaced entirely after completion
 * - Type-safe navigation
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingNavigationParams } from '../types';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import PermissionIntroScreen from '../screens/PermissionIntroScreen';
import UsageAccessPermissionScreen from '../screens/UsageAccessPermissionScreen';
import ForegroundServicePermissionScreen from '../screens/ForegroundServicePermissionScreen';
import OnboardingCompleteScreen from '../screens/OnboardingCompleteScreen';

const Stack = createNativeStackNavigator<OnboardingNavigationParams>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
      <Stack.Screen name="PermissionIntro" component={PermissionIntroScreen} />
      <Stack.Screen name="UsageAccessPermission" component={UsageAccessPermissionScreen} />
      <Stack.Screen name="ForegroundServicePermission" component={ForegroundServicePermissionScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
    </Stack.Navigator>
  );
}

