/**
 * Boundly Design System
 * 
 * A comprehensive design system for the Boundly (DailyFocus) app.
 * Built with NativeWind for light/dark mode support and responsive design.
 * 
 * @example
 * ```tsx
 * import { 
 *   Text, 
 *   Button, 
 *   Card, 
 *   useTheme, 
 *   useResponsive,
 *   colors,
 *   spacing 
 * } from '@/design-system';
 * ```
 */

// ============================================
// COMPONENTS
// ============================================
export * from './components';

// ============================================
// HOOKS
// ============================================
export * from './hooks';

// ============================================
// TOKENS
// ============================================
export * from './tokens';

// ============================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================

// Core components
export { Text, DisplayText, BodyText, LabelText, StatText, SectionLabel } from './components/Text';
export { Button, IconButton } from './components/Button';
export { Card, CardHeader, CardContent, CardFooter } from './components/Card';
export { Badge, DotBadge, CountBadge } from './components/Badge';
export { ProgressBar, CircularProgress, UsageBar } from './components/ProgressBar';
export { Divider, SectionDivider, Spacer } from './components/Divider';
export { ScreenContainer, ScrollContainer, HStack, VStack, Center } from './components/Container';

// Core hooks
export { useTheme } from './hooks/useTheme';
export { useResponsive, breakpoints } from './hooks/useResponsive';

// Core tokens
export { brand, backgrounds, text, status, borders, surfaces, appBrands, gradients } from './tokens/colors';
export { typography, fontFamilies, fontWeights, fontSizes } from './tokens/typography';
export { spacing, semanticSpacing, gaps, insets } from './tokens/spacing';
export { getShadow, getCardShadow, getGlow } from './tokens/shadows';
export { radius, semanticRadius } from './tokens/radius';

