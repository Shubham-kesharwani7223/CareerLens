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

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = {};

      for (const issue of validation.error.issues) {
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
      // Log in only once. The Zustand action stores the user.
      await login(formData);

      const authenticatedUser = useAuth.getState().user;

      toast.success("Welcome back!", {
        description: "Let's continue building your next opportunity.",
      });

      navigate(
        authenticatedUser?.isAdmin === true
          ? "/admin"
          : "/dashboard",
        { replace: true }
      );
    } catch (err) {
      const error = err;

      const message =
        error.response?.data?.message ||
        "We couldn't sign you in. Check your details and try again.";

      setApiError(message);

      toast.error("Sign-in unsuccessful", {
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
        className="mb-7 inline-flex items-center gap-3 lg:hidden"
      >
        <img
          src="/logo.png"
          alt="CareerLens"
          className="h-11 w-11 object-contain"
        />

        <span className="text-xl font-bold tracking-tight">
          CareerLens
        </span>
      </Link>

      <div className="mb-7">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#b58ab5]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[.14em]">
          <LockKeyhole className="h-3.5 w-3.5" />
          Your journey continues
        </div>

        <h1 className="career-form-heading text-4xl font-semibold leading-tight">
          Welcome back
          <span className="text-[#b58b49]">.</span>
        </h1>

        <p className="career-form-muted mt-3 text-sm leading-6 sm:text-base">
          Pick up where you left off. Your next opportunity could be
          closer than you think.
        </p>
      </div>

      {apiError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-400"
        >
          {apiError}
        </div>
      )}

      {/* Login mode: no career-role selector on this page. */}
      <div className="mb-5">
        <SocialAuthButtons
          mode="login"
          dividerText="Or continue with email"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="*******"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button
          type="submit"
          className="career-submit w-full gap-2 font-semibold"
          isLoading={isLoading}
        >
          Sign in to CareerLens
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="career-form-muted mt-6 text-center text-sm">
        New to CareerLens?{" "}
        <Link
          to="/register"
          className="career-form-link font-semibold underline-offset-4 hover:underline"
        >
          Create your account
        </Link>
      </p>

      <p className="career-form-muted mt-5 text-center text-xs">
        Your next move starts with a fresh perspective.
      </p>
    </div>
  );
}