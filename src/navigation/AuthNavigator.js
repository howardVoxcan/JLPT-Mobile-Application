import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUpScreen } from '../screens/Auth/SignUpScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { ForgotPasswordScreen } from '../screens/Auth/ForgotPasswordScreen';
import { OTPInputScreen } from '../screens/Auth/OTPInputScreen';
import { NewPasswordScreen } from '../screens/Auth/NewPasswordScreen';
import { PasswordSuccessScreen } from '../screens/Auth/PasswordSuccessScreen';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFF9F5' },
      }}
    >
      <Stack.Screen name="MainNavigator" component={MainNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPInput" component={OTPInputScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      <Stack.Screen name="PasswordSuccess" component={PasswordSuccessScreen} />
    </Stack.Navigator>
  );
};
