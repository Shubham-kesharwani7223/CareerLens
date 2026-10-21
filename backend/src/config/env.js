"use strict";

var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.allowedCorsOrigins = void 0;

const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();

/**
 * Browsers only allow FRONTEND_URL + CORS_ORIGIN.
 * Both support comma-separated origin lists.
 */
function parseOriginList(value) {
  if (!value) return [];

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function buildAllowedCorsOrigins() {
  const origins = new Set();

  for (const origin of parseOriginList(process.env.CORS_ORIGIN)) {
    origins.add(origin);
  }

  for (const origin of parseOriginList(process.env.FRONTEND_URL)) {
    origins.add(origin);
  }

  const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://aliza-resume-analyzer.vercel.app",
  ];

  for (const origin of defaultOrigins) {
    origins.add(origin);
  }

  return Array.from(origins);
}

exports.allowedCorsOrigins = buildAllowedCorsOrigins();

exports.env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),

  DATABASE_URL: process.env.DATABASE_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "default-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "3d",

  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
  MAX_FILE_SIZE: parseInt(
    process.env.MAX_FILE_SIZE || "5242880",
    10
  ),

  CORS_ORIGIN:
    process.env.CORS_ORIGIN || "http://localhost:3000",

  GEMINI_API_KEY: (process.env.GEMINI_API_KEY || "").trim(),
  GEMINI_TEXT_MODEL: (
    process.env.GEMINI_TEXT_MODEL || "gemini-3.8-flash"
  ).trim(),
  GEMINI_DOC_MODEL: (
    process.env.GEMINI_DOC_MODEL || "gemini-3.8-flash"
  ).trim(),

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_PRO_PLAN_ID: process.env.RAZORPAY_PRO_PLAN_ID || "",
  RAZORPAY_WEBHOOK_SECRET:
    process.env.RAZORPAY_WEBHOOK_SECRET || "",

  FRONTEND_URL:
    process.env.FRONTEND_URL || "http://localhost:3000",

  // No hardcoded admin account. Configure it in backend/.env.
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase(),

  // Must match the frontend Google OAuth client.
  GOOGLE_CLIENT_ID:
    process.env.GOOGLE_CLIENT_ID ||
    "635746911291-7tqkp4v5vab4k0hf5es0agafn67ug7ep.apps.googleusercontent.com",
};