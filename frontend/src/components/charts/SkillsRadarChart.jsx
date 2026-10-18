import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RechartsSafeContainer } from "@/components/charts/RechartsSafeContainer";
function clampScore(v) {
    const n = Number(v);
    if (!Number.isFinite(n))
        return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}
export function SkillsRadarChart({ skills, experience, education, projects, headlineAts, }) {
    const s = clampScore(skills);
    const e = clampScore(experience);
    const ed = clampScore(education);
    const p = clampScore(projects);
    const ats = headlineAts != null && headlineAts !== undefined ? clampScore(headlineAts) : null;
    const data = [
        { subject: "Skills", score: s, fullMark: 100 },
        { subject: "Experience", score: e, fullMark: 100 },
        { subject: "Education", score: ed, fullMark: 100 },
        { subject: "Projects", score: p, fullMark: 100 },
        ...(ats != null && ats > 0 ? [{ subject: "ATS (overall)", score: ats, fullMark: 100 }] : []),
    ];
    return (_jsxs(Card, { className: "border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/40", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Resume Section Analysis" }) }), _jsx(CardContent, { children: _jsx(RechartsSafeContainer, { empty: false, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 200, minHeight: 240, children: _jsxs(RadarChart, { cx: "50%", cy: "51%", outerRadius: "62%", margin: { top: 28, right: 36, bottom: 28, left: 36 }, data: data, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "radarStroke", x1: "0", y1: "0", x2: "1", y2: "0", children: [_jsx("stop", { offset: "0%", stopColor: "#6366f1" }), _jsx("stop", { offset: "100%", stopColor: "#a855f7" })] }) }), _jsx(PolarGrid, { stroke: "#64748b", strokeOpacity: 0.3, radialLines: false }), _jsx(PolarAngleAxis, { dataKey: "subject", tick: { fill: "#94a3b8", fontSize: 10, fontWeight: 600 }, tickLine: false, tickMargin: 14 }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 100], tickCount: 5, tick: { fill: "#64748b", fontSize: 9 }, axisLine: false }), _jsx(Tooltip, { formatter: (value) => [`${value}%`, "Score"], contentStyle: {
                                        background: "rgba(15, 23, 42, 0.92)",
                                        border: "1px solid rgba(148, 163, 184, 0.35)",
                                        borderRadius: 10,
                                        fontSize: 12,
                                        color: "#e2e8f0",
                                    }, labelStyle: { color: "#cbd5e1", fontWeight: 600 } }), _jsx(Radar, { name: "Section score", dataKey: "score", stroke: "url(#radarStroke)", fill: "rgba(99, 102, 241, 0.2)", fillOpacity: 1, strokeWidth: 2, dot: { r: 4, fill: "#a5b4fc", stroke: "#4f46e5", strokeWidth: 1 }, activeDot: { r: 6 } })] }) }) }) })] }));
}
