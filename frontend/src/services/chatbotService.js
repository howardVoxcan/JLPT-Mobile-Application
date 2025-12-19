import api from "./api";

/**
 * Gửi message tới chatbot backend
 */
export const sendChatMessage = async ({ message, sessionId }) => {
    const res = await api.post("/chatbot/chat/", {
        message,
        session_id: sessionId || null,
    });

    return res.data;
};
