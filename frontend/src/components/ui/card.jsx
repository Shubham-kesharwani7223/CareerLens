import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/utils/cn";
export function Card({ className, ...props }) {
    return (_jsx("div", { className: cn("glass-card relative rounded-2xl transition-colors duration-200 hover:border-indigo-500/50", className), ...props }));
}
export function CardHeader({ className, ...props }) {
    return (_jsx("div", { className: cn("flex flex-col space-y-1.5 p-6 lg:p-8", className), ...props }));
}
export function CardTitle({ className, ...props }) {
    return (_jsx("h3", { className: cn("text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white", className), ...props }));
}
export function CardDescription({ className, ...props }) {
    return (_jsx("p", { className: cn("text-sm text-gray-500 dark:text-slate-400", className), ...props }));
}
export function CardContent({ className, ...props }) {
    return _jsx("div", { className: cn("p-6 pt-0 lg:p-8 lg:pt-0", className), ...props });
}
export function CardFooter({ className, ...props }) {
    return (_jsx("div", { className: cn("flex items-center p-6 pt-0 lg:p-8 lg:pt-0", className), ...props }));
}
