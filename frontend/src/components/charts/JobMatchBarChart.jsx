import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from "recharts";
import { getScoreColor } from "@/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RechartsSafeContainer } from "@/components/charts/RechartsSafeContainer";
export function JobMatchBarChart({ skillMatch, experienceMatch, educationMatch, overallScore, }) {
    const data = [
        { name: "Skills", score: skillMatch },
        { name: "Experience", score: experienceMatch },
        { name: "Education", score: educationMatch },
        { name: "Overall", score: overallScore },
    ];
    const hasData = data.some((d) => d.score > 0);
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Job Match Breakdown" }) }), _jsx(CardContent, { children: _jsx(RechartsSafeContainer, { empty: !hasData, emptyMessage: "No match scores to chart \u2014 run a job match after analyzing your resume.", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 200, minHeight: 200, children: _jsxs(BarChart, { data: data, barCategoryGap: "20%", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), _jsx(XAxis, { dataKey: "name", tick: { fill: "#6b7280", fontSize: 12 }, axisLine: { stroke: "#e5e7eb" } }), _jsx(YAxis, { domain: [0, 100], tick: { fill: "#9ca3af", fontSize: 12 }, axisLine: { stroke: "#e5e7eb" } }), _jsx(Tooltip, { contentStyle: {
                                        backgroundColor: "#1f2937",
                                        border: "none",
                                        borderRadius: "8px",
                                        color: "#fff",
                                    } }), _jsx(Bar, { dataKey: "score", radius: [6, 6, 0, 0], children: data.map((entry, index) => (_jsx(Cell, { fill: getScoreColor(entry.score) }, index))) })] }) }) }) })] }));
}
