import { useState } from "react";
import { sendChatMessage } from "../services/chatbotService";

export const useChatbot = () => {
    const [messages, setMessages] = useState([
        {
        id: "init",
        text:
            "Xin chào! 👋 Mình là trợ lý học tiếng Nhật của ứng dụng, luôn sẵn sàng giúp bạn giải đáp nhanh gọn các thắc mắc về từ vựng, ngữ pháp, kanji, luyện JLPT và văn hóa Nhật Bản. Hỏi mình bất cứ lúc nào nhé! 🇯🇵📚",
        isBot: true,
        timestamp: new Date(),
        },
    ]);

    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;

        // 1. Push message user
        const userMsg = {
        id: Date.now().toString(),
        text,
        isBot: false,
        timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
        // 2. Gửi BE
        const data = await sendChatMessage({
            message: text,
            sessionId,
        });

        // 3. Lưu session
        if (!sessionId) {
            setSessionId(data.session_id);
        }

        // 4. Push reply bot
        const botMsg = {
            id: Date.now().toString() + "-bot",
            text: data.reply,
            isBot: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
        setMessages((prev) => [
            ...prev,
            {
            id: "error",
            text: "Xin lỗi, hiện chatbot đang bận. Vui lòng thử lại sau.",
            isBot: true,
            timestamp: new Date(),
            },
        ]);
        } finally {
        setLoading(false);
        }
    };

    return {
        messages,
        loading,
        sendMessage,
    };
};
