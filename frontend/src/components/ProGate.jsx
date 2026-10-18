import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
const BENEFITS = [
    "AI-Powered Resume Analysis & ATS Scoring",
    "AI Cover Letters, Bios & LinkedIn Summaries",
    "Mock Interview Prep with AI Coaching",
    "Job Match & Skill Gap Analysis",
    "Career Growth Roadmap & Project Ideas",
    "PDF Report Downloads",
];
/** Returns true if user has AI credits remaining */
export function useHasCredits() {
    const { user } = useAuth();
    return (user?.aiCredits ?? 0) > 0;
}
/** Returns true if the user is on the Pro plan */
export function useIsPro() {
    const { user } = useAuth();
    return user?.isPro === true;
}
/**
 * Renders children if user has credits.
 * Otherwise shows a blurred overlay with "Buy Credits" CTA.
 */
export function ProGate({ children, feature }) {
    const { user } = useAuth();
    const credits = user?.aiCredits ?? 0;
    const hasCredits = credits > 0;
    if (hasCredits)
        return _jsx(_Fragment, { children: children });
    return (_jsxs("div", { className: "relative min-h-[400px]", children: [_jsx("div", { className: "pointer-events-none select-none blur-[6px] opacity-40", children: children }), _jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "absolute inset-0 z-10 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm dark:bg-slate-950/80", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: { delay: 0.1 }, className: "mx-4 w-full max-w-md rounded-2xl border border-indigo-500/20 bg-white p-8 shadow-2xl dark:bg-slate-900", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#76516F] to-purple-600 shadow-xl shadow-indigo-500/30", children: _jsx(Lock, { className: "h-7 w-7 text-white" }) }), _jsx("h3", { className: "mb-1 text-xl font-bold text-gray-900 dark:text-white", children: "You've discovered a Pro feature! \uD83D\uDE80" }), _jsxs("p", { className: "mb-2 text-sm text-gray-500 dark:text-gray-400", children: [_jsx("strong", { children: feature }), " requires AI credits to use."] }), _jsxs("div", { className: "mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", children: [_jsx(Zap, { className: "h-3 w-3" }), " ", credits, " credits remaining"] })] }), _jsx("ul", { className: "mb-6 space-y-2", children: BENEFITS.map((b) => (_jsxs("li", { className: "flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300", children: [_jsx(Check, { className: "h-4 w-4 flex-shrink-0 text-[#af78a5]" }), " ", b] }, b))) }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Link, { to: "/purchase", children: _jsxs(Button, { className: "w-full gap-2 shadow-lg shadow-indigo-500/25 bg-[#76516F] text-white", children: [_jsx(Sparkles, { className: "h-4 w-4" }), " Buy Credits"] }) }), _jsx(Link, { to: "/pricing", className: "text-center text-[11px] text-[#af78a5] hover:underline dark:text-[#af78a5]", children: "View all plans \u2192" })] })] }) }) })] }));
}
