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
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
 */
const parseTimeInput = (input: string): number | null => {
  const trimmed = input.trim().toLowerCase();
  
  const hourMinMatch = trimmed.match(/(\d+)h\s*(\d+)m?/);
  if (hourMinMatch) {
    const hours = parseInt(hourMinMatch[1], 10);
    const minutes = parseInt(hourMinMatch[2] || '0', 10);
    return (hours * 60 + minutes) * 60000;
  }

  const hourMatch = trimmed.match(/(\d+(?:\.\d+)?)h/);
  if (hourMatch) {
    const hours = parseFloat(hourMatch[1]);
    return hours * 60 * 60000;
  }

  const minMatch = trimmed.match(/(\d+(?:\.\d+)?)m/);
  if (minMatch) {
    const minutes = parseFloat(minMatch[1]);
    return minutes * 60000;
  }

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
  const [inputValue, setInputValue] = useState(limit ? formatTime(limit) : '');

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
    <View className="mb-3 rounded-xl border border-border bg-surface p-4 dark:border-border dark:bg-surface">
      <View className="mb-3">
        <Text className="mb-1 text-base font-semibold text-text-primary dark:text-text-primary">
          {app.appName}
        </Text>
        {usage > 0 && (
          <Text className="text-sm text-text-secondary dark:text-text-secondary">
            Used: {formatTime(usage)} today
          </Text>
        )}
      </View>

      <View className="flex-row items-center gap-2">
        <TextInput
          className="flex-1 rounded-lg border border-border bg-bg-primary p-3 text-base text-text-primary dark:border-border dark:bg-bg-primary dark:text-text-primary"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="e.g., 1h 30m"
          placeholderTextColor="#6B6B6B"
          onSubmitEditing={handleSave}
          onBlur={handleSave}
        />
        {limit && limit > 0 && (
          <Pressable
            className="p-3"
            onPress={() => {
              setInputValue('');
              onLimitChange(app.packageName, null);
            }}
          >
            <Text className="text-sm font-medium text-status-error">
              Clear
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function LimitsScreen() {
  const insets = useSafeAreaInsets();
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
      <View 
        className="flex-1 items-center justify-center bg-bg-primary dark:bg-bg-primary"
        style={{ paddingTop: insets.top }}
      >
        <Text className="mt-12 text-center text-base text-text-secondary dark:text-text-secondary">
          No apps selected.{'\n'}Select apps first to set limits.
        </Text>
      </View>
    );
  }

  return (
    <View 
      className="flex-1 bg-bg-primary p-4 dark:bg-bg-primary"
      style={{ paddingTop: insets.top + 16 }}
    >
      <Text className="mb-1 text-2xl font-bold text-text-primary dark:text-text-primary">
        Set Daily Limits
      </Text>
      <Text className="mb-4 text-sm text-text-secondary dark:text-text-secondary">
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
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
