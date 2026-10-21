// 














































import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Sparkles, Zap, Crown, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const BENEFITS = [
  "AI-powered resume analysis and ATS scoring",
  "AI cover letters, bios and LinkedIn summaries",
  "Mock interview prep with AI coaching",
  "Job matching and skill-gap insights",
  "Career growth roadmap and project ideas",
  "Downloadable PDF reports",
];

/** Returns true when the signed-in user has AI credits available. */
export function useHasCredits() {
  const { user } = useAuth();
  return (user?.aiCredits ?? 0) > 0;
}

/** Returns true when the signed-in user has a Pro subscription. */
export function useIsPro() {
  const { user } = useAuth();
  return user?.isPro === true;
}

/**
 * This gate currently checks AI-credit balance. It does not itself enforce
 * membership status; each API must also enforce its own authorization rules.
 */
export function ProGate({ children, feature }) {
  const { user } = useAuth();
  const credits = user?.aiCredits ?? 0;
  const hasCredits = credits > 0;
  const isPro = user?.isPro === true;

  if (hasCredits) return children;

  return (
    <div className="relative min-h-[400px]">
      <div className="pointer-events-none select-none blur-[6px] opacity-40">{children}</div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-[#F7F0E5]/80 p-3 backdrop-blur-sm dark:bg-slate-950/80 sm:p-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-4 w-full max-w-md rounded-2xl border border-[#76516F]/20 bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8"
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#76516F] to-purple-600 shadow-xl shadow-indigo-500/30">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                You need more AI credits
              </h3>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {feature ? <strong>{feature}</strong> : "This feature"} needs AI credits to run. Choose a credit pack or explore CareerLens Pro.
              </p>
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                <Zap className="h-3 w-3" /> {credits} credits remaining
              </div>
            </div>

            <ul className="mb-6 space-y-2">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#af78a5]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2.5">
              <Link
                to={isPro ? "/purchase" : "/pricing"}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#694B68] px-4 py-2 text-center text-sm font-bold text-white shadow-md transition hover:bg-[#563A53]"
              >
                {isPro ? <CreditCard className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
                {isPro ? "Buy More AI Credits" : "Upgrade to Pro · ₹499/month"}
              </Link>
              <Link
                to={isPro ? "/pricing" : "/purchase"}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#DCCBD7] px-4 py-2 text-sm font-semibold text-[#694B68] transition hover:bg-[#F7EEF5] dark:border-white/10 dark:text-[#d8b9df] dark:hover:bg-white/[0.06]"
              >
                {isPro ? <Crown className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                {isPro ? "View Pro Plan" : "Buy AI Credits instead"}
              </Link>
              <p className="mt-1 text-center text-[11px] text-gray-500 dark:text-gray-400">
                Secure payments powered by Razorpay.
              </p>
              <span className="inline-flex items-center justify-center gap-1 text-[10px] text-gray-400">
                <Sparkles className="h-3 w-3" /> CareerLens plans
              </span>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
