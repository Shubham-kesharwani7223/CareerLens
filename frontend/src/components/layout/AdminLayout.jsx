import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

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
              <p className="text-xl font-bold">
                CareerLens
              </p>
              <p className="text-xs text-[#806f82] dark:text-[#b7a5ba]">
                Administration Console
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#8a668d]" />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                Administrator
              </p>
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
              Logout
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