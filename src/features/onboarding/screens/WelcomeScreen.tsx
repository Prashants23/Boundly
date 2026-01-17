/**
 * Welcome Screen - Onboarding Screen 1
 * 
 * Premium dark-themed welcome screen with horizontally scrollable illustration cards.
 * Features elegant serif typography and distinctive visual design.
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

// Slide 1: Abstract bars (app blocking visualization)
const AbstractBarsSlide = () => {
  const bars = [
    { height: 140, width: 32, left: 24, bottom: 40, radius: 16 },
    { height: 180, width: 28, left: 64, bottom: 40, radius: 14 },
    { height: 120, width: 24, left: 100, bottom: 40, radius: 12 },
    { height: 200, width: 30, left: 132, bottom: 40, radius: 15 },
    { height: 160, width: 26, left: 170, bottom: 40, radius: 13 },
    { height: 100, width: 22, left: 204, bottom: 40, radius: 11 },
    { height: 220, width: 4, left: 240, bottom: 40, radius: 2 },
    { height: 190, width: 4, left: 250, bottom: 40, radius: 2 },
    { height: 160, width: 4, left: 260, bottom: 40, radius: 2 },
    { height: 130, width: 4, left: 270, bottom: 40, radius: 2 },
    { height: 100, width: 4, left: 280, bottom: 40, radius: 2 },
    { height: 70, width: 4, left: 290, bottom: 40, radius: 2 },
    { height: 50, width: 4, left: 300, bottom: 40, radius: 2 },
    { height: 35, width: 4, left: 310, bottom: 40, radius: 2 },
  ];

  return (
    <View 
      className="h-full w-full overflow-hidden rounded-[28px]"
      style={{ backgroundColor: '#E8E0D8' }}
    >
      {bars.map((bar, index) => (
        <View
          key={index}
          className="absolute bg-bg-primary"
          style={{
            height: bar.height * (CARD_HEIGHT / 320),
            width: bar.width * (CARD_WIDTH / 340),
            left: bar.left * (CARD_WIDTH / 340),
            bottom: bar.bottom * (CARD_HEIGHT / 320),
            borderRadius: bar.radius * (CARD_WIDTH / 340),
          }}
        />
      ))}
    </View>
  );
};

// Slide 2: Usage graph visualization
const GraphSlide = () => {
  const graphBars = [
    { height: 45, day: 'M' },
    { height: 80, day: 'T' },
    { height: 60, day: 'W' },
    { height: 120, day: 'T' },
    { height: 35, day: 'F' },
    { height: 90, day: 'S' },
    { height: 55, day: 'S' },
  ];
  
  const barWidth = (CARD_WIDTH - 100) / 7;

  return (
    <View className="h-full w-full overflow-hidden rounded-[28px] bg-bg-tertiary">
      {/* Graph title */}
      <View className="flex-row items-center justify-between px-6 pt-6">
        <Text className="text-lg font-semibold text-text-primary">Weekly Focus</Text>
        <View className="rounded-2xl bg-status-successBg px-3 py-1.5">
          <Text className="text-sm font-semibold text-status-success">↓ 34%</Text>
        </View>
      </View>
      
      {/* Y-axis labels */}
      <View className="absolute bottom-[60px] left-3 top-[70px] justify-between">
        <Text className="text-[10px] font-medium text-text-muted">4h</Text>
        <Text className="text-[10px] font-medium text-text-muted">2h</Text>
        <Text className="text-[10px] font-medium text-text-muted">0</Text>
      </View>
      
      {/* Graph bars */}
      <View className="flex-1 flex-row items-end justify-around px-10 pb-10">
        {graphBars.map((bar, index) => (
          <View key={index} className="items-center gap-2">
            <View
              className="rounded-md"
              style={{
                height: bar.height * (CARD_HEIGHT / 320),
                width: barWidth - 12,
                backgroundColor: index === 3 ? '#E5C547' : '#3A3A3A',
              }}
            />
            <Text className="text-[11px] font-medium text-text-muted">{bar.day}</Text>
          </View>
        ))}
      </View>
      
      {/* Trend line */}
      <View 
        className="absolute h-0.5 bg-brand-gold/30"
        style={{
          left: 50,
          right: 30,
          top: '45%',
          transform: [{ rotate: '-8deg' }],
        }}
      />
    </View>
  );
};

