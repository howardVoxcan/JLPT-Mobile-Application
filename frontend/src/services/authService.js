import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });

    await AsyncStorage.setItem("access_token", res.data.access);
    await AsyncStorage.setItem("refresh_token", res.data.refresh);

    return res.data;
};

export const register = async ({ name, email, password, confirmPassword }) => {
    const payload = {
        full_name: name,
        email,
        password,
        confirm_password: confirmPassword,
    };

    const res = await api.post("/auth/register/", payload);

    await AsyncStorage.setItem("access_token", res.data.tokens.access);
    await AsyncStorage.setItem("refresh_token", res.data.tokens.refresh);


    return res.data.user;
};

export const getMe = async () => {
    const res = await api.get("/auth/me/");
    return res.data;
};

export const updateProfile = async (data) => {
    // data: { full_name }
    const res = await api.patch("/auth/me/", data);
    return res.data;
};

export const updateAvatar = async (image) => {
    const formData = new FormData();

    formData.append("avatar", {
        uri: image.uri,
        name: "avatar.jpg",
        type: "image/jpeg",
    });

    const res = await api.patch("/auth/me/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};

export const logout = async () => {
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
};
