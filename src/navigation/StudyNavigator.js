import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudyScreen from '../screens/Study/StudyScreen';
import GrammarLevelScreen from '../screens/Study/GrammarLevelScreen';
import GrammarLessonScreen from '../screens/Study/GrammarLessonScreen';

const Stack = createNativeStackNavigator();

export default function StudyNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFF9F5' },
      }}
    >
      <Stack.Screen name="StudyMain" component={StudyScreen} />
      <Stack.Screen name="GrammarLevel" component={GrammarLevelScreen} />
      <Stack.Screen name="GrammarLesson" component={GrammarLessonScreen} />
    </Stack.Navigator>
  );
}