// Slide 3: Time tracking visualization
const TimeTrackingSlide = () => {
  const apps = [
    { name: 'Instagram', time: '2h 14m', color: '#E1306C', width: 0.85 },
    { name: 'Twitter', time: '1h 32m', color: '#1DA1F2', width: 0.65 },
    { name: 'TikTok', time: '58m', color: '#FF0050', width: 0.45 },
    { name: 'YouTube', time: '45m', color: '#FF0000', width: 0.35 },
  ];

  return (
    <View className="h-full w-full overflow-hidden rounded-[28px] bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-5">
        <Text className="text-lg font-semibold text-text-primary">Today</Text>
        <View className="rounded-2xl bg-bg-tertiary px-3 py-1.5">
          <Text className="text-sm font-semibold text-text-primary">5h 29m</Text>
        </View>
      </View>
      
      {/* Circular progress ring */}
      <View className="items-center justify-center py-4">
        <View 
          className="h-[100px] w-[100px] items-center justify-center rounded-full border-[6px] border-brand-gold"
          style={{
            borderTopColor: '#D1D1D1',
            transform: [{ rotate: '-45deg' }],
          }}
        >
          <View style={{ transform: [{ rotate: '45deg' }] }} className="items-center">
            <Text className="text-[22px] font-bold text-text-primary">2:14</Text>
            <Text className="mt-0.5 text-[10px] text-text-tertiary">saved today</Text>
          </View>
        </View>
      </View>
      
      {/* App bars */}
      <View className="gap-2.5 px-5">
        {apps.map((app, index) => (
          <View key={index} className="flex-row items-center gap-2.5">
            <View className="w-20 flex-row items-center gap-1.5">
              <View 
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: app.color }}
              />
              <Text className="text-xs font-medium text-text-primary">{app.name}</Text>
            </View>
            <View className="h-2 flex-1 overflow-hidden rounded-full bg-border">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${app.width * 100}%`,
                  backgroundColor: app.color,
                }}
              />
            </View>
            <Text className="w-[50px] text-right text-xs text-text-tertiary">{app.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleNext = () => {
    navigation.navigate('WhyAreYouHere');
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveSlide(slideIndex);
  };

  const slides = [AbstractBarsSlide, GraphSlide, TimeTrackingSlide];

  return (
    <View 
      className="flex-1 bg-bg-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* App Name Header */}
      <View className="items-center pb-5 pt-9">
        <Text className="text-[28px] font-light uppercase tracking-[6px] text-text-primary">
          Boundly
        </Text>
        <View className="mt-3 h-0.5 w-10 rounded-sm bg-brand-gold" />
      </View>

      {/* Horizontally Scrollable Cards */}
      <View className="flex-1 justify-center">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flexGrow: 0, height: CARD_HEIGHT }}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 16, alignItems: 'center' }}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        >
          {slides.map((SlideComponent, index) => (
            <View key={index} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
              <SlideComponent />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Content */}
      <View 
        className="px-6 pt-8"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        {/* Page Indicators */}
        <View className="mb-7 flex-row gap-2">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full ${
                activeSlide === index 
                  ? 'w-7 bg-brand-gold' 
                  : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </View>

        {/* Text and Button Row */}
        <View className="flex-row items-end justify-between gap-5">
          <View className="flex-1">
            <Text className="text-[26px] font-medium leading-8 tracking-tight text-text-primary">
              Make your phone{'\n'}less distracting —
            </Text>
            <Text className="mt-0.5 text-[26px] font-medium leading-8 tracking-tight text-text-tertiary">
              no tracking, no judgment.
            </Text>
          </View>

          {/* Next Button */}
          <Pressable
            className="h-16 w-16 items-center justify-center rounded-full border-2 border-brand-gold bg-transparent active:bg-brand-gold/10"
            onPress={handleNext}
          >
            <Text className="text-[39px] text-text-primary">↗</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
