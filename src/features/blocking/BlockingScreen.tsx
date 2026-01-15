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
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useTheme } from '../../utils/theme';
import type { BlockedApp } from './useBlockingService';

interface BlockingScreenProps {
  blockedApp: BlockedApp;
  onDismiss: () => void;
}

export default function BlockingScreen({
  blockedApp,
  onDismiss,
}: BlockingScreenProps) {
  const theme = useTheme();

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
      hardwareAccelerated>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.icon, { color: theme.colors.warning }]}>⏱</Text>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Daily Limit Reached
          </Text>

          <Text style={[styles.appName, { color: theme.colors.primary }]}>
            {blockedApp.appName}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Used Today
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {formatTime(blockedApp.usageMs)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Daily Limit
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {formatTime(blockedApp.limitMs)}
              </Text>
            </View>
          </View>

          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            You've reached your daily limit for this app. Take a break and come back tomorrow.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={onDismiss}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>Got it</Text>
          </TouchableOpacity>

          <Text style={[styles.note, { color: theme.colors.textSecondary }]}>
            Note: This screen will appear again if you try to use this app today.
          </Text>
        </View>
      </View>
    </Modal>
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
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

