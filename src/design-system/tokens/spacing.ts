/**
 * Boundly Design System - Spacing Tokens
 * 
 * Consistent spacing scale for margins, paddings, and gaps.
 * Based on a 4px base unit for pixel-perfect alignment.
 */

// ============================================
// BASE SPACING SCALE
// ============================================
export const spacing = {
  /** 0px - No spacing */
  none: 0,
  /** 2px - Micro spacing */
  px: 1,
  /** 2px */
  '0.5': 2,
  /** 4px - Tightest spacing */
  '1': 4,
  /** 6px */
  '1.5': 6,
  /** 8px - Compact spacing */
  '2': 8,
  /** 10px */
  '2.5': 10,
  /** 12px - Default small spacing */
  '3': 12,
  /** 14px */
  '3.5': 14,
  /** 16px - Default medium spacing */
  '4': 16,
  /** 20px */
  '5': 20,
  /** 24px - Default large spacing */
  '6': 24,
  /** 28px */
  '7': 28,
  /** 32px - Section spacing */
  '8': 32,
  /** 36px */
  '9': 36,
  /** 40px */
  '10': 40,
  /** 44px - Touch target minimum */
  '11': 44,
  /** 48px - Large section spacing */
  '12': 48,
  /** 56px */
  '14': 56,
  /** 64px - Extra large spacing */
  '16': 64,
  /** 72px */
  '18': 72,
  /** 80px */
  '20': 80,
  /** 96px */
  '24': 96,
  /** 112px */
  '28': 112,
  /** 128px */
  '32': 128,
} as const;

// ============================================
// SEMANTIC SPACING
// ============================================
export const semanticSpacing = {
  /** Inline spacing between icons and text */
  inline: {
    xs: spacing['1'],    // 4px
    sm: spacing['2'],    // 8px
    md: spacing['3'],    // 12px
    lg: spacing['4'],    // 16px
  },
  
  /** Stack spacing (vertical) between elements */
  stack: {
    xs: spacing['2'],    // 8px
    sm: spacing['3'],    // 12px
    md: spacing['4'],    // 16px
    lg: spacing['6'],    // 24px
    xl: spacing['8'],    // 32px
  },
  
  /** Container padding */
  container: {
    xs: spacing['3'],    // 12px
    sm: spacing['4'],    // 16px
    md: spacing['5'],    // 20px
    lg: spacing['6'],    // 24px
    xl: spacing['8'],    // 32px
  },
  
  /** Component internal padding */
  component: {
    xs: spacing['2'],    // 8px
    sm: spacing['3'],    // 12px
    md: spacing['4'],    // 16px
    lg: spacing['5'],    // 20px
  },
  
  /** Screen/page margins */
  screen: {
    horizontal: spacing['6'],  // 24px - consistent horizontal margin
    vertical: spacing['4'],    // 16px - top/bottom padding
    bottom: spacing['8'],      // 32px - extra bottom space
  },
  
  /** Card spacing */
  card: {
    padding: spacing['4'],     // 16px
    paddingLg: spacing['6'],   // 24px
    gap: spacing['3'],         // 12px - between card elements
    margin: spacing['4'],      // 16px - between cards
  },
  
  /** Form spacing */
  form: {
    gap: spacing['4'],         // 16px - between form fields
    labelGap: spacing['2'],    // 8px - between label and input
    helperGap: spacing['1'],   // 4px - between input and helper text
  },
  
  /** List spacing */
  list: {
    itemGap: spacing['3'],     // 12px - between list items
    itemPadding: spacing['4'], // 16px - list item internal padding
    sectionGap: spacing['6'],  // 24px - between list sections
  },
  
  /** Button spacing */
  button: {
    paddingX: spacing['6'],    // 24px - horizontal padding
    paddingY: spacing['3'],    // 12px - vertical padding
    gap: spacing['2'],         // 8px - between icon and text
  },
  
  /** Header spacing */
  header: {
    height: spacing['14'],     // 56px - standard header height
    paddingX: spacing['4'],    // 16px
    paddingY: spacing['3'],    // 12px
  },
  
  /** Tab bar spacing */
  tabBar: {
    height: spacing['20'],     // 80px - includes safe area
    paddingBottom: spacing['6'], // 24px - safe area padding
    itemGap: spacing['2'],     // 8px - between tab items
  },
} as const;

// ============================================
// SAFE AREA DEFAULTS
// ============================================
export const safeArea = {
  /** iOS safe area top (notch) */
  top: 44,
  /** iOS safe area bottom (home indicator) */
  bottom: 34,
  /** Horizontal safe area (usually 0) */
  horizontal: 0,
} as const;

// ============================================
// TOUCH TARGETS
// ============================================
export const touchTargets = {
  /** Minimum touch target size (iOS/Android guidelines) */
  minimum: 44,
  /** Comfortable touch target */
  comfortable: 48,
  /** Large touch target */
  large: 56,
} as const;

// ============================================
// GAP PRESETS
// ============================================
export const gaps = {
  /** Tiny gap - between tightly coupled elements */
  xs: spacing['1'],      // 4px
  /** Small gap - between related elements */
  sm: spacing['2'],      // 8px
  /** Medium gap - default */
  md: spacing['4'],      // 16px
  /** Large gap - between sections */
  lg: spacing['6'],      // 24px
  /** Extra large gap - major separations */
  xl: spacing['8'],      // 32px
  /** 2XL gap */
  '2xl': spacing['12'],  // 48px
} as const;

// ============================================
// INSET PRESETS
// ============================================
export const insets = {
  /** No inset */
  none: { top: 0, right: 0, bottom: 0, left: 0 },
  /** Small inset */
  sm: { 
    top: spacing['2'], 
    right: spacing['2'], 
    bottom: spacing['2'], 
    left: spacing['2'] 
  },
  /** Medium inset */
  md: { 
    top: spacing['4'], 
    right: spacing['4'], 
    bottom: spacing['4'], 
    left: spacing['4'] 
  },
  /** Large inset */
  lg: { 
    top: spacing['6'], 
    right: spacing['6'], 
    bottom: spacing['6'], 
    left: spacing['6'] 
  },
  /** Screen default inset */
  screen: { 
    top: spacing['4'], 
    right: spacing['6'], 
    bottom: spacing['8'], 
    left: spacing['6'] 
  },
} as const;

// ============================================
// TYPE DEFINITIONS
// ============================================
export type SpacingKey = keyof typeof spacing;
export type GapKey = keyof typeof gaps;
export type InsetKey = keyof typeof insets;

export default {
  spacing,
  semanticSpacing,
  safeArea,
  touchTargets,
  gaps,
  insets,
};

