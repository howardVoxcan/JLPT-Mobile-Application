import api from "./api";

/**
 * Lấy danh sách bài đọc theo level
 */
export const getReadingLessons = async (level = "N5") => {
    const res = await api.get(
        `/reading/lessons/?level=${level}`
    );
    return res.data;
};

/**
 * Lấy chi tiết 1 bài đọc
 */
export const getReadingLessonDetail = async (lessonId) => {
    const res = await api.get(
        `/reading/lessons/${lessonId}/`
    );
    return res.data;
};

/**
 * Nộp đáp án
 */
export const submitReadingAnswer = async (questionId, choiceId) => {
    const res = await api.post("/reading/answer/", {
        question_id: questionId,
        choice_id: choiceId,
    });
    return res.data;
};
