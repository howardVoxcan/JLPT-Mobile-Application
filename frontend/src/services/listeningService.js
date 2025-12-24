// src/services/listeningService.js
import api from "./api";

/**
 * Lấy danh sách bài listening theo level
 * GET /api/listening/lessons/?level=N5
 */
export const getListeningLessons = async (level = "N5") => {
    const response = await api.get("/listening/lessons/", {
        params: { level },
    });
    return response.data;
};

/**
 * Lấy chi tiết 1 bài listening
 * GET /api/listening/lessons/:id/
 */
export const getListeningLessonDetail = async (lessonId) => {
    const response = await api.get(`/listening/lessons/${lessonId}/`);
    return response.data;
};

/**
 * Nộp bài listening
 * POST /api/listening/lessons/:id/submit/
 * body: { answers: [{ question_id, choice_id }] }
 */
export const submitListeningAttempt = async (lessonId, answers) => {
    const response = await api.post(
        `/listening/lessons/${lessonId}/submit/`,
        { answers }
    );
    return response.data;
};
