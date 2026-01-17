/**
 * Stats Screen
 * 
 * Shows simple usage statistics:
 * - Today's usage per tracked app
 * - Time saved vs yesterday (local calculation)
 * 
 * Design Philosophy:
 * - Simple list, no complex charts
 * - Easy to read at a glance
 * - Minimal data, maximum clarity
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../stores/useAppStore';
import { useLimitsStore } from '../../stores/useLimitsStore';
import { useUsageStore } from '../../stores/useUsageStore';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const selectedApps = useAppStore((state) => state.selectedApps);
  const getLimit = useLimitsStore((state) => state.getLimit);
  const { todayUsage, yesterdayUsage, isLoading, refreshUsage, getTimeSaved } =
    useUsageStore();

  useEffect(() => {
    refreshUsage();
  }, []);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return '< 1m';
  };

  const formatPercentage = (used: number, limit: number): string => {
    if (limit === 0) return '0%';
    const percentage = Math.min(100, Math.round((used / limit) * 100));
    return `${percentage}%`;
  };

  if (selectedApps.length === 0) {
    return (
      <View 
        className="flex-1 items-center justify-center bg-bg-primary dark:bg-bg-primary"
        style={{ paddingTop: insets.top }}
      >
        <Text className="mt-12 text-center text-base text-text-secondary dark:text-text-secondary">
          No apps selected yet.{'\n'}Select apps to track usage.
        </Text>
      </View>
    );
  }

  const totalTimeSaved = selectedApps.reduce((total, app) => {
    return total + getTimeSaved(app.packageName);
  }, 0);

  return (
    <ScrollView
      className="flex-1 bg-bg-primary dark:bg-bg-primary"
      style={{ paddingTop: insets.top }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshUsage}
          tintColor="#E5C547"
        />
      }
    >
      <View className="p-4">
        {totalTimeSaved > 0 && (
          <View className="mb-6 items-center rounded-xl border border-border bg-surface p-5 dark:border-border dark:bg-surface">
            <Text className="mb-2 text-sm text-text-secondary dark:text-text-secondary">
              Time Saved Today
            </Text>
            <Text className="mb-1 text-[32px] font-bold text-status-success">
              {formatTime(totalTimeSaved)}
            </Text>
            <Text className="text-xs text-text-secondary dark:text-text-secondary">
              vs yesterday
            </Text>
          </View>
        )}

        <Text className="mb-4 text-xl font-semibold text-text-primary dark:text-text-primary">
          App Usage Today
        </Text>

        {selectedApps.map((app) => {
          const usage = todayUsage[app.packageName] || 0;
          const limit = getLimit(app.packageName) || 0;
          const timeSaved = getTimeSaved(app.packageName);
          const yesterday = yesterdayUsage[app.packageName] || 0;
          const usagePercentage = limit > 0 ? Math.min(100, (usage / limit) * 100) : 0;
          const isOverLimit = usage >= limit && limit > 0;
          const isNearLimit = usage >= limit * 0.8 && limit > 0;

          return (
            <View
              key={app.packageName}
              className="mb-3 rounded-xl border border-border bg-surface p-4 dark:border-border dark:bg-surface"
            >
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="flex-1 text-lg font-semibold text-text-primary dark:text-text-primary">
                  {app.appName}
                </Text>
                {limit > 0 && (
                  <Text
                    className={`text-base font-semibold ${
                      isOverLimit
                        ? 'text-status-error'
                        : isNearLimit
                        ? 'text-status-warning'
                        : 'text-text-secondary'
                    }`}
                  >
                    {formatPercentage(usage, limit)}
                  </Text>
                )}
              </View>

              <View className="mb-3 flex-row justify-around">
                <View className="flex-1 items-center">
                  <Text className="mb-1 text-xs text-text-secondary dark:text-text-secondary">
                    Today
                  </Text>
                  <Text className="text-base font-semibold text-text-primary dark:text-text-primary">
                    {formatTime(usage)}
                  </Text>
                </View>

                {yesterday > 0 && (
                  <View className="flex-1 items-center">
                    <Text className="mb-1 text-xs text-text-secondary dark:text-text-secondary">
                      Yesterday
                    </Text>
                    <Text className="text-base font-semibold text-text-secondary dark:text-text-secondary">
                      {formatTime(yesterday)}
                    </Text>
                  </View>
                )}

                {timeSaved > 0 && (
                  <View className="flex-1 items-center">
                    <Text className="mb-1 text-xs text-text-secondary dark:text-text-secondary">
                      Saved
                    </Text>
                    <Text className="text-base font-semibold text-status-success">
                      {formatTime(timeSaved)}
                    </Text>
                  </View>
                )}

                {limit > 0 && (
                  <View className="flex-1 items-center">
                    <Text className="mb-1 text-xs text-text-secondary dark:text-text-secondary">
                      Limit
                    </Text>
                    <Text className="text-base font-semibold text-text-primary dark:text-text-primary">
                      {formatTime(limit)}
                    </Text>
                  </View>
                )}
              </View>

              {limit > 0 && (
                <View className="h-1 overflow-hidden rounded-full bg-border dark:bg-border">
                  <View
                    className={`h-full rounded-full ${
                      isOverLimit
                        ? 'bg-status-error'
                        : isNearLimit
                        ? 'bg-status-warning'
                        : 'bg-brand-gold'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
