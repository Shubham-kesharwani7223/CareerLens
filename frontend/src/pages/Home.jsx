import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ArrowRight, CheckCircle2, Sparkles, Zap, Shield, ChevronRight, Upload, BarChart3, Mic, PenLine, Target, FileText, AlertTriangle, Lock, Github, Linkedin, Twitter, Sun, Moon, } from "lucide-react";
import { Button } from "@/components/ui/button";

//Animation helpers

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};
function Section({ children, className = "", id }) {
    return (_jsx(motion.section, { id: id, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" }, className: [className, id ? "scroll-mt-28 sm:scroll-mt-32" : ""].filter(Boolean).join(" "), children: children }));
}
function ResumeDropzone() {
    const [state, setState] = useState("idle");
    const [scanProgress, setScanProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const handleFile = useCallback((file) => {
        if (state !== "idle")
            return;
        if (!file.name.toLowerCase().endsWith(".pdf")) {
            alert("Please upload a PDF file");
            return;
        }
        setFileName(file.name);
        setState("scanning");
        setScanProgress(0);
    }, [state]);
    // Drag & Drop handlers
    const onDragOver = useCallback((e) => { e.preventDefault(); setIsDragOver(true); }, []);
    const onDragLeave = useCallback(() => setIsDragOver(false), []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file)
            handleFile(file);
    }, [handleFile]);
    // File input handler
    const onFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file)
            handleFile(file);
    }, [handleFile]);
    // Scan animation — 3 seconds
    useEffect(() => {
        if (state !== "scanning")
            return;
        const start = Date.now();
        const duration = 3000;
        const tick = () => {
            const elapsed = Date.now() - start;
            const pct = Math.min(elapsed / duration, 1);
            setScanProgress(pct);
            if (pct < 1)
                requestAnimationFrame(tick);
            else
                setState("result");
        };
        requestAnimationFrame(tick);
    }, [state]);
    return (_jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "show", custom: 4, 
      className: "mx-auto mt-16 max-w-3xl", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: ".pdf", onChange: onFileChange, className: "hidden" }),
         _jsxs(AnimatePresence, { mode: "wait", children: [state === "idle" && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.97 }, 
            animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 }, 
              transition: { duration: 0.3 }, 
                onClick: () => fileInputRef.current?.click(), onDragOver: onDragOver, onDragLeave: onDragLeave, onDrop: onDrop, 
                  className: `group cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${isDragOver
                    ? "border-indigo-400 bg-indigo-500/10 scale-[1.02]"
                    : "border-indigo-500/30 bg-indigo-500/[0.04] hover:border-indigo-500/50 hover:bg-indigo-500/[0.07]"}`, 
                      children: [_jsx(motion.div, { animate: { y: [0, -6, 0] }, 
                        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, 
                        className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10", 
                        children: _jsx(Upload, { className: "h-7 w-7 text-indigo-400" }) }), _jsx("p", { className: "mb-1 text-base font-semibold text-gray-200", 
                          children: isDragOver ? "Drop your PDF here!" : "Drop your Resume PDF here for a free AI scan" }), _jsx("p", { className: "text-sm text-gray-500", 
                            children: "or click to browse files (PDF only)" })] }, "idle")), 
                            state === "scanning" && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.97 }, 
                              animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 }, transition: { duration: 0.3 }, 
                              className: "relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/80 p-10 text-center", 
                            children: [_jsx(motion.div, { className: "pointer-events-none absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_3px_rgba(99,102,241,0.5)]", 
                          animate: { top: ["10%", "90%", "10%"] }, transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }), _jsxs("div", { className: "relative", 
                        children: [_jsx(FileText, { className: "mx-auto mb-4 h-14 w-14 text-indigo-400/60" }), _jsx("p", { className: "mb-1 text-base font-semibold text-gray-200", 
                        children: "Scanning your resume\u2026" }), fileName && (_jsx("p", { className: "mb-3 text-xs text-indigo-400", 
                          children: fileName })), _jsx("div", { className: "mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-white/10", 
                            children: _jsx(motion.div, { className: "h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500", 
                              style: { width: `${scanProgress * 100}%` } }) }), _jsxs("p", { className: "mt-2 text-xs text-gray-500", 
                                children: [Math.round(scanProgress * 100), "% \u2014 Analyzing keywords, sections, ATS compatibility\u2026"] })] })] }, "scanning")), 
                              state === "result" && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.97 }, 
                              animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 }, transition: { duration: 0.4 }, 
                              className: "overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/80", 
                            children: [_jsx("div", { className: "p-6 pb-5", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, 
                          animate: { opacity: 1, y: 0 }, transition: { delay: 0.15 }, 
                        className: "flex flex-col items-center gap-5 sm:flex-row sm:items-start", 
                      children: [_jsxs("div", { className: "relative flex-shrink-0", 
                    children: [_jsxs("svg", { width: "100", height: "100", 
                  className: "-rotate-90", children: [_jsx("circle", { cx: "50", cy: "50", r: "40", stroke: "currentColor", strokeWidth: "8", fill: "none", className: "text-white/[0.06]" }), _jsx(motion.circle, { cx: "50", cy: "50", r: "40", stroke: "#f97316", strokeWidth: "8", fill: "none", strokeLinecap: "round", strokeDasharray: 2 * Math.PI * 40, initial: { strokeDashoffset: 2 * Math.PI * 40 }, 
                animate: { strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.48) }, 
              transition: { duration: 1.2, delay: 0.3, ease: "easeOut" } })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx("span", { className: "text-2xl font-bold text-orange-400", children: "48%" }), _jsx("span", { className: "text-[9px] text-gray-500", children: "ATS Score" })] })] }), _jsxs("div", { className: "flex-1 text-center sm:text-left", children: [_jsx("p", { className: "text-base font-semibold text-white", children: "Basic scan complete" }), fileName && _jsx("p", { className: "mt-0.5 text-xs text-indigo-400", children: fileName }), _jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(CheckCircle2, { className: "h-4 w-4 flex-shrink-0 text-green-400" }), _jsx("span", { className: "text-gray-300", children: "Formatting is readable by ATS systems" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(CheckCircle2, { className: "h-4 w-4 flex-shrink-0 text-green-400" }), _jsx("span", { className: "text-gray-300", children: "Contact information detected" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(AlertTriangle, { className: "h-4 w-4 flex-shrink-0 text-amber-400" }), _jsx("span", { className: "text-gray-300", children: "Multiple issues found \u2014 see full report below" })] })] })] })] }) }), _jsx("div", { className: "mx-6 border-t border-white/[0.06]" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "pointer-events-none select-none space-y-3 p-6 blur-[5px]", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-gray-500", children: "Detailed Analysis" }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-red-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-red-500/30" }), _jsx("span", { className: "text-sm text-red-300", children: "Missing 5 critical keywords (Python, React, AWS\u2026)" })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-red-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-red-500/30" }), _jsx("span", { className: "text-sm text-red-300", children: "Action verbs missing in Experience section" })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-amber-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-amber-500/30" }), _jsx("span", { className: "text-sm text-amber-300", children: "No quantified metrics found in bullet points" })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-amber-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-amber-500/30" }), _jsx("span", { className: "text-sm text-amber-300", children: "Resume exceeds recommended 2-page length" })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx("div", { className: "h-2 w-full rounded bg-white/10" }), _jsx("div", { className: "h-2 w-4/5 rounded bg-white/10" })] })] }), _jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-[1px]", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "text-center", children: [_jsx("p", { className: "mb-1 text-sm font-semibold text-white", children: "\uD83D\uDD12 Full report locked" }), _jsx("p", { className: "mb-4 text-xs text-gray-400", children: "Sign up to see all errors, missing keywords, and AI suggestions" }), _jsx(Link, { to: "/register", children: _jsxs(Button, { size: "lg", className: "gap-2 px-8 shadow-xl shadow-indigo-500/30 transition-shadow hover:shadow-2xl hover:shadow-indigo-500/50", children: [_jsx(Lock, { className: "h-4 w-4" }), "Create Free Account to Unlock Full Report"] }) })] }) })] })] }, "result"))] }), _jsx("div", { className: "mx-auto -mt-8 h-16 w-2/3 rounded-full bg-indigo-500/15 blur-3xl" })] }));
}

