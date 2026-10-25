
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight, UserRoundPlus } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select } from "@/components/ui/select";
// import { useAuth } from "@/hooks/useAuth";
// import { SocialAuthButtons } from "@/components/SocialAuthButtons";
// import { registerSchema } from "@/validators/auth";
// import { USER_ROLES } from "@/types";

// export function RegisterPage() {
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "fresher",
//     customRole: "",
//   });

//   const handleChange = (e) => {
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setErrors({});
//     setApiError("");

//     const result = registerSchema.safeParse(formData);

//     if (!result.success) {
//       const fieldErrors = {};

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
//         customRole:
//           formData.role === "other"
//             ? formData.customRole
//             : undefined,
//       });

//       toast.success("Welcome to CareerLens!", {
//         description: "Your next chapter starts here.",
//       });

//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       const error = err;

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
//     <div className="career-auth-form w-full">
//       <Link
//         to="/"
//         aria-label="CareerLens home"
//         className="mb-6 inline-flex items-center gap-3 lg:hidden"
//       >
//         <img
//           src="/logo.png"
//           alt="CareerLens"
//           className="h-10 w-10 object-contain"
//         />

//         <span className="text-xl font-bold tracking-tight">
//           CareerLens
//         </span>
//       </Link>

//       <div className="mb-6">
//         <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#b58ab5]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em]">
//           <UserRoundPlus className="h-3.5 w-3.5" />
//           Begin your journey
//         </div>

//         <h1 className="career-form-heading text-3xl font-semibold leading-tight sm:text-4xl">
//           Make room for what's next
//           <span className="text-[#b58b49]">.</span>
//         </h1>

//         <p className="career-form-muted mt-3 text-sm leading-6 sm:text-base">
//           Create your account to uncover your strengths, sharpen
//           your profile, and move towards your career goals.
//         </p>
//       </div>

//       {apiError && (
//         <div
//           role="alert"
//           className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-400"
//         >
//           {apiError}
//         </div>
//       )}

//       {/* Google sign-up: separate role selector and Google button */}
//       <SocialAuthButtons
//         mode="signup"
//         dividerText="Or create account manually"
//       />

//       {/* Manual registration: existing form remains unchanged */}
//       <form onSubmit={handleSubmit} className="space-y-3.5">
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
//           placeholder="example@gmail.com"
//           value={formData.email}
//           onChange={handleChange}
//           error={errors.email}
//         />

//         <Select
//           id="role"
//           name="role"
//           label="Your current role"
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
//             label="Specify your role"
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
//           placeholder="Create a secure password"
//           value={formData.password}
//           onChange={handleChange}
//           error={errors.password}
//         />

//         <Input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           label="Confirm password"
//           placeholder="Confirm your password"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//           error={errors.confirmPassword}
//         />

//         <Button
//           type="submit"
//           className="career-submit w-full gap-2 font-semibold"
//           isLoading={isLoading}
//         >
//           Create my CareerLens account

//           {!isLoading && <ArrowRight className="h-4 w-4" />}
//         </Button>
//       </form>

//       <p className="career-auth-form-muted mt-5 text-center text-sm">
//         Already have an account?{" "}
//         <Link
//           to="/login"
//           className="career-form-link font-semibold underline-offset-4 hover:underline"
//         >
//           Sign in
//         </Link>
//       </p>
//     </div>
//   );
// }







































import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, UserRoundPlus, Gift } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { registerSchema } from "@/validators/auth";
import { USER_ROLES } from "@/types";

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  // Capture referral code from a link such as /register?ref=CLAB12CD
  const referralCode = (
    searchParams.get("ref") ||
    searchParams.get("referralCode") ||
    ""
  )
    .trim()
    .toUpperCase();

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

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));

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

        if (key) {
          fieldErrors[key] = issue.message;
        }
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
        customRole:
          formData.role === "other"
            ? formData.customRole
            : undefined,
        ...(referralCode ? { referralCode } : {}),
      });

      toast.success("Welcome to CareerLens!", {
        description: referralCode
          ? "Your account was created with a referral code."
          : "Your next chapter starts here.",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "We couldn't create your account. Please try again.";

      setApiError(message);

      toast.error("Registration unsuccessful", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="career-auth-form w-full">
      <Link
        to="/"
        aria-label="CareerLens home"
        className="mb-6 inline-flex items-center gap-3 lg:hidden"
      >
        <img
          src="/logo.png"
          alt="CareerLens"
          className="h-10 w-10 object-contain"
        />

        <span className="text-xl font-bold tracking-tight">
          CareerLens
        </span>
      </Link>

      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#b58ab5]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em]">
          <UserRoundPlus className="h-3.5 w-3.5" />
          Begin your journey
        </div>

        <h1 className="career-form-heading text-3xl font-semibold leading-tight sm:text-4xl">
          Make room for what's next
          <span className="text-[#b58b49]">.</span>
        </h1>

        <p className="career-form-muted mt-3 text-sm leading-6 sm:text-base">
          Create your account to uncover your strengths, sharpen
          your profile, and move towards your career goals.
        </p>
      </div>

      {referralCode && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#b58ab5]/30 bg-[#b58ab5]/10 p-3">
          <Gift className="mt-0.5 h-5 w-5 shrink-0 text-[#b58ab5]" />

          <div className="text-sm">
            <p className="font-semibold">You were invited to CareerLens!</p>
            <p className="career-form-muted mt-1">
              Referral code: <strong>{referralCode}</strong>
            </p>
          </div>
        </div>
      )}

      {apiError && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-400"
        >
          {apiError}
        </div>
      )}

      <SocialAuthButtons
        mode="signup"
        dividerText="Or create account manually"
        referralCode={referralCode}
      />

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          id="name"
          name="name"
          type="text"
          label="Full name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Select
          id="role"
          name="role"
          label="Your current role"
          value={formData.role}
          onChange={handleChange}
          error={errors.role}
          options={USER_ROLES}
        />

        {formData.role === "other" && (
          <Input
            id="customRole"
            name="customRole"
            type="text"
            label="Specify your role"
            placeholder="e.g. Data Analyst"
            value={formData.customRole}
            onChange={handleChange}
            error={errors.customRole}
          />
        )}

        <Input
          id="password"
          name="password"
          type="password"
          label="Create password"
          placeholder="Create a secure password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          className="career-submit w-full gap-2 font-semibold"
          isLoading={isLoading}
        >
          Create my CareerLens account
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="career-auth-form-muted mt-5 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="career-form-link font-semibold underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
