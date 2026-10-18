import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";
const Input = forwardRef(({ className, type, label, error, id, ...props }, ref) => (_jsxs("div", { className: "space-y-1.5", children: [label && (_jsx("label", { htmlFor: id, className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: label })), _jsx("input", { type: type, id: id, className: cn("glass-input flex h-10 w-full px-3.5 py-2", error && "border-red-500 focus:border-red-500 focus:ring-red-500/20", className), ref: ref, ...props }), error && _jsx("p", { className: "text-sm text-red-500", children: error })] })));
Input.displayName = "Input";
export { Input };
