import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DictionaryScreen } from "../screens/DictionaryScreen";
import StudyScreen from "../screens/Study/StudyScreen";
import SupportScreen from "../screens/Support/SupportScreen";
import JLPTPracticeCenterScreen from "../screens/JLPTPractice/JLPTPracticeCenterScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Dictionary" component={DictionaryScreen} />
            <Tab.Screen name="Study" component={StudyScreen} />
            <Tab.Screen name="Support" component={SupportScreen} />
            <Tab.Screen name="JLPTPractice" component={JLPTPracticeCenterScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
