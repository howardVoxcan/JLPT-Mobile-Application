import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export const SupportCard = ({ onPress, title, subTitle, icon, backgroundColor }) => {
    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: backgroundColor }]}
            onPress={onPress}
        >
            <View style={styles.cardContent}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subTitle}>{subTitle}</Text>
            </View>
            <View style={styles.icon}>
                <Image source={icon} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        width: 96,
        height: 96,
        borderRadius: 60,
        backgroundColor: '#F5ECFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    cardContent: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#343232',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 12,
        color: '#7A7A7A',
        lineHeight: 20,
        textAlign: "justify",
        marginRight: 10,
    },
});
