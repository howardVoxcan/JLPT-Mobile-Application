import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DictionaryScreen } from "../screens/Dictionary/DictionaryScreen";
import StudyNavigator from "./StudyNavigator";
import SupportScreen from "../screens/Support/SupportScreen";
import JLPTPracticeCenterScreen from "../screens/JLPTPractice/JLPTPracticeCenterScreen";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Dictionary" component={DictionaryScreen} />
            <Tab.Screen name="Study" component={StudyNavigator} />
            <Tab.Screen name="Support" component={SupportScreen} />
            <Tab.Screen name="JLPTPractice" component={JLPTPracticeCenterScreen} />
            <Tab.Screen name="Profile" component={ProfileNavigator} />
        </Tab.Navigator>
    );
}

