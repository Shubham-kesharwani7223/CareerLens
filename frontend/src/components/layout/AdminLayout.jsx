// import { Link, useNavigate } from "react-router-dom";
// import { LogOut, ShieldCheck } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";
// import { toast } from "sonner";

// export function AdminLayout({ children }) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/");
//   };

//   return (
//     <div className="min-h-screen bg-[#F7F0E5] text-[#29182F] dark:bg-[#090811] dark:text-[#F7F1FA]">
//       <header className="sticky top-0 z-30 border-b border-[#e5d8df] bg-[#fffaf2] dark:border-white/10 dark:bg-[#100b16]">
//         <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
//           <Link to="/admin" className="flex items-center gap-3">
//             <img
//               src="/logo.png"
//               alt="CareerLens"
//               className="h-10 w-10 object-contain"
//             />

//             <div>
//               <p className="text-xl font-bold">
//                 CareerLens
//               </p>
//               <p className="text-xs text-[#806f82] dark:text-[#b7a5ba]">
//                 Administration Console
//               </p>
//             </div>
//           </Link>

//           <div className="flex items-center gap-3">
//             <ShieldCheck className="h-5 w-5 text-[#8a668d]" />

//             <div className="hidden text-right sm:block">
//               <p className="text-sm font-semibold">
//                 Administrator
//               </p>
//               <p className="max-w-[220px] truncate text-xs text-[#806f82] dark:text-[#b7a5ba]">
//                 {user?.email}
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={handleLogout}
//               className="flex items-center gap-2 rounded-xl border border-[#ead4d7] bg-[#fff0f0] px-4 py-2.5 text-sm font-semibold text-[#a13e4b] hover:bg-[#ffe2e5]"
//             >
//               <LogOut className="h-4 w-4" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
//         {children}
//       </main>
//     </div>
//   );
// }







































import { Link, useNavigate } from "react-router-dom";
import {
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

export function AdminLayout({ children }) {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navClass =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#655568] transition hover:bg-[#f1e6ef] dark:text-[#d4c4d9] dark:hover:bg-white/[0.07]";

  return (
    <div className="min-h-screen bg-[#F7F0E5] text-[#29182F] dark:bg-[#090811] dark:text-[#F7F1FA]">
      <header className="sticky top-0 z-30 border-b border-[#e5d8df] bg-[#fffaf2] dark:border-white/10 dark:bg-[#100b16]">
        <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="CareerLens"
              className="h-10 w-10 object-contain"
            />

            <div>
              <span className="truncate text-xl font-bold tracking-tight text-[#29182f] dark:text-[#f7f1fa]">
              Career
              <span className="bg-gradient-to-r from-[#A17B37] via-[#B779A8] to-[#A855F7] bg-clip-text text-transparent">
                Lens
              </span>
              </span>
              <p className="text-xs text-[#806f82] dark:text-[#b7a5ba]">
                Administration Console
              </p>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Admin navigation"
          >
            <Link to="/admin" className={navClass}>
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>

            <Link to="/admin/gamification" className={navClass}>
              <Gamepad2 className="h-4 w-4" />
              Quiz & Game Studio
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              title={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5d8df] bg-white text-[#76516f] transition hover:bg-[#f1e6ef] dark:border-white/10 dark:bg-white/[0.04] dark:text-[#e4c7ed] dark:hover:bg-white/[0.09]"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <ShieldCheck className="hidden h-5 w-5 text-[#8a668d] sm:block" />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Administrator</p>
              <p className="max-w-[220px] truncate text-xs text-[#806f82] dark:text-[#b7a5ba]">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-[#ead4d7] bg-[#fff0f0] px-4 py-2.5 text-sm font-semibold text-[#a13e4b] hover:bg-[#ffe2e5]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
