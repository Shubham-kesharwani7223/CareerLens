import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Crown, Check, ArrowLeft, ArrowRight, Zap, CreditCard, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { API_URL, TOKEN_KEY } from "@/utils/constants";
/* ═══ Plans ═══ */
const PLANS = [
    {
        id: "starter",
        name: "Starter",
        price: "₹49",
        credits: 5,
        icon: Star,
        color: "from-[#A17B37] to-[#D6B66D]",
        border: "border-[#C7A05A]/50",
        features: ["5 AI Credits", "Resume Analysis", "Basic ATS Score", "AI Suggestions"],
    },
    {
        id: "pro",
        name: "Pro",
        price: "₹149",
        credits: 20,
        icon: Crown,
        color: "from-[#76516F] to-[#A855F7]",
        border: "border-[#A77BA8]/70",
        popular: true,
        features: ["20 AI Credits", "Full AI Analysis", "Cover Letters & Bios", "Mock Interviews", "Job Match", "Career Growth"],
    },
];
/* ═══ Step Indicator ═══ */
function Steps({ current }) {
    const labels = ["Choose Plan", "Payment", "Complete"];
    return (_jsx("div", { className: "mb-8 flex items-center justify-center gap-2", children: labels.map((label, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${i <= current ? "bg-[#76516F] text-white" : "bg-gray-200 text-[#88758B] dark:bg-gray-700"}`, children: i < current ? _jsx(Check, { className: "h-4 w-4" }) : i + 1 }), _jsx("span", { className: `hidden text-sm font-medium sm:inline ${i <= current ? "text-[#29182F] dark:text-[#F7F1FA]" : "text-[#88758B] dark:text-gray-400"}`, children: label }), i < labels.length - 1 && _jsx("div", { className: `mx-1 h-px w-8 ${i < current ? "bg-[#76516F]" : "bg-[#DCCBD7] dark:bg-white/10"}` })] }, label))) }));
}
/* ═══ Step 1: Plan Selection ═══ */
function PlanStep({ selected, onSelect, onContinue }) {
    const { user } = useAuth();
    return (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, children: _jsxs("div", { className: "grid min-w-0 gap-6 lg:grid-cols-[280px_1fr]", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "rounded-2xl border border-[#E4D7DF] bg-white/75 p-5 dark:border-white/[0.09] dark:bg-white/[0.035]", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#76516F] to-[#A855F7] text-lg font-bold text-white", children: user?.name?.charAt(0).toUpperCase() || "U" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-[#29182F] dark:text-[#F7F1FA]", children: user?.name }), _jsx("p", { className: "text-xs text-[#88758B]", children: user?.email?.toLowerCase() })] })] }) }), _jsxs("div", { className: "rounded-2xl border border-[#C7A05A]/35 bg-[#C7A05A]/10 p-4 text-center dark:border-[#C7A05A]/25 dark:bg-[#C7A05A]/10", children: [_jsx(Zap, { className: "mx-auto mb-1 h-5 w-5 text-amber-500" }), _jsx("p", { className: "text-2xl font-bold text-[#795B30] dark:text-[#E2C17E]", children: user?.aiCredits ?? 0 }), _jsx("p", { className: "text-xs text-[#795B30] dark:text-[#E2C17E]", children: "Credits Remaining" })] })] }), _jsxs("div", { children: [_jsx("h2", { className: "mb-1 text-2xl font-bold text-[#29182F] dark:text-[#F7F1FA]", children: "Choose Your CareerLens Plan" }), _jsx("p", { className: "mb-6 text-sm text-[#796980] dark:text-[#88758B] dark:text-gray-400", children: "Choose the credit pack that fits your career goals." }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: PLANS.map((plan) => {
                                const isSelected = selected === plan.id;
                                return (_jsxs("button", { onClick: () => onSelect(plan.id), className: `relative rounded-2xl border-2 p-6 text-left transition-all ${isSelected ? `${plan.border} bg-[#F1E5F1] ring-2 ring-[#76516F]/20 dark:bg-[#211633]` : "border-[#E4D7DF] bg-white/50 hover:border-[#B99AC0] dark:border-white/[0.09] dark:bg-white/[0.02] dark:hover:border-[#8062A8]"}`, children: [plan.popular && (_jsx("span", { className: "absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-[#76516F] to-[#A855F7] px-3 py-0.5 text-[10px] font-bold text-white", children: "POPULAR CHOICE" })), _jsx("div", { className: `mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} text-white shadow-lg`, children: _jsx(plan.icon, { className: "h-5 w-5" }) }), _jsx("p", { className: "text-lg font-bold text-[#29182F] dark:text-[#F7F1FA]", children: plan.name }), _jsxs("p", { className: "mb-4 text-2xl font-extrabold text-[#29182F] dark:text-[#F7F1FA]", children: [plan.price, " ", _jsxs("span", { className: "text-sm font-normal text-[#88758B]", children: ["for ", plan.credits, " credits"] })] }), _jsx("ul", { className: "space-y-1.5", children: plan.features.map((f) => (_jsxs("li", { className: "flex items-center gap-2 text-xs text-[#65536A] dark:text-gray-300", children: [_jsx(Check, { className: "h-3 w-3 text-[#76516F] dark:text-[#C4A3FF]" }), " ", f] }, f))) })] }, plan.id));
                            }) }), _jsxs(Button, { className: "mt-6 w-full gap-2 sm:w-auto bg-[#76516F] text-white", onClick: onContinue, disabled: !selected, children: ["Continue to Payment ", _jsx(ArrowRight, { className: "h-4 w-4" })] })] })] }) }));
}
/* ═══ Step 2: Razorpay Checkout ═══ */
function PaymentForm({ plan, onBack, onSuccess }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { user } = useAuth();
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isProcessing)
            return;
        setIsProcessing(true);
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                toast.error("Please log in to continue.");
                window.location.href = "/login";
                return;
            }
            const loaded = window.Razorpay || await new Promise((resolve) => {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
            if (!loaded) {
                toast.error("Razorpay checkout could not load.");
                return;
            }
            const response = await fetch(`${API_URL}/razorpay/create-order`, {
                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ planId: plan.id }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                toast.error(data.message || "Could not create payment order.");
                return;
            }
            const checkout = new window.Razorpay({
                key: data.keyId, order_id: data.orderId, amount: data.amount, currency: data.currency,
                name: "CareerLens", description: `${plan.name} — ${plan.credits} AI credits`, image: "/logo.png",
                prefill: { name: user?.name || "", email: user?.email || "" },
                theme: { color: "#694B68" },
                handler: async (paymentResponse) => {
                    try {
                        const verify = await fetch(`${API_URL}/razorpay/verify-payment`, {
                            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ ...paymentResponse, planId: plan.id }),
                        });
                        const result = await verify.json().catch(() => ({}));
                        if (!verify.ok) {
                            toast.error(result.message || "Payment verification failed.");
                            return;
                        }
                        onSuccess();
                    }
                    catch {
                        toast.error("Payment verification failed. Please contact support before paying again.");
                    }
                },
                modal: { ondismiss: () => setIsProcessing(false) },
            });
            checkout.open();
        }
        catch {
            toast.error("Payment failed. Please try again.");
        }
        finally {
            setIsProcessing(false);
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, children: [_jsxs("button", { onClick: onBack, className: "mb-4 flex items-center gap-1.5 text-sm text-[#88758B] hover:text-[#694B68] dark:hover:text-gray-200", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Back to plans"] }), _jsxs("div", { className: "grid min-w-0 gap-6 lg:grid-cols-[1fr_320px]", children: [_jsxs("form", { onSubmit: handleSubmit, className: "min-w-0 space-y-5 rounded-2xl border border-[#E7DCE4] bg-[#FFF9F0] p-5 dark:border-white/10 dark:bg-[#100C17] sm:p-6", children: [_jsx("h2", { className: "text-xl font-bold text-[#29182F] dark:text-[#F7F1FA]", children: "Secure Payment" }), _jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-[#76516F] via-[#946D91] to-[#4A3150] p-6 text-white shadow-xl", children: [_jsx(CreditCard, { className: "mb-6 h-8 w-8 opacity-90" }), _jsx("p", { className: "text-lg font-semibold", children: plan.name }), _jsxs("p", { className: "mt-1 text-sm text-white/80", children: [plan.credits, " AI credits \u00B7 ", plan.price] }), _jsx("p", { className: "mt-5 text-xs text-white/70", children: "Secure checkout powered by Razorpay" })] }), _jsx("p", { className: "text-sm leading-6 text-[#796980] dark:text-gray-300", children: "Click below to open Razorpay Checkout. Your card, UPI and other available payment details are entered securely on Razorpay; CareerLens does not store your card details." }), _jsxs(Button, { type: "submit", className: "w-full gap-2 rounded-xl bg-[#694B68] py-3 text-base text-white shadow-xl shadow-[#76516F]/20 hover:bg-[#563A53]", isLoading: isProcessing, disabled: isProcessing, children: [isProcessing ? "Preparing secure checkout…" : `Pay ${plan.price} securely`, " ", _jsx(ArrowRight, { className: "h-4 w-4" })] }), _jsxs("p", { className: "flex items-center justify-center gap-1.5 text-xs text-[#88758B] dark:text-gray-400", children: [_jsx(Shield, { className: "h-3 w-3" }), " Secured by Razorpay. We never store your card details."] })] }), _jsxs("div", { className: "h-fit rounded-2xl border border-[#E7DCE4] bg-white p-5 dark:border-white/10 dark:bg-slate-900", children: [_jsx("h3", { className: "mb-4 font-bold text-[#29182F] dark:text-white", children: "Order Summary" }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex justify-between gap-3", children: [_jsx("span", { className: "text-[#88758B]", children: plan.name }), _jsx("span", { className: "font-medium text-[#29182F] dark:text-white", children: plan.price })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-[#88758B]", children: "AI Credits" }), _jsx("span", { className: "text-[#29182F] dark:text-white", children: plan.credits })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-[#88758B]", children: "Tax" }), _jsx("span", { className: "text-[#29182F] dark:text-white", children: "Included if applicable" })] }), _jsxs("div", { className: "flex justify-between border-t border-[#E9DDE6] pt-3 text-base font-bold dark:border-white/10", children: [_jsx("span", { className: "text-[#29182F] dark:text-white", children: "Total" }), _jsx("span", { className: "text-[#76516F] dark:text-[#C4A3FF]", children: plan.price })] })] })] })] })] }));
} /* ═══ Step 3: Success ═══ */
function SuccessStep({ plan }) {
    const navigate = useNavigate();
    const { loadUser } = useAuth();
    useEffect(() => {
        void loadUser();
        const t = setTimeout(() => navigate("/dashboard"), 4000);
        return () => clearTimeout(t);
    }, [loadUser, navigate]);
    return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "py-12 text-center", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", delay: 0.2 }, className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30", children: _jsx(Sparkles, { className: "h-9 w-9 text-green-500" }) }), _jsx("h2", { className: "mb-2 text-2xl font-bold text-[#29182F] dark:text-[#F7F1FA]", children: "Your CareerLens credits are ready! \u2728" }), _jsxs("p", { className: "mb-6 text-[#796980] dark:text-[#88758B] dark:text-gray-400", children: [plan.credits, " AI credits have been added to your account."] }), _jsx(Link, { to: "/dashboard", children: _jsxs(Button, { className: "gap-2", children: ["Go to Dashboard ", _jsx(ArrowRight, { className: "h-4 w-4" })] }) }), _jsx("p", { className: "mt-3 text-xs text-[#88758B] dark:text-gray-400", children: "Redirecting automatically in a few seconds..." })] }));
}
/* ═══ Main Page ═══ */
export function PurchasePage() {
    const [step, setStep] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState("pro");
    const plan = PLANS.find((p) => p.id === selectedPlan) || PLANS[1];
    return (_jsxs("div", { className: "min-h-screen min-w-0 overflow-x-hidden bg-[#FAF2E6] text-[#29182F] dark:bg-[#080710] dark:text-[#F7F1FA]", children: [_jsx("div", { className: "border-b border-[#E7DCE4] bg-[#FFF9F0]/90 px-3 py-4 sm:px-4 md:px-6 lg:px-8 dark:border-white/[0.08] dark:bg-[#100C17]/90", children: _jsxs("div", { className: "mx-auto flex max-w-5xl items-center justify-between", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2.5", children: [_jsx("img", { src: "/logo.png", alt: "CareerLens", className: "h-10 w-10 object-contain" }), _jsxs("span", { className: "text-lg font-extrabold tracking-tight text-[#29182F] dark:text-[#F7F1FA]", children: ["Career", _jsx("span", { className: "bg-gradient-to-r from-[#A17B37] via-[#B779A8] to-[#A855F7] bg-clip-text text-transparent", children: "Lens" })] })] }), _jsx(Link, { to: "/dashboard", className: "text-sm text-[#88758B] hover:text-gray-700 dark:hover:text-gray-300", children: "\u2190 Back to Dashboard" })] }) }), _jsxs("div", { className: "mx-auto max-w-5xl px-3 py-8 sm:px-4 md:px-6 lg:px-8", children: [_jsx(Steps, { current: step }), _jsxs(AnimatePresence, { mode: "wait", children: [step === 0 && (_jsx(PlanStep, { selected: selectedPlan, onSelect: setSelectedPlan, onContinue: () => setStep(1) }, "plan")), step === 1 && (_jsx(PaymentForm, { plan: plan, onBack: () => setStep(0), onSuccess: () => { setStep(2); toast.success("Payment successful! 🎉"); } }, "payment")), step === 2 && (_jsx(SuccessStep, { plan: plan }, "success"))] })] })] }));
}
