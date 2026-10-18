import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareQuote, Lightbulb, ChevronDown, Sparkles, Upload, Brain, Target, } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resumeApi } from "@/api/resume";
const categoryColors = {
    Technical: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Behavioral: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Leadership: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Process: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    DevOps: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "System Design": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};
function QuestionCard({ q, index }) {
    const [expanded, setExpanded] = useState(false);
    return (_jsx(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.04 }, children: _jsxs("div", { className: "group min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-white p-4 sm:p-5 transition-all hover:border-brand-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-brand-800", onClick: () => setExpanded(!expanded), children: [_jsxs("div", { className: "flex min-w-0 items-start justify-between gap-3", children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-start gap-3", children: [_jsx("div", { className: "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-500 text-xs font-bold text-white", children: index + 1 }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "mb-2", children: _jsx("span", { className: `inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryColors[q.category] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`, children: q.category }) }), _jsx("p", { className: "break-words text-sm font-medium leading-relaxed text-gray-900 dark:text-slate-200", children: q.question })] })] }), _jsx(motion.button, { className: "mt-1 flex-shrink-0 text-gray-400 transition-colors group-hover:text-brand-500", animate: { rotate: expanded ? 180 : 0 }, transition: { duration: 0.25 }, children: _jsx(ChevronDown, { className: "h-4 w-4" }) })] }), _jsx(AnimatePresence, { initial: false, children: expanded && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, className: "overflow-hidden", children: _jsxs("div", { className: "mt-4 flex items-start gap-2.5 rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20", children: [_jsx(Lightbulb, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" }), _jsxs("div", { children: [_jsx("p", { className: "mb-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400", children: "Preparation Tip" }), _jsx("p", { className: "text-sm leading-relaxed text-amber-800 dark:text-amber-300", children: q.tip })] })] }) })) })] }) }));
}
export function InterviewPrepPage() {
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [filterCategory, setFilterCategory] = useState("All");
    useEffect(() => {
        setIsLoading(true);
        resumeApi
            .getHistory()
            .then((data) => {
            setResumes(data);
            if (data.length > 0)
                setSelectedResumeId(data[0].id);
        })
            .catch(() => { })
            .finally(() => setIsLoading(false));
    }, []);
    const handleGenerate = async () => {
        if (!selectedResumeId)
            return;
        setIsGenerating(true);
        toast.loading("Generating interview questions...", { id: "interview" });
        try {
            const result = await resumeApi.getInterviewQuestions(selectedResumeId);
            setQuestions(result.questions);
            toast.success(`${result.totalQuestions} questions generated!`, {
                id: "interview",
            });
        }
        catch {
            toast.error("Failed to generate questions", { id: "interview" });
        }
        finally {
            setIsGenerating(false);
        }
    };
    const categories = ["All", ...new Set(questions.map((q) => q.category))];
    const filteredQuestions = filterCategory === "All"
        ? questions
        : questions.filter((q) => q.category === filterCategory);
    if (isLoading) {
        return (_jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" }) }));
    }
    if (resumes.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx(MessageSquareQuote, { className: "mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" }), _jsx("h2", { className: "mb-2 text-xl font-semibold text-gray-900 dark:text-white", children: "No Resumes Found" }), _jsx("p", { className: "mb-6 text-gray-500", children: "Upload a resume first to generate interview questions" }), _jsx(Link, { to: "/upload", children: _jsxs(Button, { className: "gap-2", children: [_jsx(Upload, { className: "h-4 w-4" }), " Upload Resume"] }) })] }));
    }
    return (_jsxs("div", { className: "mx-auto flex w-full min-w-0 max-w-full flex-col space-y-6 overflow-x-hidden", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "min-w-0", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Interview Preparation" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "AI-generated interview questions based on your resume" })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "min-w-0", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-5 w-5 text-[#76516F]" }), "Generate Questions"] }), _jsx(CardDescription, { children: "Select a resume to generate personalized interview questions" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4", children: [_jsx("select", { value: selectedResumeId, onChange: (e) => setSelectedResumeId(e.target.value), className: "h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:flex-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100", children: resumes.map((r) => (_jsxs("option", { value: r.id, children: [r.fileName, " \u2014 ", new Date(r.createdAt).toLocaleDateString()] }, r.id))) }), _jsxs(Button, { onClick: handleGenerate, isLoading: isGenerating, className: "w-full shrink-0 gap-2 shadow-lg shadow-brand-500/25 sm:w-auto", children: [_jsx(MessageSquareQuote, { className: "h-4 w-4" }), "Generate Questions"] })] }) })] }) }), questions.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-w-0 space-y-4", children: [_jsxs(Card, { className: "min-w-0 overflow-hidden", children: [_jsx("div", { className: "flex w-full min-w-0 flex-nowrap gap-0 overflow-x-auto overflow-y-hidden border-b border-gray-200 px-1 scrollbar-thin sm:px-0 dark:border-gray-700", children: categories.map((cat) => {
                                    const isActive = filterCategory === cat;
                                    const count = cat === "All" ? questions.length : questions.filter((q) => q.category === cat).length;
                                    return (_jsxs("button", { onClick: () => setFilterCategory(cat), className: `relative min-w-[5.5rem] flex-shrink-0 px-3 py-3 text-left text-sm font-medium transition-colors sm:min-w-0 sm:flex-1 sm:px-4 sm:text-center ${isActive
                                            ? "text-brand-600 dark:text-brand-400"
                                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`, children: [_jsx("span", { children: cat }), _jsx("span", { className: `ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${isActive
                                                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                                                    : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"}`, children: count }), isActive && (_jsx(motion.div, { layoutId: "interview-tab-indicator", className: "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-purple-500", transition: { type: "spring", damping: 25, stiffness: 300 } }))] }, cat));
                                }) }), _jsx("div", { className: "w-full min-w-0 px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 }, className: "flex w-full min-w-0 flex-col space-y-3", children: filteredQuestions.map((q, i) => (_jsx(QuestionCard, { q: q, index: i }, `${q.category}-${i}`))) }, filterCategory) }) })] }), _jsx("div", { className: "text-center", children: _jsxs(Badge, { variant: "secondary", className: "text-xs", children: [filteredQuestions.length, " of ", questions.length, " questions shown"] }) })] })), _jsx(InterviewCoach, { resumes: resumes, selectedResumeId: selectedResumeId })] }));
}
/** Premium Interview Coach: generates targeted questions from Resume + JD */
function InterviewCoach({ resumes, selectedResumeId }) {
    const [jd, setJd] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [predicted, setPredicted] = useState([]);
    const [expandedIdx, setExpandedIdx] = useState(null);
    const handleGenerate = async () => {
        if (!selectedResumeId || !jd.trim())
            return;
        setIsLoading(true);
        setPredicted([]);
        toast.loading("Predicting interview questions...", { id: "predictor" });
        try {
            const result = await resumeApi.interviewPredictor(selectedResumeId, jd);
            setPredicted(result.questions);
            toast.success(`${result.questions.length} predicted questions ready!`, { id: "predictor" });
        }
        catch {
            toast.error("Failed to generate predictions", { id: "predictor" });
        }
        finally {
            setIsLoading(false);
        }
    };
    if (resumes.length === 0)
        return null;
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "min-w-0 space-y-4", children: [_jsxs(Card, { className: "min-w-0 overflow-hidden border-indigo-500/20", children: [_jsxs(CardHeader, { className: "bg-gradient-to-r from-indigo-500/[0.06] to-purple-500/[0.06]", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "h-5 w-5 text-indigo-500" }), "Interview Coach", _jsx(Badge, { variant: "default", className: "ml-2 text-[10px]", children: "Premium" })] }), _jsx(CardDescription, { children: "Paste a job description to predict the exact interview questions you'll face" })] }), _jsxs(CardContent, { className: "w-full min-w-0 space-y-4", children: [_jsxs("div", { className: "min-w-0 space-y-1.5", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "Target Job Description" }), _jsx("textarea", { value: jd, onChange: (e) => setJd(e.target.value), placeholder: "Paste the job description you're applying for...", rows: 4, className: "w-full min-w-0 resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" })] }), _jsxs(Button, { className: "w-full gap-2 shadow-lg shadow-indigo-500/25 sm:w-auto", onClick: handleGenerate, isLoading: isLoading, disabled: !selectedResumeId || !jd.trim(), children: [_jsx(Target, { className: "h-4 w-4" }), " Predict My Interview Questions"] })] })] }), predicted.length > 0 && (_jsxs(Card, { className: "min-w-0", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-base", children: ["\uD83C\uDFAF Predicted Questions (", predicted.length, ")"] }), _jsx(CardDescription, { children: "Click a question to reveal the ideal answer strategy" })] }), _jsx(CardContent, { className: "w-full min-w-0 space-y-3", children: predicted.map((q, i) => {
                            const isOpen = expandedIdx === i;
                            return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.06 }, children: _jsxs("div", { onClick: () => setExpandedIdx(isOpen ? null : i), className: `cursor-pointer rounded-xl border p-4 transition-all ${isOpen
                                        ? "border-indigo-500/40 bg-indigo-50/50 shadow-md shadow-indigo-500/10 dark:border-indigo-500/30 dark:bg-indigo-900/10"
                                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white", children: i + 1 }), _jsx("p", { className: "text-sm font-semibold leading-relaxed text-gray-900 dark:text-slate-200", children: q.question })] }), _jsx(motion.div, { animate: { rotate: isOpen ? 180 : 0 }, transition: { duration: 0.25 }, className: "mt-0.5 flex-shrink-0 text-gray-400", children: _jsx(ChevronDown, { className: "h-4 w-4" }) })] }), _jsx(AnimatePresence, { initial: false, children: isOpen && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, className: "overflow-hidden", children: _jsxs("div", { className: "mt-4 flex items-start gap-2.5 rounded-lg border border-indigo-200/50 bg-indigo-50 p-4 dark:border-indigo-800/30 dark:bg-indigo-900/20", children: [_jsx(Lightbulb, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" }), _jsxs("div", { children: [_jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400", children: "Ideal Answer Strategy" }), _jsx("p", { className: "text-sm leading-relaxed text-indigo-800 dark:text-indigo-300", children: q.strategy })] })] }) })) })] }) }, i));
                        }) })] }))] }));
}
