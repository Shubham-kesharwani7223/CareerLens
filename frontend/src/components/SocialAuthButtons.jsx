// // import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useGoogleLogin } from "@react-oauth/google";
// // import { toast } from "sonner";
// // import { useAuth } from "@/hooks/useAuth";
// // import { API_URL, TOKEN_KEY } from "@/utils/constants";
// // function GoogleIcon() {
// //     return (_jsxs("svg", { className: "h-5 w-5 shrink-0", viewBox: "0 0 24 24", "aria-hidden": "true", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })] }));
// // }
// // export function SocialAuthButtons() {
// //     const navigate = useNavigate();
// //     const [isLoading, setIsLoading] = useState(false);
// //     const googleLogin = useGoogleLogin({
// //         flow: "implicit",
// //         onSuccess: async (tokenResponse) => {
// //             // Backend verifies the Google access token.
// //             if (!tokenResponse?.access_token) {
// //                 toast.error("No access token from Google. Please try again.");
// //                 return;
// //             }
// //             setIsLoading(true);
// //             try {
// //                 const res = await fetch(`${API_URL}/auth/google`, {
// //                     method: "POST",
// //                     headers: {
// //                         "Content-Type": "application/json",
// //                     },
// //                     body: JSON.stringify({
// //                         credential: tokenResponse.access_token,
// //                     }),
// //                 });
// //                 const data = (await res.json());
// //                 if (!res.ok) {
// //                     toast.error(data.message || "Google sign-in failed");
// //                     return;
// //                 }
// //                 if (!data.token || !data.user) {
// //                     toast.error("Invalid response from server. Please try again.");
// //                     return;
// //                 }
// //                 localStorage.setItem(TOKEN_KEY, data.token);
// //                 useAuth.setState({
// //                     user: data.user,
// //                     token: data.token,
// //                     isAuthenticated: true,
// //                     isLoading: false,
// //                 });
// //                 toast.success(`Welcome${data.user?.name
// //                     ? `, ${data.user.name.split(" ")[0]}`
// //                     : ""}! 🎉`);
// //                 navigate(
// //                 result.user?.isAdmin === true
// //                     ? "/admin"
// //                     : "/dashboard",
// //                 { replace: true }
// //                 );
// //             }
// //             catch {
// //                 toast.error("Google sign-in failed. Please try again.");
// //             }
// //             finally {
// //                 setIsLoading(false);
// //             }
// //         },
// //         onError: () => {
// //             toast.error("Google sign-in was cancelled");
// //         },
// //     });
// //     return (_jsxs("div", { className: "mb-6", children: [_jsxs("button", { type: "button", onClick: () => googleLogin(), disabled: isLoading, className: "flex h-12 w-full items-center justify-center gap-3\n        rounded-xl border border-[#684b68]\n        bg-[#684b68] px-4\n        text-sm font-semibold text-white\n        shadow-sm transition-all duration-200\n        hover:border-[#795a79] hover:bg-[#795a79]\n        focus-visible:outline-none\n        focus-visible:ring-2 focus-visible:ring-purple-500/50\n        disabled:cursor-not-allowed disabled:opacity-60\n        dark:border-[#684b68]\n        dark:bg-[#684b68]\n        dark:text-white\n        dark:hover:border-[#795a79]\n        dark:hover:bg-[#795a79]\n      ", children: [isLoading ? (_jsx("div", { className: "h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[#8b708b] border-t-transparent" })) : (_jsx(GoogleIcon, {})), _jsx("span", { children: isLoading ? "Signing in..." : "Continue with Google" })] }), _jsxs("div", { className: "relative my-6", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-[#d8cbd6] dark:border-[#49364a]" }) }), _jsx("div", { className: "relative flex justify-center", children: _jsx("span", { className: "\n              bg-[#fffaf2] px-4 py-1\n              text-xs font-semibold uppercase\n              tracking-[0.14em]\n              text-[#756579]\n              dark:bg-[#211522]\n              dark:text-[#c5b5c7]\n            ", children: "Or continue with email" }) })] })] }));
// // }




































// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGoogleLogin } from "@react-oauth/google";
// import { toast } from "sonner";

// import { useAuth } from "@/hooks/useAuth";
// import { API_URL, TOKEN_KEY } from "@/utils/constants";

