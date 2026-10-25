// import { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";

// export function AdminRoute({ children }) {
//   const { user, isAuthenticated, loadUser } = useAuth();
//   const [checking, setChecking] = useState(true);
//   const location = useLocation();

//   useEffect(() => {
//     let active = true;

//     Promise.resolve(loadUser()).finally(() => {
//       if (active) {
//         setChecking(false);
//       }
//     });

//     return () => {
//       active = false;
//     };
//   }, [loadUser]);

//   if (checking) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         Checking administrator access...
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <Navigate
//         to="/login"
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   if (user?.isAdmin !== true) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// }















































import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function AdminRoute({ children }) {
  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const loadUser = useAuth((state) => state.loadUser);
  const location = useLocation();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(() => loadUser())
      .catch(() => {
        // The auth store handles failed profile requests.
      })
      .finally(() => {
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
      <div className="flex min-h-screen items-center justify-center bg-[#F7F0E5] text-[#29182F] dark:bg-[#090811] dark:text-[#F7F1FA]">
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
