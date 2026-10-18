import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/utils/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
export function AtsScoreChart({ score, caption = "Most recently analyzed resume" }) {
    const color = getScoreColor(score);
    const label = getScoreLabel(score);
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (score / 100) * circumference;
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-gradient", children: "ATS Score" }), _jsx(CardDescription, { className: "text-xs", children: caption })] }), _jsx(CardContent, { children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative mb-4", children: [_jsxs("svg", { width: "200", height: "200", className: "-rotate-90", children: [_jsx("circle", { cx: "100", cy: "100", r: "80", stroke: "currentColor", strokeWidth: "12", fill: "none", className: "text-gray-200 dark:text-white/5" }), _jsx(motion.circle, { cx: "100", cy: "100", r: "80", stroke: color, strokeWidth: "12", fill: "none", strokeLinecap: "round", strokeDasharray: circumference, initial: { strokeDashoffset: circumference }, animate: { strokeDashoffset: offset }, transition: { duration: 1.8, ease: "easeOut", delay: 0.3 } })] }), _jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: _jsxs(motion.span, { className: "text-5xl font-bold", style: { color }, initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 1, type: "spring" }, children: [score, "%"] }) })] }), _jsx(motion.p, { className: "text-lg font-semibold", style: { color }, initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 1.2 }, children: label }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500", children: "ATS compatibility score" })] }) })] }));
}