// function GoogleIcon() {
//   return (
//     <svg
//       className="h-5 w-5 shrink-0"
//       viewBox="0 0 24 24"
//       aria-hidden="true"
//     >
//       <path
//         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
//         fill="#4285F4"
//       />
//       <path
//         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//         fill="#34A853"
//       />
//       <path
//         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//         fill="#FBBC05"
//       />
//       <path
//         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//         fill="#EA4335"
//       />
//     </svg>
//   );
// }

// export function SocialAuthButtons({
//   mode = "login",
//   dividerText = "Or continue with email",
// }) {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   // Role selection belongs only to Google sign-up.
//   const [selectedRole, setSelectedRole] = useState("fresher");
//   const [customRole, setCustomRole] = useState("");

//   const googleLogin = useGoogleLogin({
//     flow: "implicit",

//     onSuccess: async (tokenResponse) => {
//       if (!tokenResponse?.access_token) {
//         toast.error("Google did not return an access token.");
//         return;
//       }

//       const requestBody = {
//         credential: tokenResponse.access_token,
//         mode,
//       };

//       if (mode === "signup") {
//         if (
//           selectedRole === "other" &&
//           customRole.trim().length < 2
//         ) {
//           toast.error("Please enter your career role.");
//           return;
//         }

//         requestBody.role = selectedRole;

//         if (selectedRole === "other") {
//           requestBody.customRole = customRole.trim();
//         }
//       }

//       setIsLoading(true);

//       try {
//         const response = await fetch(`${API_URL}/auth/google`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           toast.error(
//             data.message || "Google authentication failed."
//           );
//           return;
//         }

//         if (!data.token || !data.user) {
//           toast.error("Invalid response from server.");
//           return;
//         }

//         localStorage.setItem(TOKEN_KEY, data.token);

//         useAuth.setState({
//           user: data.user,
//           token: data.token,
//           isAuthenticated: true,
//           isLoading: false,
//         });

//         toast.success(
//           `Welcome${
//             data.user.name
//               ? `, ${data.user.name.split(" ")[0]}`
//               : ""
//           }!`
//         );

//         navigate(
//           data.user.isAdmin === true
//             ? "/admin"
//             : "/dashboard",
//           { replace: true }
//         );
//       } catch (error) {
//         console.error("Google authentication error:", error);
//         toast.error("Google sign-in failed. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     },

//     onError: () => {
//       toast.error("Google sign-in was cancelled.");
//     },
//   });

//   return (
//     <div className="mb-6">
//       {mode === "signup" && (
//         <div className="mb-4 space-y-2">
//           <label
//             htmlFor="google-signup-role"
//             className="block text-sm font-medium text-[#4c3150] dark:text-[#e7d5ed]"
//           >
//             Career role for Google account
//           </label>

//           <select
//             id="google-signup-role"
//             value={selectedRole}
//             onChange={(event) => setSelectedRole(event.target.value)}
//             disabled={isLoading}
//             className="h-12 w-full rounded-xl border border-[#d8cbd6] bg-[#fffaf2] px-4 text-sm text-[#29182f] outline-none focus:border-[#8a668d] focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 dark:border-[#49364a] dark:bg-[#211522] dark:text-white"
//           >
//             <option value="fresher">Fresher</option>
//             <option value="developer">Developer</option>
//             <option value="software_engineer">Software Engineer</option>
//             <option value="ai_engineer">AI Engineer</option>
//             <option value="ai_ml_engineer">AI / ML Engineer</option>
//             <option value="other">Other</option>
//           </select>

//           {selectedRole === "other" && (
//             <input
//               type="text"
//               value={customRole}
//               onChange={(event) => setCustomRole(event.target.value)}
//               placeholder="Enter your career role"
//               maxLength={50}
//               disabled={isLoading}
//               className="h-12 w-full rounded-xl border border-[#d8cbd6] bg-[#fffaf2] px-4 text-sm text-[#29182f] outline-none focus:border-[#8a668d] focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 dark:border-[#49364a] dark:bg-[#211522] dark:text-white"
//             />
//           )}
//         </div>
//       )}

//       <button
//         type="button"
//         onClick={() => googleLogin()}
//         disabled={isLoading}
//         className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#684b68] bg-[#684b68] px-4 text-sm font-semibold text-white shadow-sm transition hover:border-[#795a79] hover:bg-[#795a79] disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {isLoading ? (
//           <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
//         ) : (
//           <GoogleIcon />
//         )}

//         <span>
//           {isLoading ? "Signing in..." : "Continue with Google"}
//         </span>
//       </button>

