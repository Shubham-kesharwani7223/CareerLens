import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/utils/cn";
import { getScoreColor } from "@/utils/constants";
export function Progress({ value, max = 100, className, showLabel = false, size = "md", barColor }) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const color = barColor ?? getScoreColor(percentage);
    const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
    return (_jsxs("div", { className: cn("w-full", className), children: [showLabel && (_jsxs("div", { className: "mb-1 flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Progress" }), _jsxs("span", { className: "font-medium text-gray-900 dark:text-white", children: [Math.round(percentage), "%"] })] })), _jsx("div", { className: cn("w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10", heights[size]), children: _jsx("div", { className: cn("rounded-full transition-all duration-700", heights[size]), style: { width: `${percentage}%`, backgroundColor: color } }) })] }));
}
