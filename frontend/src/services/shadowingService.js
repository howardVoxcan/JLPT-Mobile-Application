import api from "./api";

/**
 * Lấy danh sách tất cả giọng đọc
 */
export const getVoices = async () => {
  const response = await api.get("/shadowing/voices/");
  return response.data;
};

/**
 * Tạo session mới và generate audio
 * @param {Object} data - Session data
 * @param {string} data.input_type - 'text' hoặc 'image'
 * @param {string} data.text_input - Văn bản (nếu input_type = 'text')
 * @param {File} data.image - File hình ảnh (nếu input_type = 'image')
 * @param {number} data.voice - Voice ID
 * @param {number} data.speed - Tốc độ (0.5 - 2.0)
 * @param {number} data.pitch - Cao thấp (-10 đến +10)
 */
export const createShadowingSession = async (data) => {
  const formData = new FormData();
  
  formData.append("input_type", data.input_type);
  
  if (data.input_type === "text" && data.text_input) {
    formData.append("text_input", data.text_input);
  }
  
  if (data.input_type === "image" && data.image) {
    formData.append("image", {
      uri: data.image.uri,
      type: data.image.type || "image/jpeg",
      name: data.image.fileName || "image.jpg",
    });
  }
  
  formData.append("voice", data.voice);
  formData.append("speed", data.speed.toString());
  formData.append("pitch", data.pitch.toString());
  
  const response = await api.post("/shadowing/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

/**
 * Lấy danh sách sessions của user
 */
export const getSessions = async () => {
  const response = await api.get("/shadowing/sessions/");
  return response.data;
};

/**
 * Lấy chi tiết một session
 * @param {number} sessionId - ID của session
 */
export const getSessionDetail = async (sessionId) => {
  const response = await api.get(`/shadowing/sessions/${sessionId}/`);
  return response.data;
};

/**
 * Download audio file
 * @param {number} sessionId - ID của session
 */
export const downloadAudio = async (sessionId) => {
  const response = await api.get(`/shadowing/sessions/${sessionId}/download/`, {
    responseType: "blob",
  });
  return response.data;
};