//       <div className="relative my-6">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-[#d8cbd6] dark:border-[#49364a]" />
//         </div>

//         <div className="relative flex justify-center">
//           <span className="bg-[#fffaf2] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#756579] dark:bg-[#211522] dark:text-[#c5b5c7]">
//             {dividerText}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }



























































import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { API_URL, TOKEN_KEY } from "@/utils/constants";

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SocialAuthButtons({
  mode = "login",
  dividerText = "Or continue with email",
  referralCode = "",
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState("fresher");
  const [customRole, setCustomRole] = useState("");

  const normalizedReferralCode = String(referralCode || "")
    .trim()
    .toUpperCase();

  const googleLogin = useGoogleLogin({
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      if (!tokenResponse?.access_token) {
        toast.error("Google did not return an access token.");
        return;
      }

      if (
        mode === "signup" &&
        selectedRole === "other" &&
        customRole.trim().length < 2
      ) {
        toast.error("Please enter your career role.");
        return;
      }

      const requestBody = {
        credential: tokenResponse.access_token,
        mode,
      };

      if (mode === "signup") {
        requestBody.role = selectedRole;

        if (selectedRole === "other") {
          requestBody.customRole = customRole.trim();
        }

        // Forward referral code only during signup.
        if (normalizedReferralCode) {
          requestBody.referralCode = normalizedReferralCode;
        }
      }

      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(
            data.message || "Google authentication failed."
          );
          return;
        }

        // Support both direct and wrapped response formats.
        const authResult = data.data || data;
        const user = authResult.user;
        const token = authResult.token;

        if (!token || !user) {
          toast.error("Invalid response from server.");
          return;
        }

        localStorage.setItem(TOKEN_KEY, token);

        useAuth.setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success(
          `Welcome${user.name ? `, ${user.name.split(" ")[0]}` : ""}!`
        );

        navigate(
          user.isAdmin === true ? "/admin" : "/dashboard",
          { replace: true }
        );
      } catch (error) {
        console.error("Google authentication error:", error);
        toast.error("Google sign-in failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },

    onError: () => {
      toast.error("Google sign-in was cancelled.");
    },
  });

  return (
    <div className="mb-6">
      {mode === "signup" && (
        <div className="mb-4 space-y-2">
          <label
            htmlFor="google-signup-role"
            className="block text-sm font-medium text-[#4c3150] dark:text-[#e7d5ed]"
          >
            Career role for Google account
          </label>

          <select
            id="google-signup-role"
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border border-[#d8cbd6] bg-[#fffaf2] px-4 text-sm text-[#29182f] outline-none focus:border-[#8a668d] focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 dark:border-[#49364a] dark:bg-[#211522] dark:text-white"
          >
            <option value="fresher">Fresher</option>
            <option value="developer">Developer</option>
            <option value="software_engineer">Software Engineer</option>
            <option value="ai_engineer">AI Engineer</option>
            <option value="ai_ml_engineer">AI / ML Engineer</option>
            <option value="other">Other</option>
          </select>

          {selectedRole === "other" && (
            <input
              type="text"
              value={customRole}
              onChange={(event) => setCustomRole(event.target.value)}
              placeholder="Enter your career role"
              maxLength={50}
              disabled={isLoading}
              className="h-12 w-full rounded-xl border border-[#d8cbd6] bg-[#fffaf2] px-4 text-sm text-[#29182f] outline-none focus:border-[#8a668d] focus:ring-2 focus:ring-purple-500/20 disabled:opacity-60 dark:border-[#49364a] dark:bg-[#211522] dark:text-white"
            />
          )}

          {normalizedReferralCode && (
            <p className="rounded-lg border border-[#b58ab5]/30 bg-[#b58ab5]/10 px-3 py-2 text-sm">
              Referral code:{" "}
              <strong>{normalizedReferralCode}</strong>
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => googleLogin()}
        disabled={isLoading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#684b68] bg-[#684b68] px-4 text-sm font-semibold text-white shadow-sm transition hover:border-[#795a79] hover:bg-[#795a79] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
        ) : (
          <GoogleIcon />
        )}

        <span>
          {isLoading ? "Signing in..." : "Continue with Google"}
        </span>
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#d8cbd6] dark:border-[#49364a]" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-[#fffaf2] px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#756579] dark:bg-[#211522] dark:text-[#c5b5c7]">
            {dividerText}
          </span>
        </div>
      </div>
    </div>
  );
}
