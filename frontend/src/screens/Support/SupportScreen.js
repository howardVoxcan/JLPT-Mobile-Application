import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SupportCard } from "../../components/SupportCard";
import { Colors } from "../../constants/Colors";

export const SupportScreen = ({ navigation }) => {
    const handlePressChatbot = () => {
        navigation.navigate('Chatbot');
    }

    const handlePressShadowing = () => {
        navigation.navigate('ShadowingPractice');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <SupportCard
                    title="Chatbot AI"
                    subTitle="Hỏi đáp với chatbot bằng văn bản hoặc hình ảnh"
                    icon={require('../../../assets/chatbotlogo.png')}
                    backgroundColor="#C5B9E8"
                    onPress={handlePressChatbot}
                />
                <SupportCard
                    title="Luyện phát âm"
                    subTitle="Hỗ trợ luyện phát âm đoạn văn bằng cách chuyển văn bản hoặc hình ảnh sang âm thanh"
                    icon={require('../../../assets/shadowingpracticelogo.png')}
                    backgroundColor="#FFF4A3"
                    onPress={handlePressShadowing}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: Colors.backgroundSecondary,
    },
});
