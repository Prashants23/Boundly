# Boundly Design System

A comprehensive design system for the Boundly (DailyFocus) app built with **NativeWind** for seamless light/dark mode support and responsive design.

## Installation

After pulling the latest code, install the new dependencies:

```bash
cd DailyFocus
yarn install
# or
npm install
```

Then rebuild the native apps:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Quick Start

```tsx
import {
  // Components
  Text,
  Button,
  Card,
  Badge,
  ProgressBar,
  ScreenContainer,
  HStack,
  VStack,
  
  // Hooks
  useTheme,
  useResponsive,
  
  // Tokens
  brand,
  spacing,
} from '@/design-system';

function MyScreen() {
  const { colors, isDark } = useTheme();
  const { breakpoint, responsive, scale } = useResponsive();
  
  return (
    <ScreenContainer>
      <VStack gap="4">
        <Text variant="displayMd" color="primary">
          Hello Boundly
        </Text>
        <Button variant="primary" onPress={() => {}}>
          Get Started
        </Button>
      </VStack>
    </ScreenContainer>
  );
}
```

---

## Color System

### Brand Colors
```ts
brand.gold         // #E5C547 - Primary accent
brand.goldLight    // #F0D76B - Hover state
brand.goldDark     // #C9A92D - Pressed state
brand.goldMuted    // rgba(229, 197, 71, 0.15)
```

### Background Colors (auto dark/light)
```ts
const { colors } = useTheme();

colors.background.primary   // Main app background
colors.background.secondary // Elevated surfaces
colors.background.tertiary  // Cards, modals
colors.background.elevated  // Hover states
```

### Text Colors (auto dark/light)
```ts
colors.text.primary    // Main text - highest contrast
colors.text.secondary  // Descriptions
colors.text.tertiary   // Hints, placeholders
colors.text.muted      // Disabled states
```

### Status Colors
```ts
colors.status.success    // #4ADE80
colors.status.error      // #EF5350
colors.status.warning    // #FFB74D
colors.status.info       // #64B5F6
colors.status.successBg  // Dark background for success badges
```

### Using with NativeWind Classes

```tsx
// Dark mode: gold text, Light mode: uses CSS variables
<Text className="text-brand-gold">Gold Text</Text>

// Background with dark/light variants
<View className="bg-bg-primary dark:bg-bg-primary" />

// Status colors
<View className="bg-status-successBg">
  <Text className="text-status-success">Success!</Text>
</View>
```

---

## Typography

### Variants
```tsx
// Display (headlines)
<Text variant="display2xl">48px Bold</Text>
<Text variant="displayXl">40px Bold</Text>
<Text variant="displayLg">32px SemiBold</Text>
<Text variant="displayMd">28px SemiBold</Text>
<Text variant="displaySm">24px Medium</Text>

// Body (content)
<Text variant="bodyXl">20px Regular</Text>
<Text variant="bodyLg">18px Regular</Text>
<Text variant="bodyMd">16px Regular</Text>  // Default
<Text variant="bodySm">14px Regular</Text>
<Text variant="bodyXs">12px Regular</Text>

// Labels (UI elements)
<Text variant="labelLg">14px SemiBold</Text>
<Text variant="labelMd">12px SemiBold</Text>
<Text variant="labelSm">10px SemiBold UPPERCASE</Text>

// Special
<Text variant="statValue">28px Bold Mono</Text>
<Text variant="sectionLabel">10px SemiBold UPPERCASE</Text>
```

### Helper Components
```tsx
<DisplayText size="lg">Headline</DisplayText>
<BodyText size="md">Paragraph text</BodyText>
<LabelText size="sm">LABEL</LabelText>
<StatText>2:34</StatText>
<SectionLabel>TODAY'S STATS</SectionLabel>
```

### Text Props
```tsx
<Text
  variant="bodyMd"
  color="secondary"      // 'primary' | 'secondary' | 'tertiary' | 'muted' | 'brand' | 'success' | 'error'
  align="center"         // 'left' | 'center' | 'right'
  bold                   // Override weight to bold
  italic                 // Italic style
  uppercase              // Transform to uppercase
  underline              // Underlined text
>
  Styled text
</Text>
```

---

## Spacing

### Scale (4px base)
```ts
spacing['1']  = 4px
spacing['2']  = 8px
spacing['3']  = 12px
spacing['4']  = 16px
spacing['5']  = 20px
spacing['6']  = 24px
spacing['8']  = 32px
spacing['10'] = 40px
spacing['12'] = 48px
spacing['16'] = 64px
```

### Semantic Spacing
```ts
semanticSpacing.screen.horizontal  // 24px - Screen side padding
semanticSpacing.card.padding       // 16px - Card internal padding
semanticSpacing.button.paddingX    // 24px - Button horizontal padding
semanticSpacing.list.itemGap       // 12px - Between list items
```

### NativeWind Classes
```tsx
<View className="p-4 mx-6 gap-3">
  {/* p-4 = 16px padding, mx-6 = 24px horizontal margin, gap-3 = 12px */}
</View>
```

---

## Components

### Button
```tsx
<Button 
  variant="primary"     // 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size="md"             // 'sm' | 'md' | 'lg'
  loading={false}
  disabled={false}
  fullWidth={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  onPress={() => {}}
>
  Button Text
</Button>

// Icon-only button
<IconButton
  icon={<Icon />}
  variant="ghost"
  accessibilityLabel="Settings"
  onPress={() => {}}
/>
```

