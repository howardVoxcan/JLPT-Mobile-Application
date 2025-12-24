import api from "./api";

/**
 * q: keyword tìm kiếm
 * type: vocab | kanji | grammar | sentence (optional)
 */
export const searchDictionary = async (q, type = null) => {
    const params = { q };
    if (type) params.type = type;

    const res = await api.get("/dictionary/search/", { params });
    return res.data;
};
