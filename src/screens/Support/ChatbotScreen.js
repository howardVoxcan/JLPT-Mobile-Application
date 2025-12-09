import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export const ChatbotScreen = () => {
    const [messages, setMessages] = useState([
        {
        id: 1,
        text: 'Chào bạn! Ở học tiếng Nhật tôi một hành trình thú vị đây. Bước đầu tiên và quan trọng nhất là bạn viết tập trung vào việc học bảng chữ cái.',
        isBot: true,
        timestamp: new Date()
        }
    ]);

    const [inputText, setInputText] = useState('');

    const suggestions = [
            "Phân biệt giúp tôi 'は' (wa) và 'が' (ga)",
            "Cấu trúc '~たいです'",
            "Lộ trình học tiếng Nhật từ con số 0",
            "Học Kanji như thế nào để dễ nhớ?",
        ];

    const handleSuggestionPress = (text) => {
        setInputText(text);  
    };

    const sendMessage = () => {
        if (inputText.trim()) {
        const newMessage = {
            id: messages.length + 1,
            text: inputText,
            isBot: false,
            timestamp: new Date()
        };
        setMessages([...messages, newMessage]);
        setInputText('');
        
        setTimeout(() => {
            const botResponse = {
            id: messages.length + 2,
            text: 'Cảm ơn bạn đã nhắn tin! Tôi sẽ cố gắng hỗ trợ bạn tốt nhất có thể.',
            isBot: true,
            timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            

            <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}>
                    Bạn có thắc mắc cần giải đáp? Hãy chat với tôi nhé.
                </Text>
                {messages.map((message) => (
                <View key={message.id} style={[
                    styles.messageContainer,
                    message.isBot ? styles.botMessage : styles.userMessage
                ]}>
                    {message.isBot && (
                    <View style={styles.botAvatar}>
                        <Text style={styles.avatarText}>🤖</Text>
                    </View>
                    )}
                    <View style={[
                    styles.messageBubble,
                    message.isBot ? styles.botBubble : styles.userBubble
                    ]}>
                    <Text style={[
                        styles.messageText,
                        message.isBot ? styles.botText : styles.userText
                    ]}>
                        {message.text}
                    </Text>
                    </View>
                </View>
                ))}
            </ScrollView>
            <View style={styles.suggestionWrapper}>
                <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionContainer}
                >
                {suggestions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.suggestionChip}
                        onPress={() => handleSuggestionPress(item)}
                    >
                        <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>
            </View>   
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <View style={styles.inputRow}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="camera" size={24} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="image" size={24} color="#666" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Message"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons name="send" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF9F5',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        lineHeight: 20,
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-end',
    },
    botMessage: {
        justifyContent: 'flex-start',
    },
    userMessage: {
        justifyContent: 'flex-end',
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4ECDC4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        fontSize: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 18,
    },
    botBubble: {
        backgroundColor: '#E8F5E8',
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#4ECDC4',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    botText: {
        color: '#333',
    },
    userText: {
        color: 'white',
    },
    inputContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    attachButton: {
        padding: 8,
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        marginRight: 10,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.secondaryHover,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionContainer: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        gap: 10,
        height: '54'
    },
    suggestionChip: {
        backgroundColor: "#B5EAD7",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    suggestionText: {
        fontSize: 14,
        color: "#333",
        fontWeight: "500",
    },
});