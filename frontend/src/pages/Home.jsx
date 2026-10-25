// import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useState, useEffect, useCallback, useRef } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Briefcase, ArrowRight, CheckCircle2, Sparkles, Zap, Shield, ChevronRight, Upload, BarChart3, Mic, PenLine, Target, FileText, AlertTriangle, Lock, Github, Linkedin, Twitter, Sun, Moon, FilePlus2, } from "lucide-react";
// import { Button } from "@/components/ui/button";

// //Animation helpers

// const fadeUp = {
//     hidden: { opacity: 0, y: 30 },
//     show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
// };
// function Section({ children, className = "", id }) {
//     return (_jsx(motion.section, { id: id, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-80px" }, className: [className, id ? "scroll-mt-28 sm:scroll-mt-32" : ""].filter(Boolean).join(" "), children: children }));
// }
// function ResumeDropzone() {
//     const [state, setState] = useState("idle");
//     const [scanProgress, setScanProgress] = useState(0);
//     const [fileName, setFileName] = useState("");
//     const [isDragOver, setIsDragOver] = useState(false);
//     const fileInputRef = useRef(null);
//     const handleFile = useCallback((file) => {
//         if (state !== "idle")
//             return;
//         if (!file.name.toLowerCase().endsWith(".pdf")) {
//             alert("Please upload a PDF file");
//             return;
//         }
//         setFileName(file.name);
//         setState("scanning");
//         setScanProgress(0);
//     }, [state]);
//     // Drag & Drop handlers
//     const onDragOver = useCallback((e) => { e.preventDefault(); setIsDragOver(true); }, []);
//     const onDragLeave = useCallback(() => setIsDragOver(false), []);
//     const onDrop = useCallback((e) => {
//         e.preventDefault();
//         setIsDragOver(false);
//         const file = e.dataTransfer.files?.[0];
//         if (file)
//             handleFile(file);
//     }, [handleFile]);
//     // File input handler
//     const onFileChange = useCallback((e) => {
//         const file = e.target.files?.[0];
//         if (file)
//             handleFile(file);
//     }, [handleFile]);
//     // Scan animation — 3 seconds
//     useEffect(() => {
//         if (state !== "scanning")
//             return;
//         const start = Date.now();
//         const duration = 3000;
//         const tick = () => {
//             const elapsed = Date.now() - start;
//             const pct = Math.min(elapsed / duration, 1);
//             setScanProgress(pct);
//             if (pct < 1)
//                 requestAnimationFrame(tick);
//             else
//                 setState("result");
//         };
//         requestAnimationFrame(tick);
//     }, [state]);
//     return (_jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "show", custom: 4, 
//       className: "mx-auto mt-16 max-w-3xl", children: [_jsx("input", { ref: fileInputRef, type: "file", accept: ".pdf", onChange: onFileChange, className: "hidden" }),
//          _jsxs(AnimatePresence, { mode: "wait", children: [state === "idle" && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.97 }, 
//             animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 }, 
//               transition: { duration: 0.3 }, 
//                 onClick: () => fileInputRef.current?.click(), onDragOver: onDragOver, onDragLeave: onDragLeave, onDrop: onDrop, 
//                   className: `group cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${isDragOver
//                     ? "border-indigo-400 bg-indigo-500/10 scale-[1.02]"
//                     : "border-indigo-500/30 bg-indigo-500/[0.04] hover:border-indigo-500/50 hover:bg-indigo-500/[0.07]"}`, 
//                       children: [_jsx(motion.div, { animate: { y: [0, -6, 0] }, 
//                         transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, 
//                         className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10", 
//                         children: _jsx(Upload, { className: "h-7 w-7 text-indigo-400" }) }), _jsx("p", { className: "mb-1 text-base font-semibold text-gray-200", 
//                           children: isDragOver ? "Drop your PDF here!" : "Drop your Resume PDF here for a free AI scan" }), _jsx("p", { className: "text-sm text-gray-500", 
//                             children: "or click to browse files (PDF only)" })] }, "idle")), 
//                             state === "scanning" && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.97 }, 
//                               animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 }, transition: { duration: 0.3 }, 
//                               className: "relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/80 p-10 text-center", 
//                             children: [_jsx(motion.div, { className: "pointer-events-none absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_15px_3px_rgba(99,102,241,0.5)]", 
//                           animate: { top: ["10%", "90%", "10%"] }, transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }), _jsxs("div", { className: "relative", 
//                         children: [_jsx(FileText, { className: "mx-auto mb-4 h-14 w-14 text-indigo-400/60" }), _jsx("p", { className: "mb-1 text-base font-semibold text-gray-200", 
//                         children: "Scanning your resume\u2026" }), fileName && (_jsx("p", { className: "mb-3 text-xs text-indigo-400", 
//                           children: fileName })), _jsx("div", { className: "mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-white/10", 
//                             children: _jsx(motion.div, { className: "h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500", 
//                               style: { width: `${scanProgress * 100}%` } }) }), _jsxs("p", { className: "mt-2 text-xs text-gray-500", 
//                                 children: [Math.round(scanProgress * 100), "% \u2014 Analyzing keywords, sections, ATS compatibility\u2026"] })] })] }, "scanning")), 
//                               state === "result" && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.97 }, 
//                               animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 }, transition: { duration: 0.4 }, 
//                               className: "overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/80", 
//                             children: [_jsx("div", { className: "p-6 pb-5", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, 
//                           animate: { opacity: 1, y: 0 }, transition: { delay: 0.15 }, 
//                         className: "flex flex-col items-center gap-5 sm:flex-row sm:items-start", 
//                       children: [_jsxs("div", { className: "relative flex-shrink-0", 
//                     children: [_jsxs("svg", { width: "100", height: "100", 
//                   className: "-rotate-90", children: [_jsx("circle", { cx: "50", cy: "50", r: "40", stroke: "currentColor", strokeWidth: "8", fill: "none", className: "text-white/[0.06]" }), _jsx(motion.circle, { cx: "50", cy: "50", r: "40", stroke: "#f97316", strokeWidth: "8", fill: "none", strokeLinecap: "round", strokeDasharray: 2 * Math.PI * 40, initial: { strokeDashoffset: 2 * Math.PI * 40 }, 
//                 animate: { strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.48) }, 
//               transition: { duration: 1.2, delay: 0.3, ease: "easeOut" } })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsx("span", { className: "text-2xl font-bold text-orange-400", children: "48%" }), _jsx("span", { className: "text-[9px] text-gray-500", children: "ATS Score" })] })] }), _jsxs("div", { className: "flex-1 text-center sm:text-left", children: [_jsx("p", { className: "text-base font-semibold text-white", children: "Basic scan complete" }), fileName && _jsx("p", { className: "mt-0.5 text-xs text-indigo-400", children: fileName }), _jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(CheckCircle2, { className: "h-4 w-4 flex-shrink-0 text-green-400" }), _jsx("span", { className: "text-gray-300", children: "Formatting is readable by ATS systems" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(CheckCircle2, { className: "h-4 w-4 flex-shrink-0 text-green-400" }), _jsx("span", { className: "text-gray-300", children: "Contact information detected" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(AlertTriangle, { className: "h-4 w-4 flex-shrink-0 text-amber-400" }), _jsx("span", { className: "text-gray-300", children: "Multiple issues found \u2014 see full report below" })] })] })] })] }) }), _jsx("div", { className: "mx-6 border-t border-white/[0.06]" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "pointer-events-none select-none space-y-3 p-6 blur-[5px]", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-gray-500", children: "Detailed Analysis" }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-red-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-red-500/30" }), _jsx("span", { className: "text-sm text-red-300", children: "Missing 5 critical keywords (Python, React, AWS\u2026)" })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-red-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-red-500/30" }), _jsx("span", { className: "text-sm text-red-300", children: "Action verbs missing in Experience section" })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-amber-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-amber-500/30" }), _jsx("span", { className: "text-sm text-amber-300", children: "No quantified metrics found in bullet points" })] }), _jsxs("div", { className: "flex items-center gap-2 rounded-lg bg-amber-500/10 p-3", children: [_jsx("div", { className: "h-5 w-5 rounded-full bg-amber-500/30" }), _jsx("span", { className: "text-sm text-amber-300", children: "Resume exceeds recommended 2-page length" })] }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx("div", { className: "h-2 w-full rounded bg-white/10" }), _jsx("div", { className: "h-2 w-4/5 rounded bg-white/10" })] })] }), _jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-[1px]", children: _jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "text-center", children: [_jsx("p", { className: "mb-1 text-sm font-semibold text-white", children: "\uD83D\uDD12 Full report locked" }), _jsx("p", { className: "mb-4 text-xs text-gray-400", children: "Sign up to see all errors, missing keywords, and AI suggestions" }), _jsx(Link, { to: "/register", children: _jsxs(Button, { size: "lg", className: "gap-2 px-8 shadow-xl shadow-indigo-500/30 transition-shadow hover:shadow-2xl hover:shadow-indigo-500/50", children: [_jsx(Lock, { className: "h-4 w-4" }), "Create Free Account to Unlock Full Report"] }) })] }) })] })] }, "result"))] }), _jsx("div", { className: "mx-auto -mt-8 h-16 w-2/3 rounded-full bg-indigo-500/15 blur-3xl" })] }));
// }

