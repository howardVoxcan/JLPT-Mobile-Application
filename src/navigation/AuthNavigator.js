import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUpScreen } from '../screens/SignUpScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { OTPInputScreen } from '../screens/OTPInputScreen';
import { NewPasswordScreen } from '../screens/NewPasswordScreen';
import { PasswordSuccessScreen } from '../screens/PasswordSuccessScreen';
import { DictionaryScreen } from '../screens/DictionaryScreen';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFF9F5' },
        }}
      >
        <Stack.Screen name="Dictionary" component={DictionaryScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPInput" component={OTPInputScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        <Stack.Screen name="PasswordSuccess" component={PasswordSuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
