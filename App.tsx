/**
 * Boundly (Daily Focus) App
 * 
 * Privacy-first Android app for limiting distracting app usage
 * Built with NativeWind design system for consistent styling
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeStores } from './src/stores';

// Import global styles for NativeWind
import './global.css';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Initialize stores from persistent storage on app start
  useEffect(() => {
    initializeStores();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0A0A0A' : '#FAFAFA'}
        translucent={false}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