// //Data

// const features = [
//     {
//         icon: BarChart3,
//         title: "AI Resume Insights",
//         desc: "Understand your resume strengths, section-wise feedback, keyword gaps, and practical ways to improve your profile.",
//         gradient: "from-purple-500 to-rose-500",
//         span: "md:col-span-2",
//     },
//     {
//         icon: Briefcase,
//         title: "Job Match & Skill Gap",
//         desc: "Compare your resume with a target job description to identify matching skills and requirements you may be missing.",
//         gradient: "from-purple-500 to-pink-500",
//         span: "",
//     },
//     {
//         icon: PenLine,
//         title: "AI Cover Letter Generator",
//         desc: "Create a role-focused cover letter that connects your experience and skills with the opportunity you want.",
//         gradient: "from-amber-500 to-orange-500",
//         span: "",
//     },
//     {
//         icon: Mic,
//         title: "Mock Interview Preparation",
//         desc: "Practice relevant interview questions and use AI-powered feedback to strengthen your answers and confidence.",
//         gradient: "from-emerald-500 to-teal-500",
//         span: "md:col-span-2",
//     },
// ];
// const steps = [
//     { num: "01", icon: Upload, title: "Upload Your Resume", desc: "Upload your resume PDF and let CareerLens review the information that matters." },
//     { num: "02", icon: Sparkles, title: "Explore Your Insights", desc: "Review resume feedback, keyword gaps, strengths, and practical improvement suggestions." },
//     { num: "03", icon: Target, title: "Move Forward with Confidence", desc: "Use your insights to improve your resume and prepare for your next opportunity." },
// ];

// //Page

// export function HomePage() {
//     const [theme, setTheme] = useState("dark");
//     const isLight = theme === "light";
//     return (_jsxs("div", { className: `career-lens-theme ${isLight ? "career-lens-light" : "career-lens-dark"} min-h-screen min-w-0 overflow-x-hidden selection:bg-purple-500/20`, children: [_jsx("style", { children: `
//         .career-lens-theme { transition: background-color .25s ease, color .25s ease; }
//         .career-lens-dark { background:#090811 !important; color:#f7f2fb !important; }
//         .career-lens-dark [class~="bg-slate-950"] { background-color:#090811 !important; }
//         .career-lens-dark [class~="bg-slate-900/70"] { background-color:rgba(25,16,31,.88) !important; }
//         .career-lens-dark [class~="bg-slate-900/80"] { background-color:rgba(24,16,31,.92) !important; }
//         .career-lens-dark [class~="text-indigo-400"], .career-lens-dark [class~="text-indigo-300"] { color:#c4a0dc !important; }
//         .career-lens-dark [class~="border-indigo-500/20"], .career-lens-dark [class~="border-indigo-500/30"], .career-lens-dark [class~="border-indigo-500/40"] { border-color:rgba(139,78,128,.35) !important; }
//         .career-lens-dark [class~="bg-indigo-600/15"] { background-color:rgba(112,53,99,.17) !important; }
//         .career-lens-dark [class~="bg-purple-600/10"] { background-color:rgba(91,43,88,.13) !important; }
//         .career-lens-dark [class~="from-indigo-500"] { --tw-gradient-from:#70436d var(--tw-gradient-from-position); --tw-gradient-to:rgb(112 67 109 / 0%) var(--tw-gradient-to-position); --tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to); }
//         .career-lens-dark [class~="to-purple-600"] { --tw-gradient-to:#87547d var(--tw-gradient-to-position); }
//         .career-lens-dark [class~="to-purple-500"] { --tw-gradient-to:#87547d var(--tw-gradient-to-position); }
//         .career-lens-light { background:#f7f0e5 !important; color:#24152f !important; }
//         .career-lens-light [class~="bg-slate-950"] { background-color:#f7f0e5 !important; }
//         .career-lens-light [class~="bg-slate-900/70"], .career-lens-light [class~="bg-slate-900/80"] { background-color:rgba(255,250,241,.94) !important; }
//         .career-lens-light [class~="bg-white/[0.02]"], .career-lens-light [class~="bg-white/[0.03]"], .career-lens-light [class~="bg-white/[0.05]"] { background-color:rgba(255,252,246,.78) !important; }
//         .career-lens-light [class~="text-white"]:not(svg):not(button) { color:#281832 !important; }
//         .career-lens-light [class~="text-gray-200"], .career-lens-light [class~="text-gray-300"] { color:#514356 !important; }
//         .career-lens-light [class~="text-gray-400"], .career-lens-light [class~="text-gray-500"], .career-lens-light [class~="text-gray-600"] { color:#75697a !important; }
//         .career-lens-light [class~="border-white/[0.06]"], .career-lens-light [class~="border-white/[0.08]"], .career-lens-light [class~="border-white/10"] { border-color:rgba(74,45,72,.14) !important; }
//         .career-lens-light [class~="bg-indigo-500/10"], .career-lens-light [class~="bg-purple-500/10"] { background-color:rgba(128,76,155,.09) !important; }
//         .career-lens-light [class~="text-indigo-400"], .career-lens-light [class~="text-indigo-300"], .career-lens-light [class~="text-purple-400"] { color:#75419a !important; }
//         .career-lens-light [class~="bg-slate-900"] { background-color:#fffaf2 !important; }
//         .career-lens-light nav { color:#281832; }
//         .career-lens-light input { color:#281832; }
//         .career-lens-light .text-transparent {
//           background-image: linear-gradient(110deg, #b58a42 0%, #7a526f 52%, #9a6b8e 100%) !important;
//           -webkit-background-clip: text;
//           background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }
//         /* Light theme: use the same warm cream + plum + muted-gold palette as Login */
//         .career-lens-light [class*="from-indigo-"],
//         .career-lens-light [class*="from-purple-"],
//         .career-lens-light [class*="from-fuchsia-"] {
//           --tw-gradient-from: #684967 var(--tw-gradient-from-position) !important;
//           --tw-gradient-to: rgb(104 73 103 / 0%) var(--tw-gradient-to-position) !important;
//           --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
//         }
//         .career-lens-light [class*="via-purple-"] {
//           --tw-gradient-stops: var(--tw-gradient-from), #866386 var(--tw-gradient-via-position), var(--tw-gradient-to) !important;
//         }
//         .career-lens-light [class*="to-purple-"],
//         .career-lens-light [class*="to-fuchsia-"],
//         .career-lens-light [class*="to-rose-"] {
//           --tw-gradient-to: #987493 var(--tw-gradient-to-position) !important;
//         }
//         .career-lens-light [class*="border-indigo-"],
//         .career-lens-light [class*="border-purple-"] {
//           border-color: rgba(104,73,103,.24) !important;
//         }
//         .career-lens-light [class*="bg-indigo-"],
//         .career-lens-light [class*="bg-purple-"] {
//           background-color: rgba(104,73,103,.09) !important;
//         }
//         .career-lens-light [class*="text-indigo-"],
//         .career-lens-light [class*="text-purple-"] {
//           color: #765474 !important;
//         }
//         .career-lens-light button:not([aria-label*="theme"]) {
//           background-color: #684967 !important;
//           background-image: linear-gradient(110deg, #684967 0%, #896789 100%) !important;
//           color: #fffaf4 !important;
//           border-color: rgba(104,73,103,.22) !important;
//         }
//         .career-lens-light button:not([aria-label*="theme"]):hover {
//           background-image: linear-gradient(110deg, #573b57 0%, #765474 100%) !important;
//           color: #fffaf4 !important;
//         }
//         .career-lens-light button[aria-label*="theme"] {
//           background: #fffaf2 !important;
//           color: #281832 !important;
//           border-color: rgba(104,73,103,.2) !important;
//         }
//         .career-lens-light .shadow-indigo-500\/25,
//         .career-lens-light .shadow-indigo-500\/40,
//         .career-lens-light .shadow-indigo-500\/15 {
//           --tw-shadow-color: rgba(104,73,103,.18) !important;
//         }
//         .career-lens-light .bg-cyan-600\/10 {
//           background-color: rgba(181,138,66,.08) !important;
//         }
//       }
      
//       /* Light theme: feature and career-goal card icons */
// .career-lens-light .group > div:first-child,
// .career-lens-light .group > div:first-child[class*="bg-gradient-to-br"] {
//   background-image: linear-gradient(
//     135deg,
//     #684967 0%,
//     #896789 100%
//   ) !important;
//   background-color: #684967 !important;
//   border: 1px solid rgba(104, 73, 103, 0.2);
//   box-shadow: 0 6px 16px rgba(104, 73, 103, 0.16);
// }

// /* Icons inside those cards stay white for contrast */
// .career-lens-light .group > div:first-child svg {
//   color: #fffaf4 !important;
//   stroke: #fffaf4 !important;
// }

