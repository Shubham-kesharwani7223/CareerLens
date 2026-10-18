import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Brain } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select } from "@/components/ui/select";
// import { useAuth } from "@/hooks/useAuth";
// import { SocialAuthButtons } from "@/components/SocialAuthButtons";
// import { registerSchema, type RegisterFormData } from "@/validators/auth";
// import { USER_ROLES } from "@/types";
// export function RegisterPage() {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [apiError, setApiError] = useState("");
//   const [formData, setFormData] = useState<RegisterFormData>({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "fresher",
//     customRole: "",
//   });
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
//     setApiError("");
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setApiError("");
//     const result = registerSchema.safeParse(formData);
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
//       await register({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         customRole: formData.role === "other" ? formData.customRole : undefined,
//       });
//       toast.success("Account created successfully!", {
//         description: "Welcome to AI Resume Analyzer",
//       });
//       navigate("/dashboard");
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { message?: string } } };
//       const msg = error.response?.data?.message || "Registration failed. Please try again.";
//       setApiError(msg);
//       toast.error("Registration failed", { description: msg });
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
//         Create your account
//       </h2>
//       <p className="mb-8 text-gray-600 dark:text-gray-400">
//         Start analyzing your resume with AI
//       </p>
//       {apiError && (
//         <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
//           {apiError}
//         </div>
//       )}
//       <SocialAuthButtons />
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           id="name"
//           name="name"
//           type="text"
//           label="Full Name"
//           placeholder="John Doe"
//           value={formData.name}
//           onChange={handleChange}
//           error={errors.name}
//         />
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
//         <Select
//           id="role"
//           name="role"
//           label="Your Role"
//           value={formData.role}
//           onChange={handleChange}
//           error={errors.role}
//           options={USER_ROLES}
//         />
//         {formData.role === "other" && (
//           <Input
//             id="customRole"
//             name="customRole"
//             type="text"
//             label="Specify Your Role"
//             placeholder="e.g., Data Scientist"
//             value={formData.customRole}
//             onChange={handleChange}
//             error={errors.customRole}
//           />
//         )}
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
//         <Input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           label="Confirm Password"
//           placeholder="••••••••"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           error={errors.confirmPassword}
//         />
//         <Button type="submit" className="w-full" isLoading={isLoading}>
//           Create Account
//         </Button>
//       </form>
//       <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
//         Already have an account?{" "}
//         <Link
//           to="/login"
//           className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
//         >
//           Sign in
//         </Link>
//       </p>
//     </div>
//   );
// }
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight, ShieldCheck } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select } from "@/components/ui/select";
// import { useAuth } from "@/hooks/useAuth";
// import { SocialAuthButtons } from "@/components/SocialAuthButtons";
// import {
//   registerSchema,
//   type RegisterFormData,
// } from "@/validators/auth";
// import { USER_ROLES } from "@/types";
// export function RegisterPage() {
//   const navigate = useNavigate();
//   const { register } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [apiError, setApiError] = useState("");
//   const [formData, setFormData] = useState<RegisterFormData>({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "fresher",
//     customRole: "",
//   });
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     setErrors((prev) => ({
//       ...prev,
//       [e.target.name]: "",
//     }));
//     setApiError("");
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setApiError("");
//     const result = registerSchema.safeParse(formData);
//     if (!result.success) {
//       const fieldErrors: Record<string, string> = {};
//       for (const issue of result.error.issues) {
//         const key = String(issue.path[0]);
//         if (key) fieldErrors[key] = issue.message;
//       }
//       setErrors(fieldErrors);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       await register({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//         customRole:
//           formData.role === "other"
//             ? formData.customRole
//             : undefined,
//       });
//       toast.success("Welcome to CareerLens!", {
//         description: "Your career journey starts here.",
//       });
//       navigate("/dashboard");
//     } catch (err: unknown) {
//       const error = err as {
//         response?: { data?: { message?: string } };
//       };
//       const message =
//         error.response?.data?.message ||
//         "We couldn't create your account. Please try again.";
//       setApiError(message);
//       toast.error("Registration unsuccessful", {
//         description: message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="career-register w-full">
//       <style>{`
//         .career-register {
//           color: #302038;
//           font-family: Inter, ui-sans-serif, system-ui, sans-serif;
//         }
//         .career-register .register-heading {
//           font-family: Georgia, "Times New Roman", serif;
//           letter-spacing: -0.04em;
//         }
//         .career-register input,
//         .career-register select {
//           border-radius: 12px;
//           background-color: #fffaf1;
//           border-color: #dfd0d9;
//           color: #302038;
//           transition: border-color .2s, box-shadow .2s;
//         }
//         .career-register input {
//           min-height: 47px;
//         }
//         .career-register input::placeholder {
//           color: #a091a0;
//         }
//         .career-register input:focus,
//         .career-register select:focus {
//           border-color: #9a789b;
//           box-shadow: 0 0 0 3px rgba(154, 120, 155, .15);
//         }
//         .dark .career-register {
//           color: #f4eaf2;
//         }
//         .dark .career-register input,
//         .dark .career-register select {
//           background-color: #211722;
//           border-color: #49364a;
//           color: #f4eaf2;
//         }
//         .career-register .register-submit {
//           min-height: 49px;
//           border-radius: 12px;
//           color: #fffaf1;
//           background: linear-gradient(110deg, #604461, #88658b);
//           box-shadow: 0 8px 22px rgba(65, 39, 68, .16);
//           transition: transform .2s, box-shadow .2s;
//         }
//         .career-register .register-submit:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 11px 26px rgba(65, 39, 68, .24);
//         }
//       `}</style>
//       {/* Mobile branding */}
//       <Link
//         to="/"
//         className="mb-7 inline-flex items-center gap-3 lg:hidden"
//         aria-label="CareerLens home"
//       >
//         <img
//           src="/logo.png"
//           alt="CareerLens logo"
//           className="h-11 w-11 object-contain"
//         />
//         <span className="text-xl font-bold tracking-tight">
//           Career
//           <span className="text-[#a17d8d] dark:text-[#d3b08a]">
//             Lens
//           </span>
//         </span>
//       </Link>
//       {/* Heading */}
//       <div className="mb-6">
//         <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#987a8e] dark:text-[#c6a17f]">
//           A new chapter begins
//         </p>
//         <h1 className="register-heading text-3xl font-semibold leading-tight sm:text-4xl">
//           Make your next move<span className="text-[#b49a7d]">.</span>
//         </h1>
//         <p className="mt-3 text-sm leading-6 text-[#776a78] dark:text-[#b8aab8] sm:text-base">
//           Create your CareerLens account to explore your strengths,
//           sharpen your resume, and prepare for the roles you aspire to.
//         </p>
//       </div>
//       {apiError && (
//         <div
//           role="alert"
//           className="mb-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
//         >
//           {apiError}
//         </div>
//       )}
//       {/* Google authentication and its existing divider */}
//       <div className="mb-4">
//         <SocialAuthButtons />
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           id="name"
//           name="name"
//           type="text"
//           label="Full name"
//           placeholder="Enter your full name"
//           value={formData.name}
//           onChange={handleChange}
//           error={errors.name}
//         />
//         <Input
//           id="email"
//           name="email"
//           type="email"
//           label="Email address"
//           placeholder="you@example.com"
//           value={formData.email}
//           onChange={handleChange}
//           error={errors.email}
//         />
//         <Select
//           id="role"
//           name="role"
//           label="Which best describes you?"
//           value={formData.role}
//           onChange={handleChange}
//           error={errors.role}
//           options={USER_ROLES}
//         />
//         {formData.role === "other" && (
//           <Input
//             id="customRole"
//             name="customRole"
//             type="text"
//             label="Your role"
//             placeholder="e.g. Data Analyst"
//             value={formData.customRole}
//             onChange={handleChange}
//             error={errors.customRole}
//           />
//         )}
//         <Input
//           id="password"
//           name="password"
//           type="password"
//           label="Create password"
//           placeholder="Enter a secure password"
//           value={formData.password}
//           onChange={handleChange}
//           error={errors.password}
//         />
//         <Input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           label="Confirm password"
//           placeholder="Re-enter your password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           error={errors.confirmPassword}
//         />
//         <Button
//           type="submit"
//           className="register-submit w-full gap-2 font-semibold"
//           isLoading={isLoading}
//         >
//           Create my CareerLens account
//           {!isLoading && <ArrowRight className="h-4 w-4" />}
//         </Button>
//       </form>
//       <p className="mt-5 text-center text-sm text-[#776a78] dark:text-[#b8aab8]">
//         Already have an account?{" "}
//         <Link
//           to="/login"
//           className="font-semibold text-[#775675] underline-offset-4 hover:underline dark:text-[#d3b08a]"
//         >
//           Sign in
//         </Link>
//       </p>
//       <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8c7c8d] dark:text-[#a99aaa]">
//         <ShieldCheck className="h-4 w-4 text-[#a18a64]" />
//         Your information stays yours.
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { registerSchema, } from "@/validators/auth";
import { USER_ROLES } from "@/types";
export function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "fresher",
        customRole: "",
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
        const result = registerSchema.safeParse(formData);
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
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                customRole: formData.role === "other"
                    ? formData.customRole
                    : undefined,
            });
            toast.success("Welcome to CareerLens!", {
                description: "Your next chapter starts here.",
            });
            navigate("/dashboard");
        }
        catch (err) {
            const error = err;
            const message = error.response?.data?.message ||
                "We couldn't create your account. Please try again.";
            setApiError(message);
            toast.error("Registration unsuccessful", {
                description: message,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "career-auth-form w-full", children: [_jsxs(Link, { to: "/", "aria-label": "CareerLens home", className: "mb-6 inline-flex items-center gap-3 lg:hidden", children: [_jsx("img", { src: "/logo.png", alt: "CareerLens", className: "h-10 w-10 object-contain" }), _jsx("span", { className: "text-xl font-bold tracking-tight", children: "CareerLens" })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "mb-3 inline-flex items-center gap-2 rounded-full border border-[#b58ab5]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em]", children: [_jsx(UserRoundPlus, { className: "h-3.5 w-3.5" }), "Begin your journey"] }), _jsxs("h1", { className: "career-form-heading text-3xl font-semibold leading-tight sm:text-4xl", children: ["Make room for what's next", _jsx("span", { className: "text-[#b58b49]", children: "." })] }), _jsx("p", { className: "career-form-muted mt-3 text-sm leading-6 sm:text-base", children: "Create your account to uncover your strengths, sharpen your profile, and move towards your career goals." })] }), apiError && (_jsx("div", { role: "alert", className: "mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-400", children: apiError })), _jsx("div", { className: "mb-4", children: _jsx(SocialAuthButtons, {}) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5", children: [_jsx(Input, { id: "name", name: "name", type: "text", label: "Full name", placeholder: "Enter your full name", value: formData.name, onChange: handleChange, error: errors.name }), _jsx(Input, { id: "email", name: "email", type: "email", label: "Email address", placeholder: "example@gmail.com", value: formData.email, onChange: handleChange, error: errors.email }), _jsx(Select, { id: "role", name: "role", label: "Your current role", value: formData.role, onChange: handleChange, error: errors.role, options: USER_ROLES }), formData.role === "other" && (_jsx(Input, { id: "customRole", name: "customRole", type: "text", label: "Specify your role", placeholder: "e.g. Data Analyst", value: formData.customRole, onChange: handleChange, error: errors.customRole })), _jsx(Input, { id: "password", name: "password", type: "password", label: "Create password", placeholder: "Create a secure password", value: formData.password, onChange: handleChange, error: errors.password }), _jsx(Input, { id: "confirmPassword", name: "confirmPassword", type: "password", label: "Confirm password", placeholder: "Confirm your password", value: formData.confirmPassword, onChange: handleChange, error: errors.confirmPassword }), _jsxs(Button, { type: "submit", className: "career-submit w-full gap-2 font-semibold", isLoading: isLoading, children: ["Create my CareerLens account", !isLoading && _jsx(ArrowRight, { className: "h-4 w-4" })] })] }), _jsxs("p", { className: "career-form-muted mt-5 text-center text-sm", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "career-form-link font-semibold underline-offset-4 hover:underline", children: "Sign in" })] })] }));
}
