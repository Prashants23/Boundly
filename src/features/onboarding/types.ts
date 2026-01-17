/**
 * Onboarding Types
 * 
 * Type definitions for the onboarding flow
 */

export type OnboardingScreenName =
  | 'Welcome'
  | 'WhyAreYouHere'
  | 'HowItWorks'
  | 'PermissionIntro'
  | 'UsageAccessPermission'
  | 'ForegroundServicePermission'
  | 'OnboardingComplete';

export interface OnboardingNavigationParams {
  Welcome: undefined;
  WhyAreYouHere: undefined;
  HowItWorks: undefined;
  PermissionIntro: undefined;
  UsageAccessPermission: undefined;
  ForegroundServicePermission: undefined;
  OnboardingComplete: undefined;
}

