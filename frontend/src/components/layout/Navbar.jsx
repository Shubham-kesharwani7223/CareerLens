// // 













































// import { Menu, Moon, Sun, LogOut, Sparkles, ChevronDown, Crown } from "lucide-react";
// import { useTheme } from "@/hooks/useTheme";
// import { useAuth } from "@/hooks/useAuth";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// export function Navbar({ onMenuClick }) {
//   const { theme, toggleTheme } = useTheme();
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const isPro = user?.isPro === true;

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/");
//   };

//   return (
//     <header className="sticky top-0 z-30 w-full border-b border-[#e5d8df] bg-[#fffaf2]/90 text-[#29182f] shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#100b16]/90 dark:text-[#f7f1fa]">
//       <div className="flex min-h-[76px] w-full items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-7">
//         <div className="flex min-w-0 flex-1 items-center gap-3">
//           <button
//             type="button"
//             onClick={onMenuClick}
//             aria-label="Open navigation menu"
//             className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e8dce2] text-[#6e4b6b] transition hover:bg-[#f2e8ef] lg:hidden dark:border-white/10 dark:text-[#d3b4d8] dark:hover:bg-white/[0.07]"
//           >
//             <Menu className="h-5 w-5" />
//           </button>
//           <div className="flex min-w-0 items-center gap-3">
//             <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#9b7620] sm:flex dark:border-[#d4af37]/25 dark:bg-[#d4af37]/10 dark:text-[#e1c15e]">
//               <Sparkles className="h-5 w-5" />
//             </div>
//             <div className="min-w-0">
//               <h1 className="truncate text-sm font-bold tracking-tight sm:text-base md:text-lg">Your Career Workspace</h1>
//               <p className="hidden text-xs text-[#806f82] sm:block dark:text-[#a99aac]">Make your next career move with confidence</p>
//             </div>
//           </div>
//         </div>

//         <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
//           <Button
//             type="button"
//             onClick={() => navigate("/pricing")}
//             className="hidden h-10 gap-2 rounded-xl border border-[#694B68] bg-[#694B68] px-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#563A53] sm:inline-flex sm:px-4"
//             aria-label={isPro ? "View CareerLens Pro plan" : "Upgrade to CareerLens Pro"}
//           >
//             <Crown className="h-4 w-4 text-[#F3D38A]" />
//             <span>{isPro ? "Pro Plan" : "Upgrade to Pro"}</span>
//           </Button>

//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={toggleTheme}
//             aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
//             title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
//             className="h-10 w-10 rounded-full border border-[#e5d8df] bg-white/60 text-[#6e4b6b] transition hover:scale-105 hover:bg-[#f2e8ef] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#e4c7ec] dark:hover:bg-white/[0.09]"
//           >
//             {theme === "dark" ? <Sun className="h-5 w-5 text-[#d4af37]" /> : <Moon className="h-5 w-5" />}
//           </Button>

//           <button
//             type="button"
//             onClick={() => navigate("/profile")}
//             aria-label="Open profile"
//             className="group flex min-w-0 items-center gap-2 rounded-2xl border border-transparent px-2 py-1.5 text-left transition hover:border-[#e5d8df] hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/[0.05] sm:gap-3 sm:px-3"
//           >
//             <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#70436d] via-[#87547d] to-[#b18ac0] text-sm font-bold text-white shadow-md shadow-[#70436d]/20 ring-2 ring-white/70 dark:ring-white/10 sm:h-10 sm:w-10">
//               {user?.name?.trim()?.charAt(0).toUpperCase() || "U"}
//             </span>
//             <span className="hidden min-w-0 md:block">
//               <span className="block max-w-[180px] truncate text-sm font-semibold text-[#29182f] dark:text-[#f7f1fa]">{user?.name || "Your Profile"}</span>
//               <span className="block max-w-[180px] truncate text-xs capitalize text-[#806f82] dark:text-[#a99aac]">{user?.role?.replace(/_/g, " ") || "CareerLens Member"}</span>
//             </span>
//             <ChevronDown className="hidden h-4 w-4 text-[#9a879c] transition-transform group-hover:translate-y-0.5 md:block" />
//           </button>

