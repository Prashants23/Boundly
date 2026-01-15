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
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  AppState,
  AppStateStatus,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../utils/theme';
import { checkUsageStatsPermission, openUsageStatsSettings } from '../../utils/permissions';
import { navigationEvents } from '../../utils/navigationEvents';
import UsageStatsModule from '../../native/UsageStatsModule';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type PermissionsScreenRouteProp = RouteProp<RootStackParamList, 'Permissions'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PermissionsScreen() {
  const theme = useTheme();
  const route = useRoute<PermissionsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [isChecking, setIsChecking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [hasCheckedInitial, setHasCheckedInitial] = useState(false);

  const returnTo = route.params?.returnTo || 'Home';

  // Check permission once on mount
  useEffect(() => {
    const checkInitial = async () => {
      try {
        console.log('PermissionsScreen: Checking initial permission state...');
        const granted = await checkUsageStatsPermission();
        console.log('PermissionsScreen: Initial permission state:', granted);
        setHasPermission(granted);
        setHasCheckedInitial(true);
        // If already granted, navigate away immediately (user shouldn't be here)
        if (granted) {
          console.log('PermissionsScreen: Permission already granted, navigating to:', returnTo);
          // Navigate immediately - no need to show this screen if permission is granted
          navigation.replace(returnTo as any);
        }
      } catch (error) {
        console.error('PermissionsScreen: Error checking initial permission:', error);
        setHasCheckedInitial(true);
      }
    };
    checkInitial();
  }, [returnTo, navigation]);

  // Check permission when app comes to foreground (user might have granted it in Settings)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [returnTo]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && hasCheckedInitial) {
      // User might have returned from Settings - check permission
      console.log('PermissionsScreen: App became active, checking permission...');
      checkPermission();
    }
  };

  const checkPermission = async () => {
    setIsChecking(true);
    try {
      console.log('PermissionsScreen: Checking permission...');
      const granted = await checkUsageStatsPermission();
      console.log('PermissionsScreen: Permission granted:', granted);
      setHasPermission(granted);
      if (granted) {
        console.log('PermissionsScreen: Permission granted, navigating to:', returnTo);
        // Small delay to show success state
        setTimeout(() => {
          // Emit event for any listeners
          navigationEvents.emitPermissionGranted(returnTo);
          // Navigate to the return screen
          navigation.replace(returnTo as any);
        }, 500);
      } else {
        console.log('PermissionsScreen: Permission not granted yet');
        setIsChecking(false);
      }
    } catch (error) {
      console.error('PermissionsScreen: Error checking permission:', error);
      setIsChecking(false);
    }
  };

  const handleOpenSettings = async () => {
    try {
      console.log('PermissionsScreen: Opening Usage Stats Settings...');
      console.log('PermissionsScreen: UsageStatsModule available?', !!UsageStatsModule);
      
      if (!UsageStatsModule) {
        console.error('PermissionsScreen: UsageStatsModule is null!');
        // Try fallback immediately
        await Linking.openSettings();
        return;
      }

      console.log('PermissionsScreen: Calling openUsageStatsSettings on native module...');
      await UsageStatsModule.openUsageStatsSettings();
      console.log('PermissionsScreen: Settings opened successfully - Android Settings should be visible now');
      // Don't check permission immediately - wait for user to come back from Settings
    } catch (error) {
      console.error('PermissionsScreen: Error opening usage stats settings:', error);
      console.error('PermissionsScreen: Error details:', JSON.stringify(error, null, 2));
      
      // Fallback: try to open general settings
      try {
        console.log('PermissionsScreen: Trying fallback - opening general settings via Linking');
        await Linking.openSettings();
        console.log('PermissionsScreen: General settings opened via Linking');
      } catch (fallbackError) {
        console.error('PermissionsScreen: Fallback also failed:', fallbackError);
        // Show error to user with instructions
        Alert.alert(
          'Cannot Open Settings',
          'Please manually go to:\nSettings > Apps > Special access > Usage access\n\nThen find "Boundly" and enable it.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  // Show loading only if checking and we haven't shown the screen yet
  if (isChecking && !hasCheckedInitial) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.checkingText, { color: theme.colors.textSecondary }]}>
          Checking permission...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Permission Required
        </Text>

        <View style={styles.explanationContainer}>
          <Text style={[styles.explanation, { color: theme.colors.text }]}>
            Boundly needs access to your app usage data to help you track and limit
            distracting apps.
          </Text>
          <Text style={[styles.explanation, { color: theme.colors.text }]}>
            This data stays on your device and is never shared.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          <Text style={[styles.stepsTitle, { color: theme.colors.text }]}>
            How to grant permission:
          </Text>
          <View style={styles.step}>
            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>1</Text>
            <Text style={[styles.stepText, { color: theme.colors.text }]}>
              Tap the button below
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>2</Text>
            <Text style={[styles.stepText, { color: theme.colors.text }]}>
                      Find "Boundly" in the list
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>3</Text>
            <Text style={[styles.stepText, { color: theme.colors.text }]}>
              Toggle the switch to enable
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleOpenSettings}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkPermission}
          activeOpacity={0.6}>
          <Text style={[styles.checkButtonText, { color: theme.colors.primary }]}>
            I've granted permission
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  explanationContainer: {
    marginBottom: 32,
  },
  explanation: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'currentColor',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  checkButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkingText: {
    marginTop: 16,
    fontSize: 14,
  },
});

