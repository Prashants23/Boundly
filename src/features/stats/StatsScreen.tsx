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
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../../utils/theme';
import { useAppStore } from '../../stores/useAppStore';
import { useLimitsStore } from '../../stores/useLimitsStore';
import { useUsageStore } from '../../stores/useUsageStore';

export default function StatsScreen() {
  const theme = useTheme();
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshUsage}
          tintColor={theme.colors.primary}
        />
      }>
      <View style={styles.content}>
        {totalTimeSaved > 0 && (
          <View
            style={[
              styles.summaryCard,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Time Saved Today
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
              {formatTime(totalTimeSaved)}
            </Text>
            <Text style={[styles.summarySubtext, { color: theme.colors.textSecondary }]}>
              vs yesterday
            </Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          App Usage Today
        </Text>

        {selectedApps.map((app) => {
          const usage = todayUsage[app.packageName] || 0;
          const limit = getLimit(app.packageName) || 0;
          const timeSaved = getTimeSaved(app.packageName);
          const yesterday = yesterdayUsage[app.packageName] || 0;

          return (
            <View
              key={app.packageName}
              style={[
                styles.appCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
              ]}>
              <View style={styles.appHeader}>
                <Text style={[styles.appName, { color: theme.colors.text }]}>
                  {app.appName}
                </Text>
                {limit > 0 && (
                  <Text
                    style={[
                      styles.percentage,
                      {
                        color:
                          usage >= limit
                            ? theme.colors.error
                            : usage >= limit * 0.8
                            ? theme.colors.warning
                            : theme.colors.textSecondary,
                      },
                    ]}>
                    {formatPercentage(usage, limit)}
                  </Text>
                )}
              </View>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Today
                  </Text>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {formatTime(usage)}
                  </Text>
                </View>

                {yesterday > 0 && (
                  <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                      Yesterday
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.textSecondary }]}>
                      {formatTime(yesterday)}
                    </Text>
                  </View>
                )}

                {timeSaved > 0 && (
                  <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                      Saved
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.success }]}>
                      {formatTime(timeSaved)}
                    </Text>
                  </View>
                )}

                {limit > 0 && (
                  <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                      Limit
                    </Text>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>
                      {formatTime(limit)}
                    </Text>
                  </View>
                )}
              </View>

              {limit > 0 && (
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.min(100, (usage / limit) * 100)}%`,
                        backgroundColor:
                          usage >= limit
                            ? theme.colors.error
                            : usage >= limit * 0.8
                            ? theme.colors.warning
                            : theme.colors.primary,
                      },
                    ]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  appCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
});

