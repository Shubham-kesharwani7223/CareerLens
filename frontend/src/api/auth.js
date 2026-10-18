import apiClient from "./client";
export const authApi = {
    register: async (data) => {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    },
    login: async (data) => {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get("/auth/profile");
        return response.data;
    },
};
