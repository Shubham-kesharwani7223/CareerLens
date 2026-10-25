import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactGA from "react-ga4";
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  ShieldCheck,
  LockKeyhole,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { API_URL, TOKEN_KEY } from "@/utils/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.55,
    },
  }),
};

const freePlan = {
  name: "Essential",
  price: "₹0",
  tagline: "Try the core resume tools before upgrading.",
  features: [
    "Resume upload and preview",
    "Basic ATS/resume score (1 starter AI credit)",
    "Rule-based resume insights and readability",
    "Dashboard and resume analysis history",
    "Optional one-time AI credit packs",
  ],
};

const proPlan = {
  name: "CareerLens Pro",
  price: "₹499",
  period: "/month",
  tagline: "Unlock the advanced tools that turn insight into action.",
  features: [
    "Resume-to-job matching and skill-gap analysis",
    "AI interview preparation and job-specific question prediction",
    "AI cover letters, professional bios and career content",
    "Personalized career roadmap and project suggestions",
    "AI Career Assistant",
    "Mock interviews and answer evaluation",
    "100 AI credits included per successful monthly billing cycle",
    "Extra one-time credit packs available when needed",
  ],
};

const plumButtonStyle = {
  backgroundColor: "#694B68",
  backgroundImage: "none",
  color: "#FFFFFF",
  borderColor: "#694B68",
};

