/**
 * Kanji Service
 * --------------
 * API service cho module học Kanji
 * Yêu cầu:
 * - api.js đã được cấu hình sẵn (axios instance)
 * - Tự động gắn Authorization header
 */

import api from "./api";

/**
 * ============================
 * UNIT LIST (Level Screen)
 * ============================
 */

/**
 * Lấy danh sách units theo JLPT level
 * FE dùng cho KanjiLevelScreen
 *
 * @param {string} level - "N5" | "N4" | "N3" | "N2" | "N1"
 * @returns {Promise<Array>} Danh sách units
 */
export const getKanjiUnits = async (level) => {
  const response = await api.get("/kanji/units/", {
    params: { level },
  });
  return response.data;
};

/**
 * Lấy chi tiết unit bao gồm tất cả lessons và kanjis
 * 
 * @param {number} unitId
 * @returns {Promise<Object>} Unit detail với lessons và kanjis
 */
export const getKanjiUnitDetail = async (unitId) => {
  const response = await api.get(`/kanji/units/${unitId}/`);
  return response.data;
};

/**
 * ============================
 * LESSON DETAIL (Flashcard)
 * ============================
 */

/**
 * Lấy chi tiết lesson + danh sách kanji flashcards
 * FE dùng cho KanjiFlashcardScreen
 *
 * @param {number} lessonId
 * @returns {Promise<Object>} Lesson detail với danh sách kanjis
 */
export const getKanjiLessonDetail = async (lessonId) => {
  const response = await api.get(`/kanji/lessons/${lessonId}/`);
  return response.data;
};

/**
 * Lấy chi tiết một kanji cụ thể
 * 
 * @param {number} kanjiId
 * @returns {Promise<Object>} Kanji detail với vocabularies
 */
export const getKanjiDetail = async (kanjiId) => {
  const response = await api.get(`/kanji/${kanjiId}/`);
  return response.data;
};

/**
 * ============================
 * SEARCH
 * ============================
 */

/**
 * Tìm kiếm kanji
 * FE dùng cho DictionaryScreen (tab kanji)
 *
 * @param {string} query - Từ khóa tìm kiếm
 * @param {string} level - (optional) Lọc theo level
 * @returns {Promise<Array>} Danh sách kanji tìm được
 */
export const searchKanji = async (query, level = null) => {
  const params = { q: query };
  if (level) {
    params.level = level;
  }

  const response = await api.get("/kanji/search/", { params });
  return response.data;
};

/**
 * ============================
 * PROGRESS
 * ============================
 */

/**
 * Lấy tiến độ học kanji của user
 * 
 * @param {string} level - (optional) Lọc theo level
 * @returns {Promise<Array>} Danh sách kanji progress
 */
export const getKanjiProgress = async (level = null) => {
  const params = level ? { level } : {};
  const response = await api.get("/kanji/progress/", { params });
  return response.data;
};

/**
 * Tạo hoặc cập nhật tiến độ học kanji
 * 
 * @param {number} kanjiId
 * @param {Object} progressData - { is_learned, is_mastered, review_count }
 * @returns {Promise<Object>} Progress data
 */
export const updateKanjiProgress = async (kanjiId, progressData) => {
  const response = await api.post("/kanji/progress/", {
    kanji_id: kanjiId,
    ...progressData,
  });
  return response.data;
};

/**
 * Cập nhật progress cụ thể (bằng progress_id)
 * 
 * @param {number} progressId
 * @param {Object} progressData - { is_learned, is_mastered, review_count }
 * @returns {Promise<Object>} Updated progress
 */
export const updateKanjiProgressById = async (progressId, progressData) => {
  const response = await api.put(`/kanji/progress/${progressId}/`, progressData);
  return response.data;
};

/**
 * Xóa tiến độ học
 * 
 * @param {number} progressId
 * @returns {Promise<void>}
 */
export const deleteKanjiProgress = async (progressId) => {
  await api.delete(`/kanji/progress/${progressId}/`);
};

/**
 * ============================
 * FAVORITE
 * ============================
 */

/**
 * Lấy danh sách kanji yêu thích
 * FE dùng cho FavoritesScreen
 * 
 * @returns {Promise<Array>} Danh sách kanji favorites
 */
export const getKanjiFavorites = async () => {
  const response = await api.get("/kanji/favorites/");
  return response.data;
};

/**
 * Thêm kanji vào yêu thích
 * 
 * @param {number} kanjiId
 * @returns {Promise<Object>} Favorite data
 */
export const addKanjiFavorite = async (kanjiId) => {
  const response = await api.post("/kanji/favorites/", {
    kanji_id: kanjiId,
  });
  return response.data;
};

/**
 * Xóa kanji khỏi yêu thích
 * 
 * @param {number} favoriteId
 * @returns {Promise<void>}
 */
export const removeKanjiFavorite = async (favoriteId) => {
  await api.delete(`/kanji/favorites/${favoriteId}/`);
};

/**
 * Toggle favorite (thêm nếu chưa có, xóa nếu đã có)
 * Helper function cho UI
 * 
 * @param {number} kanjiId
 * @param {number} favoriteId - Nếu có (đã favorite)
 * @returns {Promise<Object|null>} Favorite data hoặc null nếu xóa
 */
export const toggleKanjiFavorite = async (kanjiId, favoriteId = null) => {
  if (favoriteId) {
    // Đã favorite -> xóa
    await removeKanjiFavorite(favoriteId);
    return null;
  } else {
    // Chưa favorite -> thêm
    return await addKanjiFavorite(kanjiId);
  }
};

/**
 * ============================
 * HELPER / MAPPER
 * ============================
 */

/**
 * Map dữ liệu unit từ API sang format UI cần
 * (Tùy chọn - nếu cần transform data)
 */
export const mapUnitForUI = (unit) => {
  return {
    id: unit.id,
    unitName: unit.unit_name,
    level: unit.level,
    lessonCount: unit.lesson_count,
    kanjiCount: unit.total_kanji_count,
    description: unit.description,
  };
};

/**
 * Map dữ liệu kanji từ API sang format UI cần
 * Đảm bảo tương thích với mock data hiện tại
 */
export const mapKanjiForUI = (kanji) => {
  return {
    id: kanji.id,
    kanji: kanji.kanji,
    hiragana: kanji.hiragana,
    vietnamese: kanji.vietnamese,
    strokeCount: kanji.stroke_count,
    kunyomi: kanji.kunyomi,
    onyomi: kanji.onyomi,
    meaning: kanji.meaning,
    vocabulary: kanji.vocabulary, // Đã có format đúng từ backend
  };
};

/**
 * Map dữ liệu lesson từ API sang format UI cần
 */
export const mapLessonForUI = (lesson) => {
  return {
    id: lesson.id,
    lessonNumber: lesson.lesson_number,
    lessonName: lesson.lesson_name,
    kanjiCount: lesson.kanji_count,
    kanjis: lesson.kanjis?.map(mapKanjiForUI) || [],
  };
};

