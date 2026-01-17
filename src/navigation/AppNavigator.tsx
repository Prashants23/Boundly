/**
 * App Navigation Setup
 * 
 * Why React Navigation v7:
 * - Native stack provides best performance
 * - Type-safe navigation with TypeScript
 * - Minimal overhead compared to other solutions
 * - Well-maintained and production-ready
 * 
 * Why native stack only:
 * - Simpler mental model
 * - Better performance (native transitions)
 * - Sufficient for MVP (max 3 navigation levels per rules)
 * 
 * Onboarding Flow:
 * - Checks onboarding completion on app start
 * - Shows onboarding if not completed
 * - Shows main app if completed
 * - Onboarding only runs once (persisted in MMKV)
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { checkUsageStatsPermission } from '../utils/permissions';
import { useBlockingService } from '../features/blocking/useBlockingService';
import BlockingScreen from '../features/blocking/BlockingScreen';
import { isOnboardingComplete } from '../features/onboarding/hooks/useOnboardingState';

// Onboarding Screens (flattened to avoid nested navigator depth)
import WelcomeScreen from '../features/onboarding/screens/WelcomeScreen';
import WhyAreYouHereScreen from '../features/onboarding/screens/WhyAreYouHereScreen';
import HowItWorksScreen from '../features/onboarding/screens/HowItWorksScreen';
import PermissionIntroScreen from '../features/onboarding/screens/PermissionIntroScreen';
import UsageAccessPermissionScreen from '../features/onboarding/screens/UsageAccessPermissionScreen';
import ForegroundServicePermissionScreen from '../features/onboarding/screens/ForegroundServicePermissionScreen';
import OnboardingCompleteScreen from '../features/onboarding/screens/OnboardingCompleteScreen';

// Main App Screens
import HomeScreen from '../features/appSelection/HomeScreen';
import PermissionsScreen from '../features/appSelection/PermissionsScreen';
import AppSelectionScreen from '../features/appSelection/AppSelectionScreen';
import LimitsScreen from '../features/limits/LimitsScreen';
import StatsScreen from '../features/stats/StatsScreen';

export type RootStackParamList = {
  // Onboarding screens (flattened)
  Welcome: undefined;
  WhyAreYouHere: undefined;
  HowItWorks: undefined;
  PermissionIntro: undefined;
  UsageAccessPermission: undefined;
  ForegroundServicePermission: undefined;
  OnboardingComplete: undefined;
  // Main app screens
  Home: undefined;
  AppSelection: undefined;
  Limits: undefined;
  Stats: undefined;
  Permissions: { returnTo?: 'Home' | 'AppSelection' } | undefined;
  Blocking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [mainAppInitialRoute, setMainAppInitialRoute] = useState<'Home' | 'Permissions'>('Home');
  const [isCheckingMainApp, setIsCheckingMainApp] = useState(false);
  const { blockedApp, clearBlock } = useBlockingService();

  // Check onboarding completion on mount
  useEffect(() => {
    // Check onboarding completion synchronously (MMKV is fast)
    const completed = isOnboardingComplete();
    setShowOnboarding(!completed);

    // If onboarding is complete, check permissions for main app initial route
    if (completed) {
      checkMainAppInitialRoute();
    }
  }, []);

  const checkMainAppInitialRoute = async () => {
    setIsCheckingMainApp(true);
    try {
      const hasPermission = await checkUsageStatsPermission();
      setMainAppInitialRoute(hasPermission ? 'Home' : 'Permissions');
    } catch (error) {
      console.error('Error checking initial permission:', error);
      setMainAppInitialRoute('Permissions');
    } finally {
      setIsCheckingMainApp(false);
    }
  };

  // Show nothing while checking onboarding state
  if (showOnboarding === null || (showOnboarding === false && isCheckingMainApp)) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={showOnboarding ? 'Welcome' : mainAppInitialRoute}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          {/* Onboarding Screens (flattened - no nested navigator) */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="WhyAreYouHere" component={WhyAreYouHereScreen} />
          <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
          <Stack.Screen name="PermissionIntro" component={PermissionIntroScreen} />
          <Stack.Screen name="UsageAccessPermission" component={UsageAccessPermissionScreen} />
          <Stack.Screen name="ForegroundServicePermission" component={ForegroundServicePermissionScreen} />
          <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
          
          {/* Main App Screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
          <Stack.Screen name="AppSelection" component={AppSelectionScreen} />
          <Stack.Screen name="Limits" component={LimitsScreen} />
          <Stack.Screen name="Stats" component={StatsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* Global blocking screen - shows on top of everything */}
      {blockedApp && (
        <BlockingScreen blockedApp={blockedApp} onDismiss={clearBlock} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

