/**
 * Why Are You Here Screen - Onboarding Screen 2
 * 
 * Purpose:
 * - Make user feel seen and understood
 * - Increase commitment through personalization
 * - Reframe the app as personal, not generic
 * 
 * Design Principles:
 * - Choice-based single select
 * - Animated cards for engagement
 * - Trust-building microcopy
 * - No wrong answers mentality
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withSequence,
  interpolate,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import OnboardingButton from '../components/OnboardingButton';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GoalOption {
  id: string;
  emoji: string;
  label: string;
  sublabel: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'social_media',
    emoji: '📵',
    label: 'Too much social media',
    sublabel: 'Scrolling takes over my day',
  },
  {
    id: 'focus',
    emoji: '🧠',
    label: "Can't stay focused",
    sublabel: 'Constantly getting distracted',
  },
  {
    id: 'screen_habits',
    emoji: '😴',
    label: 'Better screen habits',
    sublabel: 'Want healthier phone use',
  },
  {
    id: 'trying_out',
    emoji: '🛠',
    label: 'Just trying it out',
    sublabel: 'Curious what this can do',
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OptionCardProps {
  option: GoalOption;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function OptionCard({ option, index, isSelected, onSelect }: OptionCardProps) {
  const cardProgress = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  // Staggered entrance animation
  useEffect(() => {
    cardProgress.value = withDelay(
      150 + index * 100,
      withSpring(1, {
        damping: 15,
        stiffness: 100,
        mass: 0.8,
      })
    );
  }, []);

  // Selection animations
  useEffect(() => {
    if (isSelected) {
      scaleValue.value = withSequence(
        withTiming(0.96, { duration: 100 }),
        withSpring(1.02, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 150 })
      );
      glowOpacity.value = withTiming(1, { duration: 300 });
    } else {
      scaleValue.value = withSpring(1, { damping: 15, stiffness: 150 });
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isSelected]);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(cardProgress.value, [0, 1], [50, 0]);
    const opacity = interpolate(cardProgress.value, [0, 0.5, 1], [0, 0.3, 1]);
    
    return {
      transform: [
        { translateY },
        { scale: scaleValue.value },
      ],
      opacity,
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    onSelect(option.id);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={cardAnimatedStyle}
      className="relative mb-3"
    >
      {/* Glow effect behind card when selected */}
      <Animated.View
        style={[glowStyle, { position: 'absolute', inset: -2 }]}
        className="rounded-2xl bg-brand-gold/20"
      />
      
      {/* Card content */}
      <View
        className={`
          flex-row items-center rounded-2xl border-2 px-5 py-4
          ${isSelected 
            ? 'border-brand-gold bg-brand-gold/10' 
            : 'border-border/50 bg-bg-tertiary/50'
          }
        `}
      >
        {/* Emoji container with subtle animation */}
        <View 
          className={`
            mr-4 h-14 w-14 items-center justify-center rounded-xl
            ${isSelected ? 'bg-brand-gold/20' : 'bg-bg-secondary'}
          `}
        >
          <Text className="text-3xl">{option.emoji}</Text>
        </View>

        {/* Text content */}
        <View className="flex-1">
          <Text 
            className={`
              text-lg font-semibold
              ${isSelected ? 'text-brand-gold' : 'text-text-primary'}
            `}
          >
            {option.label}
          </Text>
          <Text className="mt-0.5 text-sm text-text-tertiary">
            {option.sublabel}
          </Text>
        </View>

        {/* Selection indicator */}
        <View 
          className={`
            h-6 w-6 items-center justify-center rounded-full border-2
            ${isSelected 
              ? 'border-brand-gold bg-brand-gold' 
              : 'border-border bg-transparent'
            }
          `}
        >
          {isSelected && (
            <Text className="text-xs font-bold text-bg-primary">✓</Text>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

// Floating particles for background ambiance
function FloatingParticle({ delay, startX, size }: { delay: number; startX: number; size: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(-800, {
        duration: 12000 + Math.random() * 4000,
        easing: Easing.linear,
      })
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(0.4, { duration: 2000 }),
        withTiming(0.4, { duration: 8000 }),
        withTiming(0, { duration: 2000 })
      )
    );
  }, []);

  const particleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        particleStyle,
        {
          position: 'absolute',
          bottom: -20,
          left: startX,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#E5C547',
        },
      ]}
    />
  );
}

