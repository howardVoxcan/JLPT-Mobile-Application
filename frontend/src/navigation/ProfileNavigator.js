import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { FavoritesScreen } from '../screens/Profile/FavoritesScreen';
import { NotebookScreen } from '../screens/Profile/NotebookScreen';
import { NotebookDetailScreen } from '../screens/Profile/NotebookDetailScreen';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';

const Stack = createNativeStackNavigator();
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24;

// Custom Header giống hệt tab header "Cá nhân"
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

export default function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFF9F5' },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <CustomHeader title="Danh sách yêu thích" navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="Notebook" 
        component={NotebookScreen}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <CustomHeader title="Sổ tay học tập" navigation={navigation} />,
        })}
      />
      <Stack.Screen 
        name="NotebookDetail" 
        component={NotebookDetailScreen}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => <CustomHeader title={route.params?.notebookType || "Sổ tay học tập"} navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
