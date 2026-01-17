/**
 * Permissions Screen
 * 
 * Explains why usage stats permission is needed and guides user to Settings
 * 
 * UX Considerations:
 * - Clear, non-aggressive explanation
 * - Single call-to-action button
 * - No dark patterns or manipulative language
 * - Play Store compliant messaging
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  AppState,
  AppStateStatus,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { checkUsageStatsPermission } from '../../utils/permissions';
import { navigationEvents } from '../../utils/navigationEvents';
import UsageStatsModule from '../../native/UsageStatsModule';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type PermissionsScreenRouteProp = RouteProp<RootStackParamList, 'Permissions'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PermissionsScreen() {
  const route = useRoute<PermissionsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [isChecking, setIsChecking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false);

  const returnTo = route.params?.returnTo || 'Home';

  useEffect(() => {
    const checkInitial = async () => {
      try {
        const granted = await checkUsageStatsPermission();
        setHasPermission(granted);
        setHasCheckedInitial(true);
        if (granted) {
          navigation.replace(returnTo as any);
        }
      } catch (error) {
        console.error('PermissionsScreen: Error checking initial permission:', error);
        setHasCheckedInitial(true);
      }
    };
    checkInitial();
  }, [returnTo, navigation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [returnTo]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && hasCheckedInitial) {
      checkPermission();
    }
  };

  const checkPermission = async () => {
    setIsChecking(true);
    try {
      const granted = await checkUsageStatsPermission();
      setHasPermission(granted);
      if (granted) {
        setTimeout(() => {
          navigationEvents.emitPermissionGranted(returnTo);
          navigation.replace(returnTo as any);
        }, 500);
      } else {
        setIsChecking(false);
      }
    } catch (error) {
      console.error('PermissionsScreen: Error checking permission:', error);
      setIsChecking(false);
    }
  };

  const handleOpenSettings = async () => {
    try {
      if (!UsageStatsModule) {
        await Linking.openSettings();
        return;
      }
      await UsageStatsModule.openUsageStatsSettings();
    } catch (error) {
      try {
        await Linking.openSettings();
      } catch (fallbackError) {
        Alert.alert(
          'Cannot Open Settings',
          'Please manually go to:\nSettings > Apps > Special access > Usage access\n\nThen find "Boundly" and enable it.',
          [{ text: 'OK' }]
        );
      }
    }
  };

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
      className="flex-1 items-center justify-center bg-bg-primary p-6 dark:bg-bg-primary"
      style={{ paddingTop: insets.top }}
    >
      <View className="w-full max-w-[400px]">
        <Text className="mb-6 text-center text-[28px] font-bold text-text-primary dark:text-text-primary">
          Permission Required
        </Text>

        <View className="mb-8">
          <Text className="mb-3 text-center text-base leading-6 text-text-primary dark:text-text-primary">
            Boundly needs access to your app usage data to help you track and limit
            distracting apps.
          </Text>
          <Text className="text-center text-base leading-6 text-text-primary dark:text-text-primary">
            This data stays on your device and is never shared.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold text-text-primary dark:text-text-primary">
            How to grant permission:
          </Text>
          
          <View className="mb-3 flex-row items-center">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full border-2 border-brand-gold">
              <Text className="text-xl font-bold text-brand-gold">1</Text>
            </View>
            <Text className="flex-1 text-base text-text-primary dark:text-text-primary">
              Tap the button below
            </Text>
          </View>
          
          <View className="mb-3 flex-row items-center">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full border-2 border-brand-gold">
              <Text className="text-xl font-bold text-brand-gold">2</Text>
            </View>
            <Text className="flex-1 text-base text-text-primary dark:text-text-primary">
              Find "Boundly" in the list
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full border-2 border-brand-gold">
              <Text className="text-xl font-bold text-brand-gold">3</Text>
            </View>
            <Text className="flex-1 text-base text-text-primary dark:text-text-primary">
              Toggle the switch to enable
            </Text>
          </View>
        </View>

        <Pressable
          className="mb-4 items-center rounded-lg bg-brand-gold px-8 py-4 active:bg-brand-goldDark"
          onPress={handleOpenSettings}
        >
          <Text className="text-base font-semibold text-bg-primary">
            Open Settings
          </Text>
        </Pressable>

        <Pressable
          className="items-center py-3"
          onPress={checkPermission}
        >
          <Text className="text-sm font-medium text-brand-gold">
            I've granted permission
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
