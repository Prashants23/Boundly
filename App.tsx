/**
 * Daily Focus App
 * 
 * Privacy-first Android app for limiting distracting app usage
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initializeStores } from './src/stores';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Initialize stores from persistent storage on app start
  useEffect(() => {
    initializeStores();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
