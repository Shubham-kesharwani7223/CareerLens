import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, Lightbulb, CheckCircle2, AlertTriangle, Upload, Sparkles, ArrowRight, XCircle, AlertOctagon, Info, ChevronDown, Wand2, Loader2, SpellCheck, Zap, LayoutTemplate, Key, } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StrengthMeter } from "@/components/ui/StrengthMeter";
import { AtsScoreChart } from "@/components/charts/AtsScoreChart";
import { SkillsRadarChart } from "@/components/charts/SkillsRadarChart";
import { resumeApi } from "@/api/resume";
import { generateAnalysisReport } from "@/utils/generateReport";
import { useAuth } from "@/hooks/useAuth";
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};
/** Inline "Magic Wand" button — rewrites a bullet point with AI */
function MagicRewriteBtn({ text, onRewritten }) {
    const [loading, setLoading] = useState(false);
    const handleRewrite = async (e) => {
        e.stopPropagation();
        if (loading || text.length < 5)
            return;
        setLoading(true);
        try {
            const result = await resumeApi.rewriteBulletPoint(text);
            onRewritten(result.rewritten);
            toast.success("Text rewritten successfully! ✨");
        }
        catch {
            // 403 handled globally by interceptor
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("button", { onClick: handleRewrite, disabled: loading, title: "Fix it with AI", className: "ml-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[#b18a36] dark:text-[#e5c16e] transition-all hover:bg-[#89658a]/10 hover:text-[#79557e] dark:hover:text-[#d5b6df] disabled:opacity-50", children: loading ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(Wand2, { className: "h-3.5 w-3.5" }) }));
}
/** Before/After block with inline Magic Wand rewrite */
function FeedbackBeforeAfter({ original, improved }) {
    const [betterText, setBetterText] = useState(improved);
    const [justRewritten, setJustRewritten] = useState(false);
    return (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "mb-3 flex items-start gap-2", children: [_jsx("span", { className: "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs dark:bg-red-900/30", children: "\u274C" }), _jsx("p", { className: "flex-1 text-sm text-red-700 line-through decoration-red-300 dark:text-red-400", children: original }), _jsx(MagicRewriteBtn, { text: original, onRewritten: (text) => { setBetterText(text); setJustRewritten(true); setTimeout(() => setJustRewritten(false), 2000); } })] }), _jsx("div", { className: "flex items-center justify-center py-1", children: _jsx(ArrowRight, { className: "h-4 w-4 text-[#9b8a9e] dark:text-[#aa9bb4]" }) }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs dark:bg-green-900/30", children: "\u2705" }), _jsxs(motion.p, { initial: justRewritten ? { opacity: 0, y: 5 } : false, animate: { opacity: 1, y: 0 }, className: `text-sm font-medium ${justRewritten ? "text-[#79557e] dark:text-[#d5b6df] dark:text-[#b18a36] dark:text-[#e5c16e]" : "text-green-700 dark:text-green-400"}`, children: [betterText, justRewritten && _jsx("span", { className: "ml-1 text-xs text-[#b18a36] dark:text-[#e5c16e]", children: "\u2728 AI rewritten" })] }, betterText)] })] }));
}
/** Multi-Dimensional Score Cards */
function MetricScoreCards({ analysis }) {
    const m = analysis.metrics || {
        grammarScore: Math.min(Math.round((analysis.skillsScore + analysis.experienceScore) / 2 * 1.05), 100),
        impactScore: Math.round(analysis.experienceScore * 0.9),
        formattingScore: Math.round((analysis.skillsScore + analysis.educationScore) / 2),
        keywordScore: Math.round(analysis.skillsScore * 0.95),
    };
    const cards = [
        { label: "Grammar & Typos", score: m.grammarScore, icon: SpellCheck, gradient: "from-emerald-500 to-green-500", glow: "shadow-emerald-500/20" },
        { label: "Impact & Action Verbs", score: m.impactScore, icon: Zap, gradient: "from-amber-500 to-orange-500", glow: "shadow-amber-500/20" },
        { label: "Formatting", score: m.formattingScore, icon: LayoutTemplate, gradient: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/20" },
        { label: "Keyword Match", score: m.keywordScore, icon: Key, gradient: "from-[#89658a] to-pink-500", glow: "shadow-purple-500/20" },
    ];
    const getColor = (score) => score >= 75 ? "text-green-500" : score >= 50 ? "text-amber-500" : "text-red-500";
    const getBarColor = (score) => score >= 75 ? "from-green-500 to-emerald-400" : score >= 50 ? "from-amber-500 to-yellow-400" : "from-red-500 to-orange-400";
    const getLabel = (score) => score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 50 ? "Average" : "Needs Work";
    return (_jsx(motion.div, { variants: itemVariants, children: _jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: cards.map((card, i) => (_jsx(motion.div, { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 + i * 0.08 }, children: _jsxs(Card, { className: `group relative overflow-hidden transition-shadow hover:shadow-lg hover:${card.glow}`, children: [_jsx("div", { className: `absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-[0.07] transition-opacity group-hover:opacity-[0.12]` }), _jsxs(CardContent, { className: "relative p-5", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: `flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`, children: _jsx(card.icon, { className: "h-4 w-4" }) }), _jsx("span", { className: "text-sm font-semibold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: card.label })] }), _jsxs("span", { className: `text-xl font-bold ${getColor(card.score)}`, children: [card.score, "%"] })] }), _jsx("div", { className: "mb-1.5 h-2 overflow-hidden rounded-full bg-[#e9dfe8] dark:bg-[#3c2b43] dark:bg-[#49344f] dark:bg-[#3c2b43]/60", children: _jsx(motion.div, { className: `h-full rounded-full bg-gradient-to-r ${getBarColor(card.score)}`, initial: { width: 0 }, animate: { width: `${card.score}%` }, transition: { duration: 1, delay: 0.4 + i * 0.1, ease: "easeOut" } }) }), _jsx("p", { className: `text-[11px] font-medium ${getColor(card.score)}`, children: getLabel(card.score) })] })] }) }, card.label))) }) }));
}
/** Progressive Disclosure: shows top 3 suggestions, expand for all */
function SuggestionsCard({ suggestions }) {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_COUNT = 3;
    const hasMore = suggestions.length > INITIAL_COUNT;
    const visible = showAll ? suggestions : suggestions.slice(0, INITIAL_COUNT);
    return (_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "border-[#e4d6dc] bg-[#fffaf2] text-[#29182f] shadow-sm dark:border-[#3c2b43] dark:bg-[#17101d] dark:text-[#fbf7ff]", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Lightbulb, { className: "h-5 w-5 text-yellow-500" }), "AI Suggestions"] }), _jsx(CardDescription, { children: "Top recommendations to improve your resume" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "space-y-3", children: [visible.map((suggestion, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.3 + index * 0.05 }, className: "flex gap-3 rounded-lg border border-[#eee4e9] dark:border-[#3c2b43] p-4 transition-colors hover:bg-[#fcf6ed] dark:bg-[#120d17] dark:border-[#49344f] dark:border-[#3c2b43] dark:hover:bg-[#211626] dark:bg-[#17101d]/50", children: [_jsx("div", { className: `flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${index < 3 ? "bg-gradient-to-br from-[#694969] to-[#c6a05a]" : "bg-[#9b8a9e] dark:bg-[#6f5b75] dark:bg-[#796a7d] dark:bg-[#5c4763]"}`, children: index + 1 }), _jsx("p", { className: "text-sm leading-relaxed text-[#44334b] dark:text-[#f0e8f5] dark:text-[#b5a6bb] dark:text-[#c5b8ce]", children: suggestion })] }, index))), _jsx(AnimatePresence, { children: showAll && suggestions.slice(INITIAL_COUNT).map((suggestion, i) => {
                                        const index = i + INITIAL_COUNT;
                                        return (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.25, delay: i * 0.04 }, className: "overflow-hidden", children: _jsxs("div", { className: "flex gap-3 rounded-lg border border-[#eee4e9] dark:border-[#3c2b43] p-4 transition-colors hover:bg-[#fcf6ed] dark:bg-[#120d17] dark:border-[#49344f] dark:border-[#3c2b43] dark:hover:bg-[#211626] dark:bg-[#17101d]/50", children: [_jsx("div", { className: "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#9b8a9e] dark:bg-[#6f5b75] text-xs font-bold text-white dark:bg-[#796a7d] dark:bg-[#5c4763]", children: index + 1 }), _jsx("p", { className: "text-sm leading-relaxed text-[#44334b] dark:text-[#f0e8f5] dark:text-[#b5a6bb] dark:text-[#c5b8ce]", children: suggestion })] }) }, `extra-${index}`));
                                    }) })] }), hasMore && (_jsxs(motion.button, { onClick: () => setShowAll(!showAll), className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d8cbd9] dark:border-[#49344f] py-2.5 text-sm font-medium text-[#796a7d] dark:text-[#c5b8ce] transition-all hover:border-[#a17da5] dark:hover:border-[#89658a] hover:bg-[#f4eaf2] dark:hover:bg-[#211626] hover:text-[#79557e] dark:hover:text-[#d5b6df] dark:border-[#796a7d] dark:border-[#49344f] dark:hover:border-[#89658a] dark:hover:border-[#a17da5] dark:hover:bg-brand-900/10 dark:hover:text-[#a17da5] dark:hover:text-[#d5b6df]", whileTap: { scale: 0.98 }, children: [_jsx(ChevronDown, { className: `h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}` }), showAll ? "Show Less" : `Show All ${suggestions.length} Suggestions`] }))] })] }) }));
}
export function ResumeAnalysisPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const resumeId = searchParams.get("resumeId");
    const isSample = searchParams.get("sample") === "true";
    const [resume, setResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [smartFeedback, setSmartFeedback] = useState(null);
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
    const [sectionData, setSectionData] = useState(null);
    const [isSectionLoading, setIsSectionLoading] = useState(false);
    const [rewriteInput, setRewriteInput] = useState("");
    const [rewriteResult, setRewriteResult] = useState(null);
    const [isRewriting, setIsRewriting] = useState(false);
    const [industryData, setIndustryData] = useState(null);
    const [isIndustryLoading, setIsIndustryLoading] = useState(false);
    const [readabilityData, setReadabilityData] = useState(null);
    const [isReadabilityLoading, setIsReadabilityLoading] = useState(false);
    const [hiringData, setHiringData] = useState(null);
    const [benchmarkData, setBenchmarkData] = useState(null);
    const [badgesData, setBadgesData] = useState(null);
    const [loadingStage, setLoadingStage] = useState("");
    const [isPdfGenerating, setIsPdfGenerating] = useState(false);
    /** Avoid re-fetching hiring/benchmark/badges when analysis object reference changes without real data change */
    const extrasFetchKeyRef = useRef(null);
    /** Synchronous guard so rapid double-clicks cannot enqueue multiple analyze requests before React re-renders. */
    const analyzeRequestLockRef = useRef(false);
    useEffect(() => {
        extrasFetchKeyRef.current = null;
    }, [resumeId]);
    useEffect(() => {
        // ── Sample resume: load mock data directly (no API call, no credits) ──
        if (isSample) {
            const st = location.state?.sampleData;
            if (st) {
                setResume({ id: st.id, userId: "", fileUrl: "", fileName: st.fileName, atsScore: st.atsScore, createdAt: new Date().toISOString(), analysis: st.analysis });
                setAnalysis(st.analysis);
                return;
            }
        }
        if (resumeId) {
            setIsLoading(true);
            resumeApi
                .getById(resumeId)
                .then((data) => {
                setResume(data);
                if (data.analysis) {
                    setAnalysis(data.analysis);
                }
            })
                .catch(() => {
                toast.error("Failed to load resume");
            })
                .finally(() => setIsLoading(false));
        }
        // `location.state` is unstable (new object per render) — use `location.key` so we only
        // re-run on real navigations, not on arbitrary parent re-renders.
    }, [resumeId, isSample, location.key]);
    const LOADING_STAGES = [
        "Extracting text from resume...",
        "Parsing sections & structure...",
        "Running NLP keyword analysis...",
        "Detecting technical skills...",
        "Scoring ATS compatibility...",
        "Generating AI suggestions...",
        "Finalizing analysis...",
    ];
    const handleAnalyze = async () => {
        if (!resumeId || analyzeRequestLockRef.current)
            return;
        analyzeRequestLockRef.current = true;
        setIsAnalyzing(true);
        setLoadingStage(LOADING_STAGES[0]);
        let stageInterval;
        let stageIdx = 0;
        stageInterval = setInterval(() => {
            stageIdx = (stageIdx + 1) % LOADING_STAGES.length;
            setLoadingStage(LOADING_STAGES[stageIdx]);
        }, 2500);
        try {
            const result = await resumeApi.analyze(resumeId);
            setLoadingStage("✅ Analysis complete!");
            setAnalysis(result);
            const updatedResume = await resumeApi.getById(resumeId);
            setResume(updatedResume);
            toast.success("Analysis complete!", {
                description: `ATS Score: ${updatedResume.atsScore}%`,
            });
        }
        catch (err) {
            const error = err;
            const msg = error.response?.data?.message || "Analysis failed. Please try again.";
            toast.error(msg);
        }
        finally {
            if (stageInterval)
                clearInterval(stageInterval);
            analyzeRequestLockRef.current = false;
            setIsAnalyzing(false);
            setLoadingStage("");
        }
    };
    // Auto-load hiring probability, benchmark, badges when analysis is ready (once per score snapshot)
    useEffect(() => {
        if (!analysis || !resumeId || !resume)
            return;
        const key = [
            resumeId,
            resume.atsScore ?? "null",
            analysis.skillsScore,
            analysis.experienceScore,
            analysis.educationScore,
            analysis.projectsScore,
        ].join("|");
        if (extrasFetchKeyRef.current === key)
            return;
        extrasFetchKeyRef.current = key;
        let cancelled = false;
        const delay = (ms) => new Promise((r) => setTimeout(r, ms));
        const run = async () => {
            try {
                const h = await resumeApi.getHiringProbability(resumeId);
                if (cancelled)
                    return;
                setHiringData(h);
                await delay(400);
                const b = await resumeApi.getGlobalBenchmark(resumeId);
                if (cancelled)
                    return;
                setBenchmarkData(b);
                await delay(400);
                const bad = await resumeApi.getBadges(resumeId);
                if (cancelled)
                    return;
                setBadgesData(bad);
            }
            catch {
                /* keep prior state */
            }
        };
        void run();
        return () => {
            cancelled = true;
        };
    }, [analysis, resumeId, resume]);
    if (!resumeId) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx(motion.div, { animate: { y: [0, -8, 0] }, transition: { duration: 2, repeat: Infinity }, children: _jsx(FileSearch, { className: "mb-4 h-16 w-16 text-[#b5a6bb] dark:text-[#c5b8ce] dark:text-[#695a70] dark:text-[#d0c3d8]" }) }), _jsx("h2", { className: "mb-2 text-xl font-semibold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: "No Resume Selected" }), _jsx("p", { className: "mb-6 text-[#796a7d] dark:text-[#c5b8ce]", children: "Upload a resume first to see the analysis" }), _jsx(Link, { to: "/upload", children: _jsxs(Button, { className: "gap-2 shadow-lg shadow-[#694969]/20", children: [_jsx(Upload, { className: "h-4 w-4" }), "Upload Resume"] }) })] }));
    }
    if (isLoading) {
        return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "h-10 w-48 animate-pulse rounded-lg bg-[#e9dfe8] dark:bg-[#3c2b43] dark:bg-[#211626] dark:bg-[#17101d]" }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx("div", { className: "h-80 animate-pulse rounded-xl bg-[#e9dfe8] dark:bg-[#3c2b43] dark:bg-[#211626] dark:bg-[#17101d]" }), _jsx("div", { className: "h-80 animate-pulse rounded-xl bg-[#e9dfe8] dark:bg-[#3c2b43] dark:bg-[#211626] dark:bg-[#17101d]" })] })] }));
    }
    // Detect "degenerate" stored analysis where every score is essentially zero.
    // This happens when an earlier analysis run produced bad output (e.g., the
    // resume was image-based and OCR failed, or the LLM returned junk).
    // We show a banner instead of misleading 0%/1% gauges so the user knows to re-run.
    const sectionSum = analysis
        ? analysis.skillsScore + analysis.experienceScore + analysis.educationScore + analysis.projectsScore
        : 0;
    /** Single source of truth for headline ATS — same value as Compare page & resume list */
    const canonicalAts = Math.max(0, Math.min(100, Math.round(Number(resume?.atsScore ?? 0))));
    const atsValue = canonicalAts;
    const isAnalysisDegenerate = !!analysis && (sectionSum <= 5 || (atsValue < 5 && sectionSum < 30));
    return (_jsxs("div", { className: "space-y-6 rounded-2xl bg-[#f7f0e5] p-1 text-[#29182f] dark:bg-[#090811] dark:text-[#fbf7ff]", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: "Resume Analysis" }), _jsx("p", { className: "text-[#796a7d] dark:text-[#c5b8ce] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: resume?.fileName || "Detailed analysis of your resume" })] }), !analysis && (_jsxs(Button, { onClick: handleAnalyze, isLoading: isAnalyzing, disabled: isAnalyzing, className: "gap-2 shadow-lg shadow-[#694969]/20", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Analyze Resume"] }))] }) }), isAnalysisDegenerate && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "relative overflow-hidden rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10", children: _jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertTriangle, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-amber-900 dark:text-amber-200", children: "This analysis looks incomplete" }), _jsx("p", { className: "mt-1 text-xs text-amber-800 dark:text-amber-300/90", children: "Every section scored near zero, which usually means the resume text couldn't be extracted properly (often happens with image-based or scanned PDFs). Re-run the analysis below, or re-upload a text-based PDF (exported from Word/Google Docs)." })] })] }), _jsxs("div", { className: "flex shrink-0 gap-2", children: [_jsxs(Button, { onClick: handleAnalyze, isLoading: isAnalyzing, disabled: isAnalyzing, size: "sm", className: "gap-2", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), "Re-run analysis"] }), _jsx(Link, { to: "/upload", children: _jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", children: [_jsx(Upload, { className: "h-3.5 w-3.5" }), "Re-upload"] }) })] })] }) })), _jsx(AnimatePresence, { mode: "wait", children: analysis ? (_jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "show", className: "space-y-6", children: [_jsxs("div", { className: "grid min-w-0 gap-6 lg:grid-cols-3", children: [_jsx(motion.div, { variants: itemVariants, className: "min-w-0", children: _jsx(AtsScoreChart, { score: canonicalAts }) }), _jsx(motion.div, { variants: itemVariants, className: "min-w-0", children: _jsx(StrengthMeter, { score: canonicalAts, skillsScore: analysis.skillsScore, experienceScore: analysis.experienceScore, educationScore: analysis.educationScore, projectsScore: analysis.projectsScore }) }), _jsx(motion.div, { variants: itemVariants, className: "min-w-0", children: _jsx(SkillsRadarChart, { skills: analysis.skillsScore, experience: analysis.experienceScore, education: analysis.educationScore, projects: analysis.projectsScore, headlineAts: canonicalAts }) })] }), _jsx(MetricScoreCards, { analysis: analysis }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "border-[#e4d6dc] bg-[#fffaf2] text-[#29182f] shadow-sm dark:border-[#3c2b43] dark:bg-[#17101d] dark:text-[#fbf7ff]", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Section Scores" }), _jsx(CardDescription, { children: "Detailed breakdown of each resume section" })] }), _jsx(CardContent, { className: "space-y-6", children: [
                                            { label: "Skills", score: analysis.skillsScore },
                                            { label: "Experience", score: analysis.experienceScore },
                                            { label: "Education", score: analysis.educationScore },
                                            { label: "Projects", score: analysis.projectsScore },
                                        ].map((section) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-[#44334b] dark:text-[#f0e8f5] dark:text-[#b5a6bb] dark:text-[#c5b8ce]", children: section.label }), _jsxs("span", { className: "text-sm font-bold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: [section.score, "%"] })] }), _jsx(Progress, { value: section.score, size: "md" })] }, section.label))) })] }) }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "h-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "h-5 w-5 text-green-500" }), "Keywords Found (", analysis.keywords.filter((k) => !k.startsWith("(") && !/^soft:/i.test(k)).length, ")"] }) }), _jsx(CardContent, { children: analysis.keywords.length > 0 ? (_jsx("div", { className: "flex flex-wrap gap-2", children: analysis.keywords.map((keyword, i) => {
                                                        const isSoft = /^soft:/i.test(keyword);
                                                        const display = isSoft ? keyword.replace(/^soft:\s*/i, "") : keyword;
                                                        return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: i * 0.03 }, children: _jsxs(Badge, { variant: keyword.startsWith("(") ? "secondary" : isSoft ? "default" : "success", children: [display, isSoft ? " · soft skill" : ""] }) }, `${keyword}-${i}`));
                                                    }) })) : (_jsx("div", { className: "rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-900/10", children: _jsx("p", { className: "text-xs text-yellow-700 dark:text-yellow-400", children: "No keywords detected \u2014 your resume may be image-based. Upload a text-based PDF for keyword extraction." }) })) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "h-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-500" }), "Missing Keywords (", analysis.missingKeywords.filter(k => !k.startsWith("(")).length, ")"] }) }), _jsx(CardContent, { children: analysis.missingKeywords.length > 0 ? (_jsx("div", { className: "flex flex-wrap gap-2", children: analysis.missingKeywords.map((keyword, i) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: i * 0.03 }, children: _jsx(Badge, { variant: keyword.startsWith("(") ? "secondary" : "warning", children: keyword }) }, keyword))) })) : (_jsx("div", { className: "rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/10", children: _jsx("p", { className: "text-xs text-blue-700 dark:text-blue-400", children: "Upload a text-based PDF and match against a job description to see missing skills." }) })) })] }) })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "h-full", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: "\uD83D\uDCCA Hiring Probability" }) }), _jsx(CardContent, { children: hiringData ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "text-center", children: [_jsxs(motion.span, { className: `text-5xl font-bold ${hiringData.probability >= 65 ? "text-green-500" : hiringData.probability >= 45 ? "text-yellow-500" : "text-red-500"}`, initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.3, type: "spring" }, children: [hiringData.probability, "%"] }), _jsxs("p", { className: "mt-1 text-[10px] leading-snug text-[#796a7d] dark:text-[#c5b8ce] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: ["Interview readiness index (blended model \u2014 not the same as headline ATS).", resume?.atsScore != null && (_jsxs("span", { className: "mt-0.5 block font-medium text-[#695a70] dark:text-[#d0c3d8] dark:text-[#b5a6bb] dark:text-[#c5b8ce]", children: ["Headline ATS (same as top card): ", canonicalAts, "%"] }))] }), _jsx("p", { className: "mt-1 text-xs text-[#796a7d] dark:text-[#c5b8ce]", children: hiringData.verdict })] }), _jsx("div", { className: "space-y-1.5", children: hiringData.factors.slice(0, 5).map((f) => (_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-[#695a70] dark:text-[#d0c3d8] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: f.name }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("span", { className: "font-medium", children: [f.value, "%"] }), _jsx("span", { className: f.impact === "positive" ? "text-green-500" : "text-red-500", children: f.impact === "positive" ? "↑" : "↓" })] })] }, f.name))) })] })) : _jsx("div", { className: "flex h-32 items-center justify-center", children: _jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" }) }) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "h-full", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: "\uD83C\uDF0D Global Benchmark" }) }), _jsx(CardContent, { children: benchmarkData ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "rounded-xl bg-gradient-to-r from-[#f5edf5] dark:from-[#211626] to-[#f4ead3] dark:to-[#17101d] p-3 text-center dark:from-[#211626]/20 dark:to-[#211626]/20", children: [_jsx("p", { className: "text-xs text-[#796a7d] dark:text-[#c5b8ce]", children: "You beat" }), _jsxs("p", { className: "text-3xl font-bold text-[#79557e] dark:text-[#d5b6df]", children: [benchmarkData.beatsPercent, "%"] }), _jsx("p", { className: "text-xs font-medium text-[#89658a] dark:text-[#d5b6df]", children: benchmarkData.rank }), _jsxs("p", { className: "mt-1 text-[10px] text-[#796a7d] dark:text-[#c5b8ce] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: ["Percentile vs illustrative global peers \u2014 headline ATS remains ", canonicalAts, "% (top card)."] })] }), _jsx("div", { className: "space-y-1.5", children: benchmarkData.sectionBenchmarks.map((s) => (_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-[#695a70] dark:text-[#d0c3d8] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: s.section }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `font-bold ${s.yours > s.average ? "text-green-600" : "text-red-500"}`, children: s.yours }), _jsx("span", { className: "text-[#9b8a9e] dark:text-[#aa9bb4]", children: "vs" }), _jsxs("span", { className: "text-[#796a7d] dark:text-[#c5b8ce]", children: [s.average, " avg"] })] })] }, s.section))) })] })) : _jsx("div", { className: "flex h-32 items-center justify-center", children: _jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" }) }) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "h-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-base", children: ["\uD83C\uDFAE Achievements ", badgesData ? `(${badgesData.earned}/${badgesData.total})` : ""] }) }), _jsx(CardContent, { children: badgesData ? (_jsx("div", { className: "grid grid-cols-2 gap-2", children: badgesData.badges.map((b, i) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: i * 0.05 }, className: `rounded-xl border p-2.5 text-center transition-all ${b.earned ? "border-yellow-300 bg-yellow-50 shadow-sm dark:border-yellow-700 dark:bg-yellow-900/20" : "border-[#e4d6dc] dark:border-[#3c2b43] opacity-50 dark:border-[#49344f] dark:border-[#3c2b43]"}`, children: [_jsx("span", { className: "text-2xl", children: b.icon }), _jsx("p", { className: "mt-1 text-[10px] font-semibold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: b.name }), !b.earned && (_jsx("div", { className: "mx-auto mt-1 h-1 w-12 overflow-hidden rounded-full bg-[#e9dfe8] dark:bg-[#3c2b43] dark:bg-[#49344f] dark:bg-[#3c2b43]", children: _jsx("div", { className: "h-full rounded-full bg-[#89658a] dark:bg-[#76577c]", style: { width: `${b.progress}%` } }) }))] }, b.id))) })) : _jsx("div", { className: "flex h-32 items-center justify-center", children: _jsx("div", { className: "h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" }) }) })] }) })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "h-full", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "flex items-center gap-2", children: "\uD83C\uDFE2 Industry Detection" }), !industryData && (_jsxs(Button, { size: "sm", isLoading: isIndustryLoading, className: "gap-1 shadow-lg shadow-[#694969]/20", onClick: async () => {
                                                                if (!resumeId)
                                                                    return;
                                                                setIsIndustryLoading(true);
                                                                try {
                                                                    const r = await resumeApi.detectIndustry(resumeId);
                                                                    setIndustryData(r);
                                                                    toast.success(`Detected: ${r.primaryField}`);
                                                                }
                                                                catch {
                                                                    toast.error("Detection failed");
                                                                }
                                                                finally {
                                                                    setIsIndustryLoading(false);
                                                                }
                                                            }, children: [_jsx(Sparkles, { className: "h-3 w-3" }), " Detect"] }))] }) }), _jsx(CardContent, { children: industryData ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-xl bg-gradient-to-r from-[#f5edf5] dark:from-[#211626] to-[#f4ead3] dark:to-[#17101d] p-3 text-center dark:from-[#211626]/20 dark:to-[#211626]/20", children: [_jsx("p", { className: "text-xs text-[#796a7d] dark:text-[#c5b8ce]", children: "Primary Field" }), _jsx("p", { className: "text-lg font-bold text-[#79557e] dark:text-[#d5b6df] dark:text-[#a17da5] dark:text-[#d5b6df]", children: industryData.primaryField })] }), industryData.detectedIndustries.map((ind, i) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.1 }, className: "rounded-xl border border-[#e4d6dc] dark:border-[#3c2b43] p-3 dark:border-[#49344f] dark:border-[#3c2b43]", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-semibold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: ind.name }), _jsxs(Badge, { variant: ind.confidence >= 50 ? "success" : "warning", children: [ind.confidence, "%"] })] }), _jsx("div", { className: "mb-2 h-1.5 overflow-hidden rounded-full bg-[#e9dfe8] dark:bg-[#3c2b43] dark:bg-[#49344f] dark:bg-[#3c2b43]", children: _jsx(motion.div, { className: "h-full rounded-full bg-gradient-to-r from-[#694969] to-[#c6a05a]", initial: { width: 0 }, animate: { width: `${ind.confidence}%` }, transition: { duration: 0.8 } }) }), ind.recommendedSkills.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#796a7d] dark:text-[#c5b8ce]", children: "Recommended Skills to Add" }), _jsx("div", { className: "flex flex-wrap gap-1", children: ind.recommendedSkills.map((s) => _jsx(Badge, { variant: "warning", className: "text-[10px]", children: s }, s)) })] }))] }, ind.name))), industryData.detectedIndustries.length === 0 && (_jsx("p", { className: "py-4 text-center text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: "Could not detect a specific industry. Add more relevant keywords." }))] })) : (_jsxs("div", { className: "flex flex-col items-center py-8 text-center", children: [_jsx("span", { className: "mb-2 text-3xl", children: "\uD83C\uDFE2" }), _jsx("p", { className: "text-xs text-[#796a7d] dark:text-[#c5b8ce]", children: "Click \"Detect\" to identify your industry" })] })) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "h-full", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "flex items-center gap-2", children: "\uD83D\uDCD6 Readability Score" }), !readabilityData && (_jsxs(Button, { size: "sm", isLoading: isReadabilityLoading, className: "gap-1 shadow-lg shadow-[#694969]/20", onClick: async () => {
                                                                if (!resumeId)
                                                                    return;
                                                                setIsReadabilityLoading(true);
                                                                try {
                                                                    const r = await resumeApi.analyzeReadability(resumeId);
                                                                    setReadabilityData(r);
                                                                    toast.success(`Readability: ${r.grade}`);
                                                                }
                                                                catch {
                                                                    toast.error("Analysis failed");
                                                                }
                                                                finally {
                                                                    setIsReadabilityLoading(false);
                                                                }
                                                            }, children: [_jsx(Sparkles, { className: "h-3 w-3" }), " Analyze"] }))] }) }), _jsx(CardContent, { children: readabilityData ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("span", { className: `text-4xl font-bold ${readabilityData.score >= 70 ? "text-green-500" : readabilityData.score >= 50 ? "text-yellow-500" : "text-red-500"}`, children: readabilityData.score }), _jsx("p", { className: "text-xs text-[#796a7d] dark:text-[#c5b8ce]", children: "/100" })] }), _jsx("div", { className: `flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${readabilityData.grade === "A" ? "bg-green-500" : readabilityData.grade === "B" ? "bg-blue-500" :
                                                                        readabilityData.grade === "C" ? "bg-yellow-500" : "bg-red-500"}`, children: readabilityData.grade })] }), _jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: [
                                                                { label: "Avg Sentence", value: `${readabilityData.metrics.avgSentenceLength} words`, good: readabilityData.metrics.avgSentenceLength <= 20 },
                                                                { label: "Total Words", value: String(readabilityData.metrics.totalWords), good: readabilityData.metrics.totalWords >= 200 },
                                                                { label: "Passive Voice", value: String(readabilityData.metrics.passiveVoice), good: readabilityData.metrics.passiveVoice <= 2 },
                                                                { label: "Long Sentences", value: String(readabilityData.metrics.longSentences), good: readabilityData.metrics.longSentences <= 2 },
                                                                { label: "Short Bullets", value: String(readabilityData.metrics.shortBullets), good: readabilityData.metrics.shortBullets >= 3 },
                                                                { label: "Complex Words", value: String(readabilityData.metrics.complexWords), good: readabilityData.metrics.complexWords <= 5 },
                                                            ].map((m) => (_jsxs("div", { className: `rounded-lg p-2 text-center ${m.good ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"}`, children: [_jsx("p", { className: `text-sm font-bold ${m.good ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: m.value }), _jsx("p", { className: "text-[10px] text-[#796a7d] dark:text-[#c5b8ce]", children: m.label })] }, m.label))) }), _jsx("div", { className: "space-y-1.5", children: readabilityData.tips.map((tip, i) => (_jsxs("div", { className: "flex items-start gap-2 text-xs", children: [_jsx(Lightbulb, { className: "mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-500" }), _jsx("span", { className: "text-[#695a70] dark:text-[#d0c3d8] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: tip })] }, i))) })] })) : (_jsxs("div", { className: "flex flex-col items-center py-8 text-center", children: [_jsx("span", { className: "mb-2 text-3xl", children: "\uD83D\uDCD6" }), _jsx("p", { className: "text-xs text-[#796a7d] dark:text-[#c5b8ce]", children: "Click \"Analyze\" to check readability" })] })) })] }) })] }), _jsx(SuggestionsCard, { suggestions: analysis.suggestions }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "border-[#e4d6dc] bg-[#fffaf2] text-[#29182f] shadow-sm dark:border-[#3c2b43] dark:bg-[#17101d] dark:text-[#fbf7ff]", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(AlertOctagon, { className: "h-5 w-5 text-orange-500" }), "AI Smart Feedback"] }), _jsx(CardDescription, { children: "Line-by-line review with \u274C weak \u2192 \u2705 improved suggestions" })] }), !smartFeedback && (_jsxs(Button, { size: "sm", onClick: async () => {
                                                        if (!resumeId)
                                                            return;
                                                        setIsFeedbackLoading(true);
                                                        toast.loading("Scanning your resume...", { id: "feedback" });
                                                        try {
                                                            const result = await resumeApi.getSmartFeedback(resumeId);
                                                            setSmartFeedback(result);
                                                            toast.success(`Found ${result.issuesFound} improvements!`, { id: "feedback" });
                                                        }
                                                        catch {
                                                            toast.error("Feedback failed", { id: "feedback" });
                                                        }
                                                        finally {
                                                            setIsFeedbackLoading(false);
                                                        }
                                                    }, isLoading: isFeedbackLoading, className: "gap-2 shadow-lg shadow-[#694969]/20", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Get Smart Feedback"] }))] }) }), _jsx(CardContent, { children: smartFeedback ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 rounded-xl bg-[#fcf6ed] dark:bg-[#120d17] p-4 dark:bg-[#211626] dark:bg-[#17101d]/50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-2xl font-bold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: [smartFeedback.score, "%"] }), _jsx("span", { className: "text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: "Writing Score" })] }), _jsx("div", { className: "h-6 w-px bg-[#d8cbd9] dark:bg-[#49344f] dark:bg-[#796a7d] dark:bg-[#5c4763]" }), _jsxs("span", { className: "text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: [smartFeedback.totalLinesScanned, " lines scanned"] }), _jsx("div", { className: "h-6 w-px bg-[#d8cbd9] dark:bg-[#49344f] dark:bg-[#796a7d] dark:bg-[#5c4763]" }), _jsxs("div", { className: "flex gap-2", children: [smartFeedback.summary.high > 0 && (_jsxs(Badge, { variant: "danger", children: [smartFeedback.summary.high, " High"] })), smartFeedback.summary.medium > 0 && (_jsxs(Badge, { variant: "warning", children: [smartFeedback.summary.medium, " Medium"] })), smartFeedback.summary.low > 0 && (_jsxs(Badge, { variant: "secondary", children: [smartFeedback.summary.low, " Low"] })), smartFeedback.issuesFound === 0 && (_jsx(Badge, { variant: "success", children: "No issues found!" }))] })] }), smartFeedback.feedback.length > 0 ? (_jsx("div", { className: "space-y-3", children: smartFeedback.feedback.map((item, i) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.05 }, className: "overflow-hidden rounded-xl border border-[#e4d6dc] dark:border-[#3c2b43] dark:border-[#49344f] dark:border-[#3c2b43]", children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-[#eee4e9] dark:border-[#3c2b43] bg-[#fcf6ed] dark:bg-[#120d17] px-4 py-2 dark:border-[#49344f] dark:border-[#3c2b43] dark:bg-[#211626] dark:bg-[#17101d]/50", children: [item.severity === "high" ? (_jsx(XCircle, { className: "h-4 w-4 text-red-500" })) : item.severity === "medium" ? (_jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-500" })) : (_jsx(Info, { className: "h-4 w-4 text-blue-500" })), _jsx("span", { className: "text-xs font-medium text-[#695a70] dark:text-[#d0c3d8] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: item.issue }), _jsx(Badge, { variant: item.severity === "high" ? "danger" : item.severity === "medium" ? "warning" : "secondary", className: "ml-auto text-[10px]", children: item.severity })] }), _jsx(FeedbackBeforeAfter, { original: item.original, improved: item.improved })] }, i))) })) : (_jsxs("div", { className: "flex flex-col items-center py-8 text-center", children: [_jsx(CheckCircle2, { className: "mb-2 h-10 w-10 text-green-500" }), _jsx("p", { className: "font-semibold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: "Your resume looks great!" }), _jsx("p", { className: "text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: "No weak bullet points detected" })] }))] })) : (_jsxs("div", { className: "flex flex-col items-center py-8 text-center", children: [_jsx(motion.div, { animate: { y: [0, -5, 0] }, transition: { duration: 2, repeat: Infinity }, children: _jsx(Sparkles, { className: "mb-3 h-10 w-10 text-[#a17da5] dark:text-[#d5b6df]" }) }), _jsx("p", { className: "text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: "Click \"Get Smart Feedback\" to scan your resume for weak bullet points" })] })) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "border-[#e4d6dc] bg-[#fffaf2] text-[#29182f] shadow-sm dark:border-[#3c2b43] dark:bg-[#17101d] dark:text-[#fbf7ff]", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "flex items-center gap-2", children: "\uD83D\uDCCA Resume Section Analyzer" }), _jsx(CardDescription, { children: "Detailed score for each resume section with improvement tips" })] }), !sectionData && (_jsxs(Button, { size: "sm", onClick: async () => {
                                                        if (!resumeId)
                                                            return;
                                                        setIsSectionLoading(true);
                                                        toast.loading("Analyzing sections...", { id: "sections" });
                                                        try {
                                                            const result = await resumeApi.analyzeSections(resumeId);
                                                            setSectionData(result);
                                                            toast.success("Section analysis complete!", { id: "sections" });
                                                        }
                                                        catch {
                                                            toast.error("Section analysis failed", { id: "sections" });
                                                        }
                                                        finally {
                                                            setIsSectionLoading(false);
                                                        }
                                                    }, isLoading: isSectionLoading, className: "gap-2 shadow-lg shadow-[#694969]/20", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Analyze Sections"] }))] }) }), _jsx(CardContent, { children: sectionData ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#f5edf5] dark:from-[#211626] to-[#f4ead3] dark:to-[#17101d] p-4 dark:from-[#211626]/20 dark:to-[#211626]/20", children: [_jsx("span", { className: "text-3xl font-bold text-[#79557e] dark:text-[#d5b6df]", children: canonicalAts || sectionData.overall }), _jsx("span", { className: "text-sm text-[#695a70] dark:text-[#d0c3d8] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: "/100 Overall ATS Score" })] }), _jsx("div", { className: "space-y-3", children: sectionData.sections.map((section, i) => {
                                                        // Single Source of Truth: if master analysis exists, use those scores
                                                        const masterScoreMap = analysis ? {
                                                            "Summary": analysis.skillsScore,
                                                            "Skills": analysis.skillsScore,
                                                            "Experience": analysis.experienceScore,
                                                            "Education": analysis.educationScore,
                                                            "Projects": analysis.projectsScore,
                                                        } : {};
                                                        const score = masterScoreMap[section.name] ?? section.score;
                                                        const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F";
                                                        const gradeColor = grade === "A+" || grade === "A" ? "text-green-600 bg-green-100 dark:bg-green-900/30"
                                                            : grade === "B" ? "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
                                                                : grade === "C" ? "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
                                                                    : "text-red-600 bg-red-100 dark:bg-red-900/30";
                                                        return (_jsxs(motion.div, { initial: { opacity: 0, x: -15 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.08 }, className: "rounded-xl border border-[#e4d6dc] dark:border-[#3c2b43] p-4 dark:border-[#49344f] dark:border-[#3c2b43]", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${gradeColor}`, children: grade }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: section.name }), !section.found && _jsx(Badge, { variant: "danger", className: "ml-2 text-[10px]", children: "Not Found" })] })] }), _jsxs("span", { className: "text-lg font-bold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: [score, "/100"] })] }), _jsx("div", { className: "mb-3 h-2 overflow-hidden rounded-full bg-[#e9dfe8] dark:bg-[#3c2b43] dark:bg-[#49344f] dark:bg-[#3c2b43]", children: _jsx(motion.div, { className: "h-full rounded-full bg-gradient-to-r from-[#694969] to-[#c6a05a]", initial: { width: 0 }, animate: { width: `${score}%` }, transition: { duration: 0.8, delay: i * 0.1 } }) }), section.issues.length > 0 && (_jsx("div", { className: "mb-2 space-y-1", children: section.issues.map((issue, j) => (_jsxs("div", { className: "flex items-start gap-2 text-xs", children: [_jsx(XCircle, { className: "mt-0.5 h-3 w-3 flex-shrink-0 text-red-500" }), _jsx("span", { className: "text-red-600 dark:text-red-400", children: issue })] }, j))) })), _jsx("div", { className: "space-y-1", children: section.tips.map((tip, j) => (_jsxs("div", { className: "flex items-start gap-2 text-xs", children: [_jsx(Lightbulb, { className: "mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-500" }), _jsx("span", { className: "text-[#695a70] dark:text-[#d0c3d8] dark:text-[#9b8a9e] dark:text-[#aa9bb4]", children: tip })] }, j))) })] }, section.name));
                                                    }) })] })) : (_jsxs("div", { className: "flex flex-col items-center py-8 text-center", children: [_jsx("span", { className: "mb-2 text-4xl", children: "\uD83D\uDCCA" }), _jsx("p", { className: "text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: "Click \"Analyze Sections\" to get per-section scores" })] })) })] }) }), _jsx(motion.div, { variants: itemVariants, children: _jsxs(Card, { className: "border-[#e4d6dc] bg-[#fffaf2] text-[#29182f] shadow-sm dark:border-[#3c2b43] dark:bg-[#17101d] dark:text-[#fbf7ff]", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "flex items-center gap-2", children: "\u270D\uFE0F AI Resume Rewriter" }), _jsx(CardDescription, { children: "Paste any bullet point and AI will rewrite it with action verbs, metrics & specifics" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-3", children: [_jsx("textarea", { value: rewriteInput, onChange: (e) => setRewriteInput(e.target.value), placeholder: "e.g., Worked on machine learning models.", rows: 2, className: "flex-1 resize-none rounded-lg border border-[#d8cbd9] dark:border-[#49344f] bg-white px-3 py-2 text-sm shadow-sm placeholder:text-[#9b8a9e] dark:text-[#aa9bb4] focus:border-[#89658a] dark:border-[#a17da5] focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-[#796a7d] dark:border-[#49344f] dark:bg-[#211626] dark:bg-[#17101d] dark:text-[#29182f] dark:text-[#fbf7ff]" }), _jsxs(Button, { onClick: async () => {
                                                            if (!rewriteInput.trim())
                                                                return;
                                                            setIsRewriting(true);
                                                            try {
                                                                const result = await resumeApi.rewriteBulletPoint(rewriteInput);
                                                                setRewriteResult(result);
                                                                toast.success("Rewritten!");
                                                            }
                                                            catch {
                                                                toast.error("Rewrite failed");
                                                            }
                                                            finally {
                                                                setIsRewriting(false);
                                                            }
                                                        }, isLoading: isRewriting, disabled: !rewriteInput.trim(), className: "gap-2 self-end shadow-lg shadow-[#694969]/20", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Rewrite"] })] }), _jsx(AnimatePresence, { children: rewriteResult && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "space-y-3 rounded-xl border border-[#e4d6dc] dark:border-[#3c2b43] p-4 dark:border-[#49344f] dark:border-[#3c2b43]", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs dark:bg-red-900/30", children: "\u274C" }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-red-500", children: "Before" }), _jsx("p", { className: "text-sm text-red-700 line-through decoration-red-300 dark:text-red-400", children: rewriteResult.original })] })] }), _jsx("div", { className: "flex justify-center", children: _jsx(ArrowRight, { className: "h-4 w-4 text-[#9b8a9e] dark:text-[#aa9bb4]" }) }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs dark:bg-green-900/30", children: "\u2705" }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-green-500", children: "After" }), _jsx("p", { className: "text-sm font-medium text-green-700 dark:text-green-400", children: rewriteResult.rewritten })] })] }), _jsxs("div", { className: "border-t border-[#eee4e9] dark:border-[#3c2b43] pt-3 dark:border-[#49344f] dark:border-[#3c2b43]", children: [_jsx("p", { className: "mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#796a7d] dark:text-[#c5b8ce]", children: "Changes Made" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: rewriteResult.changes.map((c, i) => (_jsx(Badge, { variant: "default", className: "text-[10px]", children: c }, i))) })] })] })) })] })] }) }), _jsxs(motion.div, { variants: itemVariants, className: "flex flex-wrap gap-3", children: [_jsxs(Button, { onClick: handleAnalyze, isLoading: isAnalyzing, disabled: isAnalyzing, variant: "outline", className: "gap-2", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Re-Analyze"] }), _jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Button, { variant: "outline", className: "gap-2 shadow-lg shadow-[#694969]/20", isLoading: isPdfGenerating, onClick: () => {
                                            if (!analysis || !resume)
                                                return;
                                            setIsPdfGenerating(true);
                                            try {
                                                generateAnalysisReport(analysis, resume.fileName, canonicalAts, user?.name || "User");
                                                toast.success("PDF report downloaded!");
                                            }
                                            catch (err) {
                                                console.error("[PDF] Generation failed:", err);
                                                toast.error("Failed to generate PDF");
                                            }
                                            finally {
                                                setIsPdfGenerating(false);
                                            }
                                        }, children: ["\uD83D\uDCC4 ", isPdfGenerating ? "Generating PDF..." : "Download PDF Report"] }) }), _jsx(Link, { to: "/job-match", children: _jsx(Button, { variant: "outline", className: "gap-2", children: "Match with Job Description" }) }), _jsx(Link, { to: "/interview-prep", children: _jsx(Button, { className: "gap-2 shadow-lg shadow-[#694969]/20", children: "\uD83C\uDFAF Interview Prep" }) })] })] }, "results")) : (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, children: _jsx(Card, { className: "overflow-hidden", children: _jsx(CardContent, { className: "relative flex flex-col items-center justify-center py-16", children: isAnalyzing ? (
                            /* ═══ DYNAMIC LOADING STATE ═══ */
                            _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex flex-col items-center", children: [_jsxs("div", { className: "relative mb-6", children: [_jsx(motion.div, { className: "h-20 w-20 rounded-full border-4 border-indigo-500/20", animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }, transition: { duration: 2, repeat: Infinity } }), _jsx(motion.div, { className: "absolute inset-2 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent", animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" } }), _jsx(motion.div, { className: "absolute inset-4 rounded-full border-4 border-t-transparent border-r-purple-500 border-b-transparent border-l-transparent", animate: { rotate: -360 }, transition: { duration: 1.5, repeat: Infinity, ease: "linear" } }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsx(Sparkles, { className: "h-6 w-6 text-[#b18a36] dark:text-[#e5c16e]" }) })] }), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.p, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "mb-2 text-sm font-medium text-[#b18a36] dark:text-[#e5c16e]", children: loadingStage }, loadingStage) }), _jsx("p", { className: "text-xs text-[#796a7d] dark:text-[#c5b8ce] dark:text-[#796a7d] dark:text-[#c5b8ce]", children: "This may take 10-20 seconds with AI analysis" }), _jsx("div", { className: "mt-4 flex gap-1.5", children: [0, 1, 2, 3, 4].map((i) => (_jsx(motion.div, { className: "h-1.5 w-1.5 rounded-full bg-[#89658a]", animate: { opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }, transition: { duration: 1.2, repeat: Infinity, delay: i * 0.2 } }, i))) })] })) : (
                            /* ═══ READY STATE ═══ */
                            _jsxs(_Fragment, { children: [_jsx(motion.div, { animate: { y: [0, -8, 0] }, transition: { duration: 2, repeat: Infinity }, children: _jsx(Sparkles, { className: "mb-4 h-16 w-16 text-[#b18a36] dark:text-[#e5c16e]" }) }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-[#29182f] dark:text-[#fbf7ff] dark:text-white", children: "Ready to Analyze" }), _jsx("p", { className: "mb-6 text-xs text-[#796a7d] dark:text-[#c5b8ce] dark:text-[#796a7d] dark:text-[#c5b8ce]", children: "AI will extract text, detect skills, and score your resume" }), _jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Button, { onClick: handleAnalyze, isLoading: isAnalyzing, disabled: isAnalyzing, className: "gap-2 shadow-lg shadow-[#694969]/20", children: [_jsx(Sparkles, { className: "h-4 w-4" }), "Analyze Now"] }) })] })) }) }) }, "empty")) })] }));
}
