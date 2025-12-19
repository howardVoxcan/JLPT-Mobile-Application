import { Platform, StatusBar } from "react-native";
import { Colors } from "../constants/Colors";
import { FontSizes, FontWeights } from "../constants/Fonts";

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24;

export const tabBarOptions = {
    tabBarActiveTintColor: Colors.secondaryHover,
    headerStyle: {
        backgroundColor: Colors.secondaryLight,
        borderBottomWidth: 2,
        height: 100 + STATUSBAR_HEIGHT - 44, 
    },
    headerTitleStyle: {
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        fontSize: FontSizes.large,
    },
    headerTitleAlign: 'center',
};