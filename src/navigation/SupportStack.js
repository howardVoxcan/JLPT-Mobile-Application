import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform, StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SupportScreen } from "../screens/Support/SupportScreen";
import { ChatbotScreen } from "../screens/Support/ChatbotScreen";
import { tabBarOptions } from "./tab.styles";
import ShadowingPracticeScreen from "../screens/Support/ShadowingPracticeScreen";
import { Colors } from "../constants/Colors";
import { FontSizes, FontWeights } from "../constants/Fonts";

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

export const SupportStack = () => {
    return (
        <Stack.Navigator screenOptions={tabBarOptions}>
            <Stack.Screen 
                name="SupportMain"
                component={SupportScreen}
                options={{ title: "Hỗ trợ", headerShown: false }}
            />
            <Stack.Screen 
                name="Chatbot"
                component={ChatbotScreen}
                options={({ navigation }) => ({
                    headerShown: true,
                    header: () => <CustomHeader title="Chatbot hỏi đáp" navigation={navigation} />,
                })}
            />
            <Stack.Screen 
                name="ShadowingPractice"
                component={ShadowingPracticeScreen}
                options={({ navigation }) => ({
                    headerShown: true,
                    header: () => <CustomHeader title="Luyện phát âm" navigation={navigation} />,
                })}
            />
        </Stack.Navigator>
    );
}
