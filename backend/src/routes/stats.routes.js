"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const statsRouter = (0, express_1.Router)();
/** In-process TTL cache so burst GETs (same cold start / multiple tabs) reuse one Prisma aggregate. */
const PLATFORM_STATS_TTL_MS = 60000;
let platformStatsCache = null;
statsRouter.get("/platform-stats", async (_req, res) => {
    const now = Date.now();
    if (platformStatsCache && platformStatsCache.expiresAt > now) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
        return res.status(200).json({ success: true, data: platformStatsCache.data });
    }
    try {
        const [users, resumesAnalyzed] = await Promise.all([
            database_1.default.user.count(),
            database_1.default.resume.count(),
        ]);
        const stats = {
            users,
            resumesAnalyzed,
            accuracy: 98,
            rating: 4.9,
        };
        platformStatsCache = { expiresAt: now + PLATFORM_STATS_TTL_MS, data: stats };
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
        return res.status(200).json({ success: true, data: stats });
    }
    catch (error) {
        console.error("Error fetching platform stats:", error);
        res.setHeader("Cache-Control", "no-store");
        return res.status(500).json({ success: false, message: "Failed to fetch statistics" });
    }
});
exports.default = statsRouter;
