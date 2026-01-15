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

import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  AppState,
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../utils/theme';
import { useAppStore } from '../../stores/useAppStore';
import { useUsageStore } from '../../stores/useUsageStore';
import { checkUsageStatsPermission, openUsageStatsSettings } from '../../utils/permissions';
import UsageStatsModule from '../../native/UsageStatsModule';
import type { UsageStat } from '../../native/UsageStatsModule';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AppSelectionScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
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

  // Check permission when screen is focused (but only once, not on every focus)
  const hasCheckedOnFocus = React.useRef(false);
  
  useFocusEffect(
    React.useCallback(() => {
      if (!hasCheckedOnFocus.current) {
        hasCheckedOnFocus.current = true;
        checkPermissionAndLoad();
      }
    }, []),
  );

  // Also listen for app state changes (user might have granted permission)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('AppSelectionScreen: App became active, rechecking permission...');
        checkPermissionAndLoad();
      }
    });
    return () => subscription.remove();
  }, []);

  const checkPermissionAndLoad = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('AppSelectionScreen: Checking permission...');
      const permissionGranted = await checkUsageStatsPermission();
      console.log('AppSelectionScreen: Permission granted:', permissionGranted);
      setHasPermission(permissionGranted);
      
      if (!permissionGranted) {
        // Redirect to permissions screen
        console.log('AppSelectionScreen: Permission not granted, redirecting to Permissions screen');
        setIsLoading(false);
        navigation.replace('Permissions', {
          returnTo: 'AppSelection',
        });
        return;
      }
      
      // Permission granted, load apps
      console.log('AppSelectionScreen: Permission granted, loading apps...');
      await loadApps();
    } catch (error) {
      console.error('AppSelectionScreen: Error checking permission:', error);
      setError('Failed to check permissions. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    console.log('AppSelectionScreen: Retry button pressed');
    setIsLoading(true);
    setError(null);
    
    // First check permission again
    try {
      const permissionGranted = await checkUsageStatsPermission();
      console.log('AppSelectionScreen: Retry - Permission granted:', permissionGranted);
      setHasPermission(permissionGranted);
      
      if (!permissionGranted) {
        // Redirect to permissions screen
        console.log('AppSelectionScreen: Retry - Permission not granted, redirecting to Permissions');
        setIsLoading(false);
        navigation.replace('Permissions', {
          returnTo: 'AppSelection',
        });
        return;
      }
      
      // Permission is granted, retry loading apps
      console.log('AppSelectionScreen: Retry - Permission granted, reloading apps...');
      await loadApps();
    } catch (error) {
      console.error('AppSelectionScreen: Retry - Error:', error);
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
      console.log('AppSelectionScreen: Loading apps...');
      if (!UsageStatsModule) {
        console.error('AppSelectionScreen: UsageStatsModule is not available');
        throw new Error('UsageStatsModule is not available');
      }

      console.log('AppSelectionScreen: Calling getTodayUsageStats...');
      const stats = await UsageStatsModule.getTodayUsageStats();
      console.log('AppSelectionScreen: Received stats:', stats?.length || 0, 'apps');
      
      if (!stats || stats.length === 0) {
        console.log('AppSelectionScreen: No apps returned from native module');
        console.log('AppSelectionScreen: This is normal if permission was just granted');
        console.log('AppSelectionScreen: Android needs time to collect usage data');
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

      // Sort by usage (most used first)
      const sorted = stats.sort(
        (a, b) => b.totalTimeInForeground - a.totalTimeInForeground,
      );
      console.log('AppSelectionScreen: Setting apps, count:', sorted.length);
      setApps(sorted);
      await refreshUsage();
      console.log('AppSelectionScreen: Apps loaded successfully');
    } catch (error) {
      console.error('AppSelectionScreen: Error loading apps:', error);
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

  // Filter apps based on search query
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Checking permissions...
        </Text>
      </View>
    );
  }

  if (apps.length === 0 && !isLoading && hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          {error || 'No apps found.'}
          {'\n\n'}
          If you just granted permission, wait a few minutes for Android to collect usage data, then try again.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: 16 }]}
          onPress={handleRetry}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, marginTop: 12 }]}
          onPress={async () => {
            console.log('AppSelectionScreen: Open Settings button pressed');
            try {
              if (!UsageStatsModule) {
                throw new Error('UsageStatsModule not available');
              }
              console.log('AppSelectionScreen: Calling openUsageStatsSettings...');
              await UsageStatsModule.openUsageStatsSettings();
              console.log('AppSelectionScreen: Settings should be open now');
              // Settings should now be open - user will grant permission there
              // When they come back, AppState listener will detect it
            } catch (error) {
              console.error('AppSelectionScreen: Error opening settings:', error);
              // Fallback: navigate to permissions screen which has better instructions
              navigation.replace('Permissions', {
                returnTo: 'AppSelection',
              });
            }
          }}
          activeOpacity={0.8}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            Open Settings
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Select Apps to Track
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} selected
      </Text>

      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search apps..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {filteredApps.length === 0 && searchQuery.trim() ? (
        <View style={styles.emptySearchContainer}>
          <Text style={[styles.emptySearchText, { color: theme.colors.textSecondary }]}>
            No apps found matching "{searchQuery}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredApps}
          keyExtractor={(item) => item.packageName}
          renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.appItem,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => handleToggle(item)}
            activeOpacity={0.7}>
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: theme.colors.text }]}>
                {item.appName}
              </Text>
              <Text style={[styles.appUsage, { color: theme.colors.textSecondary }]}>
                {formatTime(item.totalTimeInForeground)} today
              </Text>
            </View>
            <Switch
              value={isSelected(item.packageName)}
              onValueChange={() => handleToggle(item)}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </TouchableOpacity>
        )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptySearchText: {
    fontSize: 16,
    textAlign: 'center',
  },
  appItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  appInfo: {
    flex: 1,
    marginRight: 16,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  appUsage: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