// /* Career goal cards use the same plum icon background */
// .career-lens-light .grid > div > div:first-child.bg-gradient-to-br {
//   background-image: linear-gradient(
//     135deg,
//     #684967 0%,
//     #896789 100%
//   ) !important;
//   background-color: #684967 !important;
// }

// .career-lens-light .grid > div > div:first-child.bg-gradient-to-br svg {
//   color: #fffaf4 !important;
//   stroke: #fffaf4 !important;
// ` }), _jsx("nav", { className: "fixed inset-x-0 top-4 z-50 mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-900/70 px-5 py-3 shadow-xl shadow-black/20 backdrop-blur-xl", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2.5", "aria-label": "CareerLens home", children: [_jsx("img", { src: "/logo.png", alt: "CareerLens logo", className: "h-10 w-10 rounded-xl object-contain" }), _jsxs("span", { className: "text-lg font-bold tracking-tight", children: ["Career", _jsx("span", { className: "bg-gradient-to-r from-amber-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "Lens" })] })] }), _jsxs("div", { className: "hidden items-center gap-6 text-sm text-gray-400 md:flex", children: [_jsx("a", { href: "#features", className: "transition-colors hover:text-white", children: "Features" }), _jsx("a", { href: "#how-it-works", className: "transition-colors hover:text-white", children: "How it Works" }), _jsx("a", { href: "#pricing", className: "transition-colors hover:text-white", children: "Pricing" })] }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [_jsx("button", { type: "button", onClick: () => setTheme(isLight ? "dark" : "light"), "aria-label": isLight ? "Switch to dark theme" : "Switch to light theme", title: isLight ? "Switch to dark theme" : "Switch to light theme", className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:scale-105", children: isLight ? _jsx(Moon, { className: "h-4 w-4" }) : _jsx(Sun, { className: "h-4 w-4 text-amber-300" }) }), _jsx(Link, { to: "/login", children: _jsx("button", { className: "rounded-lg px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white", children: "Sign In" }) }), _jsx(Link, { to: "/register", children: _jsxs(Button, { size: "sm", className: "gap-1.5 shadow-lg shadow-indigo-500/25", children: ["Sign Up ", _jsx(ArrowRight, { className: "h-3.5 w-3.5" })] }) })] })] }) }), _jsxs("section", { className: "relative overflow-hidden px-3 pb-10 pt-36 sm:px-4 md:px-6 lg:px-8 lg:pt-44", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0 -z-10", children: [_jsx("div", { className: "absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" }), _jsx("div", { className: "absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" }), _jsx("div", { className: "absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[100px]" })] }), _jsxs("div", { className: "mx-auto max-w-5xl text-center", children: [_jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "show", custom: 0, className: "mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300", children: [_jsx(Sparkles, { className: "h-4 w-4" }), " AI-Powered Career Intelligence ", _jsx(ChevronRight, { className: "h-3 w-3" })] }), _jsxs(motion.h1, { variants: fadeUp, initial: "hidden", animate: "show", custom: 1, className: "mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl", children: ["Your Resume. Your Potential.", " ", _jsx("span", { className: "bg-gradient-to-r from-amber-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "Your Next Opportunity." })] }), _jsx(motion.p, { variants: fadeUp, initial: "hidden", animate: "show", custom: 2, className: "mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-300", children: "Analyze your resume, discover skill gaps, compare your profile with job requirements, and prepare for interviews with AI-powered career insights\u2014all in one place." }), _jsxs(motion.div, { variants: fadeUp, initial: "hidden", animate: "show", custom: 3, className: "flex flex-col items-center gap-4 sm:flex-row sm:justify-center", children: [_jsx(Link, { to: "/register", children: _jsxs(Button, { size: "lg", className: "group gap-2 px-8 text-base shadow-xl shadow-indigo-500/25 transition-shadow hover:shadow-2xl hover:shadow-indigo-500/40", children: ["Analyze My Resume", _jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })] }) }), _jsx(Link, { to: "/pricing", children: _jsx(Button, { size: "lg", variant: "outline", className: "border-white/10 bg-white/5 text-gray-300 backdrop-blur-sm hover:bg-white/10 hover:text-white", children: "Explore Pricing" }) })] }), _jsx(ResumeDropzone, {})] })] }), _jsx(Section, { className: "border-y border-white/[0.06] bg-white/[0.02] px-3 py-12 sm:px-4 md:px-6 lg:px-8", children: _jsx("div", { className: "mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-3", children: [
//                         { icon: FileText, title: "Resume Insights", desc: "Understand your strengths and improvement areas." },
//                         { icon: Target, title: "Smarter Job Alignment", desc: "Compare your skills with role requirements." },
//                         { icon: Shield, title: "Career-Focused Guidance", desc: "Turn feedback into clear next steps." },
//                     ].map((item, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: "flex flex-col items-center gap-2", children: [_jsx(item.icon, { className: "h-7 w-7 text-purple-300" }), _jsx("h3", { className: "font-semibold text-white", children: item.title }), _jsx("p", { className: "max-w-xs text-sm text-gray-400", children: item.desc })] }, item.title))) }) }), _jsx(Section, { id: "features", className: "px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-6xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-14 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-indigo-400", children: "FEATURES" }), _jsxs("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: ["Everything You Need to", " ", _jsx("span", { className: "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent", children: "Move Your Career Forward" })] }), _jsx("p", { className: "mx-auto mt-4 max-w-2xl text-gray-300", children: "From resume feedback to interview preparation, CareerLens helps you understand your next best step." })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-3", children: features.map((f, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: `group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-7 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/30 hover:bg-white/[0.05] ${f.span}`, children: [_jsx("div", { className: `mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-lg`, children: _jsx(f.icon, { className: "h-6 w-6 text-white" }) }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-white", children: f.title }), _jsx("p", { className: "text-sm leading-relaxed text-gray-300", children: f.desc }), _jsx("div", { className: `absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20` })] }, f.title))) })] }) }), _jsx(Section, { className: "px-3 py-10 sm:px-4 md:px-6 lg:px-8", children: _jsx("div", { className: "mx-auto max-w-5xl", children: _jsxs(motion.div, { variants: fadeUp, custom: 0, className: "relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-600/15 via-white/[0.03] to-amber-500/10 p-6 shadow-xl shadow-purple-950/10 sm:p-9", children: [_jsx("div", { className: "pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-purple-500/15 blur-3xl" }), _jsxs("div", { className: "relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center", children: [_jsxs("div", { className: "max-w-2xl", children: [_jsxs("div", { className: "mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300", children: [_jsx(FilePlus2, { className: "h-3.5 w-3.5" }), " FREE RESUME BUILDER"] }), _jsx("h2", { className: "text-2xl font-bold sm:text-3xl", children: ["Build an ATS-Friendly Resume", " ", _jsx("span", { className: "bg-gradient-to-r from-amber-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "with FlowCV" })] }), _jsx("p", { className: "mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base", children: "Create a polished resume with clean templates, then bring it back to CareerLens for resume insights and job matching. Free-plan features are subject to FlowCV’s current terms." })] }), _jsx("a", { href: "https://flowcv.com/", target: "_blank", rel: "noopener noreferrer", className: "group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-xl", children: ["Build Resume Free", _jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })] })] })] }) }) }), _jsx(Section, { id: "how-it-works", className: "border-t border-white/[0.06] bg-white/[0.02] px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-16 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-purple-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-purple-400", children: "HOW IT WORKS" }), _jsx("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: "A Clearer Path to Your Next Role" })] }), _jsxs("div", { className: "relative grid gap-10 md:grid-cols-3 md:gap-6", children: [_jsx("div", { className: "pointer-events-none absolute top-14 hidden h-px w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent md:block" }), steps.map((s, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: "relative text-center", children: [_jsxs("div", { className: "relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-slate-900 shadow-xl", children: [_jsx(s.icon, { className: "h-7 w-7 text-indigo-400" }), _jsx("span", { className: "absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/40", children: i + 1 })] }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-white", children: s.title }), _jsx("p", { className: "mx-auto max-w-xs text-sm text-gray-300", children: s.desc })] }, s.num)))] })] }) }), _jsx(Section, { className: "px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-6xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-12 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-amber-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-amber-400", children: "BUILT AROUND YOUR GOALS" }), _jsx("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: "Make Your Next Move with Clarity" }), _jsx("p", { className: "mx-auto mt-4 max-w-2xl text-gray-300", children: "Whether you are applying for your first role or planning your next step, start with a clearer view of your skills." })] }), _jsx("div", { className: "grid gap-5 md:grid-cols-3", children: [
//                                 { icon: FileText, title: "Build a Stronger Resume", text: "Spot unclear sections, missing keywords, and opportunities to present your experience more effectively." },
//                                 { icon: Briefcase, title: "Understand Role Fit", text: "Compare your current skills with a job description before you apply." },
//                                 { icon: Mic, title: "Prepare with Purpose", text: "Use structured practice and feedback to prepare for upcoming interviews." },
//                             ].map((item, i) => (_jsxs(motion.div, { variants: fadeUp, custom: i, className: "rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-colors hover:border-purple-400/30", children: [_jsx("div", { className: "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 shadow-lg", children: _jsx(item.icon, { className: "h-6 w-6 text-white" }) }), _jsx("h3", { className: "mb-2 text-lg font-semibold text-white", children: item.title }), _jsx("p", { className: "text-sm leading-relaxed text-gray-300", children: item.text })] }, item.title))) })] }) }), _jsx(Section, { id: "pricing", className: "border-t border-white/[0.06] bg-white/[0.02] px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-5xl", children: [_jsxs(motion.div, { variants: fadeUp, custom: 0, className: "mb-12 text-center", children: [_jsx("span", { className: "mb-3 inline-block rounded-full bg-indigo-500/10 px-4 py-1 text-xs font-semibold tracking-wider text-indigo-400", children: "PRICING" }), _jsxs("h2", { className: "mt-3 text-3xl font-bold lg:text-5xl", children: ["Start with CareerLens,", " ", _jsx("span", { className: "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent", children: "upgrade when you need more" })] }), _jsx("p", { className: "mx-auto mt-4 max-w-2xl text-gray-300", children: "Explore the available plan, start with the basics, and upgrade when you need additional CareerLens features." })] }), _jsxs("div", { className: "mx-auto grid max-w-3xl gap-6 md:grid-cols-2", children: [_jsxs(motion.div, { variants: fadeUp, custom: 1, className: "rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-left", children: [_jsx("p", { className: "text-sm font-semibold text-gray-400", children: "Basic" }), _jsx("p", { className: "mt-2 text-3xl font-extrabold text-white", children: "Free" }), _jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Try core ATS scoring and suggestions." }), _jsx(Link, { to: "/register", className: "mt-6 block", children: _jsx(Button, { variant: "outline", className: "w-full border-white/10 bg-white/5 text-gray-200 hover:bg-white/10", children: "Start free" }) })] }), _jsxs(motion.div, { variants: fadeUp, custom: 2, className: "relative rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-b from-indigo-500/[0.12] to-white/[0.02] p-8 text-left shadow-lg shadow-indigo-500/15", children: [_jsx("span", { className: "absolute -top-3 left-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md", children: "Best value" }), _jsx("p", { className: "mt-1 text-sm font-semibold text-indigo-300", children: "Pro" }), _jsxs("p", { className: "mt-2 text-3xl font-extrabold text-white", children: ["\u20B9499", _jsx("span", { className: "text-base font-normal text-gray-500", children: "/mo" })] }), _jsx("p", { className: "mt-1 text-sm text-gray-400", children: "Access more tools and features according to your selected plan." }), _jsx(Link, { to: "/pricing", className: "mt-6 block", children: _jsxs(Button, { className: "w-full gap-2 shadow-lg shadow-indigo-500/25", children: ["View all plans ", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] })] })] }) }), _jsxs(Section, { className: "relative overflow-hidden px-3 py-24 sm:px-4 md:px-6 lg:px-8", children: [_jsxs("div", { className: "pointer-events-none absolute inset-0", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" }), _jsx("div", { className: "absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" })] }), _jsxs(motion.div, { variants: fadeUp, custom: 0, className: "relative mx-auto max-w-3xl text-center", children: [_jsx(Shield, { className: "mx-auto mb-6 h-12 w-12 text-indigo-400" }), _jsxs("h2", { className: "mb-4 text-3xl font-bold lg:text-5xl", children: ["Ready for Your Next Career Move", " ", _jsx("span", { className: "bg-gradient-to-r from-amber-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "with CareerLens?" })] }), _jsx("p", { className: "mb-10 text-lg text-gray-300", children: "Build a stronger resume, understand your skill gaps, and prepare for your next opportunity with CareerLens." }), _jsx(Link, { to: "/register", children: _jsxs(Button, { size: "lg", className: "gap-2 px-10 text-base shadow-xl shadow-indigo-500/25 transition-shadow hover:shadow-2xl hover:shadow-indigo-500/40", children: ["Get Started with CareerLens", _jsx(ArrowRight, { className: "h-4 w-4" })] }) }), _jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-500" }), " Resume insights"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Zap, { className: "h-4 w-4 text-amber-500" }), " Actionable feedback"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Shield, { className: "h-4 w-4 text-indigo-500" }), " Career-focused"] })] })] })] }), _jsx("footer", { className: "border-t border-white/[0.06] px-3 py-10 sm:px-4 md:px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row", children: [_jsxs("div", { className: "flex flex-col items-center gap-1 sm:items-start", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("img", { src: "/logo.png", alt: "CareerLens logo", className: "h-9 w-9 rounded-lg object-contain" }), _jsxs("span", { className: "text-lg font-bold tracking-tight", children: ["Career", _jsx("span", { className: "bg-gradient-to-r from-amber-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent", children: "Lens" })] })] }), _jsx("p", { className: "text-xs text-gray-500", children: "Your AI-powered career companion." })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("a", { href: "https://twitter.com", target: "_blank", rel: "noopener noreferrer", className: "rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white", "aria-label": "Twitter", children: _jsx(Twitter, { className: "h-5 w-5" }) }), _jsx("a", { href: "https://www.linkedin.com/in/shubham-kesharwani7223", target: "_blank", rel: "noopener noreferrer", className: "rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white", "aria-label": "LinkedIn", children: _jsx(Linkedin, { className: "h-5 w-5" }) }), _jsx("a", { href: "https://github.com/Shubham-kesharwani7223", target: "_blank", rel: "noopener noreferrer", className: "rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-white", "aria-label": "GitHub", children: _jsx(Github, { className: "h-5 w-5" }) })] }), _jsxs("p", { className: "text-center text-sm text-gray-600 sm:text-right", children: ["\u00A9 ", new Date().getFullYear(), " CareerLens. Made with ", _jsx("span", { className: "text-[#c7a121]", children: "\u2665" }), " by CareerLens."] })] }) })] }));
// }
















































