export function PricingPage() {
  const { isAuthenticated, user, loadUser } = useAuth();

  const isPro =
    user?.isPro === true || user?.isAdmin === true;

  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const handleUpgrade = async () => {
    ReactGA.event({
      category: "Monetization",
      action: "Clicked_Razorpay_Checkout",
      label: "CareerLens Pro - ₹499/month",
    });

    setIsUpgrading(true);

    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token || !isAuthenticated) {
        window.location.href = "/login";
        return;
      }

      const loadRazorpay = async () => {
        if (window.Razorpay) return true;

        return new Promise((resolve) => {
          const script = document.createElement("script");

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);

          document.body.appendChild(script);
        });
      };

      if (!(await loadRazorpay())) {
        toast.error("Razorpay checkout could not load.");
        return;
      }

      const response = await fetch(
        `${API_URL}/razorpay/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        toast.error(
          data.message ||
            "Unable to start payment. Check Razorpay configuration."
        );
        return;
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        subscription_id: data.subscriptionId,
        name: "CareerLens",
        description: "CareerLens Pro monthly subscription",
        image: new URL("/logo.png", window.location.origin).href,

        prefill: {
          name: user?.name || data.name || "",
          email: user?.email || data.email || "",
        },

        theme: {
          color: "#694B68",
        },

        handler: async (paymentResponse) => {
          try {
            const verify = await fetch(
              `${API_URL}/razorpay/verify-subscription`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(paymentResponse),
              }
            );

            const result = await verify
              .json()
              .catch(() => ({}));

            if (!verify.ok) {
              toast.error(
                result.message ||
                  "Subscription verification failed."
              );
              return;
            }

            await loadUser();

            toast.success("Welcome to CareerLens Pro!");
            window.location.href = "/dashboard";
          } catch {
            toast.error(
              "Payment completed, but account verification failed. Contact support before paying again."
            );
          }
        },

        modal: {
          ondismiss: () => setIsUpgrading(false),
        },
      });

      checkout.open();
    } catch {
      toast.error(
        "Could not connect to Razorpay. Please try again."
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <main className="relative min-h-screen min-w-0 overflow-x-hidden bg-[#FAF2E6] text-[#29182F] transition-colors duration-300 dark:bg-[#080710] dark:text-[#F7F1FA]">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-[#C7A05A]/10 blur-[110px] dark:bg-purple-600/10" />
        <div className="absolute right-0 top-[28rem] h-72 w-72 rounded-full bg-fuchsia-300/10 blur-[100px] dark:bg-fuchsia-600/10" />
      </div>

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="CareerLens home"
          className="flex items-center gap-3"
        >
          <img
            src="/logo.png"
            alt="CareerLens logo"
            className="h-11 w-11 object-contain"
          />

          <span className="text-xl font-extrabold tracking-tight text-[#29182F] dark:text-white">
            Career
            <span className="bg-gradient-to-r from-[#A17B37] via-[#B779A8] to-[#A855F7] bg-clip-text text-transparent">
              Lens
            </span>
          </span>
        </Link>

        <Link to={isAuthenticated ? "/dashboard" : "/login"}>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-[#DCCBD7] bg-white/60 px-4 text-[#49354C] hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-200 dark:hover:bg-white/10"
          >
            {isAuthenticated ? "Dashboard" : "Sign In"}
          </Button>
        </Link>
      </nav>

      <section className="relative px-4 pb-12 pt-12 text-center sm:px-6 sm:pt-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C7A05A]/35 bg-[#C7A05A]/10 px-4 py-2 text-sm font-semibold tracking-wide text-[#795B30] dark:border-[#C7A05A]/25 dark:text-[#E2C17E]">
            <Sparkles className="h-4 w-4" />
            PLANS THAT GROW WITH YOU
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Your career. Your next{" "}
            <span className="bg-gradient-to-r from-[#B38A3F] via-[#B779A8] to-[#A855F7] bg-clip-text text-transparent">
              move.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#715F76] dark:text-gray-400 sm:text-lg">
            Get the insights to strengthen your resume, uncover
            skill gaps, and move towards opportunities that fit
            your ambitions.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#76657A] dark:text-gray-400">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#A17B37]" />
              Transparent pricing
            </span>

            <span className="inline-flex items-center gap-2">
              <Check className="h-4 w-4 text-[#A17B37]" />
              Start free
            </span>
          </div>
        </motion.div>
      </section>

      <section className="relative mx-auto grid max-w-5xl items-stretch gap-7 px-4 pb-20 sm:px-6 md:grid-cols-2 lg:px-8">
        <motion.article
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="flex flex-col rounded-3xl border border-[#E4D7DF] bg-gradient-to-b from-[#F1E5F1] via-[#FFFAF2] to-white p-6 text-[#302038] shadow-sm sm:p-8"
        >
          <div className="mb-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE3EE] text-[#76516F]">
              <Sparkles className="h-6 w-6" />
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#88758B]">
              {freePlan.name}
            </p>

            <p className="mt-3 text-5xl font-black tracking-tight text-[#302038]">
              {freePlan.price}
            </p>

            <p className="mt-3 text-sm leading-6 text-[#796980]">
              {freePlan.tagline}
            </p>
          </div>

          <div className="mb-7 h-px bg-[#E9DDE6]" />

          <p className="mb-5 text-sm font-bold text-[#49354C]">
            The essentials to get started
          </p>

          <ul className="mb-9 flex-1 space-y-4">
            {freePlan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm leading-6 text-[#65536A]"
              >
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[#A17B37]" />
                {feature}
              </li>
            ))}
          </ul>

          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="mt-auto block"
          >
            <Button
              style={plumButtonStyle}
              className="!h-12 !w-full !rounded-xl !border !border-solid !font-semibold !text-white hover:!text-white"
            >
              {isAuthenticated ? "Open My Dashboard" : "Start for Free"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.article>

        <motion.article
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="relative flex flex-col rounded-3xl border border-[#CDB5D0] bg-gradient-to-b from-[#F1E5F1] via-[#FFFAF2] to-[#FFFDF9] p-6 text-[#302038] shadow-[0_18px_45px_rgba(118,81,111,0.12)] sm:p-8"
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#76516F] to-[#946D91] px-5 py-1.5 text-xs font-bold text-white shadow-lg">
            <span className="inline-flex items-center gap-1.5">
              <Crown className="h-3.5 w-3.5" />
              CAREERLENS PRO
            </span>
          </div>

          <div className="mb-7 pt-2">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#76516F]">
              <Zap className="h-4 w-4" />
              {proPlan.name}
            </p>

            <p className="mt-4 flex flex-wrap items-baseline gap-x-1">
              <span className="text-5xl font-black tracking-tight text-[#302038]">
                {proPlan.price}
              </span>

              <span className="text-sm font-medium text-[#806D85]">
                {proPlan.period}
              </span>
            </p>

            <p className="mt-3 text-sm leading-6 text-[#796980]">
              {proPlan.tagline}
            </p>
          </div>

          <div className="mb-7 h-px bg-[#DCC8DF]" />

          <p className="mb-5 text-sm font-bold text-[#49354C]">
            Everything you need to stand out
          </p>

          <ul className="mb-9 flex-1 space-y-3.5">
            {proPlan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm leading-6 text-[#55415D]"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#76516F]/10">
                  <Check className="h-3.5 w-3.5 text-[#76516F]" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          {isPro ? (
            <Button
              disabled
              style={plumButtonStyle}
              className="!h-12 !w-full !rounded-xl !border !border-solid !font-bold !text-white"
            >
              You're on CareerLens Pro ✓
            </Button>
          ) : (
            <Button
              style={plumButtonStyle}
              className="!h-12 !w-full !rounded-xl !border !border-solid !font-bold !text-white shadow-lg shadow-[#76516F]/20 transition-colors hover:!text-white"
              onClick={handleUpgrade}
              isLoading={isUpgrading}
            >
              {isUpgrading
                ? "Preparing secure checkout..."
                : "Unlock Pro for ₹499"}

              {!isUpgrading && (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          )}

          <p className="mt-4 text-center text-xs text-[#88758B]">
            Secure checkout · Cancel according to your plan terms
          </p>
        </motion.article>
      </section>

      <section className="relative mx-auto mb-12 mt-2 max-w-3xl px-4">
        <div className="rounded-2xl border border-[#E4D7DF] bg-[#FFFAF2] px-6 py-7 text-center shadow-sm dark:border-white/10 dark:bg-[#130D18]">
          <div className="mb-3 flex items-center justify-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#694B68] dark:text-[#B99AC5]" />
            <h3 className="text-lg font-bold text-[#302038] dark:text-[#F7F1FA]">
              Secure Payments with Razorpay
            </h3>
          </div>

          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#715F76] dark:text-gray-400">
            Your payments are securely processed through
            Razorpay. Choose the plan that fits your career goals
            and upgrade whenever you're ready.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-[#694B68] dark:text-[#D5C0DF]">
            <span className="inline-flex items-center gap-2">
              <LockKeyhole className="h-4 w-4" />
              Secure Checkout
            </span>

            <span className="hidden sm:inline">•</span>

            <span className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Multiple Payment Options
            </span>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-[#E7DCE4] px-4 py-6 text-center text-sm text-[#88758B] dark:border-white/[0.08] dark:text-gray-500">
        © {new Date().getFullYear()} CareerLens. Made with{" "}
        <span className="text-[#c7a121]">♥</span> for your career.
      </footer>
    </main>
  );
}