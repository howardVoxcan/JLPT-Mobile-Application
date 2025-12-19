import api from "./api";

/**
 * Lấy danh sách bài ngữ pháp theo level
 * GET /grammar/lessons/?level=N3
 */
export const getGrammarLessons = (level) => {
    return api.get(`/grammar/lessons/?level=${level}`);
};

/**
 * Lấy chi tiết 1 bài học
 * GET /grammar/lessons/:id/
 */
export const getGrammarLessonDetail = (lessonId) => {
    return api.get(`/grammar/lessons/${lessonId}/`);
};

/**
 * Lưu tiến độ học
 * POST /grammar/progress/
 */
export const submitGrammarProgress = (data) => {
    return api.post(`/grammar/progress/`, data);
};
