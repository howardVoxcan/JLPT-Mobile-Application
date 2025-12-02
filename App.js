import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  const navigate = (screen, params = {}) => {
    if (screen === 'vocab') {
      setSelectedUnit(params.unitId);
    }
    setCurrentScreen(screen);
  };
  
  const goBack = () => {
    setCurrentScreen('home');
  };
  
  return (
    <SafeAreaProvider>
      {currentScreen === 'home' && (
        <HomeScreen 
          navigation={{ navigate }}
          onGoToFavorites={() => setCurrentScreen('favorites')}
        />
      )}
      
      {currentScreen === 'vocab' && (
        <VocabularyScreen 
          route={{ params: { unitId: selectedUnit } }}
          navigation={{ goBack }}
        />
      )}
      
      {currentScreen === 'favorites' && (
        <FavoritesScreen 
          onGoBack={() => setCurrentScreen('home')}
        />
      )}
      
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
