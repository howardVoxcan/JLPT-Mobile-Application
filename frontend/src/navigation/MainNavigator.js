import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DictionaryScreen } from "../screens/Dictionary/DictionaryScreen";
import StudyNavigator from "../navigation/StudyNavigator";
import { SupportStack } from "./SupportStack";
import JLPTPracticeNavigator from "../navigation/JLPTPracticeNavigator";
import ProfileNavigator from "../navigation/ProfileNavigator";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { tabBarOptions } from "./tab.styles";

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
    const getTabBarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        // Hide tab bar for nested screens (better UX)
        const hideTabBarScreens = ['Chatbot', 'ShadowingPractice', 'GrammarLevel', 'GrammarLesson', 'VocabularyLevel', 'VocabularyFlashcard', 'KanjiLevel', 'KanjiFlashcard', 'ReadingLevel', 'ReadingLesson', 'ListeningLevel', 'ListeningLesson', 'Favorites', 'Notebook', 'NotebookDetail', 'JLPTPracticeLevel', 'JLPTPracticeTest', 'JLPTPracticeResult', 'JLPTPracticeTestDetails'];
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
                    headerShown: false,
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
                    headerShown: false,
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
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'SupportMain';
                    const hideHeaderScreens = ['Chatbot', 'ShadowingPractice'];
                    return {
                        title: "Hỗ trợ",
                        headerShown: !hideHeaderScreens.includes(routeName),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="lightbulb-o" size={size} color={color} />
                        ),
                        tabBarStyle: getTabBarVisibility(route)
                            ? {}
                            : { display: "none" },
                    };
                }}
            />
            <Tab.Screen 
                name="JLPTPractice"
                component={JLPTPracticeNavigator}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'JLPTPracticeMain';
                    const hideHeaderScreens = ['JLPTPracticeLevel', 'JLPTPracticeTest', 'JLPTPracticeResult', 'JLPTPracticeTestDetails'];
                    return {
                        title: "Luyện thi",
                        headerShown: !hideHeaderScreens.includes(routeName),
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="file-text-o" size={size} color={color} />
                        ),
                        tabBarStyle: getTabBarVisibility(route)
                            ? {}
                            : { display: "none" },
                    };
                }}
            />
            <Tab.Screen 
                name="Profile"
                component={ProfileNavigator}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ProfileMain';
                    const hideHeaderScreens = ['Favorites', 'Notebook', 'NotebookDetail'];
                    return { 
                    title: "Cá nhân",
                        headerShown: !hideHeaderScreens.includes(routeName),
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user-circle-o" size={size} color={color} />
                    ),
                        tabBarStyle: getTabBarVisibility(route)
                            ? {}
                            : { display: "none" },
                    };
                }} 
            />
        </Tab.Navigator>
    );
}