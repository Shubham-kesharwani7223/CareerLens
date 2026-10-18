import apiClient from "./client";
export const resumeApi = {
    upload: async (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        const response = await apiClient.post("/resume/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
    getHistory: async () => {
        const response = await apiClient.get("/resume/history");
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/resume/${id}`);
        return response.data;
    },
    delete: async (id) => {
        await apiClient.delete(`/resume/${id}`);
    },
    analyze: async (resumeId) => {
        const response = await apiClient.post("/analysis/score", {
            resumeId,
        });
        return response.data;
    },
    matchJob: async (resumeId, jobDescription) => {
        const response = await apiClient.post("/analysis/job-match", {
            resumeId,
            jobDescription,
        });
        return response.data;
    },
    matchUrl: async (resumeId, jobUrl) => {
        const response = await apiClient.post("/analysis/match-url", { resumeId, jobUrl });
        return response.data;
    },
    interviewPredictor: async (resumeId, jobDescription) => {
        const response = await apiClient.post("/analysis/interview-predictor", { resumeId, jobDescription });
        return response.data;
    },
    getInterviewQuestions: async (resumeId) => {
        const response = await apiClient.post("/analysis/interview-questions", { resumeId });
        return response.data;
    },
    getSmartFeedback: async (resumeId) => {
        const response = await apiClient.post("/analysis/smart-feedback", { resumeId });
        return response.data;
    },
    rewriteBulletPoint: async (text) => {
        const response = await apiClient.post("/analysis/rewrite", { text });
        return response.data;
    },
    analyzeSections: async (resumeId) => {
        const response = await apiClient.post("/analysis/sections", { resumeId });
        return response.data;
    },
    generateContent: async (resumeId, jobDescription, type) => {
        const response = await apiClient.post("/analysis/generate-content", { resumeId, jobDescription, type });
        return response.data;
    },
    detectIndustry: async (resumeId) => {
        const response = await apiClient.post("/analysis/detect-industry", { resumeId });
        return response.data;
    },
    analyzeReadability: async (resumeId) => {
        const response = await apiClient.post("/analysis/readability", { resumeId });
        return response.data;
    },
    compareResumes: async (oldResumeId, newResumeId) => {
        const response = await apiClient.post("/analysis/compare", { oldResumeId, newResumeId });
        return response.data;
    },
    getCareerGrowth: async (resumeId) => {
        const response = await apiClient.post("/analysis/career-growth", { resumeId });
        return response.data;
    },
    suggestProjects: async (resumeId) => {
        const response = await apiClient.post("/analysis/suggest-projects", { resumeId });
        return response.data;
    },
    evaluateAnswer: async (resumeId, question, answer) => {
        const response = await apiClient.post("/analysis/evaluate-answer", { resumeId, question, answer });
        return response.data;
    },
    chat: async (resumeId, question, history) => {
        const response = await apiClient.post("/analysis/chat", { resumeId, question, history });
        return response.data;
    },
    getResumePreview: async (resumeId) => {
        const response = await apiClient.post("/analysis/resume-preview", { resumeId });
        return response.data;
    },
    getHiringProbability: async (resumeId) => {
        const response = await apiClient.post("/analysis/hiring-probability", { resumeId });
        return response.data;
    },
    getGlobalBenchmark: async (resumeId) => {
        const response = await apiClient.post("/analysis/global-benchmark", { resumeId });
        return response.data;
    },
    getBadges: async (resumeId) => {
        const response = await apiClient.post("/analysis/badges", { resumeId });
        return response.data;
    },
};
