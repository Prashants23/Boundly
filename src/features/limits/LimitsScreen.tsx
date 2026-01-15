/**
 * Limits Screen
 * 
 * Allows users to set daily usage limits for selected apps
 * 
 * UX Considerations:
 * - Simple time picker (hours and minutes)
 * - Clear visual feedback
 * - Easy to adjust
 * - Shows current usage for context
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../utils/theme';
import { useAppStore, type SelectedApp } from '../../stores/useAppStore';
import { useLimitsStore } from '../../stores/useLimitsStore';
import { useUsageStore } from '../../stores/useUsageStore';

/**
 * Format milliseconds to human-readable time string
 */
const formatTime = (ms: number): string => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Parse time input string to milliseconds
 * Supports formats like "1h 30m", "90m", "1.5h", "120"
 */
const parseTimeInput = (input: string): number | null => {
  const trimmed = input.trim().toLowerCase();
  
  // Try "Xh Ym" format
  const hourMinMatch = trimmed.match(/(\d+)h\s*(\d+)m?/);
  if (hourMinMatch) {
    const hours = parseInt(hourMinMatch[1], 10);
    const minutes = parseInt(hourMinMatch[2] || '0', 10);
    return (hours * 60 + minutes) * 60000;
  }

  // Try "Xh" format
  const hourMatch = trimmed.match(/(\d+(?:\.\d+)?)h/);
  if (hourMatch) {
    const hours = parseFloat(hourMatch[1]);
    return hours * 60 * 60000;
  }

  // Try "Xm" format
  const minMatch = trimmed.match(/(\d+(?:\.\d+)?)m/);
  if (minMatch) {
    const minutes = parseFloat(minMatch[1]);
    return minutes * 60000;
  }

  // Try just number (assume minutes)
  const numMatch = trimmed.match(/^\d+$/);
  if (numMatch) {
    const minutes = parseInt(numMatch[0], 10);
    return minutes * 60000;
  }

  return null;
};

interface LimitItemProps {
  app: SelectedApp;
  limit: number | undefined;
  usage: number;
  onLimitChange: (packageName: string, limitMs: number | null) => void;
}

function LimitItem({ app, limit, usage, onLimitChange }: LimitItemProps) {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState(limit ? formatTime(limit) : '');

  // Update input value when limit changes externally
  useEffect(() => {
    if (limit) {
      setInputValue(formatTime(limit));
    } else {
      setInputValue('');
    }
  }, [limit]);

  const handleSave = () => {
    const parsed = parseTimeInput(inputValue);
    if (parsed && parsed > 0) {
      onLimitChange(app.packageName, parsed);
    } else if (inputValue.trim() === '') {
      onLimitChange(app.packageName, null);
    }
  };

  return (
    <View
      style={[
        styles.limitItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <View style={styles.appInfo}>
        <Text style={[styles.appName, { color: theme.colors.text }]}>
          {app.appName}
        </Text>
        {usage > 0 && (
          <Text style={[styles.usageText, { color: theme.colors.textSecondary }]}>
            Used: {formatTime(usage)} today
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="e.g., 1h 30m"
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={handleSave}
          onBlur={handleSave}
        />
        {limit && limit > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setInputValue('');
              onLimitChange(app.packageName, null);
            }}>
            <Text style={[styles.clearButtonText, { color: theme.colors.error }]}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function LimitsScreen() {
  const theme = useTheme();
  const selectedApps = useAppStore((state) => state.selectedApps);
  const getLimit = useLimitsStore((state) => state.getLimit);
  const setLimit = useLimitsStore((state) => state.setLimit);
  const removeLimit = useLimitsStore((state) => state.removeLimit);
  const getTodayUsage = useUsageStore((state) => state.getTodayUsage);

  const handleLimitChange = (packageName: string, limitMs: number | null) => {
    if (limitMs === null) {
      removeLimit(packageName);
    } else {
      setLimit(packageName, limitMs);
    }
  };

  if (selectedApps.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No apps selected.{'\n'}Select apps first to set limits.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Set Daily Limits
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Enter time limits (e.g., "1h 30m", "90m", "2h")
      </Text>

      <FlatList
        data={selectedApps}
        keyExtractor={(item) => item.packageName}
        renderItem={({ item }) => (
          <LimitItem
            app={item}
            limit={getLimit(item.packageName)}
            usage={getTodayUsage(item.packageName)}
            onLimitChange={handleLimitChange}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingBottom: 16,
  },
  limitItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  appInfo: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  usageText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 12,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
  },
});

