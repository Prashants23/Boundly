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
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { checkUsageStatsPermission } from '../utils/permissions';
import { useBlockingService } from '../features/blocking/useBlockingService';
import BlockingScreen from '../features/blocking/BlockingScreen';

// Screens
import HomeScreen from '../features/appSelection/HomeScreen';
import PermissionsScreen from '../features/appSelection/PermissionsScreen';
import AppSelectionScreen from '../features/appSelection/AppSelectionScreen';
import LimitsScreen from '../features/limits/LimitsScreen';
import StatsScreen from '../features/stats/StatsScreen';

export type RootStackParamList = {
  Home: undefined;
  AppSelection: undefined;
  Limits: undefined;
  Stats: undefined;
  Permissions: { returnTo?: 'Home' | 'AppSelection' } | undefined;
  Blocking: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState<'Home' | 'Permissions'>('Home');
  const [isChecking, setIsChecking] = useState(true);
  const { blockedApp, clearBlock } = useBlockingService();

  useEffect(() => {
    checkInitialPermission();
  }, []);

  const checkInitialPermission = async () => {
    try {
      const hasPermission = await checkUsageStatsPermission();
      setInitialRoute(hasPermission ? 'Home' : 'Permissions');
    } catch (error) {
      console.error('Error checking initial permission:', error);
      setInitialRoute('Permissions'); // Default to permissions screen on error
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return null; // Or a loading screen
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false, // We'll add custom headers later if needed
            animation: 'slide_from_right',
          }}>
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

