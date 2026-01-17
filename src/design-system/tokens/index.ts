/**
 * Boundly Design System - Token Exports
 * 
 * Central export point for all design tokens.
 */

// Color tokens
export * from './colors';
export { default as colors } from './colors';

// Typography tokens
export * from './typography';
export { default as typography } from './typography';

// Spacing tokens
export * from './spacing';
export { default as spacing } from './spacing';

// Shadow tokens
export * from './shadows';
export { default as shadows } from './shadows';

// Border radius tokens
export * from './radius';
export { default as radius } from './radius';

// ============================================
// CONVENIENCE RE-EXPORTS
// ============================================
export {
  brand,
  backgrounds,
  text,
  status,
  borders,
  surfaces,
  appBrands,
  gradients,
  getThemeColors,
} from './colors';

export {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  displayStyles,
  bodyStyles,
  labelStyles,
  specialStyles,
} from './typography';

export {
  spacing as spacingScale,
  semanticSpacing,
  safeArea,
  touchTargets,
  gaps,
  insets,
} from './spacing';

export {
  getShadow,
  getCardShadow,
  getCardHoverShadow,
  getGlow,
} from './shadows';

export {
  radius as radiusScale,
  semanticRadius,
  radiusTop,
  radiusBottom,
  radiusLeft,
  radiusRight,
} from './radius';

