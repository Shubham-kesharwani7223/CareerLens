import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import ReactGA from "react-ga4";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, Loader2, User, Briefcase, ShieldCheck, FileCheck2, ArrowRight, } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resumeApi } from "@/api/resume";
import { SAMPLE_RESUMES } from "@/data/sampleResumes";
export function UploadResumePage() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loadingSample, setLoadingSample] = useState(null);
    const handleSample = (sample) => {
        if (loadingSample || isUploading || isAnalyzing)
            return;
        ReactGA.event({
            category: "Resume Features",
            action: "View_Sample_CV",
            label: `Sample: ${sample.name}`,
        });
        setLoadingSample(sample.id);
        toast.loading(`Loading ${sample.name}'s analysis...`, {
            id: "sample",
        });
        setTimeout(() => {
            setLoadingSample(null);
            toast.success("Viewing sample analysis. Upload your own CV to get personalized insights!", { id: "sample", duration: 5000 });
            navigate(`/analysis?resumeId=${sample.id}&sample=true`, {
                state: { sampleData: sample },
            });
        }, 1200);
    };
    const onDrop = useCallback((acceptedFiles) => {
        setUploadError("");
        setUploadProgress(0);
        const selectedFile = acceptedFiles[0];
        if (!selectedFile)
            return;
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const extension = selectedFile.name.split(".").pop()?.toLowerCase();
        const validExtension = extension === "pdf" || extension === "docx";
        if (!allowedTypes.includes(selectedFile.type) || !validExtension) {
            setUploadError("Please select a valid PDF or DOCX resume.");
            toast.error("Unsupported file type", {
                description: "CareerLens accepts PDF and DOCX files only.",
            });
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setUploadError("Your file is larger than 5MB.");
            toast.error("File too large", {
                description: "Please upload a file smaller than 5MB.",
            });
            return;
        }
        setFile(selectedFile);
        toast.success("Resume ready to upload", {
            description: selectedFile.name,
        });
    }, []);
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        multiple: false,
        noClick: true,
        noKeyboard: true,
    });
    const handleUpload = async () => {
        if (!file || isUploading || isAnalyzing)
            return;
        ReactGA.event({
            category: "Resume Features",
            action: "Upload_Personal_CV",
            label: `File Type: ${file.type}`,
        });
        setIsUploading(true);
        setUploadError("");
        setUploadProgress(0);
        const progressInterval = window.setInterval(() => {
            setUploadProgress((previous) => {
                if (previous >= 90) {
                    window.clearInterval(progressInterval);
                    return 90;
                }
                return previous + 10;
            });
        }, 200);
        try {
            const resume = await resumeApi.upload(file);
            window.clearInterval(progressInterval);
            setUploadProgress(100);
            setIsUploading(false);
            setIsAnalyzing(true);
            toast.success("Resume uploaded successfully!", {
                description: "CareerLens is preparing your AI analysis.",
            });
            try {
                await resumeApi.analyze(resume.id);
                ReactGA.event({
                    category: "AI Analysis",
                    action: "Analysis_Complete",
                    label: "Resume successfully processed by AI",
                });
                toast.success("Analysis complete!", {
                    description: "Opening your personalized resume insights.",
                });
            }
            catch (analysisError) {
                const error = analysisError;
                const message = error.response?.data?.message ||
                    "Your resume was uploaded, but analysis could not complete. You can retry from the Analysis page.";
                toast.error(message, { id: "upload-analyze" });
            }
            window.setTimeout(() => {
                navigate(`/analysis?resumeId=${resume.id}`);
            }, 1000);
        }
        catch (uploadError) {
            window.clearInterval(progressInterval);
            setUploadProgress(0);
            const error = uploadError;
            const message = error.response?.data?.message ||
                "Upload failed. Please check your connection and try again.";
            setUploadError(message);
            toast.error("Resume upload failed", { description: message });
        }
        finally {
            setIsUploading(false);
            setIsAnalyzing(false);
        }
    };
    const removeFile = () => {
        if (isUploading || isAnalyzing)
            return;
        setFile(null);
        setUploadError("");
        setUploadProgress(0);
    };
    const busy = isUploading || isAnalyzing;
    return (_jsxs("div", { className: "mx-auto w-full max-w-5xl space-y-7 rounded-2xl bg-[#f7f0e5] p-1 text-[#29182f] dark:bg-[#090811] dark:text-[#fbf7ff]", children: [_jsxs(motion.section, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 }, className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "mb-2 inline-flex items-center gap-2 rounded-full border border-[#e4d6dc] bg-[#fffaf2] px-3 py-1.5 text-xs font-semibold text-[#79557e] dark:border-[#49344f] dark:bg-[#17101d] dark:text-[#e0cce6]", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5 text-[#b18a36] dark:text-[#e5c16e]" }), "CAREERLENS WORKSPACE"] }), _jsx("h1", { className: "text-2xl font-bold tracking-tight text-[#29182f] dark:text-[#fbf7ff] sm:text-3xl", children: "Upload Your Resume" }), _jsx("p", { className: "mt-2 max-w-2xl text-sm leading-6 text-[#796a7d] dark:text-[#c5b8ce] sm:text-base", children: "Turn your resume into a clearer career roadmap with AI-powered insights, ATS scoring, and personalized recommendations." })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2 self-start rounded-xl border border-[#e4d6dc] bg-[#fffaf2] px-3 py-2.5 text-xs font-medium text-[#796a7d] dark:border-[#49344f] dark:bg-[#17101d] dark:text-[#c5b8ce] sm:self-auto", children: [_jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }), "Private and secure"] })] }), _jsx(motion.section, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.05 }, children: _jsxs(Card, { className: "overflow-hidden rounded-2xl border border-[#e4d6dc] bg-[#fffaf2] text-[#29182f] shadow-sm dark:border-[#3c2b43] dark:bg-[#17101d] dark:text-[#fbf7ff]", children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsxs(CardTitle, { className: "flex items-center gap-3 text-xl text-[#29182f] dark:text-[#fbf7ff]", children: [_jsx("span", { className: "flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4ead3] text-[#9b7628] dark:bg-[#b18a36]/15 dark:text-[#e5c16e]", children: _jsx(FileText, { className: "h-5 w-5" }) }), "Resume File"] }), _jsx("p", { className: "pl-14 text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: "Choose the latest version of your resume to get started." })] }), _jsxs(CardContent, { className: "space-y-5", children: [_jsxs("div", { ...getRootProps(), className: `group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-all duration-200 sm:min-h-[245px] ${isDragActive
                                        ? "scale-[1.01] border-[#89658a] bg-[#f0e4f1] dark:border-[#c49bca] dark:bg-[#76577c]/15"
                                        : "border-[#d8cbd9] bg-[#fcf6ed] hover:border-[#a17da5] hover:bg-[#f8f0f5] dark:border-[#49344f] dark:bg-[#120d17] dark:hover:border-[#89658a] dark:hover:bg-[#211626]"}`, onClick: open, children: [_jsx("input", { ...getInputProps() }), _jsx(motion.div, { animate: isDragActive ? { scale: 1.08, y: -3 } : { scale: 1, y: 0 }, transition: { type: "spring", stiffness: 300, damping: 20 }, className: `mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${isDragActive
                                                ? "bg-[#89658a] text-white"
                                                : "bg-[#eee3ef] text-[#89618c] dark:bg-[#76577c]/20 dark:text-[#d5b6df]"}`, children: _jsx(Upload, { className: "h-8 w-8", strokeWidth: 1.8 }) }), isDragActive ? (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-lg font-semibold text-[#694969] dark:text-[#e0cce6]", children: "Drop your resume here" }), _jsx("p", { className: "mt-1 text-sm text-[#796a7d] dark:text-[#c5b8ce]", children: "Release to select your file" })] })) : (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-base text-[#44334b] dark:text-[#f0e8f5] sm:text-lg", children: [_jsx("button", { type: "button", onClick: (event) => {
                                                                event.stopPropagation();
                                                                open();
                                                            }, className: "font-semibold text-[#79557e] underline-offset-4 hover:underline dark:text-[#d5b6df]", children: "Click to upload" }), " ", "or drag and drop"] }), _jsx("p", { className: "mt-2 text-sm text-[#796a7d] dark:text-[#b9a9c2]", children: "PDF or DOCX \u00B7 Maximum file size 5MB" }), _jsxs("div", { className: "mt-5 flex flex-wrap items-center justify-center gap-2", children: [_jsx("span", { className: "rounded-lg border border-[#e4d6dc] bg-[#fffaf2] px-3 py-1 text-xs font-medium text-[#796a7d] dark:border-[#49344f] dark:bg-[#17101d] dark:text-[#c5b8ce]", children: ".PDF" }), _jsx("span", { className: "rounded-lg border border-[#e4d6dc] bg-[#fffaf2] px-3 py-1 text-xs font-medium text-[#796a7d] dark:border-[#49344f] dark:bg-[#17101d] dark:text-[#c5b8ce]", children: ".DOCX" })] })] }))] }), _jsx(AnimatePresence, { children: file && (_jsx(motion.div, { initial: { opacity: 0, height: 0, y: -8 }, animate: { opacity: 1, height: "auto", y: 0 }, exit: { opacity: 0, height: 0, y: -8 }, className: "overflow-hidden", children: _jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-[#d7c6d9] bg-[#f5edf5] p-3 dark:border-[#49344f] dark:bg-[#211626] sm:p-4", children: [_jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8dce9] text-[#79557e] dark:bg-[#76577c]/25 dark:text-[#d5b6df]", children: _jsx(FileCheck2, { className: "h-5 w-5" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "break-all text-sm font-semibold text-[#29182f] dark:text-[#fbf7ff]", children: file.name }), _jsxs("p", { className: "mt-1 text-xs text-[#796a7d] dark:text-[#c5b8ce]", children: [(file.size / 1024 / 1024).toFixed(2), " MB \u00B7 Ready for analysis"] })] }), _jsx("button", { type: "button", "aria-label": "Remove selected file", disabled: busy, onClick: (event) => {
                                                        event.stopPropagation();
                                                        removeFile();
                                                    }, className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#796a7d] transition hover:bg-white hover:text-red-600 disabled:opacity-40 dark:text-[#c5b8ce] dark:hover:bg-white/10 dark:hover:text-red-400", children: _jsx(X, { className: "h-4 w-4" }) })] }) })) }), _jsx(AnimatePresence, { children: busy && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: "auto" }, exit: { opacity: 0, height: 0 }, className: "space-y-3 overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 text-sm", children: [_jsxs("span", { className: "flex items-center gap-2 font-medium text-[#694969] dark:text-[#e0cce6]", children: [isAnalyzing ? (_jsx(Sparkles, { className: "h-4 w-4 animate-pulse text-[#b18a36] dark:text-[#e5c16e]" })) : (_jsx(Loader2, { className: "h-4 w-4 animate-spin text-[#89658a] dark:text-[#d5b6df]" })), isAnalyzing
                                                                ? "Analyzing your resume..."
                                                                : "Uploading your resume..."] }), _jsx("span", { className: "shrink-0 font-semibold text-[#79557e] dark:text-[#d5b6df]", children: isAnalyzing ? "Processing" : `${uploadProgress}%` })] }), _jsx("div", { className: "h-2 overflow-hidden rounded-full bg-[#e9dfe8] dark:bg-[#3c2b43]", children: _jsx(motion.div, { className: "h-full rounded-full bg-gradient-to-r from-[#694969] via-[#89658a] to-[#c6a05a]", initial: { width: 0 }, animate: {
                                                        width: isAnalyzing ? "100%" : `${uploadProgress}%`,
                                                    }, transition: {
                                                        duration: isAnalyzing ? 1.5 : 0.25,
                                                        ease: "easeInOut",
                                                    } }) })] })) }), _jsx(AnimatePresence, { children: uploadError && (_jsxs(motion.div, { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, className: "flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300", children: [_jsx(AlertCircle, { className: "mt-0.5 h-4 w-4 shrink-0" }), _jsx("p", { children: uploadError })] })) }), _jsx(AnimatePresence, { children: uploadProgress === 100 && !busy && !uploadError && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, className: "flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-300", children: [_jsx(CheckCircle2, { className: "h-5 w-5 shrink-0" }), "Resume uploaded successfully. Opening your analysis..."] })) }), _jsxs(Button, { type: "button", className: "h-12 w-full gap-2 rounded-xl border border-[#89658a] bg-gradient-to-r from-[#694969] to-[#89658a] text-sm font-semibold text-white shadow-lg shadow-[#694969]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50", disabled: !file || busy, isLoading: busy, onClick: handleUpload, children: [isAnalyzing ? (_jsx(Sparkles, { className: "h-4 w-4" })) : (_jsx(Upload, { className: "h-4 w-4" })), isAnalyzing
                                            ? "Analyzing Resume..."
                                            : isUploading
                                                ? "Uploading Resume..."
                                                : "Upload & Analyze"] }), _jsxs("p", { className: "flex items-center justify-center gap-2 text-center text-xs text-[#8b7b90] dark:text-[#aa9bb4]", children: [_jsx(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0" }), "Your resume is processed to generate personalized career insights."] })] })] }) }), _jsxs(motion.section, { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: 0.1 }, className: "space-y-4", children: [_jsxs("div", { className: "relative flex items-center justify-center py-1", children: [_jsx("div", { className: "absolute inset-x-0 top-1/2 border-t border-[#e4d6dc] dark:border-[#3c2b43]" }), _jsx("span", { className: "relative bg-[#f7f0e5] px-4 text-xs font-bold uppercase tracking-[0.16em] text-[#9b8a9e] dark:bg-[#090811] dark:text-[#aa9bb4]", children: "Or explore a sample" })] }), _jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: SAMPLE_RESUMES.map((sample) => {
                            const isSampleLoading = loadingSample === sample.id;
                            return (_jsxs(motion.button, { type: "button", onClick: () => handleSample(sample), disabled: !!loadingSample || busy, whileHover: { y: -2 }, whileTap: { scale: 0.99 }, className: `group flex min-w-0 items-center gap-3 rounded-2xl border p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:p-5 ${isSampleLoading
                                    ? "border-[#89658a] bg-[#f0e4f1] dark:border-[#89658a] dark:bg-[#211626]"
                                    : "border-[#e4d6dc] bg-[#fffaf2] hover:border-[#b99ab9] hover:bg-[#f8f0f5] dark:border-[#3c2b43] dark:bg-[#17101d] dark:hover:border-[#89658a] dark:hover:bg-[#211626]"}`, children: [_jsx("div", { className: `flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${sample.role.includes("Marketing")
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300"
                                            : "bg-purple-100 text-purple-700 dark:bg-purple-400/15 dark:text-purple-300"}`, children: isSampleLoading ? (_jsx(Loader2, { className: "h-5 w-5 animate-spin" })) : sample.role.includes("Marketing") ? (_jsx(Briefcase, { className: "h-5 w-5" })) : (_jsx(User, { className: "h-5 w-5" })) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "truncate text-sm font-semibold text-[#29182f] dark:text-[#fbf7ff] sm:text-base", children: [sample.emoji, " ", sample.name] }), _jsxs("p", { className: "mt-1 text-xs leading-5 text-[#796a7d] dark:text-[#c5b8ce] sm:text-sm", children: [sample.role, " ", _jsx("span", { "aria-hidden": "true", children: "\u00B7" }), " ", sample.years] })] }), _jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-[#89658a] transition-transform group-hover:translate-x-1 dark:text-[#d5b6df]" })] }, sample.id));
                        }) })] }), _jsx(motion.section, { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay: 0.15 }, children: _jsx(Card, { className: "overflow-hidden rounded-2xl border border-[#e4d6dc] bg-gradient-to-br from-[#fffaf2] to-[#f4eaf2] text-[#29182f] shadow-sm dark:border-[#3c2b43] dark:from-[#17101d] dark:to-[#211626] dark:text-[#fbf7ff]", children: _jsxs(CardContent, { className: "p-5 sm:p-6", children: [_jsxs("div", { className: "mb-5 flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-5 w-5 text-[#b18a36] dark:text-[#e5c16e]" }), _jsx("h2", { className: "font-semibold text-[#29182f] dark:text-[#fbf7ff]", children: "How CareerLens works" })] }), _jsx("div", { className: "grid gap-5 sm:grid-cols-3 sm:gap-4", children: [
                                    {
                                        step: "01",
                                        title: "Upload Resume",
                                        description: "Select your PDF or DOCX file.",
                                        icon: Upload,
                                    },
                                    {
                                        step: "02",
                                        title: "AI Analysis",
                                        description: "Get an ATS score and resume insights.",
                                        icon: Sparkles,
                                    },
                                    {
                                        step: "03",
                                        title: "Improve & Grow",
                                        description: "Use recommendations to plan your next move.",
                                        icon: CheckCircle2,
                                    },
                                ].map((item) => (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eee3ef] text-[#79557e] dark:bg-[#76577c]/20 dark:text-[#d5b6df]", children: _jsx(item.icon, { className: "h-5 w-5" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "text-sm font-semibold text-[#29182f] dark:text-[#fbf7ff]", children: [_jsx("span", { className: "mr-2 text-xs font-bold text-[#a17da5] dark:text-[#c49bca]", children: item.step }), item.title] }), _jsx("p", { className: "mt-1 text-xs leading-5 text-[#796a7d] dark:text-[#c5b8ce]", children: item.description })] })] }, item.step))) })] }) }) })] }));
}
