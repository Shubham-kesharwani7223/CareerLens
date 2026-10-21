import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
