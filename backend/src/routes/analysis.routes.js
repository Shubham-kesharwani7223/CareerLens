"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analysis_controller_1 = require("../controllers/analysis.controller");
const auth_1 = require("../middlewares/auth");
const credits_1 = require("../middlewares/credits");
const router = (0, express_1.Router)();
// ═══════════════════════════════════════════════════════════════
// AI-HEAVY routes (cost Gemini credits) — require credits
// ═══════════════════════════════════════════════════════════════
// POST /api/analysis/score
router.post("/score", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.analyzeResume(req, res, next));
// POST /api/analysis/job-match
router.post("/job-match", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.matchJob(req, res, next));
// POST /api/analysis/interview-questions
router.post("/interview-questions", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.generateInterviewQuestions(req, res, next));
// POST /api/analysis/smart-feedback
router.post("/smart-feedback", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.generateSmartFeedback(req, res, next));
// POST /api/analysis/generate-content
router.post("/generate-content", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.generateContent(req, res, next));
// POST /api/analysis/career-growth
router.post("/career-growth", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.getCareerGrowth(req, res, next));
// POST /api/analysis/suggest-projects
router.post("/suggest-projects", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.suggestProjects(req, res, next));
// POST /api/analysis/evaluate-answer
router.post("/evaluate-answer", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.evaluateAnswer(req, res, next));
// POST /api/analysis/chat
router.post("/chat", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.chat(req, res, next));
// POST /api/analysis/match-url
router.post("/match-url", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.matchUrl(req, res, next));
// POST /api/analysis/interview-predictor
router.post("/interview-predictor", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.interviewPredictor(req, res, next));
// ═══════════════════════════════════════════════════════════════
// LIGHTWEIGHT routes (rule-based, no Gemini cost) — no credits
// ═══════════════════════════════════════════════════════════════
// POST /api/analysis/rewrite (AI-powered, costs 1 credit)
router.post("/rewrite", auth_1.authenticate, credits_1.requireCredits, (req, res, next) => analysis_controller_1.analysisController.rewriteBulletPoint(req, res, next));
// POST /api/analysis/sections
router.post("/sections", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.analyzeSections(req, res, next));
// POST /api/analysis/resume-preview
router.post("/resume-preview", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.getResumePreview(req, res, next));
// POST /api/analysis/hiring-probability
router.post("/hiring-probability", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.getHiringProbability(req, res, next));
// POST /api/analysis/global-benchmark
router.post("/global-benchmark", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.getGlobalBenchmark(req, res, next));
// POST /api/analysis/badges
router.post("/badges", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.getBadges(req, res, next));
// POST /api/analysis/detect-industry
router.post("/detect-industry", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.detectIndustry(req, res, next));
// POST /api/analysis/readability
router.post("/readability", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.analyzeReadability(req, res, next));
// POST /api/analysis/compare
router.post("/compare", auth_1.authenticate, (req, res, next) => analysis_controller_1.analysisController.compareResumes(req, res, next));
exports.default = router;