import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Upload,
  X,
  Zap,
  BrainCircuit,
  BriefcaseBusiness,
  FileCheck2,
  MessageSquareText,
  LockKeyhole,
  Github,
  Linkedin,
  Twitter,
  TrendingUp,
  Clock3,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Resume Insights",
    description:
      "Understand your resume with actionable feedback, strengths, and areas that need improvement.",
    tag: "AI-powered",
  },
  {
    icon: Target,
    title: "Job Match & Skill Gap",
    description:
      "Compare your resume with job descriptions and discover the skills and keywords you are missing.",
    tag: "Smart matching",
  },
  {
    icon: FileCheck2,
    title: "AI Cover Letter",
    description:
      "Create a tailored cover letter that highlights your experience and aligns with your target role.",
    tag: "Personalized",
  },
  {
    icon: MessageSquareText,
    title: "Mock Interview Prep",
    description:
      "Prepare for interviews with role-specific questions and structured practice guidance.",
    tag: "Career ready",
  },
];

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description:
      "Upload your resume in PDF format and get started with your career analysis.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Explore Your Insights",
    description:
      "Review resume feedback, identify skill gaps, and understand your job readiness.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Move Forward",
    description:
      "Improve your resume, prepare for interviews, and take the next step in your career.",
  },
];

const benefits = [
  "ATS-focused resume feedback",
  "Job description keyword matching",
  "Personalized improvement suggestions",
  "Career and interview guidance",
];

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Get started with your career journey.",
    features: [
      "Basic resume tools",
      "Explore CareerLens",
      "Access available free features",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "₹499",
    suffix: "/month",
    description: "For candidates serious about their next opportunity.",
    features: [
      "Advanced resume analysis",
      "Job matching and skill gaps",
      "AI-powered career assistance",
      "Access to Pro features",
    ],
    cta: "Explore Pro",
    featured: true,
  },
];

