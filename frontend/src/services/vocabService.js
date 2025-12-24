/**
 * Vocabulary Service
 * ------------------
 * Yêu cầu:
 * - api.js đã được cấu hình sẵn (axios instance)
 * - Tự động gắn Authorization header
 */

import api from "./api";

/**
 * ============================
 * LESSON LIST (Level Screen)
 * ============================
 */

/**
 * Lấy danh sách bài học từ vựng theo JLPT level
 * FE dùng cho VocabularyLevelScreen
 *
 * @param {string} level - "N5" | "N4" | ...
 */
export const getVocabularyLessons = async (level) => {
  const response = await api.get("/vocab/lessons/", {
    params: { level },
  });

  return response.data;
};

/**
 * ============================
 * LESSON DETAIL (Flashcard)
 * ============================
 */

/**
 * Lấy chi tiết bài học + danh sách flashcard
 * FE dùng cho VocabularyFlashcardScreen
 *
 * @param {number} lessonId
 */
export const getVocabularyLessonDetail = async (lessonId) => {
  const response = await api.get(`/vocab/lessons/${lessonId}/`);
  return response.data;
};

/**
 * ============================
 * PROGRESS
 * ============================
 */

/**
 * Cập nhật tiến trình học từ vựng
 *
 * @param {number} lessonId
 * @param {number} completedWords
 */
export const updateVocabularyProgress = async (lessonId, completedWords) => {
  const response = await api.post(`/vocab/lessons/${lessonId}/progress/`, {
    completed_words: completedWords,
  });

  return response.data;
};

/**
 * ============================
 * FAVORITE
 * ============================
 */

/**
 * Toggle favorite cho 1 từ vựng
 *
 * @param {number} wordId
 * @returns {Object} { favorite: true | false }
 */
export const toggleVocabularyFavorite = async (wordId) => {
  const response = await api.post(`/vocab/words/${wordId}/favorite/`);

  return response.data;
};

/**
 * ============================
 * HELPER (OPTIONAL)
 * ============================
 */

/**
 * Chuẩn hóa dữ liệu lesson cho UI
 */
export const mapLessonForUI = (lesson) => {
  return {
    id: lesson.id,
    title: lesson.title,
    wordCount: lesson.wordCount,
    status: lesson.status,
    progress: lesson.progress,
  };
};