### Card
```tsx
<Card 
  variant="elevated"    // 'default' | 'elevated' | 'outlined' | 'filled'
  size="md"             // 'sm' | 'md' | 'lg' (padding)
  pressable
  onPress={() => {}}
>
  <CardHeader 
    title={<Text>Title</Text>}
    subtitle={<Text>Subtitle</Text>}
    action={<IconButton />}
  />
  <CardContent>
    <Text>Card content here</Text>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge
```tsx
<Badge 
  variant="success"     // 'default' | 'success' | 'error' | 'warning' | 'info' | 'brand'
  size="md"             // 'sm' | 'md' | 'lg'
  pill                  // Fully rounded
  icon={<Icon />}
>
  Active
</Badge>

// Dot indicator
<DotBadge variant="success" />

// Notification count
<CountBadge count={12} max={99} variant="error" />
```

### ProgressBar
```tsx
<ProgressBar
  value={75}
  max={100}
  variant="brand"       // 'default' | 'success' | 'warning' | 'error' | 'brand'
  height={8}
  animated
  glow
/>

// Circular progress
<CircularProgress
  value={65}
  size={100}
  strokeWidth={6}
  variant="brand"
>
  <Text variant="statValue">65%</Text>
</CircularProgress>
```

### Layout Containers
```tsx
// Full screen container with safe areas
<ScreenContainer
  safeArea={{ top: true, bottom: true }}
  background="primary"
  padding
>
  {/* Content */}
</ScreenContainer>

// Scrollable container
<ScrollContainer safeArea background="primary">
  {/* Scrollable content */}
</ScrollContainer>

// Horizontal stack
<HStack gap="3" align="center" justify="between">
  <Text>Left</Text>
  <Text>Right</Text>
</HStack>

// Vertical stack
<VStack gap="4" align="stretch">
  <Card />
  <Card />
</VStack>

// Center container
<Center>
  <Text>Centered content</Text>
</Center>
```

### Divider
```tsx
<Divider />                          // Full width line
<Divider variant="inset" />          // Left inset
<Divider variant="middle" />         // Both sides inset
<Divider label="OR" />               // With text label
<Divider orientation="vertical" />   // Vertical line

<SectionDivider title="SETTINGS" />  // Section header

<Spacer size="4" />                  // Invisible spacing (16px)
```

---

## Hooks

### useTheme
```tsx
const {
  colorScheme,          // 'light' | 'dark'
  isDark,               // boolean
  isLight,              // boolean
  toggleColorScheme,    // () => void
  setColorScheme,       // (scheme) => void
  colors,               // All theme colors
  shadow,               // (level) => ViewStyle
  cardShadow,           // ViewStyle
  glow,                 // (type, size) => ViewStyle
} = useTheme();

// Usage
<View style={[styles.card, shadow('md')]}>
<View style={[styles.button, glow('gold')]}>
```

### useResponsive
```tsx
const {
  width,                // Screen width
  height,               // Screen height
  isLandscape,          // boolean
  isPortrait,           // boolean
  deviceType,           // 'phone' | 'tablet'
  isPhone,              // boolean
  isTablet,             // boolean
  breakpoint,           // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  isAtLeast,            // (bp) => boolean
  isAtMost,             // (bp) => boolean
  safeArea,             // SafeAreaInsets
  responsive,           // (values) => value
  scale,                // (value) => scaled value
  moderateScale,        // (value, factor) => scaled value
  platform,             // { isIOS, isAndroid, isWeb }
} = useResponsive();

// Responsive values
const fontSize = responsive({
  default: 16,
  sm: 18,
  lg: 24,
});

// Conditional rendering
{isTablet && <SidePanel />}
```

---

## Dark/Light Mode

### Automatic Detection
The app automatically uses the system color scheme. Colors adapt automatically when using:
- `useTheme()` hook
- Design system components
- NativeWind `dark:` prefix classes

### NativeWind Dark Mode Classes
```tsx
// Background
<View className="bg-white dark:bg-bg-primary" />

// Text
<Text className="text-black dark:text-white" />

// Border
<View className="border-gray-200 dark:border-border" />
```

### Manual Toggle
```tsx
const { toggleColorScheme, setColorScheme } = useTheme();

// Toggle
<Button onPress={toggleColorScheme}>Toggle Theme</Button>

// Set specific
setColorScheme('dark');
```

---

## File Structure

```
src/design-system/
├── index.ts                 # Main exports
├── DESIGN_SYSTEM.md         # This file
├── nativewind-env.d.ts      # TypeScript types
├── components/
│   ├── index.ts
│   ├── Text.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── ProgressBar.tsx
│   ├── Divider.tsx
│   └── Container.tsx
├── hooks/
│   ├── index.ts
│   ├── useTheme.ts
│   └── useResponsive.ts
└── tokens/
    ├── index.ts
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    ├── shadows.ts
    └── radius.ts
```

---

## Migration from Legacy Theme

The old `useTheme` from `@/utils/theme` still works but is deprecated. Migrate gradually:

```tsx
// Old (deprecated)
import { useTheme } from '@/utils/theme';
const theme = useTheme();
<Text style={{ color: theme.colors.text }}>Hello</Text>

// New (recommended)
import { Text, useTheme } from '@/design-system';
const { colors } = useTheme();
<Text color="primary">Hello</Text>
// or
<Text style={{ color: colors.text.primary }}>Hello</Text>
```

---

## Best Practices

1. **Use semantic color names** instead of hardcoded values
2. **Use spacing tokens** for consistent layouts
3. **Use typography variants** for consistent text styling
4. **Use design system components** for UI consistency
5. **Test in both dark and light modes**
6. **Use responsive utilities** for different screen sizes
7. **Import from `@/design-system`** for tree-shaking

---

## Support

For questions or issues with the design system, check:
- Component source files for implementation details
- Token files for available values
- This documentation for usage examples

