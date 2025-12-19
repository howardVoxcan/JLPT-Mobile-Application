import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import StudyScreen from '../screens/Study/StudyScreen';
import GrammarLevelScreen from '../screens/Study/GrammarLevelScreen';
import GrammarLessonScreen from '../screens/Study/GrammarLessonScreen';
import VocabularyLevelScreen from '../screens/Study/VocabularyLevelScreen';
import VocabularyFlashcardScreen from '../screens/Study/VocabularyFlashcardScreen';
import KanjiLevelScreen from '../screens/Study/KanjiLevelScreen';
import KanjiFlashcardScreen from '../screens/Study/KanjiFlashcardScreen';
import ReadingLevelScreen from '../screens/Study/ReadingLevelScreen';
import ReadingLessonScreen from '../screens/Study/ReadingLessonScreen';
import ListeningLevelScreen from '../screens/Study/ListeningLevelScreen';
import ListeningLessonScreen from '../screens/Study/ListeningLessonScreen';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';

const Stack = createNativeStackNavigator();
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24;

// Custom Header giống header "Danh sách yêu thích"
const CustomHeader = ({ title, navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity 
      onPress={() => navigation.goBack()} 
      activeOpacity={0.7}
      style={styles.backButton}
    >
      <Ionicons name="chevron-back" size={32} color={Colors.primaryHover} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <View style={styles.rightPlaceholder} />
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.secondaryLight,
    height: 100 + STATUSBAR_HEIGHT - 44,
    paddingTop: STATUSBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    fontSize: FontSizes.large,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  rightPlaceholder: {
    width: 48,
  },
});

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
      <Stack.Screen 
        name="GrammarLevel" 
        component={GrammarLevelScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <CustomHeader title="Ngữ pháp" navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="GrammarLesson" 
        component={GrammarLessonScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <CustomHeader title="Ngữ pháp" navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="VocabularyLevel" 
        component={VocabularyLevelScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={route.params?.category || 'Từ vựng'} navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="VocabularyFlashcard" 
        component={VocabularyFlashcardScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={`${route.params?.unit || 'Unit 01'} - ${route.params?.lesson || 'Bài 1'}`} navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="KanjiLevel" 
        component={KanjiLevelScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={route.params?.category || 'Kanji'} navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="KanjiFlashcard" 
        component={KanjiFlashcardScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={`${route.params?.unit || '第1週'} ${route.params?.lesson || '(1)'}`} navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="ReadingLevel" 
        component={ReadingLevelScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={route.params?.category || 'Đọc hiểu'} navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="ReadingLesson" 
        component={ReadingLessonScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={route.params?.title || '第1部 - 文体'} navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="ListeningLevel" 
        component={ListeningLevelScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={route.params?.category || 'Nghe hiểu'} navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="ListeningLesson" 
        component={ListeningLessonScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={route.params?.title || 'Bài 1: Giới thiệu bản thân'} navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
