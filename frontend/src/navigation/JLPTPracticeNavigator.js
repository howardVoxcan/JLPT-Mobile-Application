import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import JLPTPracticeCenterScreen from '../screens/JLPTPractice/JLPTPracticeCenterScreen';
import JLPTPracticeLevelScreen from '../screens/JLPTPractice/JLPTPracticeLevelScreen';
import JLPTPracticeTestScreen from '../screens/JLPTPractice/JLPTPracticeTestScreen';
import JLPTPracticeResultScreen from '../screens/JLPTPractice/JLPTPracticeResultScreen';
import JLPTPracticeTestDetailsScreen from '../screens/JLPTPractice/JLPTPracticeTestDetailsScreen';
import { Colors } from '../constants/Colors';
import { FontSizes, FontWeights } from '../constants/Fonts';

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

export default function JLPTPracticeNavigator() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#FFF9F5' },
        }}
        >
        <Stack.Screen name="JLPTPracticeMain" component={JLPTPracticeCenterScreen} />
        <Stack.Screen 
            name="JLPTPracticeLevel" 
            component={JLPTPracticeLevelScreen}
            options={({ navigation, route }) => ({
            headerShown: true,
            header: () => <CustomHeader title="Thi thử JLPT" navigation={navigation} />,
            })}
        />
        <Stack.Screen 
            name="JLPTPracticeTest" 
            component={JLPTPracticeTestScreen}
            options={({ navigation, route }) => ({
            headerShown: true,
            header: () => <CustomHeader title={`Test ${route.params?.testId || 1}`} navigation={navigation} />,
            })}
        />
        <Stack.Screen 
            name="JLPTPracticeResult" 
            component={JLPTPracticeResultScreen}
            options={{
            headerShown: false,
            }}
        />
        <Stack.Screen 
            name="JLPTPracticeTestDetails" 
            component={JLPTPracticeTestDetailsScreen}
            options={({ navigation, route }) => ({
            headerShown: true,
            header: () => <CustomHeader title="Chi tiết đáp án" navigation={navigation} />,
            })}
        />
        </Stack.Navigator>
    );
}
