import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Shield, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
function getStrengthLevel(score) {
    if (score >= 80)
        return { label: "Excellent", color: "#22c55e", icon: CheckCircle2, ring: "ring-green-500/30", bg: "from-green-500 to-emerald-500" };
    if (score >= 60)
        return { label: "Good", color: "#84cc16", icon: TrendingUp, ring: "ring-lime-500/30", bg: "from-lime-500 to-green-500" };
    if (score >= 40)
        return { label: "Average", color: "#eab308", icon: AlertTriangle, ring: "ring-yellow-500/30", bg: "from-yellow-500 to-orange-500" };
    return { label: "Needs Work", color: "#ef4444", icon: AlertTriangle, ring: "ring-red-500/30", bg: "from-red-500 to-orange-500" };
}
export function StrengthMeter({ score, skillsScore, experienceScore, educationScore, projectsScore }) {
    const strength = getStrengthLevel(score);
    const Icon = strength.icon;
    const circumference = 2 * Math.PI * 58;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const metrics = [
        { label: "Skills", value: skillsScore, max: 100 },
        { label: "Experience", value: experienceScore, max: 100 },
        { label: "Education", value: educationScore, max: 100 },
        { label: "Projects", value: projectsScore, max: 100 },
    ];
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "h-5 w-5 text-brand-500" }), "Resume Strength"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative mb-6", children: [_jsxs("svg", { width: "140", height: "140", className: "-rotate-90", children: [_jsx("circle", { cx: "70", cy: "70", r: "58", stroke: "currentColor", strokeWidth: "10", fill: "none", className: "text-gray-200 dark:text-gray-700" }), _jsx(motion.circle, { cx: "70", cy: "70", r: "58", stroke: strength.color, strokeWidth: "10", fill: "none", strokeLinecap: "round", strokeDasharray: circumference, initial: { strokeDashoffset: circumference }, animate: { strokeDashoffset }, transition: { duration: 1.5, ease: "easeOut" } })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx(motion.span, { className: "text-3xl font-bold", style: { color: strength.color }, initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.5 }, children: score }), _jsx("span", { className: "text-xs text-gray-500", children: "/ 100" })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.8 }, className: `mb-6 flex items-center gap-2 rounded-full bg-gradient-to-r ${strength.bg} px-4 py-1.5 text-sm font-semibold text-white shadow-lg`, children: [_jsx(Icon, { className: "h-4 w-4" }), strength.label] }), _jsx("div", { className: "w-full space-y-3", children: metrics.map((m, i) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "font-medium text-gray-600 dark:text-gray-400", children: m.label }), _jsxs("span", { className: "font-bold text-gray-900 dark:text-white", children: [m.value, "%"] })] }), _jsx("div", { className: "h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700", children: _jsx(motion.div, { className: "h-full rounded-full", style: { backgroundColor: getStrengthLevel(m.value).color }, initial: { width: 0 }, animate: { width: `${m.value}%` }, transition: { duration: 1, delay: 0.3 + i * 0.1 } }) })] }, m.label))) })] }) })] }));
}
