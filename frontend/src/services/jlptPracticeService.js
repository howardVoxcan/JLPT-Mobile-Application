// src/services/jlptPracticeService.js
import api from "./api";

/**
 * JLPT Practice Service
 * Handle API calls for JLPT Practice tests
 */

/**
 * Get list of tests by level
 * GET /api/jlpt-practice/tests/?level=N5
 * 
 * @param {string} level - JLPT level (N5, N4, N3, N2, N1)
 * @returns {Promise<Array>} List of tests
 */
export const getJLPTTests = async (level = 'N5') => {
  const response = await api.get('/jlpt-practice/tests/', {
    params: { level }
  });
  return response.data;
};

/**
 * Get test detail with all questions
 * GET /api/jlpt-practice/tests/:id/
 * 
 * @param {number} testId - Test ID
 * @returns {Promise<Object>} Test detail with sections and questions
 */
export const getJLPTTestDetail = async (testId) => {
  const response = await api.get(`/jlpt-practice/tests/${testId}/`);
  return response.data;
};

/**
 * Submit test answers
 * POST /api/jlpt-practice/tests/:id/submit/
 * 
 * @param {number} testId - Test ID
 * @param {Array} answers - Array of {question_id, choice_id}
 * @returns {Promise<Object>} Test result with score and section breakdown
 */
export const submitJLPTTest = async (testId, answers) => {
  const response = await api.post(
    `/jlpt-practice/tests/${testId}/submit/`,
    { answers }
  );
  return response.data;
};

/**
 * Get attempt detail (for viewing results)
 * GET /api/jlpt-practice/attempts/:id/
 * 
 * @param {number} attemptId - Attempt ID
 * @returns {Promise<Object>} Attempt detail with questions and user answers
 */
export const getJLPTAttemptDetail = async (attemptId) => {
  const response = await api.get(`/jlpt-practice/attempts/${attemptId}/`);
  return response.data;
};

/**
 * Helper function to format time
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time (MM:SS)
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Helper function to map section colors
 * @param {string} sectionType - Section type (vocabulary, grammar, reading, listening)
 * @returns {Object} Color and borderColor
 */
export const getSectionColor = (sectionType) => {
  const colorMap = {
    'vocabulary': {
      color: 'rgba(255, 183, 197, 0.5)',
      borderColor: 'rgba(255, 183, 197, 0.5)',
    },
    'grammar': {
      color: 'rgba(197, 185, 232, 0.5)',
      borderColor: 'rgba(197, 185, 232, 0.5)',
    },
    'reading': {
      color: 'rgba(255, 244, 163, 0.5)',
      borderColor: 'rgba(255, 244, 163, 0.5)',
    },
    'listening': {
      color: 'rgba(149, 212, 235, 0.5)',
      borderColor: 'rgba(149, 212, 235, 0.5)',
    },
  };
  
  return colorMap[sectionType] || colorMap['vocabulary'];
};

