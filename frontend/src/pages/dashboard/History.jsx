import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Trash2, ExternalLink, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { resumeApi } from "@/api/resume";
import { getScoreLabel } from "@/utils/constants";
export function HistoryPage() {
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        resumeApi
            .getHistory()
            .then(setResumes)
            .catch(() => toast.error("Failed to load resume history"))
            .finally(() => setIsLoading(false));
    }, []);
    const handleDelete = async (id) => {
        try {
            await resumeApi.delete(id);
            setResumes((prev) => prev.filter((r) => r.id !== id));
            toast.success("Resume deleted successfully");
        }
        catch {
            toast.error("Failed to delete resume");
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#6B4B68] border-t-transparent" }) }));
    }
    return (_jsxs("div", { className: "history-page mx-auto w-full min-w-0 max-w-7xl space-y-6 overflow-x-hidden px-4 sm:px-6", children: [_jsx("style", { children: `
        /* Keep history cards readable even when shared Card styles override Tailwind dark classes. */
        .dark .history-page .history-card,
        .dark .history-page .history-card[data-slot="card"] {
          background-color: #19121f !important;
          border-color: rgba(139, 78, 128, 0.45) !important;
          color: #f7f2fb !important;
        }
        .dark .history-page .history-card .resume-title {
          color: #f7f2fb !important;
        }
        .dark .history-page .history-card .resume-meta {
          color: #c7b7cb !important;
        }
        .dark .history-page .history-card .score-label {
          color: #d8c9dc !important;
        }
      ` }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: _jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-2xl font-bold text-[#2F1D32] dark:text-white sm:text-3xl", children: "Resume History" }), _jsx("p", { className: "mt-1 text-sm text-[#806F82] dark:text-gray-400 sm:text-base", children: "All your uploaded resumes and their scores" })] }), _jsx(Link, { to: "/upload", className: "w-full shrink-0 sm:w-auto", children: _jsxs(Button, { className: "w-full gap-2 rounded-xl bg-[#6B4B68] text-white shadow-md shadow-[#6B4B68]/20 transition-colors hover:bg-[#563A53] sm:w-auto", children: [_jsx(Upload, { className: "h-4 w-4" }), " Upload New"] }) })] }) }), resumes.length === 0 ? (_jsx(Card, { className: "w-full min-w-0 overflow-hidden rounded-2xl border border-[#E8DCE5] bg-[#FFFAF2] shadow-sm dark:border-white/10 dark:bg-[#19121f]", children: _jsxs(CardContent, { className: "flex flex-col items-center justify-center px-5 py-16 text-center", children: [_jsx(FileText, { className: "mb-4 h-16 w-16 text-[#B58A3A]/70 dark:text-[#D4B36A]" }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-[#2F1D32] dark:text-white", children: "No Resumes Found" }), _jsx("p", { className: "mb-6 text-sm text-[#806F82] dark:text-gray-400", children: "Upload your first resume to get started" }), _jsx(Link, { to: "/upload", children: _jsxs(Button, { className: "gap-2 rounded-xl bg-[#6B4B68] text-white hover:bg-[#563A53]", children: [_jsx(Upload, { className: "h-4 w-4" }), " Upload Resume"] }) })] }) })) : (_jsx("div", { className: "grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3", children: resumes.map((resume, index) => {
                    const score = resume.atsScore || 0;
                    return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "min-w-0", children: _jsxs(Card, { className: "history-card flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8DCE5] bg-[#FFFAF2] text-[#2F1D32] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D7C3D3] hover:shadow-lg hover:shadow-[#6B4B68]/10 dark:border-[#8B4E80]/50 dark:bg-[#19121f] dark:text-[#F7F2FB] dark:hover:border-[#8B4E80]/70", children: [_jsx(CardHeader, { className: "min-w-0 pb-3", children: _jsxs("div", { className: "flex min-w-0 items-start gap-3", children: [_jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EADDBD] bg-[#F8F0DE] dark:border-[#B58A3A]/30 dark:bg-[#B58A3A]/10", children: _jsx(FileText, { className: "h-6 w-6 text-[#6B4B68] dark:text-[#D4B36A]" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-start gap-2", children: [_jsx(CardTitle, { title: resume.fileName || "Resume", className: "resume-title min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-sm font-semibold leading-5 text-[#2F1D32] dark:text-[#F7F2FB] sm:text-base", children: resume.fileName || "Resume" }), _jsxs(Badge, { className: "shrink-0 border border-[#D7EBDD] bg-[#E3F6E9] text-xs font-semibold text-[#226747] dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300", children: [score, "%"] })] }), _jsx("p", { className: "resume-meta mt-1 text-xs text-[#8B7B8D] dark:text-[#C7B7CB]", children: new Date(resume.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) })] })] }) }), _jsxs(CardContent, { className: "flex flex-1 flex-col justify-between gap-5", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "mb-2 flex flex-wrap items-center justify-between gap-2 text-sm", children: [_jsx("span", { className: "score-label text-[#806F82] dark:text-[#D8C9DC]", children: "ATS Score" }), _jsx("span", { className: "score-label font-semibold text-[#2F1D32] dark:text-[#F7F2FB]", children: getScoreLabel(score) })] }), _jsx(Progress, { value: score, size: "sm", className: "[&>div]:bg-[#6B4B68] dark:[&>div]:bg-[#B58A3A]" })] }), _jsxs("div", { className: "flex min-w-0 gap-2", children: [_jsx(Link, { to: `/analysis?resumeId=${resume.id}`, className: "min-w-0 flex-1", children: _jsxs(Button, { variant: "default", size: "sm", className: "w-full min-w-0 gap-1.5 rounded-xl border border-[#6B4B68] bg-[#6B4B68] text-white shadow-sm hover:border-[#563A53] hover:bg-[#563A53] hover:text-white", children: [_jsx(ExternalLink, { className: "h-3.5 w-3.5 shrink-0" }), _jsx("span", { children: "View Analysis" })] }) }), _jsx(Button, { variant: "default", size: "sm", "aria-label": `Delete ${resume.fileName || "resume"}`, title: "Delete resume", onClick: () => handleDelete(resume.id), className: "h-9 w-10 shrink-0 rounded-xl border border-[#6B4B68] bg-[#6B4B68] p-0 text-white shadow-sm hover:border-[#563A53] hover:bg-[#563A53] hover:text-white", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] })] }) }, resume.id));
                }) }))] }));
}