//           <span className="hidden h-8 w-px bg-[#e5d8df] dark:bg-white/10 sm:block" />
//           <Button
//             type="button"
//             onClick={handleLogout}
//             className="h-10 gap-2 rounded-xl border border-[#ead4d7] bg-[#fff0f0] px-3 text-sm font-semibold text-[#a13e4b] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#d99aa3] hover:bg-[#ffe2e5] hover:shadow-md dark:border-[#8d3d4b]/40 dark:bg-[#7f2938]/15 dark:text-[#ffb8c1] dark:hover:border-[#b75b68]/60 dark:hover:bg-[#7f2938]/30 sm:px-4"
//           >
//             <LogOut className="h-4 w-4" />
//             <span className="hidden sm:inline">Logout</span>
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// }











































































import {
  Menu,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  ChevronDown,
  Crown,
} from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isPro = user?.isPro === true || user?.isAdmin === true;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#e5d8df] bg-[#fffaf2]/90 text-[#29182f] shadow-sm backdrop-blur-xl transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#100b16]/90 dark:text-[#f7f1fa]">
      <div className="flex min-h-[76px] w-full items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e8dce2] text-[#6e4b6b] transition hover:bg-[#f2e8ef] lg:hidden dark:border-white/10 dark:text-[#d3b4d8] dark:hover:bg-white/[0.07]"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#9b7620] sm:flex dark:border-[#d4af37]/25 dark:bg-[#d4af37]/10 dark:text-[#e1c15e]">
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold tracking-tight sm:text-base md:text-lg">
                Your Career Workspace
              </h1>
              <p className="hidden text-xs text-[#806f82] sm:block dark:text-[#a99aac]">
                Make your next career move with confidence
              </p>
            </div>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Button
            type="button"
            onClick={() => navigate("/pricing")}
            className="hidden h-10 gap-2 rounded-xl border border-[#694B68] bg-[#694B68] px-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#563A53] sm:inline-flex sm:px-4"
            aria-label={
              isPro
                ? "View CareerLens Pro plan"
                : "Upgrade to CareerLens Pro"
            }
          >
            <Crown className="h-4 w-4 text-[#F3D38A]" />
            <span>{isPro ? "Pro Plan" : "Upgrade to Pro"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className="h-10 w-10 rounded-full border border-[#e5d8df] bg-white/60 text-[#6e4b6b] transition hover:scale-105 hover:bg-[#f2e8ef] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#e4c7ec] dark:hover:bg-white/[0.09]"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-[#d4af37]" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            aria-label="Open profile"
            className="group flex min-w-0 items-center gap-2 rounded-2xl border border-transparent px-2 py-1.5 text-left transition hover:border-[#e5d8df] hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/[0.05] sm:gap-3 sm:px-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#70436d] via-[#87547d] to-[#b18ac0] text-sm font-bold text-white shadow-md shadow-[#70436d]/20 ring-2 ring-white/70 dark:ring-white/10 sm:h-10 sm:w-10">
              {user?.name?.trim()?.charAt(0).toUpperCase() || "U"}
            </span>

            <span className="hidden min-w-0 md:block">
              <span className="block max-w-[180px] truncate text-sm font-semibold text-[#29182f] dark:text-[#f7f1fa]">
                {user?.name || "Your Profile"}
              </span>
              <span className="block max-w-[180px] truncate text-xs capitalize text-[#806f82] dark:text-[#a99aac]">
                {user?.role?.replace(/_/g, " ") || "CareerLens Member"}
              </span>
            </span>

            <ChevronDown className="hidden h-4 w-4 text-[#9a879c] transition-transform group-hover:translate-y-0.5 md:block" />
          </button>

          <span className="hidden h-8 w-px bg-[#e5d8df] dark:bg-white/10 sm:block" />

          <Button
            type="button"
            onClick={handleLogout}
            className="h-10 gap-2 rounded-xl border border-[#ead4d7] bg-[#fff0f0] px-3 text-sm font-semibold text-[#a13e4b] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#d99aa3] hover:bg-[#ffe2e5] hover:shadow-md dark:border-[#8d3d4b]/40 dark:bg-[#7f2938]/15 dark:text-[#ffb8c1] dark:hover:border-[#b75b68]/60 dark:hover:bg-[#7f2938]/30 sm:px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}