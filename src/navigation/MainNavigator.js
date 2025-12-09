import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DictionaryScreen } from "../screens/Dictionary/DictionaryScreen";
import StudyNavigator from "../navigation/StudyNavigator";
import { SupportStack } from "./SupportStack";
import JLPTPracticeCenterScreen from "../screens/JLPTPractice/JLPTPracticeCenterScreen";
import ProfileNavigator from "../navigation/ProfileNavigator";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { tabBarOptions } from "./tab.styles";

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
    const getTabBarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        // Hide tab bar for nested screens
        const hideTabBarScreens = ['Chatbot', 'GrammarLevel', 'GrammarLesson', 'Favorites', 'NotebookDetail'];
        if (hideTabBarScreens.includes(routeName)) {
            return false;
        }
        return true;
    };

    return (
        <Tab.Navigator screenOptions={tabBarOptions}>
            <Tab.Screen 
                name="Dictionary"
                component={DictionaryScreen}
                options={{ 
                    title: "Từ điển",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="book" size={size} color={color} />
                    ),
                }} 
            />
            <Tab.Screen 
                name="Study"
                component={StudyNavigator}
                options={({ route }) => ({ 
                    title: "Học tập",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="graduation-cap" size={size} color={color} />
                    ),
                    tabBarStyle: getTabBarVisibility(route)
                        ? {}
                        : { display: "none" },
                })} 
            />
            <Tab.Screen 
                name="Support"
                component={SupportStack}
                options={({ route }) => ({
                    title: "Hỗ trợ",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="lightbulb-o" size={size} color={color} />
                    ),
                    tabBarStyle: getTabBarVisibility(route)
                        ? {}
                        : { display: "none" },
                    headerShown: getTabBarVisibility(route),
                })}
            />
            <Tab.Screen 
                name="JLPTPractice"
                component={JLPTPracticeCenterScreen}
                options={{ 
                    title: "Luyện thi",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="file-text-o" size={size} color={color} />
                    ),
                }} 
            />
            <Tab.Screen 
                name="Profile"
                component={ProfileNavigator}
                options={({ route }) => ({ 
                    title: "Cá nhân",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user-circle-o" size={size} color={color} />
                    ),
                    tabBarStyle: getTabBarVisibility(route)
                        ? {}
                        : { display: "none" },
                })} 
            />
        </Tab.Navigator>
    );
}
