"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisController = exports.AnalysisController = void 0;
const cheerio = __importStar(require("cheerio"));
const analysis_service_1 = require("../services/analysis.service");
const analysis_1 = require("../validators/analysis");
const response_1 = require("../helpers/response");
const http_errors_1 = require("../utils/http-errors");
const credits_1 = require("../middlewares/credits");
const JOB_FETCH_TIMEOUT_MS = 12000;
const JOB_FETCH_UA = "Mozilla/5.0 (compatible; CareerLens/1.0)";

async function fetchJobPageHtml(jobUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), JOB_FETCH_TIMEOUT_MS);
    try {
        const res = await fetch(jobUrl, {
            signal: controller.signal,
            redirect: "follow",
            headers: {
                "User-Agent": JOB_FETCH_UA,
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        });
        if (res.status === 404) {
            return {
                ok: false,
                message: "That job URL returned 404 (not found). Check the link or paste the job description manually.",
            };
        }
        if (!res.ok) {
            return {
                ok: false,
                message: `The page returned HTTP ${res.status}. It may block automated access — paste the job description manually.`,
            };
        }
        const html = await res.text();
        if (!html.trim()) {
            return {
                ok: false,
                message: "The page returned no usable HTML. Paste the job description manually.",
            };
        }
        return { ok: true, html };
    }
    catch (err) {
        const isAbort = err instanceof Error &&
            (err.name === "AbortError" || /abort/i.test(err.message));
        if (isAbort) {
            return {
                ok: false,
                message: "Fetching the job URL timed out. Try again, or paste the job description manually.",
            };
        }
        return {
            ok: false,
            message: "Could not fetch the job URL (network error). The page may be private or blocking scrapers. Paste the job description manually.",
        };
    }
    finally {
        clearTimeout(timeout);
    }
}
/** Send result + deduct 1 AI credit, include remaining balance in response header */
async function sendWithCredit(res, userId, data) {
    const remaining = await (0, credits_1.deductCredit)(userId);
    res.setHeader("X-AI-Credits-Remaining", remaining);
    (0, response_1.sendSuccess)(res, data);
}
class AnalysisController {
    async analyzeResume(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            console.log("[AnalysisController] analyzeResume start", {
                resumeId,
                userId: req.user.userId,
            });
            const analysis = await analysis_service_1.analysisService.analyzeResume(resumeId, req.user.userId);
            console.log("[AnalysisController] analyzeResume OK", { resumeId });
            await sendWithCredit(res, req.user.userId, analysis);
        }
        catch (error) {
            if (error instanceof http_errors_1.ClientError) {
                (0, response_1.sendError)(res, error.message, error.statusCode, { code: error.code });
                return;
            }
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async matchJob(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId, jobDescription } = analysis_1.jobMatchSchema.parse(req.body);
            const result = await analysis_service_1.analysisService.matchJob(resumeId, jobDescription, req.user.userId);
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async generateInterviewQuestions(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const questions = await analysis_service_1.analysisService.generateInterviewQuestions(resumeId, req.user.userId);
            await sendWithCredit(res, req.user.userId, questions);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async generateSmartFeedback(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const feedback = await analysis_service_1.analysisService.generateSmartFeedback(resumeId, req.user.userId);
            await sendWithCredit(res, req.user.userId, feedback);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async rewriteBulletPoint(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { text } = req.body;
            if (!text || typeof text !== "string" || text.trim().length < 5) {
                (0, response_1.sendError)(res, "Please provide text to rewrite (min 5 characters)", 400);
                return;
            }
            const result = await analysis_service_1.analysisService.rewriteBulletPoint(text.trim());
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            next(error);
        }
    }
    async analyzeSections(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const result = await analysis_service_1.analysisService.analyzeSections(resumeId, req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async generateContent(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const { jobDescription, type } = req.body;
            if (!jobDescription || !type) {
                (0, response_1.sendError)(res, "jobDescription and type are required", 400);
                return;
            }
            const result = await analysis_service_1.analysisService.generateContent(resumeId, req.user.userId, jobDescription, type);
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof http_errors_1.ClientError) {
                (0, response_1.sendError)(res, error.message, error.statusCode, { code: error.code });
                return;
            }
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async getResumePreview(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const result = await analysis_service_1.analysisService.getResumePreview(resumeId, req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async getHiringProbability(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            (0, response_1.sendSuccess)(res, await analysis_service_1.analysisService.getHiringProbability(resumeId, req.user.userId));
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async getGlobalBenchmark(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            (0, response_1.sendSuccess)(res, await analysis_service_1.analysisService.getGlobalBenchmark(resumeId, req.user.userId));
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async getBadges(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            (0, response_1.sendSuccess)(res, await analysis_service_1.analysisService.getBadges(resumeId, req.user.userId));
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async detectIndustry(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const result = await analysis_service_1.analysisService.detectIndustry(resumeId, req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async analyzeReadability(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const result = await analysis_service_1.analysisService.analyzeReadability(resumeId, req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async getCareerGrowth(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const result = await analysis_service_1.analysisService.getCareerGrowth(resumeId, req.user.userId);
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async suggestProjects(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId } = analysis_1.analyzeSchema.parse(req.body);
            const result = await analysis_service_1.analysisService.suggestProjects(resumeId, req.user.userId);
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async evaluateAnswer(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId, question, answer } = req.body;
            if (!resumeId || !question || !answer) {
                (0, response_1.sendError)(res, "resumeId, question, and answer required", 400);
                return;
            }
            const result = await analysis_service_1.analysisService.evaluateAnswer(resumeId, req.user.userId, question, answer);
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async chat(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId, question, history } = req.body;
            if (!resumeId || !question) {
                (0, response_1.sendError)(res, "resumeId and question required", 400);
                return;
            }
            const sanitizedHistory = Array.isArray(history)
                ? history
                    .slice(-24)
                    .filter((h) => h &&
                    typeof h === "object" &&
                    h.role &&
                    typeof h.content === "string")
                    .map((h) => ({
                    role: (h.role === "assistant" ? "assistant" : "user"),
                    content: String(h.content).slice(0, 4000),
                }))
                : undefined;
            const result = await analysis_service_1.analysisService.chat(resumeId, req.user.userId, question, sanitizedHistory);
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async compareResumes(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { oldResumeId, newResumeId } = req.body;
            if (!oldResumeId || !newResumeId) {
                (0, response_1.sendError)(res, "oldResumeId and newResumeId are required", 400);
                return;
            }
            const result = await analysis_service_1.analysisService.compareResumes(oldResumeId, newResumeId, req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async matchUrl(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { jobUrl, resumeId } = req.body;
            if (!jobUrl || typeof jobUrl !== "string" || !resumeId) {
                (0, response_1.sendError)(res, "jobUrl and resumeId are required", 400);
                return;
            }
            // Validate URL
            try {
                new URL(jobUrl);
            }
            catch {
                (0, response_1.sendError)(res, "Please provide a valid URL", 400);
                return;
            }
            // 1. Scrape the job page (fetch + cheerio; no axios — avoids missing-module issues on Vercel)
            const fetched = await fetchJobPageHtml(jobUrl);
            if (!fetched.ok) {
                (0, response_1.sendError)(res, fetched.message, 400);
                return;
            }
            const $ = cheerio.load(fetched.html);
            $("script, style, nav, header, footer, iframe, noscript, svg, img").remove();
            const jobText = $("body").text().replace(/\s+/g, " ").trim();
            if (jobText.length < 50) {
                (0, response_1.sendError)(res, "Could not extract enough text from that URL. The page may require login. Try pasting the job description manually.", 400);
                return;
            }
            // 2. Get resume text
            const resumeText = await analysis_service_1.analysisService.getResumeText(resumeId, req.user.userId);
            // 3. LLM match
            const { llmMatchUrl } = await Promise.resolve().then(() => __importStar(require("../services/llm.service")));
            const result = await llmMatchUrl(resumeText, jobText.slice(0, 5000));
            if (!result) {
                (0, response_1.sendError)(res, "AI analysis failed. Please try again.", 500);
                return;
            }
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async interviewPredictor(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const { resumeId, jobDescription } = req.body;
            if (!resumeId || !jobDescription) {
                (0, response_1.sendError)(res, "resumeId and jobDescription are required", 400);
                return;
            }
            const result = await analysis_service_1.analysisService.interviewPredictor(resumeId, req.user.userId, jobDescription);
            if (!result?.questions?.length) {
                (0, response_1.sendError)(res, "AI failed to generate questions. Please try again.", 500);
                return;
            }
            await sendWithCredit(res, req.user.userId, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
}
exports.AnalysisController = AnalysisController;
exports.analysisController = new AnalysisController();
