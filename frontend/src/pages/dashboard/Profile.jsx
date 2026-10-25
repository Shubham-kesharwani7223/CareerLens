import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Calendar, FileText, TrendingUp, Mic, Bell, Moon, Sun, Sparkles, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { resumeApi } from "@/api/resume";
import { USER_ROLES } from "@/types";
function displayUserRole(role) {
    if (!role)
        return "Member";
    const row = USER_ROLES.find((r) => r.value === role);
    return row?.label ?? String(role).replace(/_/g, " ");
}
const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
};
// Human emoji avatars: stable for each account name.
const PROFILE_EMOJIS = [
    "👨🏻‍💻",
    "👩🏻‍💻",
    "👨🏽‍🎓",
    "👩🏽‍🎓",
    "🧑🏻‍💻",
    "👨🏾‍💼",
    "👩🏾‍💼",
    "🧑🏼‍🎓",
    "👨🏻‍🚀",
    "👩🏻‍🚀",
    "🧑🏽‍💻",
    "👩🏼‍🔬",
];
function getProfileEmoji(name) {
    if (!name)
        return "🧑🏻‍💻";
    const seed = Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return PROFILE_EMOJIS[seed % PROFILE_EMOJIS.length];
}
export function ProfilePage() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [resumes, setResumes] = useState([]);
    const [emailNotif, setEmailNotif] = useState(true);
    useEffect(() => {
        resumeApi
            .getHistory()
            .then(setResumes)
            .catch(() => { });
    }, []);
    const totalResumes = resumes.length;
    const avgScore = totalResumes > 0
        ? Math.round(resumes.reduce((total, resume) => total + (resume.atsScore || 0), 0) /
            totalResumes)
        : 0;
    const totalAnalyzed = resumes.filter((resume) => resume.atsScore != null && resume.atsScore > 0).length;
    const profileFields = [
        {
            icon: User,
            label: "Full Name",
            value: user?.name || "N/A",
        },
        {
            icon: Mail,
            label: "Email",
            value: (user?.email || "N/A").toLowerCase(),
        },
        {
            icon: Shield,
            label: "Role",
            value: displayUserRole(user?.role),
        },
        {
            icon: Calendar,
            label: "Member Since",
            value: user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                : "N/A",
        },
    ];
    const stats = [
        {
            label: "Resumes Uploaded",
            value: totalResumes,
            icon: FileText,
            color: "text-[#4389D9] dark:text-[#83B9FF]",
            bg: "bg-[#E5EFFB] dark:bg-[#1D2D43]",
            border: "border-[#D4E4F7] dark:border-[#304760]",
        },
        {
            label: "Average ATS Score",
            value: `${avgScore}%`,
            icon: TrendingUp,
            color: "text-[#299B68] dark:text-[#6BD9A0]",
            bg: "bg-[#E3F5E9] dark:bg-[#1B3528]",
            border: "border-[#D0EBD9] dark:border-[#2C4B38]",
        },
        {
            label: "Resumes Analyzed",
            value: totalAnalyzed,
            icon: Mic,
            color: "text-[#A66DD0] dark:text-[#D0A0F5]",
            bg: "bg-[#F2E5F8] dark:bg-[#352440]",
            border: "border-[#E7D5F0] dark:border-[#4B3559]",
        },
    ];
    return (_jsxs("div", { className: "space-y-6 text-[#2C1930] dark:text-[#F8F0FA]", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: [_jsxs("p", { className: "mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#987B95] dark:text-[#C2A6C7]", children: [_jsx(Sparkles, { className: "h-4 w-4 text-[#B28B35] dark:text-[#E2C36C]" }), "CareerLens account"] }), _jsx("h1", { className: "text-2xl font-bold tracking-tight text-[#2C1930] dark:text-[#FFF7FF] sm:text-3xl", children: "Your Profile" }), _jsx("p", { className: "mt-1 text-sm text-[#79687E] dark:text-[#C8B9CE] sm:text-base", children: "Your career journey, account details, and personal preferences." })] }), _jsxs("div", { className: "grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.65fr)]", children: [_jsxs("div", { className: "min-w-0 space-y-6", children: [_jsx(motion.div, { variants: itemVariants, initial: "hidden", animate: "show", transition: { delay: 0.05 }, children: _jsxs(Card, { className: "relative overflow-hidden rounded-[28px] border border-[#E7D8E2] bg-gradient-to-br from-[#FFFCF6] via-[#FFF8F0] to-[#F3E8F1] shadow-[0_16px_45px_rgba(59,35,59,0.08)] dark:!border-[#49354C] dark:!bg-gradient-to-br dark:!from-[#17101C] dark:!via-[#140D18] dark:!to-[#211426] dark:shadow-[0_16px_45px_rgba(0,0,0,0.22)]", children: [_jsx("div", { className: "pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#D8B95F]/15 blur-3xl" }), _jsx("div", { className: "pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#A57BA7]/20 blur-3xl" }), _jsxs(CardContent, { className: "relative flex flex-col items-center p-8 text-center", children: [_jsxs("div", { className: "relative mb-5 flex h-32 w-32 items-center justify-center rounded-[36px] border-4 border-[#FFF8E9] bg-gradient-to-br from-[#F9E8B0] via-[#D8B85F] to-[#98713A] text-6xl shadow-[0_14px_30px_rgba(163,124,47,0.25)] dark:border-[#49354C] dark:from-[#6C5123] dark:via-[#A8863C] dark:to-[#4A3520]", children: [_jsx("span", { role: "img", "aria-label": "Human profile avatar", children: getProfileEmoji(user?.name) }), _jsx("span", { className: "absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-[#FFFAF2] bg-[#765574] text-white shadow-md dark:border-[#17101C] dark:bg-[#A080A0]", children: _jsx(Sparkles, { className: "h-4 w-4" }) })] }), _jsx("h2", { className: "max-w-full break-words text-xl font-bold tracking-tight text-[#2C1930] dark:text-[#FFF7FF]", children: user?.name || "CareerLens User" }), _jsx("p", { className: "mt-2 max-w-full break-all text-sm text-[#79687E] dark:text-[#D4C3D9]", children: user?.email || "No email available" }), _jsx(Badge, { className: "mt-4 rounded-full border border-[#DCC6DD] bg-[#F0E3F1] px-4 py-1.5 text-xs font-semibold text-[#6F4D73] hover:bg-[#F0E3F1] dark:border-[#604565] dark:bg-[#35243A] dark:text-[#F0DDF5] dark:hover:bg-[#35243A]", children: displayUserRole(user?.role) }), _jsxs("div", { className: "mt-6 inline-flex items-center gap-2 rounded-full border border-[#E8DDBF] bg-[#FFF8E8] px-4 py-3 text-xs font-medium text-[#876A2C] dark:border-[#57462D] dark:bg-[#2A2117] dark:text-[#F2D27B]", children: [_jsx(Sparkles, { className: "h-4 w-4 shrink-0" }), _jsx("span", { children: "Your career story starts here" })] })] })] }) }), _jsx(motion.div, { variants: itemVariants, initial: "hidden", animate: "show", transition: { delay: 0.15 }, children: _jsxs(Card, { className: "rounded-[26px] border-[#E7D8E2] bg-[#FFFAF2] shadow-sm dark:!border-[#49354C] dark:!bg-[#17101D]", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "!text-base !text-[#2C1930] dark:!text-[#FFF7FF]", children: "Account Details" }), _jsx(CardDescription, { className: "!text-[#79687E] dark:!text-[#C8B9CE]", children: "Your registered account information" })] }), _jsx(CardContent, { className: "space-y-3", children: profileFields.map((field) => (_jsxs("div", { className: "flex min-w-0 items-center gap-3 rounded-xl border border-[#E9DFE7] bg-white/80 p-3.5 transition-colors hover:border-[#CBB0CE] dark:border-[#403044] dark:bg-[#211727] dark:hover:border-[#76577C]", children: [_jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E4EF] dark:bg-[#38253B]", children: _jsx(field.icon, { className: "h-5 w-5 text-[#8D668D] dark:text-[#D8B8DF]" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-xs font-medium text-[#8F7A92] dark:text-[#C3ADC9]", children: field.label }), _jsx("p", { className: "mt-1 break-words text-sm font-semibold text-[#35233A] dark:text-[#F8EFFB]", children: field.value })] })] }, field.label))) })] }) })] }), _jsxs("div", { className: "min-w-0 space-y-6", children: [_jsx(motion.div, { variants: itemVariants, initial: "hidden", animate: "show", transition: { delay: 0.1 }, children: _jsxs(Card, { className: "rounded-[28px] border-[#E7D8E2] bg-[#FFFAF2] shadow-[0_14px_36px_rgba(59,35,59,0.06)] dark:!border-[#49354C] dark:!bg-[#17101D] dark:shadow-[0_14px_36px_rgba(0,0,0,0.18)]", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "!text-base !text-[#2C1930] dark:!text-[#FFF7FF]", children: "Your Journey" }), _jsx(CardDescription, { className: "!text-[#79687E] dark:!text-[#C8B9CE]", children: "Your activity on the platform so far" })] }), _jsx(CardContent, { children: _jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: stats.map((stat, index) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2 + index * 0.08 }, className: `flex min-h-[170px] flex-col items-center justify-center rounded-2xl border ${stat.border} bg-white/80 p-4 text-center transition duration-200 hover:-translate-y-1 hover:shadow-md dark:bg-[#211727]`, children: [_jsx("div", { className: `mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg}`, children: _jsx(stat.icon, { className: `h-6 w-6 ${stat.color}` }) }), _jsx("p", { className: "text-3xl font-bold tracking-tight text-[#2C1930] dark:text-[#FFF7FF]", children: stat.value }), _jsx("p", { className: "mt-2 text-xs font-semibold leading-relaxed text-[#79687E] dark:text-[#D0C0D5]", children: stat.label })] }, stat.label))) }) })] }) }), _jsx(motion.div, { variants: itemVariants, initial: "hidden", animate: "show", transition: { delay: 0.25 }, children: _jsxs(Card, { className: "rounded-[28px] border-[#E7D8E2] bg-[#FFFAF2] shadow-sm dark:!border-[#49354C] dark:!bg-[#17101D]", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "!text-base !text-[#2C1930] dark:!text-[#FFF7FF]", children: "Preferences" }), _jsx(CardDescription, { className: "!text-[#79687E] dark:!text-[#C8B9CE]", children: "Customize your CareerLens experience" })] }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 rounded-2xl border border-[#E6D9E5] bg-white/70 p-4 transition-colors hover:bg-[#FBF4FA] dark:border-[#49354C] dark:bg-[#211727] dark:hover:bg-[#291D30]", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0E4EF] dark:bg-[#38253B]", children: theme === "dark" ? (_jsx(Moon, { className: "h-5 w-5 text-[#B995C6]" })) : (_jsx(Sun, { className: "h-5 w-5 text-[#B28B35]" })) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-[#35233A] dark:text-[#F8EFFB]", children: "Dark Mode" }), _jsx("p", { className: "mt-1 text-xs text-[#79687E] dark:text-[#C8B9CE]", children: theme === "dark"
                                                                                ? "Currently using dark theme"
                                                                                : "Currently using light theme" })] })] }), _jsx("button", { type: "button", role: "switch", "aria-checked": theme === "dark", "aria-label": "Toggle dark mode", onClick: toggleTheme, className: `relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A17A9D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#17101D] ${theme === "dark" ? "bg-[#8B668B]" : "bg-[#D8C7D8]"}`, children: _jsx("span", { "aria-hidden": "true", className: `block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${theme === "dark" ? "translate-x-5" : "translate-x-0"}` }) })] }), _jsxs("div", { className: "flex items-center justify-between gap-3 rounded-2xl border border-[#E6D9E5] bg-white/70 p-4 transition-colors hover:bg-[#FBF4FA] dark:border-[#49354C] dark:bg-[#211727] dark:hover:bg-[#291D30]", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F5E9] dark:bg-[#1B3528]", children: _jsx(Bell, { className: `h-5 w-5 ${emailNotif
                                                                            ? "text-[#299B68] dark:text-[#6BD9A0]"
                                                                            : "text-[#8F7A92] dark:text-[#A995AF]"}` }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-[#35233A] dark:text-[#F8EFFB]", children: "Email Notifications" }), _jsx("p", { className: "mt-1 text-xs text-[#79687E] dark:text-[#C8B9CE]", children: emailNotif
                                                                                ? "Tips and analysis reminders are enabled"
                                                                                : "Email reminders are turned off" })] })] }), _jsx("button", { type: "button", role: "switch", "aria-checked": emailNotif, "aria-label": "Toggle email notifications", onClick: () => setEmailNotif((previous) => !previous), className: `relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#17101D] ${emailNotif ? "bg-[#438B68]" : "bg-[#D8C7D8] dark:bg-[#514153]"}`, children: _jsx("span", { "aria-hidden": "true", className: `block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${emailNotif ? "translate-x-5" : "translate-x-0"}` }) })] }), _jsx("p", { className: "px-1 pt-1 text-xs leading-relaxed text-[#8F7A92] dark:text-[#BBAABE]", children: "Your appearance follows the CareerLens theme. Email notification preference is currently a local UI setting." })] })] }) })] })] })] }));
}
