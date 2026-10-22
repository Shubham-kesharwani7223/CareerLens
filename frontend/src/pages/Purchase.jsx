import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Crown,
  Check,
  ArrowLeft,
  ArrowRight,
  Zap,
  CreditCard,
  Shield,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { API_URL, TOKEN_KEY } from "@/utils/constants";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "₹49",
    credits: 5,
    icon: Star,
    color: "from-[#A17B37] to-[#D6B66D]",
    border: "border-[#C7A05A]/50",
    features: [
      "5 AI Credits",
      "Resume Analysis",
      "Basic ATS Score",
      "AI Suggestions",
    ],
  },
  {
    id: "pro",
    name: "Growth Credits",
    price: "₹149",
    credits: 20,
    icon: Crown,
    color: "from-[#76516F] to-[#A855F7]",
    border: "border-[#A77BA8]/70",
    popular: true,
    features: [
      "20 AI Credits",
      "Basic resume analysis",
      "ATS scoring and suggestions",
      "Use on eligible credit-based tools",
    ],
  },
];

function Steps({ current }) {
  const labels = ["Choose Plan", "Payment", "Complete"];

  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {labels.map((label, index) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              index <= current
                ? "bg-[#76516F] text-white"
                : "bg-gray-200 text-[#88758B] dark:bg-gray-700"
            }`}
          >
            {index < current ? (
              <Check className="h-4 w-4" />
            ) : (
              index + 1
            )}
          </div>

          <span
            className={`hidden text-sm font-medium sm:inline ${
              index <= current
                ? "text-[#29182F] dark:text-[#F7F1FA]"
                : "text-[#88758B] dark:text-gray-400"
            }`}
          >
            {label}
          </span>

          {index < labels.length - 1 && (
            <div
              className={`mx-1 h-px w-8 ${
                index < current
                  ? "bg-[#76516F]"
                  : "bg-[#DCCBD7] dark:bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function PlanStep({ selected, onSelect, onContinue }) {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E4D7DF] bg-white/75 p-5 dark:border-white/[0.09] dark:bg-white/[0.035]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#76516F] to-[#A855F7] text-lg font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#29182F] dark:text-[#F7F1FA]">
                  {user?.name}
                </p>
                <p className="text-xs text-[#88758B]">
                  {user?.email?.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#C7A05A]/35 bg-[#C7A05A]/10 p-4 text-center dark:border-[#C7A05A]/25">
            <Zap className="mx-auto mb-1 h-5 w-5 text-amber-500" />

            <p className="text-2xl font-bold text-[#795B30] dark:text-[#E2C17E]">
              {user?.aiCredits ?? 0}
            </p>

            <p className="text-xs text-[#795B30] dark:text-[#E2C17E]">
              Credits Remaining
            </p>
          </div>
        </div>

        <div>
          <h2 className="mb-1 text-2xl font-bold text-[#29182F] dark:text-[#F7F1FA]">
            Choose Your CareerLens Credit Pack
          </h2>

          <p className="mb-6 text-sm text-[#796980] dark:text-gray-400">
            Choose the credit pack that fits your career goals.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {PLANS.map((plan) => {
              const isSelected = selected === plan.id;
              const PlanIcon = plan.icon;

              return (
                <button
                  type="button"
                  key={plan.id}
                  onClick={() => onSelect(plan.id)}
                  className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
                    isSelected
                      ? `${plan.border} bg-[#F1E5F1] ring-2 ring-[#76516F]/20 dark:bg-[#211633]`
                      : "border-[#E4D7DF] bg-white/50 hover:border-[#B99AC0] dark:border-white/[0.09] dark:bg-white/[0.02] dark:hover:border-[#8062A8]"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-[#76516F] to-[#A855F7] px-3 py-0.5 text-[10px] font-bold text-white">
                      POPULAR CHOICE
                    </span>
                  )}

                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} text-white shadow-lg`}
                  >
                    <PlanIcon className="h-5 w-5" />
                  </div>

                  <p className="text-lg font-bold text-[#29182F] dark:text-[#F7F1FA]">
                    {plan.name}
                  </p>

                  <p className="mb-4 text-2xl font-extrabold text-[#29182F] dark:text-[#F7F1FA]">
                    {plan.price}{" "}
                    <span className="text-sm font-normal text-[#88758B]">
                      for {plan.credits} credits
                    </span>
                  </p>

                  <ul className="space-y-1.5">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-[#65536A] dark:text-gray-300"
                      >
                        <Check className="h-3 w-3 text-[#76516F] dark:text-[#C4A3FF]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <Button
            className="mt-6 w-full gap-2 bg-[#76516F] text-white hover:bg-[#563A53] sm:w-auto"
            onClick={onContinue}
            disabled={!selected}
          >
            Continue to Payment
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="mt-3 text-xs text-[#88758B]">
            Need the monthly Pro subscription instead?{" "}
            <Link
              to="/pricing"
              className="font-bold text-[#694B68] underline"
            >
              Explore CareerLens Pro · ₹499/month
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PaymentForm({ plan, onBack, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        toast.error("Please log in to continue.");
        window.location.href = "/login";
        return;
      }

      let loaded = window.Razorpay;

      if (!loaded) {
        loaded = await new Promise((resolve) => {
          const script = document.createElement("script");

          script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);

          document.body.appendChild(script);
        });
      }

      if (!loaded) {
        toast.error("Razorpay checkout could not load.");
        return;
      }

      const response = await fetch(
        `${API_URL}/razorpay/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ planId: plan.id }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(
          data.message || "Could not create payment order."
        );
        return;
      }

      const checkout = new window.Razorpay({
        key: data.keyId,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "CareerLens",
        description: `${plan.name} — ${plan.credits} AI credits`,
        image: new URL("/logo.png", window.location.origin).href,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: { color: "#694B68" },

        handler: async (paymentResponse) => {
          try {
            const verify = await fetch(
              `${API_URL}/razorpay/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...paymentResponse,
                  planId: plan.id,
                }),
              }
            );

            const result = await verify
              .json()
              .catch(() => ({}));

            if (!verify.ok) {
              toast.error(
                result.message || "Payment verification failed."
              );
              return;
            }

            onSuccess();
          } catch {
            toast.error(
              "Payment verification failed. Please contact support before paying again."
            );
          }
        },

        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });

      checkout.open();
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-[#88758B] hover:text-[#694B68] dark:hover:text-gray-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to plans
      </button>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={handleSubmit}
          className="min-w-0 space-y-5 rounded-2xl border border-[#E7DCE4] bg-[#FFF9F0] p-5 dark:border-white/10 dark:bg-[#100C17] sm:p-6"
        >
          <h2 className="text-xl font-bold text-[#29182F] dark:text-[#F7F1FA]">
            Secure Payment
          </h2>

          <div className="rounded-2xl bg-gradient-to-br from-[#76516F] via-[#946D91] to-[#4A3150] p-6 text-white shadow-xl">
            <CreditCard className="mb-6 h-8 w-8 opacity-90" />

            <p className="text-lg font-semibold">{plan.name}</p>
            <p className="mt-1 text-sm text-white/80">
              {plan.credits} AI credits · {plan.price}
            </p>

            <p className="mt-5 text-xs text-white/70">
              Secure checkout powered by Razorpay
            </p>
          </div>

          <p className="text-sm leading-6 text-[#796980] dark:text-gray-300">
            Click below to open Razorpay Checkout. Your card,
            UPI and other available payment details are entered
            securely on Razorpay; CareerLens does not store your
            card details.
          </p>

          <Button
            type="submit"
            className="w-full gap-2 rounded-xl bg-[#694B68] py-3 text-base text-white shadow-xl shadow-[#76516F]/20 hover:bg-[#563A53]"
            isLoading={isProcessing}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Preparing secure checkout…"
              : `Pay ${plan.price} securely`}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-[#88758B] dark:text-gray-400">
            <Shield className="h-3 w-3" />
            Secured by Razorpay. We never store your card details.
          </p>
        </form>

        <div className="h-fit rounded-2xl border border-[#E7DCE4] bg-white p-5 dark:border-white/10 dark:bg-slate-900">
          <h3 className="mb-4 font-bold text-[#29182F] dark:text-white">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-[#88758B]">{plan.name}</span>
              <span className="font-medium text-[#29182F] dark:text-white">
                {plan.price}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#88758B]">AI Credits</span>
              <span className="text-[#29182F] dark:text-white">
                {plan.credits}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#88758B]">Tax</span>
              <span className="text-[#29182F] dark:text-white">
                Included if applicable
              </span>
            </div>

            <div className="flex justify-between border-t border-[#E9DDE6] pt-3 text-base font-bold dark:border-white/10">
              <span className="text-[#29182F] dark:text-white">
                Total
              </span>
              <span className="text-[#76516F] dark:text-[#C4A3FF]">
                {plan.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessStep({ plan }) {
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  useEffect(() => {
    void loadUser();

    const timer = setTimeout(
      () => navigate("/dashboard"),
      4000
    );

    return () => clearTimeout(timer);
  }, [loadUser, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30"
      >
        <Sparkles className="h-9 w-9 text-green-500" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-[#29182F] dark:text-[#F7F1FA]">
        Your CareerLens credits are ready! ✨
      </h2>

      <p className="mb-6 text-[#796980] dark:text-gray-400">
        {plan.credits} AI credits have been added to your account.
      </p>

      <Link to="/dashboard">
        <Button className="gap-2">
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>

      <p className="mt-3 text-xs text-[#88758B] dark:text-gray-400">
        Redirecting automatically in a few seconds...
      </p>
    </motion.div>
  );
}

export function PurchasePage() {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plan =
    PLANS.find((item) => item.id === selectedPlan) || PLANS[1];

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#FAF2E6] text-[#29182F] dark:bg-[#080710] dark:text-[#F7F1FA]">
      <div className="border-b border-[#E7DCE4] bg-[#FFF9F0]/90 px-3 py-4 dark:border-white/[0.08] dark:bg-[#100C17]/90 sm:px-4 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="CareerLens"
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-extrabold tracking-tight text-[#29182F] dark:text-[#F7F1FA]">
              Career
              <span className="bg-gradient-to-r from-[#A17B37] via-[#B779A8] to-[#A855F7] bg-clip-text text-transparent">
                Lens
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="rounded-xl border border-[#DCCBD7] px-3 py-2 text-xs font-bold text-[#694B68] transition hover:bg-[#F1E5F1] dark:border-white/10 dark:text-[#D7B6DF] dark:hover:bg-white/[0.06] sm:text-sm"
            >
              Upgrade to Pro · ₹499/month
            </Link>

            <Link
              to="/dashboard"
              className="text-sm text-[#88758B] hover:text-gray-700 dark:hover:text-gray-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-3 py-8 sm:px-4 md:px-6 lg:px-8">
        <Steps current={step} />

        <AnimatePresence mode="wait">
          {step === 0 && (
            <PlanStep
              key="plan"
              selected={selectedPlan}
              onSelect={setSelectedPlan}
              onContinue={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <PaymentForm
              key="payment"
              plan={plan}
              onBack={() => setStep(0)}
              onSuccess={() => {
                setStep(2);
                toast.success("Payment successful! 🎉");
              }}
            />
          )}

          {step === 2 && (
            <SuccessStep key="success" plan={plan} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}