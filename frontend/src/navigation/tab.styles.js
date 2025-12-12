import { Colors } from "../constants/Colors";
import { FontSizes, FontWeights } from "../constants/Fonts";

export const tabBarOptions = {
    tabBarActiveTintColor: Colors.secondaryHover,
    headerStyle: {
        backgroundColor: Colors.secondaryLight,
        borderBottomWidth: 2,
    },
    headerTitleStyle: {
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        fontSize: FontSizes.large,
    },
    headerTitleAlign: 'center',
};