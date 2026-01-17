/**
 * Blocking Screen - Overlay when app limit is exceeded
 * 
 * UX Considerations:
 * - Minimal and non-aggressive
 * - Clear message about why app is blocked
 * - Option to dismiss (but app will be blocked again if still over limit)
 * - Play Store compliant: Not manipulative, clear purpose
 * 
 * Overlay Risks & Mitigations:
 * - Risk: Can be seen as intrusive
 * - Mitigation: Only show when limit actually exceeded, clear messaging
 * - Risk: Users might find ways to bypass
 * - Mitigation: Re-check periodically, but don't be too aggressive
 * - Risk: Play Store might flag as overlay abuse
 * - Mitigation: Clear purpose (user-set limits), not ads or manipulation
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
} from 'react-native';
import type { BlockedApp } from './useBlockingService';

interface BlockingScreenProps {
  blockedApp: BlockedApp;
  onDismiss: () => void;
}

export default function BlockingScreen({
  blockedApp,
  onDismiss,
}: BlockingScreenProps) {
  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="fade"
      hardwareAccelerated
    >
      <View className="flex-1 items-center justify-center bg-bg-primary p-6 dark:bg-bg-primary">
        <View className="w-full max-w-[400px] items-center rounded-2xl bg-surface p-6 shadow-lg dark:bg-surface">
          <Text className="mb-4 text-6xl">⏱</Text>
          
          <Text className="mb-2 text-center text-2xl font-bold text-text-primary dark:text-text-primary">
            Daily Limit Reached
          </Text>

          <Text className="mb-6 text-center text-xl font-semibold text-brand-gold">
            {blockedApp.appName}
          </Text>

          <View className="mb-6 w-full flex-row justify-around border-y border-border py-4 dark:border-border">
            <View className="items-center">
              <Text className="mb-1 text-sm text-text-secondary dark:text-text-secondary">
                Used Today
              </Text>
              <Text className="text-lg font-semibold text-text-primary dark:text-text-primary">
                {formatTime(blockedApp.usageMs)}
              </Text>
            </View>
            <View className="items-center">
              <Text className="mb-1 text-sm text-text-secondary dark:text-text-secondary">
                Daily Limit
              </Text>
              <Text className="text-lg font-semibold text-text-primary dark:text-text-primary">
                {formatTime(blockedApp.limitMs)}
              </Text>
            </View>
          </View>

          <Text className="mb-6 text-center text-base leading-6 text-text-secondary dark:text-text-secondary">
            You've reached your daily limit for this app. Take a break and come back tomorrow.
          </Text>

          <Pressable
            className="mb-4 w-full items-center rounded-lg bg-brand-gold px-8 py-4 active:bg-brand-goldDark"
            onPress={onDismiss}
          >
            <Text className="text-base font-semibold text-bg-primary">
              Got it
            </Text>
          </Pressable>

          <Text className="text-center text-xs italic text-text-secondary dark:text-text-secondary">
            Note: This screen will appear again if you try to use this app today.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
