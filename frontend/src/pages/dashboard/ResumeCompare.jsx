import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitCompareArrows, TrendingUp, TrendingDown, Minus, Upload, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resumeApi } from "@/api/resume";
export function ResumeComparePage() {
    const [resumes, setResumes] = useState([]);
    const [oldId, setOldId] = useState("");
    const [newId, setNewId] = useState("");
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isComparing, setIsComparing] = useState(false);
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        resumeApi.getHistory()
            .then((data) => {
            if (cancelled)
                return;
            setResumes(data);
            // Auto-select the two most recent DIFFERENT resumes
            if (data.length >= 2) {
                setOldId(data[1].id);
                setNewId(data[0].id);
            }
            else if (data.length === 1) {
                setOldId(data[0].id);
                setNewId("");
            }
        })
            .catch(() => { })
            .finally(() => { if (!cancelled)
            setIsLoading(false); });
        return () => { cancelled = true; };
    }, []);
    const isSameResume = oldId !== "" && newId !== "" && oldId === newId;
    const handleCompare = async () => {
        if (!oldId || !newId)
            return;
        if (isSameResume) {
            toast.error("Please select two different resumes");
            return;
        }
        setIsComparing(true);
        toast.loading("Comparing resumes...", { id: "compare" });
        try {
            const res = await resumeApi.compareResumes(oldId, newId);
            setResult(res);
            toast.success("Comparison complete!", { id: "compare" });
        }
        catch {
            toast.error("Comparison failed", { id: "compare" });
        }
        finally {
            setIsComparing(false);
        }
    };
    // When oldId changes, if newId is the same, auto-pick the next available
    const handleOldChange = (id) => {
        setOldId(id);
        setResult(null);
        if (id === newId) {
            const alt = resumes.find((r) => r.id !== id);
            if (alt)
                setNewId(alt.id);
            else
                setNewId("");
        }
    };
    const handleNewChange = (id) => {
        setNewId(id);
        setResult(null);
        if (id === oldId) {
            const alt = resumes.find((r) => r.id !== id);
            if (alt)
                setOldId(alt.id);
            else
                setOldId("");
        }
    };
    // Helper: get display label for a resume
    const label = (r) => {
        const score = r.atsScore != null ? ` (ATS: ${r.atsScore}%)` : "";
        return `${r.fileName}${score} — ${new Date(r.createdAt).toLocaleDateString()}`;
    };
    if (isLoading) {
        return _jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" }) });
    }
    if (resumes.length < 2) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx(GitCompareArrows, { className: "mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" }), _jsx("h2", { className: "mb-2 text-xl font-semibold text-gray-900 dark:text-white", children: "Need 2+ Resumes" }), _jsx("p", { className: "mb-6 text-gray-500", children: "Upload at least 2 resumes to compare them" }), _jsx(Link, { to: "/upload", children: _jsxs(Button, { className: "gap-2", children: [_jsx(Upload, { className: "h-4 w-4" }), " Upload Resume"] }) })] }));
    }
    return (_jsxs("div", { className: "w-full min-w-0 space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Resume Comparison" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Compare your old resume with the improved version" })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, children: _jsx(Card, { children: _jsxs(CardContent, { className: "p-6", children: [_jsxs("div", { className: "grid w-full min-w-0 items-end gap-4 sm:grid-cols-[1fr_auto_1fr_auto]", children: [_jsxs("div", { className: "min-w-0 space-y-1.5", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "\uD83D\uDCC4 Old Resume" }), _jsx("select", { value: oldId, onChange: (e) => handleOldChange(e.target.value), className: "flex h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100", children: resumes.map((r) => (_jsxs("option", { value: r.id, disabled: r.id === newId, children: [label(r), r.id === newId ? " (selected as New)" : ""] }, r.id))) })] }), _jsx("div", { className: "flex items-center justify-center pb-1", children: _jsx("span", { className: "text-xl text-gray-400", children: "\u2192" }) }), _jsxs("div", { className: "min-w-0 space-y-1.5", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300", children: "\uD83D\uDCC4 New Resume" }), _jsx("select", { value: newId, onChange: (e) => handleNewChange(e.target.value), className: "flex h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100", children: resumes.map((r) => (_jsxs("option", { value: r.id, disabled: r.id === oldId, children: [label(r), r.id === oldId ? " (selected as Old)" : ""] }, r.id))) })] }), _jsxs(Button, { onClick: handleCompare, isLoading: isComparing, disabled: isSameResume || !oldId || !newId, className: "w-full gap-2 shadow-lg shadow-brand-500/25 sm:w-auto", children: [_jsx(GitCompareArrows, { className: "h-4 w-4" }), " Compare"] })] }), isSameResume && (_jsxs(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, className: "mt-4 flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 dark:border-amber-800 dark:bg-amber-900/20", children: [_jsx(AlertTriangle, { className: "h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" }), _jsx("p", { className: "text-sm text-amber-800 dark:text-amber-300", children: "You've selected the same resume for both fields. Please pick two different versions to compare." })] }))] }) }) }), result && (() => {
                const rawDelta = result.rawAtsDelta ?? result.newScore - result.oldScore;
                const rowDeltasOk = result.fullComparisonReliable ?? result.comparisonReliable !== false;
                const headlineOk = result.atsHeadlineValid === true ||
                    (result.atsHeadlineValid === undefined && result.comparisonReliable !== false);
                const showSevereWarning = !headlineOk;
                return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "space-y-6", children: [showSevereWarning && (_jsxs(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, className: "flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/40 dark:bg-amber-900/10", children: [_jsx(AlertTriangle, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" }), _jsxs("div", { className: "min-w-0 space-y-1", children: [_jsx("p", { className: "font-medium text-amber-900 dark:text-amber-100", children: "Comparison not available" }), _jsxs("p", { className: "text-xs text-amber-800/90 dark:text-amber-200/90", children: [result.verdict, _jsxs("span", { className: "mt-2 block text-amber-700/80 dark:text-amber-300/80", children: ["Raw ATS difference (informational only): ", rawDelta > 0 ? "+" : "", rawDelta, " percentage points."] })] })] })] })), headlineOk && !rowDeltasOk && result.unreliableSide === "old" && (_jsxs(motion.div, { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, className: "flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm dark:border-sky-900/40 dark:bg-sky-900/10", children: [_jsx(Info, { className: "mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" }), _jsxs("p", { className: "text-xs text-sky-900 dark:text-sky-100", children: ["The ", _jsx("strong", { children: "ATS improvement" }), " above compares stored headline scores. The ", _jsx("strong", { children: "older" }), " resume\u2019s section scores may be from a failed or partial run (e.g. 1% with zeros). Use the table as a guide only, or re-analyze the old file if you still have it."] })] })), _jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "flex flex-col items-center p-6 text-center", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-gray-500", children: "Old Score" }), _jsxs("p", { className: "text-4xl font-bold text-gray-400", children: [result.oldScore, "%"] })] }) }), _jsx(Card, { className: "border-brand-200 bg-gradient-to-br from-brand-50 to-purple-50 dark:border-brand-800 dark:from-brand-900/20 dark:to-purple-900/20", children: _jsxs(CardContent, { className: "flex flex-col items-center p-6 text-center", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-gray-500", children: "Improvement" }), headlineOk ? (_jsxs("p", { className: `text-4xl font-bold ${result.improvement > 0 ? "text-green-500" : result.improvement < 0 ? "text-red-500" : "text-gray-500"}`, children: [result.improvement > 0 ? "+" : "", result.improvement, "%"] })) : (_jsx("p", { className: "text-4xl font-bold text-gray-400 dark:text-gray-500", title: "Headline improvement hidden when the new resume\u2019s analysis is unreliable", children: "\u2014" })), _jsx("p", { className: "mt-1 text-sm font-medium text-brand-600 dark:text-brand-400", children: result.verdict })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "flex flex-col items-center p-6 text-center", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-gray-500", children: "New Score" }), _jsxs("p", { className: "text-4xl font-bold text-brand-600", children: [result.newScore, "%"] })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Detailed Comparison" }), _jsx(CardDescription, { children: "Side-by-side metric breakdown" })] }), _jsx(CardContent, { className: "min-w-0", children: _jsx("div", { className: "w-full min-w-0 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "min-w-[20rem]", children: [_jsxs("div", { className: "grid grid-cols-4 gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 sm:gap-4 sm:px-4 dark:border-gray-700 dark:bg-gray-800/50", children: [_jsx("span", { children: "Metric" }), _jsx("span", { className: "text-center", children: "Old" }), _jsx("span", { className: "text-center", children: "New" }), _jsx("span", { className: "text-center", children: "Change" })] }), result.comparisons.map((c, i) => {
                                                    const diff = c.new - c.old;
                                                    return (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.05 }, className: "grid grid-cols-4 items-center gap-2 border-b border-gray-100 px-3 py-3 last:border-0 sm:gap-4 sm:px-4 dark:border-gray-800", children: [_jsx("span", { className: "min-w-0 text-sm font-medium text-gray-900 dark:text-white", children: c.label }), _jsxs("span", { className: "text-center text-sm text-gray-500", children: [c.old, c.unit] }), _jsxs("span", { className: "text-center text-sm font-semibold text-gray-900 dark:text-white", children: [c.new, c.unit] }), _jsx("div", { className: "flex items-center justify-center", children: !rowDeltasOk ? (_jsx(Badge, { variant: "secondary", className: "gap-1", children: "\u2014" })) : diff > 0 ? (_jsxs(Badge, { variant: "success", className: "gap-1", children: [_jsx(TrendingUp, { className: "h-3 w-3" }), " +", diff] })) : diff < 0 ? (_jsxs(Badge, { variant: "danger", className: "gap-1", children: [_jsx(TrendingDown, { className: "h-3 w-3" }), " ", diff] })) : (_jsxs(Badge, { variant: "secondary", className: "gap-1", children: [_jsx(Minus, { className: "h-3 w-3" }), " 0"] })) })] }, c.label));
                                                })] }) }) })] })] }));
            })()] }));
}
