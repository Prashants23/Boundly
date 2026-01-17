/**
 * App Selection Screen
 * 
 * Allows users to select apps to track and limit
 * 
 * UX Considerations:
 * - Simple list of installed apps with usage
 * - Toggle to select/deselect
 * - Shows current usage for context
 * - Minimal, clean interface
 */

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Switch,
  AppState,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppStore } from '../../stores/useAppStore';
import { useUsageStore } from '../../stores/useUsageStore';
import { checkUsageStatsPermission } from '../../utils/permissions';
import UsageStatsModule from '../../native/UsageStatsModule';
import type { UsageStat } from '../../native/UsageStatsModule';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AppSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [apps, setApps] = useState<UsageStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedApps = useAppStore((state) => state.selectedApps);
  const addApp = useAppStore((state) => state.addApp);
  const removeApp = useAppStore((state) => state.removeApp);
  const isSelected = useAppStore((state) => state.isSelected);
  const refreshUsage = useUsageStore((state) => state.refreshUsage);

  const hasCheckedOnFocus = React.useRef(false);
  
  useFocusEffect(
    React.useCallback(() => {
      if (!hasCheckedOnFocus.current) {
        hasCheckedOnFocus.current = true;
        checkPermissionAndLoad();
      }
    }, []),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissionAndLoad();
      }
    });
    return () => subscription.remove();
  }, []);

  const checkPermissionAndLoad = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const permissionGranted = await checkUsageStatsPermission();
      setHasPermission(permissionGranted);
      
      if (!permissionGranted) {
        setIsLoading(false);
        navigation.replace('Permissions', {
          returnTo: 'AppSelection',
        });
        return;
      }
      
      await loadApps();
    } catch (error) {
      setError('Failed to check permissions. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const permissionGranted = await checkUsageStatsPermission();
      setHasPermission(permissionGranted);
      
      if (!permissionGranted) {
        setIsLoading(false);
        navigation.replace('Permissions', {
          returnTo: 'AppSelection',
        });
        return;
      }
      
      await loadApps();
    } catch (error) {
      setError('Failed to retry. Please check permissions and try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasPermission) {
      loadApps();
    }
  }, [hasPermission]);

  const loadApps = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!UsageStatsModule) {
        throw new Error('UsageStatsModule is not available');
      }

      const stats = await UsageStatsModule.getTodayUsageStats();
      
      if (!stats || stats.length === 0) {
        setError(
          'No usage data found yet.\n\n' +
          'This is normal if you just granted permission. Android needs a few minutes to collect usage data.\n\n' +
          'Try:\n' +
          '• Wait 2-3 minutes, then tap Retry\n' +
          '• Open and use some apps, then come back\n' +
          '• Make sure "Boundly" is enabled in Settings > Apps > Special access > Usage access'
        );
        setApps([]);
        setIsLoading(false);
        return;
      }

      const sorted = stats.sort(
        (a, b) => b.totalTimeInForeground - a.totalTimeInForeground,
      );
      setApps(sorted);
      await refreshUsage();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load apps. Please check permissions and try again.',
      );
      setApps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const handleToggle = (app: UsageStat) => {
    if (isSelected(app.packageName)) {
      removeApp(app.packageName);
    } else {
      addApp({
        packageName: app.packageName,
        appName: app.appName,
      });
    }
  };

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) {
      return apps;
    }
    const query = searchQuery.toLowerCase().trim();
    return apps.filter(
      (app) =>
        app.appName.toLowerCase().includes(query) ||
        app.packageName.toLowerCase().includes(query),
    );
  }, [apps, searchQuery]);

  if (isLoading) {
    return (
      <View 
        className="flex-1 items-center justify-center bg-bg-primary dark:bg-bg-primary"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#E5C547" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View 
        className="flex-1 items-center justify-center bg-bg-primary dark:bg-bg-primary"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#E5C547" />
        <Text className="mt-4 text-base text-text-secondary dark:text-text-secondary">
          Checking permissions...
        </Text>
      </View>
    );
  }

  if (apps.length === 0 && !isLoading && hasPermission) {
    return (
      <View 
        className="flex-1 items-center justify-center bg-bg-primary p-4 dark:bg-bg-primary"
        style={{ paddingTop: insets.top }}
      >
        <Text className="mt-12 text-center text-base text-text-secondary dark:text-text-secondary">
          {error || 'No apps found.'}
          {'\n\n'}
          If you just granted permission, wait a few minutes for Android to collect usage data, then try again.
        </Text>
        <Pressable
          className="mt-4 items-center rounded-lg bg-brand-gold px-6 py-3 active:bg-brand-goldDark"
          onPress={handleRetry}
        >
          <Text className="text-base font-semibold text-bg-primary">Retry</Text>
        </Pressable>
        <Pressable
          className="mt-3 items-center rounded-lg border border-border bg-surface px-6 py-3 dark:border-border dark:bg-surface"
          onPress={async () => {
            try {
              if (!UsageStatsModule) {
                throw new Error('UsageStatsModule not available');
              }
              await UsageStatsModule.openUsageStatsSettings();
            } catch (error) {
              navigation.replace('Permissions', {
                returnTo: 'AppSelection',
              });
            }
          }}
        >
          <Text className="text-base font-semibold text-text-primary dark:text-text-primary">
            Open Settings
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View 
      className="flex-1 bg-bg-primary p-4 dark:bg-bg-primary"
      style={{ paddingTop: insets.top + 16 }}
    >
      <Text className="mb-1 text-2xl font-bold text-text-primary dark:text-text-primary">
        Select Apps to Track
      </Text>
      <Text className="mb-4 text-sm text-text-secondary dark:text-text-secondary">
        {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} selected
      </Text>

      <View className="mb-4 overflow-hidden rounded-xl border border-border bg-surface dark:border-border dark:bg-surface">
        <TextInput
          className="px-4 py-3 text-base text-text-primary dark:text-text-primary"
          placeholder="Search apps..."
          placeholderTextColor="#6B6B6B"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {filteredApps.length === 0 && searchQuery.trim() ? (
        <View className="flex-1 items-center justify-center py-12">
          <Text className="text-center text-base text-text-secondary dark:text-text-secondary">
            No apps found matching "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={(item) => item.packageName}
          renderItem={({ item }) => (
            <Pressable
              className="mb-2 flex-row items-center justify-between rounded-xl border border-border bg-surface p-4 active:bg-surface-hover dark:border-border dark:bg-surface"
              onPress={() => handleToggle(item)}
            >
              <View className="mr-4 flex-1">
                <Text className="mb-1 text-base font-semibold text-text-primary dark:text-text-primary">
                  {item.appName}
                </Text>
                <Text className="text-sm text-text-secondary dark:text-text-secondary">
                  {formatTime(item.totalTimeInForeground)} today
                </Text>
              </View>
              <Switch
                value={isSelected(item.packageName)}
                onValueChange={() => handleToggle(item)}
                trackColor={{
                  false: '#2A2A2A',
                  true: '#E5C547',
                }}
                thumbColor="#FFFFFF"
              />
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
