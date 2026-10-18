"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireCredits = requireCredits;
exports.deductCredit = deductCredit;
const database_1 = __importDefault(require("../config/database"));
const response_1 = require("../helpers/response");
const env_1 = require("../config/env");
/** Check if the given email is the admin (God Mode) */
function isAdmin(email) {
    return !!email && email.toLowerCase() === env_1.env.ADMIN_EMAIL.toLowerCase();
}
/**
 * Middleware: checks the user has at least 1 AI credit remaining.
 * Admin (ADMIN_EMAIL) bypasses all credit checks.
 */
async function requireCredits(req, res, next) {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, "Authentication required", 401);
            return;
        }
        // ── Admin Bypass: skip credit check entirely ──
        if (isAdmin(req.user.email)) {
            next();
            return;
        }
        const user = await database_1.default.user.findUnique({
            where: { id: req.user.userId },
            select: { aiCredits: true, isPro: true },
        });
        if (!user) {
            (0, response_1.sendError)(res, "User not found", 404);
            return;
        }
        if (user.aiCredits <= 0) {
            (0, response_1.sendError)(res, user.isPro
                ? "You've used all 100 AI credits for this month. Credits reset on your next billing cycle."
                : "You've used your free AI credit. Upgrade to Pro for 100 credits/month.", 403);
            return;
        }
        req.userCredits = user.aiCredits;
        next();
    }
    catch (error) {
        next(error);
    }
}
/**
 * Deducts 1 AI credit from a user.
 * Admin (ADMIN_EMAIL) is never deducted — returns Infinity.
 */
async function deductCredit(userId) {
    // Look up user email to check admin
    const user = await database_1.default.user.findUnique({
        where: { id: userId },
        select: { email: true },
    });
    if (user && isAdmin(user.email)) {
        return 999; // Admin: infinite credits, no deduction
    }
    const updated = await database_1.default.user.update({
        where: { id: userId },
        data: { aiCredits: { decrement: 1 } },
        select: { aiCredits: true },
    });
    return updated.aiCredits;
}