//Data

const features = [
    {
        icon: BarChart3,
        title: "AI Resume Insights",
        desc: "Understand your resume strengths, section-wise feedback, keyword gaps, and practical ways to improve your profile.",
        gradient: "from-purple-500 to-rose-500",
        span: "md:col-span-2",
    },
    {
        icon: Briefcase,
        title: "Job Match & Skill Gap",
        desc: "Compare your resume with a target job description to identify matching skills and requirements you may be missing.",
        gradient: "from-purple-500 to-pink-500",
        span: "",
    },
    {
        icon: PenLine,
        title: "AI Cover Letter Generator",
        desc: "Create a role-focused cover letter that connects your experience and skills with the opportunity you want.",
        gradient: "from-amber-500 to-orange-500",
        span: "",
    },
    {
        icon: Mic,
        title: "Mock Interview Preparation",
        desc: "Practice relevant interview questions and use AI-powered feedback to strengthen your answers and confidence.",
        gradient: "from-emerald-500 to-teal-500",
        span: "md:col-span-2",
    },
];
const steps = [
    { num: "01", icon: Upload, title: "Upload Your Resume", desc: "Upload your resume PDF and let CareerLens review the information that matters." },
    { num: "02", icon: Sparkles, title: "Explore Your Insights", desc: "Review resume feedback, keyword gaps, strengths, and practical improvement suggestions." },
    { num: "03", icon: Target, title: "Move Forward with Confidence", desc: "Use your insights to improve your resume and prepare for your next opportunity." },
];

