"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const response_1 = require("../helpers/response");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// POST /api/feedback
router.post("/", auth_1.authenticate, async (req, res, next) => {
    try {
        if (!req.user) {
            (0, response_1.sendError)(res, "Unauthorized", 401);
            return;
        }
        const { rating, comment } = req.body;
        if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
            (0, response_1.sendError)(res, "Rating must be a number between 1 and 5", 400);
            return;
        }
        const feedback = await database_1.default.feedback.create({
            data: {
                userId: req.user.userId,
                rating,
                comment: typeof comment === "string" ? comment.trim().slice(0, 1000) : "",
            },
        });
        (0, response_1.sendSuccess)(res, { id: feedback.id, message: "Thank you for your feedback!" }, 201);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
