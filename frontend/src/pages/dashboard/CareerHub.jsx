import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, BookOpen, Upload, Sparkles, ArrowRight, Code2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resumeApi } from "@/api/resume";
export function CareerHubPage() {
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [career, setCareer] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCareerLoading, setIsCareerLoading] = useState(false);
    const [isProjectsLoading, setIsProjectsLoading] = useState(false);
    // Find the selected resume object for analysis-status checks
    const selectedResume = resumes.find((r) => r.id === selectedResumeId);
    const hasAnalysis = !!selectedResume?.analysis;
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        resumeApi.getHistory().then((data) => {
            if (cancelled)
                return;
            setResumes(data);
            // Prefer the first resume that already has analysis data
            const analyzed = data.find((r) => r.analysis);
            setSelectedResumeId(analyzed?.id || data[0]?.id || "");
        }).catch(() => { }).finally(() => { if (!cancelled)
            setIsLoading(false); });
        return () => { cancelled = true; };
    }, []);
    const handleCareer = async () => {
        if (!selectedResumeId)
            return;
        if (!hasAnalysis) {
            toast.error("Please analyze this resume first (go to Analysis page), then come back here.");
            return;
        }
        setIsCareerLoading(true);
        try {
            const r = await resumeApi.getCareerGrowth(selectedResumeId);
            setCareer(r);
            toast.success(`Next role: ${r.nextRole}`);
        }
        catch {
            toast.error("Career analysis failed. Please try again.");
        }
        finally {
            setIsCareerLoading(false);
        }
    };
    const handleProjects = async () => {
        if (!selectedResumeId)
            return;
        if (!hasAnalysis) {
            toast.error("Please analyze this resume first (go to Analysis page), then come back here.");
            return;
        }
        setIsProjectsLoading(true);
        try {
            const r = await resumeApi.suggestProjects(selectedResumeId);
            setProjects(r.projects);
            toast.success(`${r.projects.length} projects suggested!`);
        }
        catch {
            toast.error("Project suggestions failed. Please try again.");
        }
        finally {
            setIsProjectsLoading(false);
        }
    };
    if (isLoading)
        return _jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" }) });
    if (resumes.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx(Rocket, { className: "mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" }), _jsx("h2", { className: "mb-2 text-xl font-semibold text-gray-900 dark:text-white", children: "No Resumes Found" }), _jsx(Link, { to: "/upload", children: _jsxs(Button, { className: "gap-2", children: [_jsx(Upload, { className: "h-4 w-4" }), " Upload Resume"] }) })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Career Hub" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Career growth path & AI project suggestions based on your resume" }), _jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3", children: [_jsx("select", { value: selectedResumeId, onChange: (e) => { setSelectedResumeId(e.target.value); setCareer(null); setProjects([]); }, className: "flex h-9 rounded-lg border border-gray-300 bg-white px-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100", children: resumes.map((r) => (_jsxs("option", { value: r.id, children: [r.fileName, " ", r.analysis ? `(ATS: ${r.atsScore ?? "–"}%)` : "(not analyzed)"] }, r.id))) }), !hasAnalysis && selectedResumeId && (_jsxs("span", { className: "text-xs text-amber-600 dark:text-amber-400", children: ["\u26A0\uFE0F This resume hasn't been analyzed yet \u2014 ", _jsx(Link, { to: `/analysis?resumeId=${selectedResumeId}`, className: "underline font-medium", children: "analyze it first" })] }))] })] }), _jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 }, children: _jsxs(Card, { className: "h-full", children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "h-5 w-5 text-green-500" }), " Career Growth"] }), !career && _jsxs(Button, { size: "sm", isLoading: isCareerLoading, onClick: handleCareer, className: "gap-1 shadow-lg shadow-brand-500/25", children: [_jsx(Sparkles, { className: "h-3 w-3" }), " Analyze"] })] }), _jsx(CardDescription, { children: "Your career progression roadmap" })] }), _jsx(CardContent, { children: career ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Current" }), _jsx("p", { className: "text-sm font-bold text-gray-900 dark:text-white", children: career.currentLevel })] }), _jsx(ArrowRight, { className: "h-5 w-5 flex-shrink-0 text-brand-500" }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Next Role" }), _jsx("p", { className: "text-sm font-bold text-brand-600 dark:text-brand-400", children: career.nextRole })] }), _jsx(Badge, { variant: "default", className: "ml-auto", children: career.timeframe })] }), _jsxs("div", { children: [_jsxs("p", { className: "mb-2 text-sm font-semibold text-gray-900 dark:text-white", children: ["Skills to Learn for ", career.nextRole, ":"] }), _jsx("div", { className: "space-y-2", children: career.skillsToLearn.map((skill, i) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.05 }, className: "flex items-center gap-2 rounded-lg border border-gray-100 p-2.5 dark:border-gray-700", children: [_jsx(BookOpen, { className: "h-4 w-4 text-brand-500" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: skill })] }, skill))) })] }), career.allPaths.length > 1 && (_jsxs("div", { children: [_jsx("p", { className: "mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500", children: "Other Career Paths" }), career.allPaths.slice(1).map((p) => (_jsx("div", { className: "mb-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50", children: _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: p.from }), _jsx(ArrowRight, { className: "h-3 w-3 text-gray-400" }), _jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: p.to }), _jsx(Badge, { variant: "secondary", className: "ml-auto text-[10px]", children: p.timeframe })] }) }, p.to)))] }))] })) : (_jsxs("div", { className: "flex flex-col items-center py-8 text-center", children: [_jsx("span", { className: "mb-2 text-4xl", children: "\uD83D\uDCC8" }), _jsx("p", { className: "text-xs text-gray-500", children: "Click \"Analyze\" to see your career path" })] })) })] }) }), _jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, children: _jsxs(Card, { className: "h-full", children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Code2, { className: "h-5 w-5 text-purple-500" }), " Project Ideas"] }), projects.length === 0 && _jsxs(Button, { size: "sm", isLoading: isProjectsLoading, onClick: handleProjects, className: "gap-1 shadow-lg shadow-brand-500/25", children: [_jsx(Sparkles, { className: "h-3 w-3" }), " Suggest"] })] }), _jsx(CardDescription, { children: "AI-suggested projects to boost your resume" })] }), _jsx(CardContent, { children: projects.length > 0 ? (_jsx("div", { className: "space-y-3", children: projects.map((p, i) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.08 }, className: "rounded-xl border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700", children: [_jsxs("div", { className: "mb-2 flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: p.title }), _jsx("p", { className: "text-xs text-gray-500", children: p.description })] }), _jsxs(Badge, { variant: p.relevance >= 70 ? "success" : p.relevance >= 40 ? "warning" : "secondary", children: [p.relevance, "% match"] })] }), _jsx("div", { className: "mb-2 flex flex-wrap gap-1", children: p.techStack.map((t) => _jsx(Badge, { variant: "default", className: "text-[10px]", children: t }, t)) }), _jsx(Badge, { variant: "secondary", className: "text-[10px]", children: p.difficulty })] }, p.title))) })) : (_jsxs("div", { className: "flex flex-col items-center py-8 text-center", children: [_jsx("span", { className: "mb-2 text-4xl", children: "\uD83D\uDCA1" }), _jsx("p", { className: "text-xs text-gray-500", children: "Click \"Suggest\" to get project ideas" })] })) })] }) })] })] }));
}
