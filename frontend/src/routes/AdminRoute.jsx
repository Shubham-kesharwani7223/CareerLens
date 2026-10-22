import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminRoute({ children }) {
  const { user, isAuthenticated, loadUser } = useAuth();
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let active = true;

    Promise.resolve(loadUser()).finally(() => {
      if (active) {
        setChecking(false);
      }
    });

    return () => {
      active = false;
    };
  }, [loadUser]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking administrator access...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (user?.isAdmin !== true) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}