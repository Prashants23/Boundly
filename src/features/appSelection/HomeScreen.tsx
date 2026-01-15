/**
 * Home Screen - Entry point
 * 
 * This will be the main screen where users:
 * - See current status
 * - Navigate to app selection
 * - View stats
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../utils/theme';
import { checkUsageStatsPermission } from '../../utils/permissions';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppStore } from '../../stores/useAppStore';
import { useLimitsStore } from '../../stores/useLimitsStore';
import { useBlockingService } from '../blocking/useBlockingService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [isChecking, setIsChecking] = useState(true);
  const selectedApps = useAppStore((state) => state.selectedApps);
  const limits = useLimitsStore((state) => state.limits);
  const { isAccessibilityEnabled, checkAccessibilityStatus, openAccessibilitySettings } = useBlockingService();

  // Check permission when screen is focused (user might have granted it)
  useEffect(() => {
    checkPermissionAndNavigate();
  }, []);

  // Also check when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkPermissionAndNavigate();
      checkAccessibilityStatus(); // Check accessibility when screen is focused
    });
    return unsubscribe;
  }, [navigation, checkAccessibilityStatus]);

  // Check accessibility when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkAccessibilityStatus();
      }
    });
    return () => subscription.remove();
  }, [checkAccessibilityStatus]);

  const checkPermissionAndNavigate = async () => {
    try {
      const hasPermission = await checkUsageStatsPermission();
      if (!hasPermission) {
        // Navigate to permissions screen
        navigation.replace('Permissions', {
          returnTo: 'Home',
        });
      }
    } catch (error) {
      console.error('Error checking permission:', error);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  const activeAppsCount = selectedApps.filter(
    (app) => limits[app.packageName] && limits[app.packageName] > 0,
  ).length;

  const needsAccessibility = activeAppsCount > 0 && !isAccessibilityEnabled;

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Boundly
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {activeAppsCount > 0
            ? `${activeAppsCount} app${activeAppsCount !== 1 ? 's' : ''} being tracked`
            : 'Select apps and set limits to get started'}
        </Text>

        {needsAccessibility && (
          <View style={[styles.warningContainer, { backgroundColor: theme.colors.surface, borderColor: '#FFA500' }]}>
            <Text style={[styles.warningTitle, { color: theme.colors.text }]}>
              ⚠️ Enable App Blocking
            </Text>
            <Text style={[styles.warningText, { color: theme.colors.textSecondary }]}>
              To prevent blocked apps from launching, you need to enable the Accessibility Service.
            </Text>
            <Text style={[styles.warningText, { color: theme.colors.textSecondary, marginTop: 8 }]}>
              Tap the button below, then find "Boundly" and enable it.
            </Text>
            <TouchableOpacity
              style={[styles.warningButton, { backgroundColor: theme.colors.primary }]}
              onPress={openAccessibilitySettings}
              activeOpacity={0.8}>
              <Text style={styles.warningButtonText}>Open Accessibility Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkButton}
              onPress={checkAccessibilityStatus}
              activeOpacity={0.6}>
              <Text style={[styles.checkButtonText, { color: theme.colors.primary }]}>
                I've enabled it
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('AppSelection')}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Select Apps</Text>
          </TouchableOpacity>

          {selectedApps.length > 0 && (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
              ]}
              onPress={() => navigation.navigate('Limits')}
              activeOpacity={0.8}>
              <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                Set Limits
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border },
            ]}
            onPress={() => navigation.navigate('Stats')}
            activeOpacity={0.8}>
            <Text style={[styles.buttonText, { color: theme.colors.text }]}>
              View Stats
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  warningContainer: {
    width: '100%',
    maxWidth: 300,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  warningButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  warningButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  checkButton: {
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  checkButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

