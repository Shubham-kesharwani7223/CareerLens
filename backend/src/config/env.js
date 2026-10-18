"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.allowedCorsOrigins = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Browsers only allow `FRONTEND_URL` + `CORS_ORIGIN` (both support comma lists).
 * Merging avoids Vercel misconfigs where only one var is set.
 */
function parseOriginList(value) {
    if (!value)
        return [];
    return value
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
}
function buildAllowedCorsOrigins() {
    const set = new Set();
    for (const o of parseOriginList(process.env.CORS_ORIGIN))
        set.add(o);
    for (const o of parseOriginList(process.env.FRONTEND_URL))
        set.add(o);
    for (const o of [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        // Default production app (Vercel); override/extend with CORS_ORIGIN / FRONTEND_URL
        "https://aliza-resume-analyzer.vercel.app",
    ]) {
        set.add(o);
    }
    return Array.from(set);
}
exports.allowedCorsOrigins = buildAllowedCorsOrigins();
exports.env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "default-secret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "3d",
    UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    /** Raw env value (for logs); use `allowedCorsOrigins` in server for CORS checks */
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
    GEMINI_API_KEY: (process.env.GEMINI_API_KEY || "").trim(),
    GEMINI_TEXT_MODEL: (process.env.GEMINI_TEXT_MODEL || "gemini-3.8-flash").trim(),
    GEMINI_DOC_MODEL: (process.env.GEMINI_DOC_MODEL || "gemini-3.8-flash").trim(),
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
    RAZORPAY_PRO_PLAN_ID: process.env.RAZORPAY_PRO_PLAN_ID || "",
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "alizait1192@gmail.com",
    /** Web client ID; must match frontend Google OAuth client. GOOGLE_CLIENT_ID in .env overrides. */
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ||
        "635746911291-7tqkp4v5vab4k0hf5es0agafn67ug7ep.apps.googleusercontent.com",
};
