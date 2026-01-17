/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // ============================================
      // COLOR SYSTEM - Boundly Design System
      // ============================================
      // Primary palette: Warm gold accent on dark backgrounds
      // Inspired by premium productivity apps
      colors: {
        // Brand Colors
        brand: {
          gold: '#E5C547',        // Primary accent - warm gold
          goldLight: '#F0D76B',   // Hover/light state
          goldDark: '#C9A92D',    // Pressed/dark state
          goldMuted: 'rgba(229, 197, 71, 0.15)', // Background tint
        },
        
        // Background Colors
        bg: {
          // Dark theme (default)
          primary: '#0A0A0A',     // Main background
          secondary: '#121212',   // Elevated surfaces
          tertiary: '#1A1A1A',    // Cards, modals
          elevated: '#1E1E1E',    // Hover states
          
          // Light theme
          'light-primary': '#FAFAFA',
          'light-secondary': '#F5F5F5',
          'light-tertiary': '#FFFFFF',
          'light-elevated': '#EBEBEB',
        },
        
        // Text Colors
        text: {
          // Dark theme
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          tertiary: '#6B6B6B',
          muted: '#4A4A4A',
          
          // Light theme
          'light-primary': '#0A0A0A',
          'light-secondary': '#555555',
          'light-tertiary': '#888888',
          'light-muted': '#AAAAAA',
        },
        
        // Semantic Colors
        status: {
          success: '#4ADE80',
          successBg: '#1A3A1A',
          error: '#EF5350',
          errorBg: '#3A1A1A',
          warning: '#FFB74D',
          warningBg: '#3A2A1A',
          info: '#64B5F6',
          infoBg: '#1A2A3A',
        },
        
        // App Brand Colors (for usage tracking)
        apps: {
          instagram: '#E1306C',
          twitter: '#1DA1F2',
          tiktok: '#FF0050',
          youtube: '#FF0000',
          facebook: '#1877F2',
          snapchat: '#FFFC00',
          discord: '#5865F2',
          twitch: '#9146FF',
        },
        
        // Border Colors
        border: {
          DEFAULT: '#2A2A2A',
          light: '#3A3A3A',
          strong: '#4A4A4A',
          'light-DEFAULT': '#E0E0E0',
          'light-light': '#EBEBEB',
          'light-strong': '#CCCCCC',
        },
        
        // Surface Colors (for cards, buttons)
        surface: {
          DEFAULT: '#1A1A1A',
          hover: '#252525',
          pressed: '#0F0F0F',
          disabled: '#151515',
          'light-DEFAULT': '#FFFFFF',
          'light-hover': '#F5F5F5',
          'light-pressed': '#EBEBEB',
          'light-disabled': '#FAFAFA',
        },
      },
      
      // ============================================
      // TYPOGRAPHY SYSTEM
      // ============================================
      fontFamily: {
        // Display font - for headlines and app name
        display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        // Body font - for content
        sans: ['SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
        // Mono font - for stats/numbers
        mono: ['SF Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      
      fontSize: {
        // Display sizes
        'display-2xl': ['48px', { lineHeight: '52px', letterSpacing: '-0.02em' }],
        'display-xl': ['40px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
        'display-lg': ['32px', { lineHeight: '38px', letterSpacing: '-0.01em' }],
        'display-md': ['28px', { lineHeight: '34px', letterSpacing: '-0.01em' }],
        'display-sm': ['24px', { lineHeight: '30px', letterSpacing: '-0.01em' }],
        
        // Body sizes
        'body-xl': ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        'body-lg': ['18px', { lineHeight: '26px', letterSpacing: '0' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0' }],
        'body-xs': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        
        // Label sizes
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm': ['10px', { lineHeight: '14px', letterSpacing: '0.04em', fontWeight: '600' }],
      },
      
      // ============================================
      // SPACING SYSTEM
      // ============================================
      spacing: {
        // Micro spacing
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '18': '72px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
        
        // Semantic spacing
        'safe-top': '44px',     // iOS safe area top
        'safe-bottom': '34px', // iOS safe area bottom
        'nav-height': '56px',  // Navigation bar height
        'tab-height': '80px',  // Tab bar height
      },
      
      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        'full': '9999px',
        
        // Component-specific
        'button': '12px',
        'card': '20px',
        'modal': '24px',
        'input': '10px',
        'badge': '8px',
        'pill': '9999px',
      },
      
      // ============================================
      // SHADOWS (Box Shadows)
      // ============================================
      boxShadow: {
        'none': 'none',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.4)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.4)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.5)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.6)',
        
        // Glow effects
        'glow-gold': '0 0 20px rgba(229, 197, 71, 0.3)',
        'glow-gold-lg': '0 0 40px rgba(229, 197, 71, 0.4)',
        'glow-success': '0 0 20px rgba(74, 222, 128, 0.3)',
        'glow-error': '0 0 20px rgba(239, 83, 80, 0.3)',
        
        // Card shadows
        'card': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 20px rgba(0, 0, 0, 0.4)',
        
        // Light mode shadows
        'light-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'light-DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'light-md': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'light-lg': '0 8px 16px rgba(0, 0, 0, 0.12)',
        'light-xl': '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
      
      // ============================================
      // ANIMATION & TRANSITIONS
      // ============================================
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.2s ease-in',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(229, 197, 71, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(229, 197, 71, 0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // ============================================
      // BREAKPOINTS (for responsive design)
      // ============================================
      screens: {
        'xs': '375px',   // iPhone SE, small phones
        'sm': '390px',   // iPhone 14/15
        'md': '428px',   // iPhone 14/15 Plus
        'lg': '744px',   // iPad Mini
        'xl': '1024px',  // iPad Pro 11"
        '2xl': '1366px', // iPad Pro 12.9"
      },
      
      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        'base': '0',
        'dropdown': '10',
        'sticky': '20',
        'fixed': '30',
        'modal-backdrop': '40',
        'modal': '50',
        'popover': '60',
        'tooltip': '70',
        'toast': '80',
        'overlay': '90',
        'max': '100',
      },
      
      // ============================================
      // OPACITY SCALE
      // ============================================
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '15': '0.15',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
      },
    },
  },
  plugins: [],
};

