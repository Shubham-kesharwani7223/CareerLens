// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// const express_1 = require("express");
// const auth_1 = require("../middlewares/auth");
// const response_1 = require("../helpers/response");
// const database_1 = __importDefault(require("../config/database"));
// const router = (0, express_1.Router)();
// // POST /api/feedback
// router.post("/", auth_1.authenticate, async (req, res, next) => {
//     try {
//         if (!req.user) {
//             (0, response_1.sendError)(res, "Unauthorized", 401);
//             return;
//         }
//         const { rating, comment } = req.body;
//         if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
//             (0, response_1.sendError)(res, "Rating must be a number between 1 and 5", 400);
//             return;
//         }
//         const feedback = await database_1.default.feedback.create({
//             data: {
//                 userId: req.user.userId,
//                 rating,
//                 comment: typeof comment === "string" ? comment.trim().slice(0, 1000) : "",
//             },
//         });
//         (0, response_1.sendSuccess)(res, { id: feedback.id, message: "Thank you for your feedback!" }, 201);
//     }
//     catch (error) {
//         next(error);
//     }
// });
// exports.default = router;
























"use strict";

var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, "__esModule", { value: true });

const { Router } = require("express");
const { authenticate } = require("../middlewares/auth");
const { sendError, sendSuccess } = require("../helpers/response");
const database = __importDefault(require("../config/database"));

// Fixed: match module.exports = { sendFeedbackEmail }
const {
  sendFeedbackEmail,
} = require("../services/feedbackEmail.service");

const router = Router();

// POST /api/feedback
router.post("/", authenticate, async (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }

    const { rating, comment } = req.body;

    // Validate rating
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return sendError(
        res,
        "Rating must be a number between 1 and 5",
        400
      );
    }

    // Validate comment
    if (
      comment !== undefined &&
      typeof comment !== "string"
    ) {
      return sendError(
        res,
        "Comment must be text",
        400
      );
    }

    const cleanComment = (comment || "")
      .trim()
      .slice(0, 1000);

    // 1. Save feedback to database first
    const feedback =
      await database.default.feedback.create({
        data: {
          userId: req.user.userId,
          rating,
          comment: cleanComment,
        },
      });

    // 2. Fetch authenticated user's profile
    const user =
      await database.default.user.findUnique({
        where: {
          id: req.user.userId,
        },
        select: {
          name: true,
          email: true,
        },
      });

    // 3. Send email notification
    try {
      if (typeof sendFeedbackEmail !== "function") {
        throw new Error(
          "sendFeedbackEmail export/import is incorrect"
        );
      }

      await sendFeedbackEmail({
        rating: feedback.rating,
        comment: feedback.comment,
        user,
        createdAt: feedback.createdAt,
      });

      console.log(
        "[Feedback] Email notification sent successfully."
      );
    } catch (emailError) {
      console.error(
        "[Feedback] Saved, but email notification failed:",
        emailError.message
      );
    }

    // Feedback remains saved even if email fails
    return sendSuccess(
      res,
      {
        id: feedback.id,
        message: "Thank you for your feedback!",
      },
      201
    );
  } catch (error) {
    next(error);
  }
});

exports.default = router;
