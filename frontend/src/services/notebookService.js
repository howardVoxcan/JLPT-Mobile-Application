// src/services/notebookService.js
import api from "./api";

/**
 * Notebook Service
 * Handle API calls for notebook features
 */

/**
 * Get notebook categories summary
 * GET /api/notebook/categories/
 * 
 * @returns {Promise<Array>} List of categories with progress summary
 */
export const getNotebookCategories = async () => {
  const response = await api.get('/notebook/categories/');
  return response.data;
};

/**
 * Get notebook category detail by level
 * GET /api/notebook/categories/<category>/
 * 
 * @param {string} category - Category name (Từ vựng, Kanji, Ngữ pháp, Đọc hiểu, Nghe hiểu, Thi JLPT)
 * @returns {Promise<Array>} List of levels with detail
 */
export const getNotebookCategoryDetail = async (category) => {
  const response = await api.get(`/notebook/categories/${category}/`);
  return response.data;
};
