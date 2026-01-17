/**
 * Boundly Design System - Border Radius Tokens
 * 
 * Consistent border radius values for rounded corners.
 */

// ============================================
// BASE RADIUS SCALE
// ============================================
export const radius = {
  /** No radius - sharp corners */
  none: 0,
  /** 4px - Subtle rounding */
  sm: 4,
  /** 8px - Default radius */
  DEFAULT: 8,
  /** 12px - Medium radius */
  md: 12,
  /** 16px - Large radius */
  lg: 16,
  /** 20px - Extra large radius */
  xl: 20,
  /** 24px - 2XL radius */
  '2xl': 24,
  /** 28px - 3XL radius */
  '3xl': 28,
  /** 32px - 4XL radius */
  '4xl': 32,
  /** 9999px - Full/pill radius */
  full: 9999,
} as const;

// ============================================
// SEMANTIC RADIUS
// ============================================
export const semanticRadius = {
  /** Button radius - slightly rounded */
  button: radius.md,       // 12px
  /** Small button radius */
  buttonSm: radius.DEFAULT, // 8px
  /** Large button radius */
  buttonLg: radius.lg,     // 16px
  /** Pill button - fully rounded */
  buttonPill: radius.full, // 9999px
  
  /** Card radius - rounded corners */
  card: radius.xl,         // 20px
  /** Small card radius */
  cardSm: radius.lg,       // 16px
  /** Large card/modal radius */
  cardLg: radius['2xl'],   // 24px
  
  /** Modal radius */
  modal: radius['2xl'],    // 24px
  
  /** Input radius */
  input: 10,               // Custom 10px
  /** Input group radius */
  inputGroup: radius.md,   // 12px
  
  /** Badge radius */
  badge: radius.DEFAULT,   // 8px
  /** Pill badge - fully rounded */
  badgePill: radius.full,  // 9999px
  
  /** Tag radius */
  tag: radius.sm,          // 4px
  /** Pill tag */
  tagPill: radius.full,    // 9999px
  
  /** Avatar radius - circular */
  avatar: radius.full,     // 9999px
  /** Avatar squared */
  avatarSquare: radius.md, // 12px
  
  /** Checkbox/radio radius */
  checkbox: radius.sm,     // 4px
  /** Radio - fully rounded */
  radio: radius.full,      // 9999px
  
  /** Toggle/switch radius */
  toggle: radius.full,     // 9999px
  
  /** Progress bar radius */
  progress: radius.full,   // 9999px
  
  /** Tooltip radius */
  tooltip: radius.DEFAULT, // 8px
  
  /** Toast/notification radius */
  toast: radius.md,        // 12px
  
  /** Bottom sheet radius (top corners only) */
  bottomSheet: radius['3xl'], // 28px
  
  /** Image radius */
  image: radius.md,        // 12px
  /** Image rounded */
  imageRounded: radius.lg, // 16px
  /** Image circular */
  imageCircle: radius.full, // 9999px
  
  /** Skeleton placeholder radius */
  skeleton: radius.DEFAULT, // 8px
} as const;

// ============================================
// PARTIAL RADIUS HELPERS
// ============================================

/**
 * Top-only radius (for bottom sheets, headers)
 */
export const radiusTop = (value: number) => ({
  borderTopLeftRadius: value,
  borderTopRightRadius: value,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
});

/**
 * Bottom-only radius (for footers)
 */
export const radiusBottom = (value: number) => ({
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: value,
  borderBottomRightRadius: value,
});

/**
 * Left-only radius
 */
export const radiusLeft = (value: number) => ({
  borderTopLeftRadius: value,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: value,
  borderBottomRightRadius: 0,
});

/**
 * Right-only radius
 */
export const radiusRight = (value: number) => ({
  borderTopLeftRadius: 0,
  borderTopRightRadius: value,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: value,
});

/**
 * Asymmetric radius
 */
export const radiusAsymmetric = (
  topLeft: number,
  topRight: number,
  bottomRight: number,
  bottomLeft: number
) => ({
  borderTopLeftRadius: topLeft,
  borderTopRightRadius: topRight,
  borderBottomRightRadius: bottomRight,
  borderBottomLeftRadius: bottomLeft,
});

// ============================================
// TYPE DEFINITIONS
// ============================================
export type RadiusKey = keyof typeof radius;
export type SemanticRadiusKey = keyof typeof semanticRadius;

export default {
  radius,
  semanticRadius,
  radiusTop,
  radiusBottom,
  radiusLeft,
  radiusRight,
  radiusAsymmetric,
};

