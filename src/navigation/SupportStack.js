import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SupportScreen } from "../screens/Support/SupportScreen";
import { ChatbotScreen } from "../screens/Support/ChatbotScreen";
import { tabBarOptions } from "./tab.styles";

const Stack = createStackNavigator();

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
        </Stack.Navigator>
    );
}
