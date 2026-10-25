"use strict";

var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const resume_routes_1 = __importDefault(require("./resume.routes"));
const analysis_routes_1 = __importDefault(require("./analysis.routes"));
const razorpay_routes_1 = __importDefault(require("./razorpay.routes"));
const feedback_routes_1 = __importDefault(require("./feedback.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const gamification_routes_1 = __importDefault(require("./gamification.routes"));
const referral_routes_1 = __importDefault(require("./referral.routes"));

const router = (0, express_1.Router)();

// Authentication APIs
router.use("/auth", auth_routes_1.default);

// Resume and analysis APIs
router.use("/resume", resume_routes_1.default);
router.use("/analysis", analysis_routes_1.default);

// Payments and feedback APIs
router.use("/razorpay", razorpay_routes_1.default);
router.use("/feedback", feedback_routes_1.default);

// Admin APIs must be protected by authenticate + requireAdmin
router.use("/admin", admin_routes_1.default);

// Gamification APIs
// Learning data uses PostgreSQL; AI credit balances remain in MongoDB.
router.use("/gamification", gamification_routes_1.default);

// Referral APIs
router.use("/referrals", referral_routes_1.default);

// Health check
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

exports.default = router;
