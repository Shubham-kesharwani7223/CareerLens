import { create } from "zustand";
import { THEME_KEY } from "@/utils/constants";
function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored)
        return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}
function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
}
export const useTheme = create((set) => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return {
        theme: initial,
        toggleTheme: () => set((state) => {
            const next = state.theme === "dark" ? "light" : "dark";
            applyTheme(next);
            return { theme: next };
        }),
        setTheme: (theme) => {
            applyTheme(theme);
            set({ theme });
        },
    };
});