export default function WhyAreYouHereScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  
  // Animated values for header
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const questionOpacity = useSharedValue(0);
  const questionTranslateY = useSharedValue(20);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    // Header animation
    headerOpacity.value = withDelay(0, withTiming(1, { duration: 600 }));
    headerTranslateY.value = withDelay(0, withSpring(0, { damping: 15 }));
    
    // Question animation
    questionOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    questionTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));
    
    // Footer animation
    footerOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const questionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
    transform: [{ translateY: questionTranslateY.value }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  const handleContinue = () => {
    // Store the selected goal if needed (could use MMKV or state management)
    navigation.navigate('HowItWorks');
  };

  const handleSelectGoal = (id: string) => {
    setSelectedGoal(id);
  };

  // Generate floating particles for ambient effect
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 400,
    startX: (SCREEN_WIDTH / 8) * i + Math.random() * 30,
    size: 3 + Math.random() * 3,
  }));

  return (
    <View 
      className="flex-1 bg-bg-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* Ambient floating particles */}
      {/* <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
        {particles.map((particle) => (
          <FloatingParticle 
            key={particle.id}
            delay={particle.delay}
            startX={particle.startX}
            size={particle.size}
          />
        ))}
      </View> */}

      {/* Subtle gradient overlay at top */}
      <View 
        className="absolute left-0 right-0 top-0 h-40 opacity-30"
        style={{
          backgroundColor: 'transparent',
          // Simulating gradient with opacity fade
        }}
        pointerEvents="none"
      />

      {/* Header */}
      {/* <Animated.View style={headerStyle} className="items-center pb-4 pt-8">
        <Text className="text-[28px] font-light uppercase tracking-[6px] text-text-primary">
          Boundly
        </Text>
        <View className="mt-3 h-0.5 w-10 rounded-sm bg-brand-gold" />
      </Animated.View> */}

      {/* Main Content */}
      <View className="flex-1 px-6">
        {/* Question Section */}
        <Animated.View style={questionStyle} className="mt-8">
          <Text className="text-center text-sm font-medium uppercase tracking-widest text-brand-gold">
            Let's personalize
          </Text>
          <Text className="mt-3 text-center text-[26px] font-semibold leading-9 text-text-primary">
          What’s stealing your attention?
          </Text>
        </Animated.View>

        {/* Option Cards */}
        <View className="flex-1 justify-center">
          {GOAL_OPTIONS.map((option, index) => (
            <OptionCard
              key={option.id}
              option={option}
              index={index}
              isSelected={selectedGoal === option.id}
              onSelect={handleSelectGoal}
            />
          ))}
        </View>
      </View>

      {/* Footer */}
      <Animated.View 
        style={[footerStyle, { paddingBottom: Math.max(insets.bottom, 24) }]}
        className="px-6 pt-4"
      >
        {/* Microcopy */}
        <View className="mb-5 flex-row items-center justify-center">
          <View className="mr-2 h-1.5 w-1.5 rounded-full bg-status-success" />
          <Text className="text-center text-sm text-text-tertiary">
            No wrong answers. This stays on your phone.
          </Text>
        </View>

        {/* Progress indicator */}
        {/* <View className="mb-4 flex-row items-center justify-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          <View className="h-1.5 w-6 rounded-full bg-brand-gold" />
          <View className="h-1.5 w-1.5 rounded-full bg-border" />
          <View className="h-1.5 w-1.5 rounded-full bg-border" />
          <View className="h-1.5 w-1.5 rounded-full bg-border" />
        </View> */}

        {/* Continue Button */}
        <OnboardingButton
          label="Continue"
          onPress={handleContinue}
          disabled={!selectedGoal}
          variant="primary"
        />
      </Animated.View>
    </View>
  );
}

