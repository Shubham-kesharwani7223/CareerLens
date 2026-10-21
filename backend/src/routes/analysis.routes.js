"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = require("express");
const analysis_controller_1 = require("../controllers/analysis.controller");
const auth_1 = require("../middlewares/auth");
const credits_1 = require("../middlewares/credits");

const router = (0, express_1.Router)();

// FREE TIER: Basic resume scoring — requires available AI credit.

router.post(
  "/score",
  auth_1.authenticate,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.analyzeResume(req, res, next)
);

router.post(
  "/smart-feedback",
  auth_1.authenticate,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.generateSmartFeedback(
      req,
      res,
      next
    )
);

router.post(
  "/rewrite",
  auth_1.authenticate,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.rewriteBulletPoint(
      req,
      res,
      next
    )
);

// =============================================================
// PRO TIER: Advanced AI features.
// Both an active Pro subscription and available AI credits required.
// =============================================================

router.post(
  "/job-match",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.matchJob(req, res, next)
);

router.post(
  "/interview-questions",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.generateInterviewQuestions(
      req,
      res,
      next
    )
);

router.post(
  "/generate-content",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.generateContent(req, res, next)
);

router.post(
  "/career-growth",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.getCareerGrowth(req, res, next)
);

router.post(
  "/suggest-projects",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.suggestProjects(
      req,
      res,
      next
    )
);

router.post(
  "/evaluate-answer",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.evaluateAnswer(req, res, next)
);

router.post(
  "/chat",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.chat(req, res, next)
);

router.post(
  "/match-url",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.matchUrl(req, res, next)
);

router.post(
  "/interview-predictor",
  auth_1.authenticate,
  credits_1.requirePro,
  credits_1.requireCredits,
  (req, res, next) =>
    analysis_controller_1.analysisController.interviewPredictor(
      req,
      res,
      next
    )
);

// =============================================================
// LIGHTWEIGHT authenticated routes (no Gemini credit required).
// =============================================================

router.post(
  "/sections",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.analyzeSections(req, res, next)
);

router.post(
  "/resume-preview",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.getResumePreview(req, res, next)
);

router.post(
  "/hiring-probability",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.getHiringProbability(
      req,
      res,
      next
    )
);

router.post(
  "/global-benchmark",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.getGlobalBenchmark(
      req,
      res,
      next
    )
);

router.post(
  "/badges",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.getBadges(req, res, next)
);

router.post(
  "/detect-industry",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.detectIndustry(
      req,
      res,
      next
    )
);

router.post(
  "/readability",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.analyzeReadability(
      req,
      res,
      next
    )
);

router.post(
  "/compare",
  auth_1.authenticate,
  (req, res, next) =>
    analysis_controller_1.analysisController.compareResumes(
      req,
      res,
      next
    )
);

exports.default = router;