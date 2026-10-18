import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors", {
    variants: {
        variant: {
            default: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300",
            success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
            warning: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
            danger: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
            secondary: "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300",
        },
    },
    defaultVariants: { variant: "default" },
});
export function Badge({ className, variant, ...props }) {
    return _jsx("span", { className: cn(badgeVariants({ variant }), className), ...props });
}
