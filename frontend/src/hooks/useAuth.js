import { create } from "zustand";
import { TOKEN_KEY } from "@/utils/constants";
import { authApi } from "@/api/auth";
export const useAuth = create((set) => ({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    isLoading: true,
    isAuthenticated: false,
    login: async (data) => {
        const response = await authApi.login(data);
        localStorage.setItem(TOKEN_KEY, response.token);
        set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
        });
        return response;
    },
    register: async (data) => {
        const response = await authApi.register(data);
        localStorage.setItem(TOKEN_KEY, response.token);
        set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
        });
        return response;
    },
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ user: null, token: null, isAuthenticated: false });
    },
    loadUser: async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
        }
        try {
            const user = await authApi.getProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        }
        catch {
            localStorage.removeItem(TOKEN_KEY);
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
}));
