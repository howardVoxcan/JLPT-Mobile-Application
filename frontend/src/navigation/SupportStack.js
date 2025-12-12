import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SupportScreen } from "../screens/Support/SupportScreen";
import { ChatbotScreen } from "../screens/Support/ChatbotScreen";
import { tabBarOptions } from "./tab.styles";
import { ShadowingPracticeScreen } from "../screens/Support/ShadowingPracticeScreen";

const Stack = createNativeStackNavigator();

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
                options={{ title: "Chatbot hỏi đáp" }}
            />
            <Stack.Screen 
                name="ShadowingPractice"
                component={ShadowingPracticeScreen}
                options={{ title: "Luyện phát âm" }}
            />
        </Stack.Navigator>
    );
}