function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`cl-section ${className}`}>
      <div className="cl-container">{children}</div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, description, light = false }) {
  return (
    <div className={`cl-section-heading ${light ? "cl-heading-light" : ""}`}>
      {eyebrow && <span className="cl-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

function ResumeDropzone({ isLight }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (status !== "scanning") return;

    const interval = setInterval(() => {
      setProgress((previous) => {
        const next = Math.min(previous + 10, 100);

        if (next === 100) {
          clearInterval(interval);
          setStatus("complete");
        }

        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [status]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF resume.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    setProgress(0);
    setStatus("scanning");
  };

  const reset = () => {
    setFile(null);
    setProgress(0);
    setStatus("idle");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={`cl-upload-card ${isLight ? "cl-upload-light" : ""}`}>
      <div className="cl-upload-top">
        <div>
          <span className="cl-mini-label">
            <Sparkles size={14} /> YOUR CAREER STARTS HERE
          </span>
          <h3>Analyze your resume</h3>
          <p>Upload your PDF resume to preview the workflow.</p>
        </div>

        <div className="cl-upload-icon">
          <FileText size={25} />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="cl-hidden-input"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {status === "idle" && (
        <button
          type="button"
          className="cl-dropzone"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            handleFile(event.dataTransfer.files?.[0]);
          }}
        >
          <span className="cl-drop-icon">
            <Upload size={24} />
          </span>
          <strong>Drop your resume here</strong>
          <span>or click to browse your files</span>
          <small>PDF format · Maximum 10 MB</small>
        </button>
      )}

      {status === "scanning" && (
        <div className="cl-scan-state">
          <div className="cl-scan-file">
            <FileText size={26} />
            <div>
              <strong>{file?.name}</strong>
              <span>Demo scan in progress...</span>
            </div>
            <span className="cl-scan-percent">{progress}%</span>
          </div>

          <div className="cl-progress-track">
            <div
              className="cl-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="cl-muted">
            Previewing the upload experience. This is not a real AI analysis.
          </p>
        </div>
      )}

      {status === "complete" && (
        <div className="cl-demo-result">
          <div className="cl-demo-success">
            <CheckCircle2 size={22} />
            <div>
              <strong>Demo upload complete</strong>
              <span>{file?.name}</span>
            </div>
          </div>

          <div className="cl-demo-score">
            <div>
              <span className="cl-mini-label">SAMPLE PREVIEW</span>
              <h4>Resume insights</h4>
              <p>
                Connect your resume analysis backend to display actual scores
                and personalized results here.
              </p>
            </div>
            <div className="cl-score-circle">
              <span>--</span>
              <small>Score</small>
            </div>
          </div>

          <div className="cl-demo-actions">
            <Button onClick={reset} variant="outline">
              Upload Another
            </Button>
            <Link to="/login">
              <Button className="cl-primary-btn">
                Continue <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="cl-upload-trust">
        <span>
          <ShieldCheck size={15} /> Secure workflow
        </span>
        <span>
          <LockKeyhole size={14} /> Your career, your control
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  const isLight = theme === "light";

  useEffect(() => {
    const savedTheme = localStorage.getItem("careerlens-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.careerlensTheme = theme;
    localStorage.setItem("careerlens-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <main className={`careerlens-home ${isLight ? "cl-light" : "cl-dark"}`}>
      <style>{`
        .careerlens-home {
          --cl-bg: #090811;
          --cl-bg-alt: #100d1b;
          --cl-card: #151122;
          --cl-card-hover: #1b162b;
          --cl-text: #f7f3ff;
          --cl-muted: #aaa3ba;
          --cl-border: rgba(255,255,255,.10);
          --cl-accent: #b99aff;
          --cl-accent-2: #8b5cf6;
          --cl-accent-soft: rgba(167,139,250,.12);
          --cl-glow: rgba(139,92,246,.18);
          --cl-nav: rgba(9,8,17,.82);
          background: var(--cl-bg);
          color: var(--cl-text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          min-height: 100vh;
          overflow: clip;
          transition: background .25s ease, color .25s ease;
        }
        .careerlens-home * { box-sizing: border-box; }
        .careerlens-home a { color: inherit; text-decoration: none; }
        .careerlens-home button { font: inherit; }
        .careerlens-home .cl-container { width: min(1160px, calc(100% - 48px)); margin-inline: auto; }
        .careerlens-home .cl-section { padding: 100px 0; }
        .careerlens-home .cl-light {
          --cl-bg: #f8f2e8;
          --cl-bg-alt: #f0e8dc;
          --cl-card: #fffaf2;
          --cl-card-hover: #f4eadc;
          --cl-text: #241a31;
          --cl-muted: #756b7e;
          --cl-border: rgba(55,35,60,.13);
          --cl-accent: #7950bb;
          --cl-accent-2: #8051c9;
          --cl-accent-soft: rgba(128,81,201,.09);
          --cl-glow: rgba(128,81,201,.11);
          --cl-nav: rgba(248,242,232,.88);
        }
        .careerlens-home.cl-light {
          --cl-bg: #f8f2e8;
          --cl-bg-alt: #f0e8dc;
          --cl-card: #fffaf2;
          --cl-card-hover: #f4eadc;
          --cl-text: #241a31;
          --cl-muted: #756b7e;
          --cl-border: rgba(55,35,60,.13);
          --cl-accent: #7950bb;
          --cl-accent-2: #8051c9;
          --cl-accent-soft: rgba(128,81,201,.09);
          --cl-glow: rgba(128,81,201,.11);
          --cl-nav: rgba(248,242,232,.88);
        }
        .careerlens-home .cl-container { position: relative; }
        .careerlens-home .cl-nav-wrap {
          height: 76px;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--cl-nav);
          border-bottom: 1px solid var(--cl-border);
          backdrop-filter: blur(18px);
        }
        .careerlens-home .cl-navbar { display:flex; align-items:center; justify-content:space-between; gap:24px; }
        .careerlens-home .cl-brand { display:inline-flex; align-items:center; gap:11px; flex-shrink:0; }
        .careerlens-home .cl-logo {
          width: 40px; height:40px; display:grid; place-items:center;
          border-radius:13px; color:white; font-size:15px; font-weight:900;
          letter-spacing:-1.4px; background:linear-gradient(140deg,#a78bfa,#6d28d9);
          box-shadow:0 5px 22px rgba(139,92,246,.27);
        }
        .careerlens-home .cl-brand-name { font-size:19px; font-weight:800; letter-spacing:-.8px; }
        .careerlens-home .cl-brand-name span { color:var(--cl-accent); }
        .careerlens-home .cl-nav-links { display:flex; align-items:center; gap:31px; }
        .careerlens-home .cl-nav-links a { font-size:13px; font-weight:600; color:var(--cl-muted); transition:color .2s; }
        .careerlens-home .cl-nav-links a:hover { color:var(--cl-text); }
        .careerlens-home .cl-nav-actions { display:flex; align-items:center; gap:10px; }
        .careerlens-home .cl-theme-btn,.careerlens-home .cl-menu-btn {
          width:39px; height:39px; display:grid; place-items:center; cursor:pointer;
          border:1px solid var(--cl-border); border-radius:12px; color:var(--cl-text);
          background:var(--cl-card); transition:background .2s;
        }
        .careerlens-home .cl-theme-btn:hover,.careerlens-home .cl-menu-btn:hover { background:var(--cl-card-hover); }
        .careerlens-home .cl-signin { font-size:13px; font-weight:700; padding:10px 12px; }
        .careerlens-home .cl-primary-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          min-height:43px; padding:0 19px; border:0; border-radius:12px;
          color:white!important; font-size:13px; font-weight:750;
          background:linear-gradient(135deg,#9a76ef,#7143cf);
          box-shadow:0 8px 24px rgba(124,77,220,.20);
          transition:transform .2s, filter .2s;
        }
        .careerlens-home .cl-primary-btn:hover { filter:brightness(1.1); transform:translateY(-1px); }
        .careerlens-home .cl-menu-btn { display:none; }
        .careerlens-home .cl-mobile-menu { display:none; }
        .careerlens-home .cl-hero {
          position:relative; padding:95px 0 76px;
          background:radial-gradient(ellipse at 50% 0%,var(--cl-glow),transparent 60%);
        }
        .careerlens-home .cl-hero-grid {
          display:grid; grid-template-columns:1.02fr .98fr; align-items:center; gap:64px;
        }
        .careerlens-home .cl-hero-copy { max-width:600px; }
        .careerlens-home .cl-pill {
          display:inline-flex; align-items:center; gap:8px; border:1px solid var(--cl-border);
          background:var(--cl-accent-soft); border-radius:100px; padding:8px 13px;
          color:var(--cl-accent); font-size:11px; font-weight:800; letter-spacing:.8px;
        }
        .careerlens-home .cl-hero h1 {
          margin:25px 0 20px; font-size:clamp(42px,5.3vw,68px);
          line-height:1.07; letter-spacing:-3.2px; font-weight:850;
        }
        .careerlens-home .cl-gradient-text {
          color:var(--cl-accent);
          background:linear-gradient(100deg,#c4a7ff,#9871ed 58%,#d8b6ff);
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
        }
        .careerlens-home .cl-light .cl-gradient-text { background-image:linear-gradient(100deg,#7a45bd,#a05bb6); }
        .careerlens-home .cl-hero-desc { max-width:520px; font-size:16px; line-height:1.85; color:var(--cl-muted); }
        .careerlens-home .cl-hero-actions { display:flex; align-items:center; flex-wrap:wrap; gap:13px; margin-top:29px; }
        .careerlens-home .cl-secondary-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:9px;
          min-height:43px; padding:0 18px; border:1px solid var(--cl-border);
          border-radius:12px; color:var(--cl-text); font-size:13px; font-weight:750;
          background:var(--cl-card); transition:background .2s;
        }
        .careerlens-home .cl-secondary-btn:hover { background:var(--cl-card-hover); }
        .careerlens-home .cl-hero-note { display:flex; flex-wrap:wrap; gap:16px; margin-top:24px; color:var(--cl-muted); font-size:11px; }
        .careerlens-home .cl-hero-note span { display:inline-flex; align-items:center; gap:6px; }
        .careerlens-home .cl-hero-note svg { color:var(--cl-accent); }
        .careerlens-home .cl-upload-card {
          padding:26px; border:1px solid var(--cl-border); border-radius:24px;
          background:linear-gradient(145deg,var(--cl-card),var(--cl-bg-alt));
          box-shadow:0 28px 85px rgba(0,0,0,.18);
        }
        .careerlens-home .cl-upload-top { display:flex; justify-content:space-between; gap:15px; margin-bottom:23px; }
        .careerlens-home .cl-mini-label { display:inline-flex; align-items:center; gap:6px; font-size:10px; letter-spacing:1.2px; font-weight:850; color:var(--cl-accent); }
        .careerlens-home .cl-upload-top h3 { font-size:22px; letter-spacing:-.7px; margin:10px 0 5px; }
        .careerlens-home .cl-upload-top p { color:var(--cl-muted); font-size:12px; line-height:1.6; margin:0; }
        .careerlens-home .cl-upload-icon,.careerlens-home .cl-drop-icon {
          display:grid; place-items:center; flex-shrink:0; color:var(--cl-accent);
          border-radius:15px; background:var(--cl-accent-soft);
        }
        .careerlens-home .cl-upload-icon { width:47px; height:47px; }
        .careerlens-home .cl-dropzone {
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px;
          width:100%; min-height:220px; padding:25px; cursor:pointer;
          color:var(--cl-text); border:1.5px dashed var(--cl-border); border-radius:17px;
          background:var(--cl-accent-soft); transition:border-color .2s,background .2s;
        }
        .careerlens-home .cl-dropzone:hover { border-color:var(--cl-accent); }
        .careerlens-home .cl-drop-icon { width:53px; height:53px; border-radius:17px; }
        .careerlens-home .cl-dropzone strong { font-size:14px; }
        .careerlens-home .cl-dropzone span:not(.cl-drop-icon) { font-size:12px; color:var(--cl-muted); }
        .careerlens-home .cl-dropzone small { margin-top:8px; font-size:10px; color:var(--cl-muted); }
        .careerlens-home .cl-hidden-input { display:none; }
        .careerlens-home .cl-upload-trust { display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-top:18px; color:var(--cl-muted); font-size:10px; }
        .careerlens-home .cl-upload-trust span { display:inline-flex; align-items:center; gap:5px; }
        .careerlens-home .cl-scan-state { padding:22px 0; }
        .careerlens-home .cl-scan-file { display:flex; align-items:center; gap:12px; }
        .careerlens-home .cl-scan-file > svg { color:var(--cl-accent); flex-shrink:0; }
        .careerlens-home .cl-scan-file > div { min-width:0; flex:1; }
        .careerlens-home .cl-scan-file strong,.careerlens-home .cl-scan-file span { display:block; }
        .careerlens-home .cl-scan-file strong { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:12px; }
        .careerlens-home .cl-scan-file span { margin-top:5px; color:var(--cl-muted); font-size:10px; }
        .careerlens-home .cl-scan-file .cl-scan-percent { color:var(--cl-accent); font-weight:800; }
        .careerlens-home .cl-progress-track { height:7px; margin-top:22px; overflow:hidden; border-radius:20px; background:var(--cl-border); }
        .careerlens-home .cl-progress-fill { height:100%; border-radius:20px; background:linear-gradient(90deg,#8b5cf6,#c4a7ff); transition:width .2s; }
        .careerlens-home .cl-muted { color:var(--cl-muted); font-size:11px; line-height:1.7; }
        .careerlens-home .cl-demo-result { padding:12px 0; }
        .careerlens-home .cl-demo-success { display:flex; align-items:center; gap:10px; color:#22c58b; }
        .careerlens-home .cl-demo-success div { min-width:0; }
        .careerlens-home .cl-demo-success strong,.careerlens-home .cl-demo-success span { display:block; }
        .careerlens-home .cl-demo-success strong { font-size:13px; }
        .careerlens-home .cl-demo-success span { margin-top:4px; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:10px; color:var(--cl-muted); }
        .careerlens-home .cl-demo-score { display:flex; justify-content:space-between; align-items:center; gap:15px; margin-top:24px; padding:19px; border:1px solid var(--cl-border); border-radius:15px; background:var(--cl-accent-soft); }
        .careerlens-home .cl-demo-score h4 { font-size:16px; margin:8px 0 5px; }
        .careerlens-home .cl-demo-score p { max-width:240px; margin:0; color:var(--cl-muted); font-size:11px; line-height:1.6; }
        .careerlens-home .cl-score-circle { width:65px; height:65px; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0; border:2px solid var(--cl-accent); border-radius:50%; }
        .careerlens-home .cl-score-circle span { font-size:19px; font-weight:850; }
        .careerlens-home .cl-score-circle small { font-size:9px; color:var(--cl-muted); }
        .careerlens-home .cl-demo-actions { display:flex; gap:10px; margin-top:17px; }
        .careerlens-home .cl-demo-actions > * { flex:1; }
        .careerlens-home .cl-demo-actions button { width:100%; min-height:40px; font-size:12px; }
        .careerlens-home .cl-demo-actions button[class*="outline"] { border-color:var(--cl-border); color:var(--cl-text); background:transparent; }
        .careerlens-home .cl-trust-strip { border-block:1px solid var(--cl-border); background:var(--cl-bg-alt); }
        .careerlens-home .cl-trust-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; padding:23px 0; }
        .careerlens-home .cl-trust-item { display:flex; justify-content:center; align-items:center; gap:10px; color:var(--cl-muted); font-size:11px; font-weight:650; }
        .careerlens-home .cl-trust-item svg { color:var(--cl-accent); flex-shrink:0; }
        .careerlens-home .cl-section-heading { max-width:680px; margin:0 auto 48px; text-align:center; }
        .careerlens-home .cl-eyebrow { display:inline-block; margin-bottom:13px; color:var(--cl-accent); font-size:11px; font-weight:850; letter-spacing:1.5px; text-transform:uppercase; }
        .careerlens-home .cl-section-heading h2 { margin:0; font-size:clamp(30px,4vw,45px); line-height:1.15; letter-spacing:-1.8px; font-weight:850; }
        .careerlens-home .cl-section-heading p { max-width:570px; margin:16px auto 0; color:var(--cl-muted); font-size:14px; line-height:1.85; }
        .careerlens-home .cl-features-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
        .careerlens-home .cl-feature-card {
          padding:27px; border:1px solid var(--cl-border); border-radius:19px;
          background:var(--cl-card); transition:transform .25s,border-color .25s,background .25s;
        }
        .careerlens-home .cl-feature-card:hover { transform:translateY(-4px); border-color:var(--cl-accent); background:var(--cl-card-hover); }
        .careerlens-home .cl-feature-top { display:flex; justify-content:space-between; align-items:center; gap:10px; }
        .careerlens-home .cl-feature-icon { width:47px; height:47px; display:grid; place-items:center; border-radius:14px; color:var(--cl-accent); background:var(--cl-accent-soft); }
        .careerlens-home .cl-feature-tag { padding:6px 9px; border-radius:20px; background:var(--cl-accent-soft); color:var(--cl-accent); font-size:9px; font-weight:800; }
        .careerlens-home .cl-feature-card h3 { margin:22px 0 9px; font-size:18px; letter-spacing:-.5px; }
        .careerlens-home .cl-feature-card p { margin:0; color:var(--cl-muted); font-size:12px; line-height:1.9; }
        .careerlens-home .cl-how { background:var(--cl-bg-alt); }
        .careerlens-home .cl-steps-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .careerlens-home .cl-step-card { padding:27px; border:1px solid var(--cl-border); border-radius:18px; background:var(--cl-card); }
        .careerlens-home .cl-step-number { display:flex; justify-content:space-between; align-items:center; color:var(--cl-accent); font-size:12px; font-weight:850; }
        .careerlens-home .cl-step-number svg { width:42px; height:42px; padding:10px; border-radius:13px; background:var(--cl-accent-soft); }
        .careerlens-home .cl-step-card h3 { margin:24px 0 10px; font-size:17px; }
        .careerlens-home .cl-step-card p { margin:0; color:var(--cl-muted); font-size:12px; line-height:1.85; }
        .careerlens-home .cl-builder-card {
          display:grid; grid-template-columns:1fr auto; align-items:center; gap:30px;
          margin-top:65px; padding:31px; border:1px solid var(--cl-border);
          border-radius:20px; background:var(--cl-card);
        }
        .careerlens-home .cl-builder-card h3 { margin:10px 0; font-size:22px; letter-spacing:-.7px; }
        .careerlens-home .cl-builder-card p { max-width:640px; margin:0; color:var(--cl-muted); font-size:12px; line-height:1.8; }
        .careerlens-home .cl-builder-badge { display:inline-flex; align-items:center; gap:7px; color:var(--cl-accent); font-size:10px; font-weight:850; letter-spacing:1px; }
        .careerlens-home .cl-pricing-grid { display:grid; grid-template-columns:repeat(2,minmax(0,390px)); justify-content:center; gap:22px; }
        .careerlens-home .cl-price-card { position:relative; padding:30px; border:1px solid var(--cl-border); border-radius:21px; background:var(--cl-card); }
        .careerlens-home .cl-price-card.cl-price-featured { border-color:var(--cl-accent); box-shadow:0 15px 50px var(--cl-glow); }
        .careerlens-home .cl-popular { position:absolute; right:18px; top:18px; border-radius:20px; padding:6px 9px; color:var(--cl-accent); background:var(--cl-accent-soft); font-size:9px; font-weight:850; }
        .careerlens-home .cl-plan-name { color:var(--cl-muted); font-size:13px; font-weight:800; }
        .careerlens-home .cl-price { display:flex; align-items:baseline; gap:5px; margin:19px 0 9px; }
        .careerlens-home .cl-price strong { font-size:40px; letter-spacing:-2px; }
        .careerlens-home .cl-price span { color:var(--cl-muted); font-size:12px; }
        .careerlens-home .cl-plan-description { min-height:38px; color:var(--cl-muted); font-size:12px; line-height:1.7; }
        .careerlens-home .cl-plan-divider { height:1px; margin:22px 0; background:var(--cl-border); }
        .careerlens-home .cl-plan-features { display:grid; gap:14px; margin:0 0 25px; padding:0; list-style:none; }
        .careerlens-home .cl-plan-features li { display:flex; gap:9px; align-items:flex-start; color:var(--cl-muted); font-size:12px; line-height:1.6; }
        .careerlens-home .cl-plan-features svg { flex-shrink:0; margin-top:1px; color:var(--cl-accent); }
        .careerlens-home .cl-price-card > a { display:block; }
        .careerlens-home .cl-price-card > a button { width:100%; }
        .careerlens-home .cl-cta { padding:25px 0 100px; }
        .careerlens-home .cl-cta-panel {
          position:relative; overflow:hidden; text-align:center; padding:65px 28px;
          border:1px solid var(--cl-border); border-radius:26px;
          background:radial-gradient(ellipse at 50% 0%,var(--cl-glow),transparent 70%),var(--cl-card);
        }
        .careerlens-home .cl-cta-panel h2 { max-width:700px; margin:0 auto; font-size:clamp(30px,4vw,46px); letter-spacing:-1.8px; line-height:1.15; }
        .careerlens-home .cl-cta-panel p { max-width:530px; margin:17px auto 25px; color:var(--cl-muted); font-size:13px; line-height:1.8; }
        .careerlens-home .cl-footer { padding:35px 0 25px; border-top:1px solid var(--cl-border); background:var(--cl-bg-alt); }
        .careerlens-home .cl-footer-top { display:flex; justify-content:space-between; align-items:center; gap:25px; padding-bottom:26px; }
        .careerlens-home .cl-footer-copy { max-width:390px; margin-top:12px; color:var(--cl-muted); font-size:11px; line-height:1.8; }
        .careerlens-home .cl-socials { display:flex; gap:10px; }
        .careerlens-home .cl-socials a { width:38px; height:38px; display:grid; place-items:center; border:1px solid var(--cl-border); border-radius:11px; color:var(--cl-muted); transition:color .2s,border-color .2s; }
        .careerlens-home .cl-socials a:hover { color:var(--cl-accent); border-color:var(--cl-accent); }
        .careerlens-home .cl-footer-bottom { display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; padding-top:21px; border-top:1px solid var(--cl-border); color:var(--cl-muted); font-size:10px; }
        .careerlens-home .cl-footer-links { display:flex; flex-wrap:wrap; gap:18px; }
        .careerlens-home .cl-footer-links a:hover { color:var(--cl-accent); }
        @media (max-width: 900px) {
          .careerlens-home .cl-hero { padding-top:70px; }
          .careerlens-home .cl-hero-grid { grid-template-columns:1fr; gap:42px; max-width:700px; }
          .careerlens-home .cl-hero-copy { max-width:650px; }
          .careerlens-home .cl-hero-desc { max-width:610px; }
          .careerlens-home .cl-upload-card { max-width:650px; width:100%; }
          .careerlens-home .cl-section { padding:78px 0; }
          .careerlens-home .cl-trust-grid { grid-template-columns:repeat(2,1fr); }
          .careerlens-home .cl-steps-grid { gap:13px; }
          .careerlens-home .cl-step-card { padding:21px; }
        }
        @media (max-width: 680px) {
          .careerlens-home .cl-container { width:calc(100% - 32px); }
          .careerlens-home .cl-nav-wrap { height:67px; }
          .careerlens-home .cl-nav-links { display:none; }
          .careerlens-home .cl-nav-actions { gap:7px; }
          .careerlens-home .cl-signin { display:none; }
          .careerlens-home .cl-menu-btn { display:grid; }
          .careerlens-home .cl-mobile-menu {
            display:flex; flex-direction:column; gap:5px;
            position:absolute; top:66px; left:0; right:0; z-index:55;
            padding:13px 16px 17px; border-bottom:1px solid var(--cl-border);
            background:var(--cl-bg); box-shadow:0 18px 25px rgba(0,0,0,.12);
          }
          .careerlens-home .cl-mobile-menu a { padding:13px 10px; border-radius:9px; color:var(--cl-muted); font-size:13px; font-weight:700; }
          .careerlens-home .cl-mobile-menu a:hover { background:var(--cl-accent-soft); color:var(--cl-text); }
          .careerlens-home .cl-mobile-menu .cl-mobile-auth { margin-top:7px; text-align:center; color:white; background:linear-gradient(135deg,#9a76ef,#7143cf); }
          .careerlens-home .cl-logo { width:36px; height:36px; border-radius:11px; }
          .careerlens-home .cl-brand-name { font-size:17px; }
          .careerlens-home .cl-hero { padding:60px 0 48px; }
          .careerlens-home .cl-hero-grid { gap:34px; }
          .careerlens-home .cl-hero h1 { font-size:clamp(39px,10vw,54px); letter-spacing:-2.3px; margin-top:21px; }
          .careerlens-home .cl-hero-desc { font-size:14px; }
          .careerlens-home .cl-hero-actions { align-items:stretch; }
          .careerlens-home .cl-hero-actions a { flex:1; }
          .careerlens-home .cl-hero-actions a > button,.careerlens-home .cl-hero-actions > button { width:100%; }
          .careerlens-home .cl-hero-note { gap:11px; }
          .careerlens-home .cl-upload-card { padding:19px; border-radius:19px; }
          .careerlens-home .cl-upload-top h3 { font-size:20px; }
          .careerlens-home .cl-dropzone { min-height:190px; padding:18px; }
          .careerlens-home .cl-upload-trust { font-size:9px; }
          .careerlens-home .cl-trust-grid { gap:18px 8px; padding:21px 0; }
          .careerlens-home .cl-trust-item { justify-content:flex-start; font-size:10px; }
          .careerlens-home .cl-section { padding:66px 0; }
          .careerlens-home .cl-section-heading { margin-bottom:32px; }
          .careerlens-home .cl-section-heading h2 { font-size:32px; letter-spacing:-1.2px; }
          .careerlens-home .cl-section-heading p { font-size:12px; }
          .careerlens-home .cl-features-grid { grid-template-columns:1fr; gap:13px; }
          .careerlens-home .cl-feature-card { padding:22px; }
          .careerlens-home .cl-feature-card h3 { margin-top:18px; }
          .careerlens-home .cl-steps-grid { grid-template-columns:1fr; gap:13px; }
          .careerlens-home .cl-step-card { padding:23px; }
          .careerlens-home .cl-step-card h3 { margin-top:17px; }
          .careerlens-home .cl-builder-card { grid-template-columns:1fr; gap:22px; margin-top:40px; padding:23px; }
          .careerlens-home .cl-builder-card h3 { font-size:20px; }
          .careerlens-home .cl-builder-card > a { width:100%; }
          .careerlens-home .cl-builder-card > a button { width:100%; }
          .careerlens-home .cl-pricing-grid { grid-template-columns:1fr; gap:15px; }
          .careerlens-home .cl-price-card { padding:25px; }
          .careerlens-home .cl-cta { padding:10px 0 65px; }
          .careerlens-home .cl-cta-panel { padding:46px 21px; border-radius:20px; }
          .careerlens-home .cl-cta-panel h2 { font-size:32px; letter-spacing:-1.2px; }
          .careerlens-home .cl-footer-top { flex-direction:column; align-items:flex-start; }
          .careerlens-home .cl-footer-bottom { flex-direction:column; }
        }
        @media (prefers-reduced-motion: reduce) {
          .careerlens-home *, .careerlens-home *::before, .careerlens-home *::after { animation-duration:.01ms!important; transition-duration:.01ms!important; scroll-behavior:auto!important; }
        }
      `}</style>

      {/* NAVBAR */}
      <header className="cl-nav-wrap">
        <div className="cl-container cl-navbar">
          <Link to="/" className="cl-brand" onClick={closeMenu}>
            <span className="cl-logo">CL</span>
            <span className="cl-brand-name">
              Career<span>Lens</span>
            </span>
          </Link>

          <nav className="cl-nav-links" aria-label="Main navigation">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="cl-nav-actions">
            <button
              type="button"
              className="cl-theme-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
              title={`Switch to ${isLight ? "dark" : "light"} mode`}
            >
              {isLight ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <Link to="/login" className="cl-signin">
              Sign In
            </Link>

            <Link to="/register">
              <Button className="cl-primary-btn">
                Get Started <ArrowRight size={15} />
              </Button>
            </Link>

            <button
              type="button"
              className="cl-menu-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="cl-mobile-menu"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              ))}

              <Link
                to="/login"
                onClick={closeMenu}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="cl-mobile-auth"
                onClick={closeMenu}
              >
                Create Your Account <ArrowRight size={15} />
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="cl-hero">
        <div className="cl-container cl-hero-grid">
          <motion.div
            className="cl-hero-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="cl-pill">
              <Sparkles size={14} />
              YOUR CAREER, REIMAGINED
            </span>

            <h1>
              Your next career move starts with{" "}
              <span className="cl-gradient-text">CareerLens.</span>
            </h1>

            <p className="cl-hero-desc">
              Make every application count. Get resume insights, understand
              your skill gaps, and prepare for your next opportunity with
              AI-powered career tools.
            </p>

            <div className="cl-hero-actions">
              <Link to="/register">
                <Button className="cl-primary-btn">
                  Start for Free <ArrowRight size={16} />
                </Button>
              </Link>

              <a href="#features" className="cl-secondary-btn">
                Explore Features <ChevronRight size={16} />
              </a>
            </div>

            <div className="cl-hero-note">
              <span>
                <CheckCircle2 size={14} /> Career-focused insights
              </span>
              <span>
                <ShieldCheck size={14} /> Secure account access
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
          >
            <ResumeDropzone isLight={isLight} />
          </motion.div>
        </div>
      </section>

      {/* TRUST / BENEFITS */}
      <div className="cl-trust-strip">
        <div className="cl-container cl-trust-grid">
          <div className="cl-trust-item">
            <BrainCircuit size={19} /> AI-assisted insights
          </div>
          <div className="cl-trust-item">
            <Target size={19} /> Targeted job matching
          </div>
          <div className="cl-trust-item">
            <ShieldCheck size={19} /> Privacy-conscious design
          </div>
          <div className="cl-trust-item">
            <Zap size={19} /> Practical career guidance
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <Section id="features">
        <SectionHeading
          eyebrow="Powerful career tools"
          title={
            <>
              Everything you need to{" "}
              <span className="cl-gradient-text">move forward.</span>
            </>
          }
          description="From your first resume review to interview preparation, CareerLens helps you focus on what matters in your job search."
        />

        <div className="cl-features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                className="cl-feature-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.07 }}
              >
                <div className="cl-feature-top">
                  <span className="cl-feature-icon">
                    <Icon size={23} />
                  </span>
                  <span className="cl-feature-tag">{feature.tag}</span>
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <section className="cl-how" id="how-it-works">
        <div className="cl-container cl-section">
          <SectionHeading
            eyebrow="Simple by design"
            title={
              <>
                Three steps. A{" "}
                <span className="cl-gradient-text">clearer direction.</span>
              </>
            }
            description="Get started with a simple workflow designed to help you understand your resume and make better-informed career decisions."
          />

          <div className="cl-steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.article
                  key={step.number}
                  className="cl-step-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  <div className="cl-step-number">
                    <span>STEP {step.number}</span>
                    <Icon size={22} />
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </motion.article>
              );
            })}
          </div>

          {/* FREE RESUME BUILDER */}
          <div className="cl-builder-card">
            <div>
              <span className="cl-builder-badge">
                <Sparkles size={14} /> NEED A RESUME FIRST?
              </span>

              <h3>Build a resume you feel confident sharing.</h3>

              <p>
                Start with a resume builder, then bring your resume to
                CareerLens for further improvement and job preparation.
              </p>
            </div>

            <a
              href="https://flowcv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="cl-primary-btn"
            >
              Try FlowCV <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* WHY CAREERLENS */}
      <Section>
        <div className="cl-hero-grid">
          <div>
            <span className="cl-eyebrow">Built around your goals</span>

            <h2
              style={{
                fontSize: "clamp(30px, 4vw, 43px)",
                lineHeight: 1.17,
                letterSpacing: "-1.5px",
                margin: "0 0 18px",
              }}
            >
              Less guessing.
              <br />
              <span className="cl-gradient-text">More career clarity.</span>
            </h2>

            <p
              style={{
                color: "var(--cl-muted)",
                fontSize: 13,
                lineHeight: 1.9,
                maxWidth: 510,
              }}
            >
              Your next opportunity deserves more than a generic resume.
              CareerLens is designed to help you identify what to improve,
              understand role requirements, and prepare with a clearer plan.
            </p>

            <div style={{ display: "grid", gap: 15, marginTop: 26 }}>
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    fontSize: 12,
                    fontWeight: 650,
                  }}
                >
                  <span
                    style={{
                      width: 25,
                      height: 25,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 8,
                      color: "var(--cl-accent)",
                      background: "var(--cl-accent-soft)",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={15} />
                  </span>
                  {benefit}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <Link to="/register" className="cl-primary-btn">
                Start Your Journey <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 15,
              alignContent: "center",
            }}
          >
            {[
              {
                icon: FileText,
                title: "A stronger resume",
                text: "Understand how to improve the presentation of your skills and experience.",
              },
              {
                icon: BriefcaseBusiness,
                title: "A more focused job search",
                text: "Compare your current profile with the requirements of your target roles.",
              },
              {
                icon: Award,
                title: "Better preparation",
                text: "Build confidence with practical guidance for applications and interviews.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    gap: 17,
                    padding: 22,
                    border: "1px solid var(--cl-border)",
                    borderRadius: 17,
                    background: "var(--cl-card)",
                  }}
                >
                  <span className="cl-feature-icon">
                    <Icon size={22} />
                  </span>

                  <div>
                    <h3 style={{ fontSize: 15, margin: "2px 0 7px" }}>
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 11,
                        lineHeight: 1.8,
                        color: "var(--cl-muted)",
                        margin: 0,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <section id="pricing" style={{ background: "var(--cl-bg-alt)" }}>
        <div className="cl-container cl-section">
          <SectionHeading
            eyebrow="Simple pricing"
            title={
              <>
                Invest in your{" "}
                <span className="cl-gradient-text">next step.</span>
              </>
            }
            description="Start exploring CareerLens and choose the plan that suits your career goals."
          />

          <div className="cl-pricing-grid">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`cl-price-card ${
                  plan.featured ? "cl-price-featured" : ""
                }`}
              >
                {plan.featured && (
                  <span className="cl-popular">PRO PLAN</span>
                )}

                <span className="cl-plan-name">{plan.name}</span>

                <div className="cl-price">
                  <strong>{plan.price}</strong>
                  {plan.suffix && <span>{plan.suffix}</span>}
                </div>

                <p className="cl-plan-description">{plan.description}</p>

                <div className="cl-plan-divider" />

                <ul className="cl-plan-features">
                  {plan.features.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={16} />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.featured ? "/pricing" : "/register"}
                  className={
                    plan.featured
                      ? "cl-primary-btn"
                      : "cl-secondary-btn"
                  }
                >
                  {plan.cta} <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>

          <p
            style={{
              color: "var(--cl-muted)",
              textAlign: "center",
              fontSize: 10,
              lineHeight: 1.7,
              marginTop: 24,
            }}
          >
            Features and subscription benefits are subject to your configured
            plan. Check the pricing page for current details.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cl-cta">
        <div className="cl-container">
          <motion.div
            className="cl-cta-panel"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="cl-eyebrow">Your next chapter starts here</span>

            <h2>
              Ready to see your resume through a{" "}
              <span className="cl-gradient-text">new lens?</span>
            </h2>

            <p>
              Take the first step toward a more focused job search with
              CareerLens.
            </p>

            <Link to="/register" className="cl-primary-btn">
              Get Started for Free <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cl-footer">
        <div className="cl-container">
          <div className="cl-footer-top">
            <div>
              <Link to="/" className="cl-brand">
                <span className="cl-logo">CL</span>
                <span className="cl-brand-name">
                  Career<span>Lens</span>
                </span>
              </Link>

              <p className="cl-footer-copy">
                Helping you understand your resume, discover opportunities,
                and move forward with greater career clarity.
              </p>
            </div>

            <div className="cl-socials">
              <a
                href="https://github.com/Shubham-kesharwani7223"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={17} />
              </a>

              <a
                href="https://www.linkedin.com/in/shubham-kesharwani7223"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={17} />
              </a>
            </div>
          </div>

          <div className="cl-footer-bottom">
            <span>
              © {new Date().getFullYear()} CareerLens. All rights reserved.
            </span>

            <div className="cl-footer-links">
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <Link to="/pricing">Pricing</Link>
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}