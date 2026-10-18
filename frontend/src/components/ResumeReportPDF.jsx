import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
/**
 * Hidden, light-themed A4 report template.
 * Rendered off-screen and captured by html2canvas → jsPDF.
 * Uses inline styles to guarantee white background regardless of app theme.
 */
export const ResumeReportPDF = forwardRef(({ atsScore, analysis, fileName, candidateName }, ref) => {
    const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const scoreColor = atsScore >= 80
        ? "#16a34a"
        : atsScore >= 60
            ? "#65a30d"
            : atsScore >= 40
                ? "#ca8a04"
                : "#dc2626";
    const scoreLabel = atsScore >= 80
        ? "Excellent"
        : atsScore >= 60
            ? "Good"
            : atsScore >= 40
                ? "Average"
                : "Needs Improvement";
    const sections = [
        { label: "Skills", score: analysis.skillsScore },
        { label: "Experience", score: analysis.experienceScore },
        { label: "Education", score: analysis.educationScore },
        { label: "Projects", score: analysis.projectsScore },
    ];
    return (_jsxs("div", { ref: ref, style: {
            position: "absolute",
            left: "-9999px",
            top: 0,
            width: "794px", // A4 width at 96 DPI
            backgroundColor: "#ffffff",
            color: "#1f2937",
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            fontSize: "14px",
            lineHeight: 1.6,
            padding: 0,
            margin: 0,
        }, children: [_jsx("div", { style: {
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)",
                    padding: "32px 40px",
                    color: "#ffffff",
                }, children: _jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: "24px", fontWeight: 800, letterSpacing: "-0.5px" }, children: "ResumeAI Analyzer" }), _jsx("div", { style: { fontSize: "13px", opacity: 0.85, marginTop: "4px" }, children: "AI-Powered Resume Analysis Report" })] }), _jsxs("div", { style: { textAlign: "right", fontSize: "12px", opacity: 0.9 }, children: [_jsx("div", { children: date }), _jsx("div", { style: { marginTop: "2px" }, children: "Confidential" })] })] }) }), _jsxs("div", { style: {
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "16px 40px",
                    display: "flex",
                    gap: "32px",
                    fontSize: "13px",
                }, children: [_jsxs("div", { children: [_jsx("span", { style: { color: "#94a3b8" }, children: "Candidate: " }), _jsx("span", { style: { fontWeight: 600, color: "#1e293b" }, children: candidateName })] }), _jsxs("div", { children: [_jsx("span", { style: { color: "#94a3b8" }, children: "Resume: " }), _jsx("span", { style: { fontWeight: 600, color: "#1e293b" }, children: fileName })] })] }), _jsxs("div", { style: { padding: "32px 40px 40px" }, children: [_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "24px",
                            marginBottom: "32px",
                            padding: "24px",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            background: "#fafbff",
                        }, children: [_jsxs("div", { style: {
                                    width: "90px",
                                    height: "90px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: scoreColor,
                                    color: "#fff",
                                    flexShrink: 0,
                                }, children: [_jsxs("div", { style: { fontSize: "28px", fontWeight: 800, lineHeight: 1 }, children: [atsScore, "%"] }), _jsx("div", { style: { fontSize: "10px", opacity: 0.9, marginTop: "2px" }, children: "ATS Score" })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: "20px", fontWeight: 700, color: scoreColor }, children: scoreLabel }), _jsx("div", { style: { fontSize: "13px", color: "#64748b", marginTop: "4px" }, children: "Your resume's overall ATS compatibility rating based on skills, experience, education, and project sections." })] })] }), _jsxs("div", { style: { marginBottom: "28px" }, children: [_jsx("div", { style: { fontSize: "16px", fontWeight: 700, marginBottom: "14px", color: "#0f172a" }, children: "\uD83D\uDCCA Section Breakdown" }), _jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }, children: sections.map((s) => {
                                    const barColor = s.score >= 80 ? "#22c55e" : s.score >= 60 ? "#84cc16" : s.score >= 40 ? "#eab308" : "#ef4444";
                                    return (_jsxs("div", { style: {
                                            padding: "14px 16px",
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                            background: "#fff",
                                        }, children: [_jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "8px" }, children: [_jsx("span", { style: { fontWeight: 600, fontSize: "13px" }, children: s.label }), _jsxs("span", { style: { fontWeight: 700, fontSize: "14px", color: barColor }, children: [s.score, "%"] })] }), _jsx("div", { style: {
                                                    height: "6px",
                                                    borderRadius: "3px",
                                                    background: "#f1f5f9",
                                                    overflow: "hidden",
                                                }, children: _jsx("div", { style: {
                                                        height: "100%",
                                                        width: `${s.score}%`,
                                                        borderRadius: "3px",
                                                        backgroundColor: barColor,
                                                    } }) })] }, s.label));
                                }) })] }), _jsxs("div", { style: { marginBottom: "28px" }, children: [_jsxs("div", { style: { fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "#0f172a" }, children: ["\u2705 Keywords Found (", analysis.keywords.filter((k) => !k.startsWith("(")).length, ")"] }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" }, children: analysis.keywords.length > 0 ? (analysis.keywords.map((kw) => (_jsx("span", { style: {
                                        display: "inline-block",
                                        padding: "4px 10px",
                                        borderRadius: "999px",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        backgroundColor: "#dcfce7",
                                        color: "#166534",
                                    }, children: kw }, kw)))) : (_jsx("span", { style: { fontSize: "12px", color: "#94a3b8" }, children: "No keywords detected" })) })] }), _jsxs("div", { style: { marginBottom: "28px" }, children: [_jsxs("div", { style: { fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "#0f172a" }, children: ["\u26A0\uFE0F Missing Keywords (", analysis.missingKeywords.filter((k) => !k.startsWith("(")).length, ")"] }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" }, children: analysis.missingKeywords.length > 0 ? (analysis.missingKeywords.map((kw) => (_jsx("span", { style: {
                                        display: "inline-block",
                                        padding: "4px 10px",
                                        borderRadius: "999px",
                                        fontSize: "11px",
                                        fontWeight: 600,
                                        backgroundColor: "#fef3c7",
                                        color: "#92400e",
                                    }, children: kw }, kw)))) : (_jsx("span", { style: { fontSize: "12px", color: "#94a3b8" }, children: "None \u2014 great keyword coverage!" })) })] }), _jsxs("div", { style: { marginBottom: "24px" }, children: [_jsx("div", { style: { fontSize: "16px", fontWeight: 700, marginBottom: "14px", color: "#0f172a" }, children: "\uD83D\uDCA1 AI Improvement Suggestions" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: analysis.suggestions.map((suggestion, i) => (_jsxs("div", { style: {
                                        display: "flex",
                                        gap: "12px",
                                        padding: "12px 14px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        background: i % 2 === 0 ? "#fafbff" : "#ffffff",
                                    }, children: [_jsx("div", { style: {
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                                color: "#fff",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }, children: i + 1 }), _jsx("div", { style: { fontSize: "12px", lineHeight: 1.6, color: "#374151" }, children: suggestion })] }, i))) })] })] }), _jsxs("div", { style: {
                    padding: "16px 40px",
                    borderTop: "1px solid #e2e8f0",
                    textAlign: "center",
                    fontSize: "10px",
                    color: "#94a3b8",
                }, children: ["Generated by ResumeAI Analyzer \u2014 ", date, " \u2014 This is an AI-generated analysis. Results may vary."] })] }));
});
ResumeReportPDF.displayName = "ResumeReportPDF";
