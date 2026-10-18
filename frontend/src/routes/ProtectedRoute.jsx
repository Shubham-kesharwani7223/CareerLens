import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
export function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-white dark:bg-gray-950", children: _jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