//Page

export function HomePage() {
    const [theme, setTheme] = useState("dark");
    const isLight = theme === "light";
    return (_jsxs("div", { className: `career-lens-theme ${isLight ? "career-lens-light" : "career-lens-dark"} min-h-screen min-w-0 overflow-x-hidden selection:bg-purple-500/20`, children: [_jsx("style", { children: `
        .career-lens-theme { transition: background-color .25s ease, color .25s ease; }
        .career-lens-dark { background:#090811 !important; color:#f7f2fb !important; }
        .career-lens-dark [class~="bg-slate-950"] { background-color:#090811 !important; }
        .career-lens-dark [class~="bg-slate-900/70"] { background-color:rgba(25,16,31,.88) !important; }
        .career-lens-dark [class~="bg-slate-900/80"] { background-color:rgba(24,16,31,.92) !important; }
        .career-lens-dark [class~="text-indigo-400"], .career-lens-dark [class~="text-indigo-300"] { color:#c4a0dc !important; }
        .career-lens-dark [class~="border-indigo-500/20"], .career-lens-dark [class~="border-indigo-500/30"], .career-lens-dark [class~="border-indigo-500/40"] { border-color:rgba(139,78,128,.35) !important; }
        .career-lens-dark [class~="bg-indigo-600/15"] { background-color:rgba(112,53,99,.17) !important; }
        .career-lens-dark [class~="bg-purple-600/10"] { background-color:rgba(91,43,88,.13) !important; }
        .career-lens-dark [class~="from-indigo-500"] { --tw-gradient-from:#70436d var(--tw-gradient-from-position); --tw-gradient-to:rgb(112 67 109 / 0%) var(--tw-gradient-to-position); --tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to); }
        .career-lens-dark [class~="to-purple-600"] { --tw-gradient-to:#87547d var(--tw-gradient-to-position); }
        .career-lens-dark [class~="to-purple-500"] { --tw-gradient-to:#87547d var(--tw-gradient-to-position); }
        .career-lens-light { background:#f7f0e5 !important; color:#24152f !important; }
        .career-lens-light [class~="bg-slate-950"] { background-color:#f7f0e5 !important; }
        .career-lens-light [class~="bg-slate-900/70"], .career-lens-light [class~="bg-slate-900/80"] { background-color:rgba(255,250,241,.94) !important; }
        .career-lens-light [class~="bg-white/[0.02]"], .career-lens-light [class~="bg-white/[0.03]"], .career-lens-light [class~="bg-white/[0.05]"] { background-color:rgba(255,252,246,.78) !important; }
        .career-lens-light [class~="text-white"]:not(svg):not(button) { color:#281832 !important; }
        .career-lens-light [class~="text-gray-200"], .career-lens-light [class~="text-gray-300"] { color:#514356 !important; }
        .career-lens-light [class~="text-gray-400"], .career-lens-light [class~="text-gray-500"], .career-lens-light [class~="text-gray-600"] { color:#75697a !important; }
        .career-lens-light [class~="border-white/[0.06]"], .career-lens-light [class~="border-white/[0.08]"], .career-lens-light [class~="border-white/10"] { border-color:rgba(74,45,72,.14) !important; }
        .career-lens-light [class~="bg-indigo-500/10"], .career-lens-light [class~="bg-purple-500/10"] { background-color:rgba(128,76,155,.09) !important; }
        .career-lens-light [class~="text-indigo-400"], .career-lens-light [class~="text-indigo-300"], .career-lens-light [class~="text-purple-400"] { color:#75419a !important; }
        .career-lens-light [class~="bg-slate-900"] { background-color:#fffaf2 !important; }
        .career-lens-light nav { color:#281832; }
        .career-lens-light input { color:#281832; }
        .career-lens-light .text-transparent {
          background-image: linear-gradient(110deg, #b58a42 0%, #7a526f 52%, #9a6b8e 100%) !important;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        /* Light theme: use the same warm cream + plum + muted-gold palette as Login */
        .career-lens-light [class*="from-indigo-"],
        .career-lens-light [class*="from-purple-"],
        .career-lens-light [class*="from-fuchsia-"] {
          --tw-gradient-from: #684967 var(--tw-gradient-from-position) !important;
          --tw-gradient-to: rgb(104 73 103 / 0%) var(--tw-gradient-to-position) !important;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
        }
        .career-lens-light [class*="via-purple-"] {
          --tw-gradient-stops: var(--tw-gradient-from), #866386 var(--tw-gradient-via-position), var(--tw-gradient-to) !important;
        }
        .career-lens-light [class*="to-purple-"],
        .career-lens-light [class*="to-fuchsia-"],
        .career-lens-light [class*="to-rose-"] {
          --tw-gradient-to: #987493 var(--tw-gradient-to-position) !important;
        }
        .career-lens-light [class*="border-indigo-"],
        .career-lens-light [class*="border-purple-"] {
          border-color: rgba(104,73,103,.24) !important;
        }
        .career-lens-light [class*="bg-indigo-"],
        .career-lens-light [class*="bg-purple-"] {
          background-color: rgba(104,73,103,.09) !important;
        }
        .career-lens-light [class*="text-indigo-"],
        .career-lens-light [class*="text-purple-"] {
          color: #765474 !important;
        }
        .career-lens-light button:not([aria-label*="theme"]) {
          background-color: #684967 !important;
          background-image: linear-gradient(110deg, #684967 0%, #896789 100%) !important;
          color: #fffaf4 !important;
          border-color: rgba(104,73,103,.22) !important;
        }
        .career-lens-light button:not([aria-label*="theme"]):hover {
          background-image: linear-gradient(110deg, #573b57 0%, #765474 100%) !important;
          color: #fffaf4 !important;
        }
        .career-lens-light button[aria-label*="theme"] {
          background: #fffaf2 !important;
          color: #281832 !important;
          border-color: rgba(104,73,103,.2) !important;
        }
        .career-lens-light .shadow-indigo-500\/25,
        .career-lens-light .shadow-indigo-500\/40,
        .career-lens-light .shadow-indigo-500\/15 {
          --tw-shadow-color: rgba(104,73,103,.18) !important;
        }
        .career-lens-light .bg-cyan-600\/10 {
          background-color: rgba(181,138,66,.08) !important;
        }
      }
      
      /* Light theme: feature and career-goal card icons */
.career-lens-light .group > div:first-child,
.career-lens-light .group > div:first-child[class*="bg-gradient-to-br"] {
  background-image: linear-gradient(
    135deg,
    #684967 0%,
    #896789 100%
  ) !important;
  background-color: #684967 !important;
  border: 1px solid rgba(104, 73, 103, 0.2);
  box-shadow: 0 6px 16px rgba(104, 73, 103, 0.16);
}

/* Icons inside those cards stay white for contrast */
.career-lens-light .group > div:first-child svg {
  color: #fffaf4 !important;
  stroke: #fffaf4 !important;
}

/* Career goal cards use the same plum icon background */
.career-lens-light .grid > div > div:first-child.bg-gradient-to-br {
  background-image: linear-gradient(
    135deg,
    #684967 0%,
    #896789 100%
  ) !important;
  background-color: #684967 !important;
}

.career-lens-light .grid > div > div:first-child.bg-gradient-to-br svg {
  color: #fffaf4 !important;
  stroke: #fffaf4 !important;
` }), _jsx("nav", { className: "fixed inset-x-0 top-4 z-50 mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-900/70 px-5 py-3 shadow-xl shadow-black/20 backdrop-blur-xl", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2.5", "aria-label": "CareerLens home", children: [_jsx("img", { src: "/logo.png", alt: "CareerLens logo", className: "h-10 w-10 rounded-xl object-contain" }), _jsxs("span", { className: "text-lg font-bold tracking-tight", children: ["Career", _jsx("span", { className: "bg-gradient-to-r from-amber-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "Lens" })] })] }), _jsxs("div", { className: "hidden items-center gap-6 text-sm text-gray-400 md:flex", children: [_jsx("a", { href: "#features", className: "transition-colors hover:text-white", children: "Features" }), _jsx("a", { href: "#how-it-works", className: "transition-colors hover:text-white", children: "How it Works" }), _jsx("a", { href: "#pricing", className: "transition-colors hover:text-white", children: "Pricing" })] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx("button", { type: "button", onClick: () => setTheme(isLight ? "dark" : "light"), "aria-label": isLight ? "Switch to dark theme" : "Switch to light theme", title: isLight ? "Switch to dark theme" : "Switch to light theme", className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:scale-105", children: isLight ? _jsx(Moon, { className: "h-4 w-4" }) : _jsx(Sun, { className: "h-4 w-4 text-amber-300" }) }), _jsx(Link, { to: "/login", children: _jsx("button", { className: "rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white", children: "Sign In" }) }), _jsx(Link, { to: "/register", children: _jsxs(Button, { size: "sm", className: "gap-1.5 shadow-lg shadow-indigo-500/25", children: ["Sign Up ", _jsx(ArrowRight, { className: "h-3.5 w-3.5" })] }) })] })] }) }), _jsxs("section", { className: "relative overflow-hidden px-3 pb-10 pt-36 sm:px-4 md:px-6 lg:px-8 lg:pt-44", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10", children: [_jsx("div", { className: "absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" }), _jsx("div", { className: "absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" }), _jsx("div", { className: "absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" })] }), _jsxs("div", { className: "mx-auto max-w-5xl text-center", children: [_jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "show", custom: 0, className: "mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300", children: [_jsx(Sparkles, { className: "h-4 w-4" }), " AI-Powered Career Intelligence ", _jsx(ChevronRight, { className: "h-3 w-3" })] }), _jsxs(motion.h1, { variants: fadeUp, initial: "hidden", animate: "show", custom: 1, className: "mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl", children: ["Your Resume. Your Potential.", " ", _jsx("span", { className: "bg-gradient-to-r from-amber-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "Your Next Opportunity." })] }), _jsx(motion.p, { variants: fadeUp, initial: "hidden", animate: "show", custom: 2, className: "mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300", children: "Analyze your resume, discover skill gaps, compare your profile with job requirements, and prepare for interviews with AI-powered career insights\u2014all in one place." }), _jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "show", custom: 3, className: "flex flex-col items-center gap-4 sm:flex-row sm:justify-center", children: [_jsx(Link, { to: "/register", children: _jsxs(Button, { size: "lg", className: "group gap-2 px-8 text-base shadow-xl shadow-indigo-500/25 transition-shadow hover:shadow-2xl hover:shadow-indigo-500/40", children: ["Analyze My Resume", _jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })] }) }), _jsx(Link, { to: "/pricing", children: _jsx(Button, { size: "lg", variant: "outline", className: "border-white/10 bg-white/5 text-gray-300 backdrop-blur-sm hover:bg-white/10 hover:text-white", children: "Explore Pricing" }) })] }), _jsx(ResumeDropzone, {})] })] }), _jsx(Section, { className: "border-y border-white/[0.06] bg-white/[0.02] px-3 py-12 sm:px-4 md:px-6 lg:px-8", children: _jsx("div", { className: "mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3", children: [
                        { icon: FileText, title: "Resume Insights", desc: "Understand your strengths and improvement areas." },
                        { icon: Target, title: "Smarter Job Alignment", desc: "Compare your skills with role requirements." },
                        { icon: Shield, title: "Career-Focused Guidance", desc: "Turn feedback into clear next steps." },
                    ].map((item, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: "flex flex-col items-center gap-2", children: [_jsx(item.icon, { className: "h-7 w-7 text-purple-300" }), _jsx("h3", { className: "font-semibold text-white", children: item.title }), _jsx("p", { className: "max-w-xs text-sm text-gray-400", children: item.desc })] }, item.title))) }) }), _jsx(Section, { id: "features", className: "px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-6xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-14 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-indigo-400", children: "FEATURES" }), _jsxs("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: ["Everything You Need to", " ", _jsx("span", { className: "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent", children: "Move Your Career Forward" })] }), _jsx("p", { className: "mx-auto mt-4 max-w-2xl text-gray-300", children: "From resume feedback to interview preparation, CareerLens helps you understand your next best step." })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-3", children: features.map((f, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: `group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/30 hover:bg-white/[0.05] ${f.span}`, children: [_jsx("div", { className: `mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-lg`, children: _jsx(f.icon, { className: "h-6 w-6 text-white" }) }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-white", children: f.title }), _jsx("p", { className: "text-sm leading-relaxed text-gray-300", children: f.desc }), _jsx("div", { className: `absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20` })] }, f.title))) })] }) }), _jsx(Section, { id: "how-it-works", className: "border-t border-white/[0.06] bg-white/[0.02] px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-16 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-purple-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-purple-400", children: "HOW IT WORKS" }), _jsx("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: "A Clearer Path to Your Next Role" })] }), _jsxs("div", { className: "relative grid gap-10 md:grid-cols-3 md:gap-6", children: [_jsx("div", { className: "pointer-events-none absolute top-14 hidden h-px w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent md:block" }), steps.map((s, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: "relative text-center", children: [_jsxs("div", { className: "relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900 shadow-xl", children: [_jsx(s.icon, { className: "h-7 w-7 text-indigo-400" }), _jsx("span", { className: "absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/40", children: i + 1 })] }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-white", children: s.title }), _jsx("p", { className: "mx-auto max-w-xs text-sm text-gray-300", children: s.desc })] }, s.num)))] })] }) }), _jsx(Section, { className: "px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-6xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-12 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-amber-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-amber-400", children: "BUILT AROUND YOUR GOALS" }), _jsx("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: "Make Your Next Move with Clarity" }), _jsx("p", { className: "mx-auto mt-4 max-w-2xl text-gray-300", children: "Whether you are applying for your first role or planning your next step, start with a clearer view of your skills." })] }), _jsx("div", { className: "grid gap-5 md:grid-cols-3", children: [
                                { icon: FileText, title: "Build a Stronger Resume", text: "Spot unclear sections, missing keywords, and opportunities to present your experience more effectively." },
                                { icon: Briefcase, title: "Understand Role Fit", text: "Compare your current skills with a job description before you apply." },
                                { icon: Mic, title: "Prepare with Purpose", text: "Use structured practice and feedback to prepare for upcoming interviews." },
                            ].map((item, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: "rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-colors hover:border-purple-400/30", children: [_jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 shadow-lg", children: _jsx(item.icon, { className: "h-6 w-6 text-white" }) }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-white", children: item.title }), _jsx("p", { className: "text-sm leading-relaxed text-gray-300", children: item.text })] }, item.title))) })] }) }), _jsx(Section, { id: "pricing", className: "border-t border-white/[0.06] bg-white/[0.02] px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-12 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-indigo-400", children: "PRICING" }), _jsxs("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: ["Start with CareerLens,", " ", _jsx("span", { className: "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent", children: "upgrade when you need more" })] }), _jsx("p", { className: "mx-auto mt-4 max-w-2xl text-gray-300", children: "Explore the available plan, start with the basics, and upgrade when you need additional CareerLens features." })] }), _jsxs("div", { className: "mx-auto grid max-w-3xl gap-6 md:grid-cols-2", children: [_jsxs(motion.div, { variants: fadeUp, custom: 1, className: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-left", children: [_jsx("p", { className: "text-sm font-semibold text-gray-400", children: "Basic" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold text-white", children: "Free" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Try core ATS scoring and suggestions." }), _jsx(Link, { to: "/register", className: "mt-6 block", children: _jsx(Button, { variant: "outline", className: "w-full border-white/10 bg-white/5 text-gray-200 hover:bg-white/10", children: "Start free" }) })] }), _jsxs(motion.div, { variants: fadeUp, custom: 2, className: "relative rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-b from-indigo-500/[0.12] to-white/[0.02] p-8 text-left shadow-lg shadow-indigo-500/15", children: [_jsx("span", { className: "absolute -top-3 left-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md", children: "Best value" }), _jsx("p", { className: "mt-1 text-sm font-semibold text-indigo-300", children: "Pro" }), _jsxs("p", { className: "mt-2 text-3xl font-extrabold text-white", children: ["\u20B9499", _jsx("span", { className: "text-base font-normal text-gray-500", children: "/mo" })] }), _jsx("p", { className: "mt-1 text-sm text-gray-400", children: "Access more tools and features according to your selected plan." }), _jsx(Link, { to: "/pricing", className: "mt-6 block", children: _jsxs(Button, { className: "w-full gap-2 shadow-lg shadow-indigo-500/25", children: ["View all plans ", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] })] })] }) }), _jsxs(Section, { className: "relative overflow-hidden px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" }), _jsx("div", { className: "absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" })] }), _jsxs(motion.div, { variants: fadeUp, custom: 0, className: "relative mx-auto max-w-3xl text-center", children: [_jsx(Shield, { className: "mx-auto mb-6 h-12 w-12 text-indigo-400" }), _jsxs("h2", { className: "mb-4 text-3xl font-bold lg:text-5xl", children: ["Ready for Your Next Career Move", " ", _jsx("span", { className: "bg-gradient-to-r from-amber-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "with CareerLens?" })] }), _jsx("p", { className: "mb-10 text-lg text-gray-300", children: "Build a stronger resume, understand your skill gaps, and prepare for your next opportunity with CareerLens." }), _jsx(Link, { to: "/register", children: _jsxs(Button, { size: "lg", className: "gap-2 px-10 text-base shadow-xl shadow-indigo-500/25 transition-shadow hover:shadow-2xl hover:shadow-indigo-500/40", children: ["Get Started with CareerLens", _jsx(ArrowRight, { className: "h-4 w-4" })] }) }), _jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-500" }), " Resume insights"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Zap, { className: "h-4 w-4 text-amber-500" }), " Actionable feedback"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Shield, { className: "h-4 w-4 text-indigo-500" }), " Career-focused"] })] })] })] }), _jsx("footer", { className: "border-t border-white/[0.06] px-3 py-10 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row", children: [_jsxs("div", { className: "flex flex-col items-center gap-1 sm:items-start", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("img", { src: "/logo.png", alt: "CareerLens logo", className: "h-9 w-9 rounded-lg object-contain" }), _jsxs("span", { className: "text-lg font-bold tracking-tight", children: ["Career", _jsx("span", { className: "bg-gradient-to-r from-amber-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "Lens" })] })] }), _jsx("p", { className: "text-xs text-gray-500", children: "Your AI-powered career companion." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "https://twitter.com", target: "_blank", rel: "noopener noreferrer", className: "rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white", "aria-label": "Twitter", children: _jsx(Twitter, { className: "h-5 w-5" }) }), _jsx("a", { href: "https://www.linkedin.com/in/shubham-kesharwani7223", target: "_blank", rel: "noopener noreferrer", className: "rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white", "aria-label": "LinkedIn", children: _jsx(Linkedin, { className: "h-5 w-5" }) }), _jsx("a", { href: "https://github.com/Shubham-kesharwani7223", target: "_blank", rel: "noopener noreferrer", className: "rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white", "aria-label": "GitHub", children: _jsx(Github, { className: "h-5 w-5" }) })] }), _jsxs("p", { className: "text-center text-sm text-gray-600 sm:text-right", children: ["\u00A9 ", new Date().getFullYear(), " CareerLens. Made with ", _jsx("span", { className: "text-[#c7a121]", children: "\u2665" }), " by CareerLens."] })] }) })] }));
}
