import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Brain } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useAuth } from "@/hooks/useAuth";
// import { SocialAuthButtons } from "@/components/SocialAuthButtons";
// import { loginSchema, type LoginFormData } from "@/validators/auth";
// export function LoginPage() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: "",
//     password: "",
//   });
//   const [apiError, setApiError] = useState("");
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//     setApiError("");
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setApiError("");
//     const result = loginSchema.safeParse(formData);
//     if (!result.success) {
//       const fieldErrors: Record<string, string> = {};
//       for (const issue of result.error.issues) {
//         const key = String(issue.path[0]);
//         if (key) {
//           fieldErrors[key] = issue.message;
//         }
//       }
//       setErrors(fieldErrors);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       await login(formData);
//       toast.success("Welcome back!", {
//         description: "You've been logged in successfully",
//       });
//       navigate("/dashboard");
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { message?: string } } };
//       const msg = error.response?.data?.message || "Login failed. Please try again.";
//       setApiError(msg);
//       toast.error("Login failed", { description: msg });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div>
//       <div className="mb-8 flex items-center gap-2 lg:hidden">
//         <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
//           <Brain className="h-5 w-5 text-white" />
//         </div>
//         <span className="text-xl font-bold text-gray-900 dark:text-white">
//           ResumeAI
//         </span>
//       </div>
//       <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
//         Welcome back
//       </h2>
//       <p className="mb-8 text-gray-600 dark:text-gray-400">
//         Sign in to your account to continue
//       </p>
//       {apiError && (
//         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
//           {apiError}
//         </div>
//       )}
//       <SocialAuthButtons />
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           id="email"
//           name="email"
//           type="email"
//           label="Email"
//           placeholder="you@example.com"
//           value={formData.email}
//           onChange={handleChange}
//           error={errors.email}
//         />
//         <Input
//           id="password"
//           name="password"
//           type="password"
//           label="Password"
//           placeholder="••••••••"
//           value={formData.password}
//           onChange={handleChange}
//           error={errors.password}
//         />
//         <Button type="submit" className="w-full" isLoading={isLoading}>
//           Sign In
//         </Button>
//       </form>
//       <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
//         Don't have an account?{" "}
//         <Link
//           to="/register"
//           className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
//         >
//           Create one
//         </Link>
//       </p>
//     </div>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { loginSchema } from "@/validators/auth";
export function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        setApiError("");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setApiError("");
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = {};
            for (const issue of result.error.issues) {
                const key = String(issue.path[0]);
                if (key)
                    fieldErrors[key] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }
        setIsLoading(true);
        try {
            await login(formData);
            toast.success("Welcome back!", {
                description: "Let's continue building your next opportunity.",
            });
            navigate("/dashboard");
        }
        catch (err) {
            const error = err;
            const message = error.response?.data?.message ||
                "We couldn't sign you in. Check your details and try again.";
            setApiError(message);
            toast.error("Sign-in unsuccessful", { description: message });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "career-auth-form w-full", children: [_jsxs(Link, { to: "/", "aria-label": "CareerLens home", className: "mb-7 inline-flex items-center gap-3 lg:hidden", children: [_jsx("img", { src: "/logo.png", alt: "CareerLens", className: "h-11 w-11 object-contain" }), _jsx("span", { className: "text-xl font-bold tracking-tight", children: "CareerLens" })] }), _jsxs("div", { className: "mb-7", children: [_jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full border border-[#b58ab5]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em]", children: [_jsx(LockKeyhole, { className: "h-3.5 w-3.5" }), "Your journey continues"] }), _jsxs("h1", { className: "career-form-heading text-4xl font-semibold leading-tight", children: ["Welcome back", _jsx("span", { className: "text-[#b58b49]", children: "." })] }), _jsx("p", { className: "career-form-muted mt-3 text-sm leading-6 sm:text-base", children: "Pick up where you left off. Your next opportunity could be closer than you think." })] }), apiError && (_jsx("div", { role: "alert", className: "mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-400", children: apiError })), _jsx("div", { className: "mb-5", children: _jsx(SocialAuthButtons, {}) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { id: "email", name: "email", type: "email", label: "Email address", placeholder: "example@gmail.com", value: formData.email, onChange: handleChange, error: errors.email }), _jsx(Input, { id: "password", name: "password", type: "password", label: "Password", placeholder: "*******", value: formData.password, onChange: handleChange, error: errors.password }), _jsxs(Button, { type: "submit", className: "career-submit w-full gap-2 font-semibold", isLoading: isLoading, children: ["Sign in to CareerLens", !isLoading && _jsx(ArrowRight, { className: "h-4 w-4" })] })] }), _jsxs("p", { className: "career-form-muted mt-6 text-center text-sm", children: ["New to CareerLens?", " ", _jsx(Link, { to: "/register", className: "career-form-link font-semibold underline-offset-4 hover:underline", children: "Create your account" })] }), _jsx("p", { className: "career-form-muted mt-5 text-center text-xs", children: "Your next move starts with a fresh perspective." })] }));
}
