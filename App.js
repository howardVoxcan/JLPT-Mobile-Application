import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="dark" />
    </>
  );
}
