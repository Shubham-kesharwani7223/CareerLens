import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { Menu, Moon, Sun, LogOut } from "lucide-react";
// import { useTheme } from "@/hooks/useTheme";
// import { useAuth } from "@/hooks/useAuth";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// interface NavbarProps { onMenuClick: () => void; }
// export function Navbar({ onMenuClick }: NavbarProps) {
//   const { theme, toggleTheme } = useTheme();
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/");
//   };
//   return (
//     <header
//       className="sticky top-0 z-30 flex w-full min-h-16 items-center justify-between gap-x-2 border-b border-gray-200 bg-white px-3 py-2 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-white/[0.06] dark:bg-slate-950 dark:supports-[backdrop-filter]:bg-slate-950/80 sm:min-h-16 sm:gap-3 sm:px-4 sm:py-0 md:gap-3 lg:px-6"
//     >
//       <div className="flex min-h-10 min-w-0 flex-1 basis-0 items-center gap-2 sm:gap-3">
//         <button
//           onClick={onMenuClick}
//           className="shrink-0 rounded-xl p-2 text-gray-500 hover:bg-gray-100 sm:p-2 lg:hidden dark:hover:bg-white/10"
//         >
//           <Menu className="h-5 w-5" />
//         </button>
//         <h1 className="hidden min-w-0 flex-1 truncate text-xs font-semibold text-gray-500 sm:block sm:text-sm md:text-base dark:text-gray-400">
//           AI Resume Analyzer
//         </h1>
//       </div>
//       <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-0.5 sm:gap-1.5 md:gap-2">
//         <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 shrink-0 rounded-xl sm:h-10 sm:w-10">
//           {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//         </Button>
//         <button
//           onClick={() => navigate("/profile")}
//           className="flex max-w-full cursor-pointer items-center gap-1.5 border-l border-gray-200 pl-2 transition-opacity hover:opacity-80 sm:gap-2 sm:pl-3 md:gap-3 dark:border-white/10"
//         >
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 sm:h-9 sm:w-9 sm:text-sm">
//             {user?.name?.charAt(0).toUpperCase() || "U"}
//           </div>
//           <div className="hidden min-w-0 text-left md:block">
//             <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user?.name || "User"}</p>
//             <p className="text-[11px] capitalize text-gray-500 dark:text-gray-500">{user?.role?.replace(/_/g, " ") || "Member"}</p>
//           </div>
//         </button>
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={handleLogout}
//           className="h-9 w-9 shrink-0 rounded-xl text-gray-400 hover:text-red-400 sm:h-10 sm:w-10"
//         >
//           <LogOut className="h-5 w-5" />
//         </Button>
//       </div>
//     </header>
//   );
// }
import { Menu, Moon, Sun, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export function Navbar({ onMenuClick }) {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/");
    };
    return (_jsx("header", { className: "sticky top-0 z-30 w-full border-b border-[#e5d8df] bg-[#fffaf2]/90 text-[#29182f] shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#100b16]/90 dark:text-[#f7f1fa]", children: _jsxs("div", { className: "flex min-h-[76px] w-full items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-7", children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: [_jsx("button", { type: "button", onClick: onMenuClick, "aria-label": "Open navigation menu", className: "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e8dce2] text-[#6e4b6b] transition hover:bg-[#f2e8ef] lg:hidden dark:border-white/10 dark:text-[#d3b4d8] dark:hover:bg-white/[0.07]", children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("div", { className: "hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#9b7620] sm:flex dark:border-[#d4af37]/25 dark:bg-[#d4af37]/10 dark:text-[#e1c15e]", children: _jsx(Sparkles, { className: "h-5 w-5" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "truncate text-sm font-bold tracking-tight sm:text-base md:text-lg", children: "Your Career Workspace" }), _jsx("p", { className: "hidden text-xs text-[#806f82] sm:block dark:text-[#a99aac]", children: "Make your next career move with confidence" })] })] })] }), _jsxs("div", { className: "ml-auto flex shrink-0 items-center gap-2 sm:gap-3", children: [_jsx(Button, { type: "button", variant: "ghost", size: "icon", onClick: toggleTheme, "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode", title: theme === "dark" ? "Switch to light mode" : "Switch to dark mode", className: "h-10 w-10 rounded-full border border-[#e5d8df] bg-white/60 text-[#6e4b6b] transition hover:scale-105 hover:bg-[#f2e8ef] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#e4c7ec] dark:hover:bg-white/[0.09]", children: theme === "dark" ? _jsx(Sun, { className: "h-5 w-5 text-[#d4af37]" }) : _jsx(Moon, { className: "h-5 w-5" }) }), _jsxs("button", { type: "button", onClick: () => navigate("/profile"), "aria-label": "Open profile", className: "group flex min-w-0 items-center gap-2 rounded-2xl border border-transparent px-2 py-1.5 text-left transition hover:border-[#e5d8df] hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/[0.05] sm:gap-3 sm:px-3", children: [_jsx("span", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#70436d] via-[#87547d] to-[#b18ac0] text-sm font-bold text-white shadow-md shadow-[#70436d]/20 ring-2 ring-white/70 dark:ring-white/10 sm:h-10 sm:w-10", children: user?.name?.trim()?.charAt(0).toUpperCase() || "U" }), _jsxs("span", { className: "hidden min-w-0 md:block", children: [_jsx("span", { className: "block max-w-[180px] truncate text-sm font-semibold text-[#29182f] dark:text-[#f7f1fa]", children: user?.name || "Your Profile" }), _jsx("span", { className: "block max-w-[180px] truncate text-xs capitalize text-[#806f82] dark:text-[#a99aac]", children: user?.role?.replace(/_/g, " ") || "CareerLens Member" })] }), _jsx(ChevronDown, { className: "hidden h-4 w-4 text-[#9a879c] transition-transform group-hover:translate-y-0.5 md:block" })] }), _jsx("span", { className: "hidden h-8 w-px bg-[#e5d8df] dark:bg-white/10 sm:block" }), _jsxs(Button, { type: "button", onClick: handleLogout, className: "h-10 gap-2 rounded-xl border border-[#ead4d7] bg-[#fff0f0] px-3 text-sm font-semibold text-[#a13e4b] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#d99aa3] hover:bg-[#ffe2e5] hover:shadow-md dark:border-[#8d3d4b]/40 dark:bg-[#7f2938]/15 dark:text-[#ffb8c1] dark:hover:border-[#b75b68]/60 dark:hover:bg-[#7f2938]/30 sm:px-4", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Logout" })] })] })] }) }));
}
