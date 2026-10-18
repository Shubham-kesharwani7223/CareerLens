import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/utils/cn";
/** Basic skeleton block — mimics a loading placeholder */
export function Skeleton({ className }) {
    return (_jsx("div", { className: cn("animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800", className) }));
}
/** Pre-composed layout: skeleton for a stat card */
export function SkeletonCard({ className }) {
    return (_jsx("div", { className: cn("animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]", className), children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-800" }), _jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("div", { className: "h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "h-5 w-16 rounded bg-gray-300 dark:bg-gray-700" })] })] }) }));
}
/** Pre-composed layout: skeleton for a chart/section area */
export function SkeletonChart({ className }) {
    return (_jsxs("div", { className: cn("animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]", className), children: [_jsxs("div", { className: "p-6 space-y-3", children: [_jsx("div", { className: "h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "h-3 w-56 rounded bg-gray-100 dark:bg-gray-800" })] }), _jsx("div", { className: "px-6 pb-6", children: _jsx("div", { className: "h-52 rounded-xl bg-gray-100 dark:bg-gray-800/60" }) })] }));
}
/** Pre-composed layout: skeleton for text paragraphs */
export function SkeletonText({ lines = 4, className }) {
    return (_jsx("div", { className: cn("space-y-3", className), children: Array.from({ length: lines }).map((_, i) => (_jsx("div", { className: cn("h-3 animate-pulse rounded bg-gray-200 dark:bg-gray-800", i === lines - 1 ? "w-3/5" : i % 2 === 0 ? "w-full" : "w-4/5"), style: { animationDelay: `${i * 75}ms` } }, i))) }));
}
/** Full-page analysis skeleton layout */
export function SkeletonAnalysis() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { className: "h-7 w-48" }), _jsx(Skeleton, { className: "h-4 w-72" })] }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [...Array(4)].map((_, i) => (_jsx(SkeletonCard, { "style-": { animationDelay: `${i * 100}ms` } }, i))) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(SkeletonChart, {}), _jsx(SkeletonChart, {})] }), _jsx(SkeletonChart, {})] }));
}
/** Dashboard skeleton layout */
export function SkeletonDashboard() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Skeleton, { className: "h-10 w-64" }), _jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [...Array(4)].map((_, i) => (_jsx(SkeletonCard, {}, i))) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(SkeletonChart, { className: "h-80" }), _jsx(SkeletonChart, { className: "h-80" })] })] }));
}
