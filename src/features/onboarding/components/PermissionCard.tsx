/**
 * Permission Card Component
 * 
 * Reusable component for explaining permissions in a calm, non-threatening way.
 * 
 * Design Principles:
 * - Clear, neutral language
 * - No fear-mongering
 * - Explain what the app does NOT do
 * - Visual hierarchy with icon + title + description
 */

import React from 'react';
import { View, Text } from 'react-native';

export interface PermissionCardProps {
  /**
   * Icon/emoji to display (optional)
   * Keep it simple - emoji or simple text
   */
  icon?: string;
  
  /**
   * Permission title
   * Should be clear and concise (e.g., "Usage Access")
   */
  title: string;
  
  /**
   * Main explanation of what this permission does
   * Keep it factual and neutral
   */
  description: string;
  
  /**
   * What the app does NOT do with this permission
   * Important for building trust
   */
  whatWeDontDo?: string;
}

/**
 * PermissionCard Component
 * 
 * Displays permission information in a card format.
 * Used in Permission Intro screen to explain permissions before requesting them.
 */
export default function PermissionCard({
  icon,
  title,
  description,
  whatWeDontDo,
}: PermissionCardProps) {
  return (
    <View className="mb-4 rounded-xl border border-border bg-surface p-5 dark:border-border dark:bg-surface">
      {icon && (
        <Text className="mb-3 text-center text-3xl">{icon}</Text>
      )}
      <Text className="mb-2 text-center text-xl font-semibold text-text-primary dark:text-text-primary">
        {title}
      </Text>
      <Text className="mb-3 text-center text-[15px] leading-[22px] text-text-secondary dark:text-text-secondary">
        {description}
      </Text>
      {whatWeDontDo && (
        <View className="mt-2 border-t border-border pt-3 dark:border-border">
          <Text className="mb-1 text-[13px] font-semibold text-text-secondary dark:text-text-secondary">
            We don't:
          </Text>
          <Text className="text-[13px] italic leading-[18px] text-text-secondary dark:text-text-secondary">
            {whatWeDontDo}
          </Text>
        </View>
      )}
    </View>
  );
}
