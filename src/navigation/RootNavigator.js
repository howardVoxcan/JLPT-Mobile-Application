import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "../navigation/MainNavigator";
import { AuthNavigator } from "../navigation/AuthNavigator";

export default function RootNavigator() {
    const { userToken } = false; // Thay bằng logic xác thực thật sau này

    return (
        <NavigationContainer>
        {userToken ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}
