import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// 
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Upload, CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resumeApi } from "@/api/resume";
/** Strip leading "- " bullet and render **bold** markdown inline */
function renderMarkdown(text) {
    const cleaned = text.replace(/^-\s+/, "");
    return cleaned.split("**").map((part, i) => i % 2 === 1 ? _jsx("strong", { children: part }, i) : _jsx("span", { children: part }, i));
}
export function MockInterviewPage() {
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answer, setAnswer] = useState("");
    const [evaluation, setEvaluation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [totalScore, setTotalScore] = useState([]);
    useEffect(() => {
        setIsLoading(true);
        resumeApi.getHistory().then((data) => {
            setResumes(data);
            if (data.length > 0)
                setSelectedResumeId(data[0].id);
        }).catch(() => { }).finally(() => setIsLoading(false));
    }, []);
    const startInterview = async () => {
        if (!selectedResumeId)
            return;
        setIsGenerating(true);
        toast.loading("Preparing questions...", { id: "mock" });
        try {
            const r = await resumeApi.getInterviewQuestions(selectedResumeId);
            setQuestions(r.questions.slice(0, 10));
            setCurrentIdx(0);
            setAnswer("");
            setEvaluation(null);
            setTotalScore([]);
            toast.success("Interview started!", { id: "mock" });
        }
        catch {
            toast.error("Failed", { id: "mock" });
        }
        finally {
            setIsGenerating(false);
        }
    };
    const submitAnswer = async () => {
        if (!answer.trim() || !selectedResumeId)
            return;
        setIsEvaluating(true);
        try {
            const r = await resumeApi.evaluateAnswer(selectedResumeId, questions[currentIdx].question, answer);
            setEvaluation(r);
            setTotalScore((prev) => [...prev, r.score]);
            const s10 = r.scoreOutOf10 ?? Math.max(1, Math.min(10, Math.round(r.score / 10)));
            toast.success(`Score: ${s10}/10 — ${r.grade}`);
        }
        catch {
            toast.error("Evaluation failed");
        }
        finally {
            setIsEvaluating(false);
        }
    };
    const nextQuestion = () => {
        setCurrentIdx((prev) => prev + 1);
        setAnswer("");
        setEvaluation(null);
    };
    const avgScore = totalScore.length > 0 ? Math.round(totalScore.reduce((a, b) => a + b, 0) / totalScore.length) : 0;
    const currentQ = questions[currentIdx];
    const isFinished = questions.length > 0 && currentIdx >= questions.length;
    if (isLoading) {
        return (_jsx("div", { className: "mx-auto flex h-64 min-h-0 w-full min-w-0 max-w-4xl items-center justify-center overflow-x-hidden px-4 text-[#3b263b] sm:px-6 dark:text-[#fffaf2]", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-[#6b4b68] border-t-transparent" }) }));
    }
    if (resumes.length === 0) {
        return (_jsxs("div", { className: "mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center justify-center overflow-x-hidden px-4 py-20 text-[#3b263b] sm:px-6 dark:text-[#fffaf2]", children: [_jsx(Mic, { className: "mb-4 h-16 w-16 shrink-0 text-[#b58a3a] dark:text-[#d7b86a]" }), _jsx("h2", { className: "mb-2 text-balance text-center text-xl font-semibold text-[#3b263b] dark:text-[#fffaf2] sm:text-2xl", children: "No Resumes Found" }), _jsx(Link, { to: "/upload", className: "w-full max-w-xs sm:max-w-none sm:w-auto", children: _jsxs(Button, { className: "w-full gap-2 bg-[#6b4b68] text-white hover:bg-[#593d57] sm:w-auto", children: [_jsx(Upload, { className: "h-4 w-4" }), " Upload Resume"] }) })] }));
    }
    return (_jsxs("div", { className: "mx-auto w-full min-w-0 max-w-4xl space-y-6 overflow-x-hidden px-4 text-[#3b263b] sm:px-6 dark:text-[#fffaf2]", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h1", { className: "text-balance text-2xl font-bold text-[#3b263b] dark:text-[#fffaf2] sm:text-3xl", children: "CareerLens Mock Interview" }), _jsx("p", { className: "text-balance text-sm text-[#806e80] dark:text-[#c5b8c7] sm:text-base", children: "Build interview confidence with CareerLens AI coaching and personalized feedback" })] }), questions.length === 0 && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "w-full min-w-0", children: _jsx(Card, { className: "w-full min-w-0 max-w-full overflow-hidden", children: _jsxs(CardContent, { className: "flex w-full min-w-0 flex-col items-center py-8 text-center sm:py-12", children: [_jsx(motion.div, { animate: { scale: [1, 1.1, 1] }, transition: { duration: 2, repeat: Infinity }, children: _jsx(Mic, { className: "mb-4 h-16 w-16 shrink-0 text-[#b58a3a]" }) }), _jsx("h3", { className: "mb-2 text-balance text-xl font-semibold text-[#3b263b] dark:text-[#fffaf2] sm:text-2xl", children: "Get Interview-Ready with CareerLens" }), _jsx("p", { className: "mb-4 max-w-prose text-balance px-0 text-sm text-gray-500 sm:px-2 sm:text-base", children: "CareerLens creates resume-based interview questions, evaluates your answers, and highlights strengths and areas to improve." }), _jsxs("div", { className: "mb-6 flex w-full min-w-0 flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center", children: [_jsx("select", { value: selectedResumeId, onChange: (e) => setSelectedResumeId(e.target.value), className: "h-9 min-w-0 w-full rounded-lg border border-gray-300 bg-[#fffaf2] px-3 text-left text-sm text-[#3b263b] dark:border-[#6b4b68] dark:bg-[#211824] dark:text-[#fffaf2] sm:w-auto sm:min-w-48", children: resumes.map((r) => (_jsx("option", { value: r.id, children: r.fileName }, r.id))) }), _jsxs(Button, { onClick: startInterview, isLoading: isGenerating, className: "w-full min-w-0 gap-2 bg-[#6b4b68] text-white shadow-lg shadow-[#6b4b68]/25 hover:bg-[#593d57] sm:w-auto", children: [_jsx(Mic, { className: "h-4 w-4 shrink-0" }), " Start Mock Interview"] })] })] }) }) })), currentQ && !isFinished && (_jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, className: "flex min-h-0 w-full min-w-0 max-w-full flex-col space-y-4 overflow-x-hidden max-md:min-h-[50vh] max-md:pb-0", children: [_jsxs("div", { className: "min-h-0 w-full min-w-0 max-md:flex-1 max-md:overflow-y-auto max-md:overflow-x-hidden max-md:pb-[calc(13rem+env(safe-area-inset-bottom,0px))] md:pb-0", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-gray-500", children: ["Question ", currentIdx + 1, " of ", questions.length] }), totalScore.length > 0 && _jsxs(Badge, { variant: "default", children: ["Avg Score: ", avgScore, "%"] })] }), _jsx("div", { className: "h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700", children: _jsx(motion.div, { className: "h-full rounded-full bg-gradient-to-r from-[#6b4b68] to-[#b58a3a]", animate: { width: `${((currentIdx + 1) / questions.length) * 100}%` } }) }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(Badge, { variant: "default", className: "mb-2 w-fit", children: currentQ.category }), _jsx(CardTitle, { className: "text-lg", children: currentQ.question })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("textarea", { value: answer, onChange: (e) => setAnswer(e.target.value), placeholder: "Type your answer here... (Use the STAR method: Situation, Task, Action, Result)", rows: 6, disabled: !!evaluation, className: "hidden w-full resize-none rounded-xl border border-[#e5d9e4] bg-[#fffdf8] px-4 py-3 text-sm text-[#3b263b] shadow-sm placeholder:text-[#9a8999] focus:border-[#6b4b68] focus:outline-none focus:ring-2 focus:ring-[#6b4b68]/20 disabled:opacity-60 dark:border-[#6b4b68] dark:bg-[#211824] dark:text-[#fffaf2] md:block" }), !evaluation ? (_jsxs(Button, { onClick: submitAnswer, isLoading: isEvaluating, disabled: !answer.trim(), className: "hidden w-full gap-2 bg-[#6b4b68] text-white shadow-lg shadow-[#6b4b68]/25 hover:bg-[#593d57] md:inline-flex", children: [_jsx(Send, { className: "h-4 w-4" }), " Submit Answer"] })) : (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between rounded-xl bg-gradient-to-r from-[#fbf5e9] to-[#f2e7ee] p-4 dark:from-[#6b4b68]/25 dark:to-[#b58a3a]/10", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500", children: "Your Score" }), _jsxs("p", { className: "text-3xl font-bold text-[#6b4b68] dark:text-[#d5b96d]", children: [evaluation.scoreOutOf10 ?? Math.max(1, Math.min(10, Math.round(evaluation.score / 10))), _jsx("span", { className: "text-lg font-semibold text-gray-500", children: "/10" })] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["\u2248 ", evaluation.score, "% on full scale"] })] }), _jsx(Badge, { variant: evaluation.score >= 70 ? "success" : evaluation.score >= 50 ? "warning" : "danger", className: "text-sm", children: evaluation.grade })] }), evaluation.starFeedback && (_jsxs("div", { className: "rounded-lg border border-[#e5d5b6] bg-white/80 p-3 text-xs leading-relaxed text-gray-800 dark:border-[#6b4b68] dark:bg-gray-900/60 dark:text-gray-200", children: [_jsx("p", { className: "mb-1 font-semibold text-[#6b4b68] dark:text-[#d5b96d]", children: "STAR feedback" }), _jsx("p", { className: "whitespace-pre-wrap", children: evaluation.starFeedback })] })), evaluation.strengths.length > 0 && (_jsx("div", { className: "space-y-1", children: evaluation.strengths.map((s, i) => (_jsxs("div", { className: "flex items-start gap-2 text-xs", children: [_jsx(CheckCircle2, { className: "mt-0.5 h-3 w-3 text-green-500" }), _jsx("span", { className: "text-green-700 dark:text-green-400", children: renderMarkdown(s) })] }, i))) })), evaluation.feedback.length > 0 && (_jsx("div", { className: "space-y-1", children: evaluation.feedback.map((f, i) => (_jsxs("div", { className: "flex items-start gap-2 text-xs", children: [_jsx(XCircle, { className: "mt-0.5 h-3 w-3 text-red-500" }), _jsx("span", { className: "text-red-700 dark:text-red-400", children: renderMarkdown(f) })] }, i))) })), _jsx(Button, { onClick: nextQuestion, className: "hidden w-full gap-2 bg-[#6b4b68] text-white hover:bg-[#593d57] md:inline-flex", children: currentIdx < questions.length - 1 ? (_jsxs(_Fragment, { children: [_jsx(ChevronRight, { className: "h-4 w-4" }), " Next Question"] })) : (_jsx(_Fragment, { children: "Finish Interview" })) })] }))] })] })] }), _jsx("div", { className: "z-20 w-full min-w-0 max-w-full border-t border-[#eadfe8] bg-[#fffaf2]/90 p-4 backdrop-blur-md dark:border-[#4b354b] dark:bg-[#17111c]/90 max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:overflow-x-hidden md:hidden", style: { paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }, children: !evaluation ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: answer, onChange: (e) => setAnswer(e.target.value), placeholder: "Type your answer (STAR: Situation, Task, Action, Result)...", rows: 4, className: "w-full resize-none rounded-xl border border-[#e5d9e4] bg-[#fffdf8] px-4 py-3 text-sm text-[#3b263b] shadow-sm placeholder:text-[#9a8999] focus:border-[#6b4b68] focus:outline-none focus:ring-2 focus:ring-[#6b4b68]/20 dark:border-[#6b4b68] dark:bg-[#211824] dark:text-[#fffaf2]" }), _jsxs(Button, { onClick: submitAnswer, isLoading: isEvaluating, disabled: !answer.trim(), className: "w-full gap-2 bg-[#6b4b68] text-white shadow-lg shadow-[#6b4b68]/25 hover:bg-[#593d57]", children: [_jsx(Send, { className: "h-4 w-4" }), " Submit Answer"] })] })) : (_jsx(Button, { onClick: nextQuestion, className: "w-full gap-2 bg-[#6b4b68] text-white hover:bg-[#593d57]", children: currentIdx < questions.length - 1 ? (_jsxs(_Fragment, { children: [_jsx(ChevronRight, { className: "h-4 w-4" }), " Next Question"] })) : (_jsx(_Fragment, { children: "Finish Interview" })) })) })] }, currentIdx) })), isFinished && (_jsx(motion.div, { className: "w-full min-w-0 max-w-full overflow-x-hidden", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, children: _jsx(Card, { className: "w-full min-w-0 max-w-full overflow-hidden", children: _jsxs(CardContent, { className: "flex flex-col items-center py-12 text-center", children: [_jsx("span", { className: "mb-4 text-6xl", children: "\uD83C\uDF89" }), _jsx("h3", { className: "mb-2 text-xl font-bold text-[#3b263b] dark:text-[#fffaf2]", children: "Interview Complete!" }), _jsxs("p", { className: "mb-4 text-4xl font-bold text-[#6b4b68] dark:text-[#d5b96d]", children: [avgScore, "%"] }), _jsxs("p", { className: "mb-6 text-sm text-gray-500", children: ["Average score across ", totalScore.length, " questions"] }), _jsx("div", { className: "mb-6 flex flex-wrap justify-center gap-2", children: totalScore.map((s, i) => (_jsxs(Badge, { variant: s >= 70 ? "success" : s >= 50 ? "warning" : "danger", children: ["Q", i + 1, ": ", s, "%"] }, i))) }), _jsxs(Button, { onClick: () => { setQuestions([]); setCurrentIdx(0); setTotalScore([]); setEvaluation(null); setAnswer(""); }, className: "gap-2 bg-[#6b4b68] text-white hover:bg-[#593d57]", children: [_jsx(RotateCcw, { className: "h-4 w-4" }), " Try Again"] })] }) }) }))] }));
}
