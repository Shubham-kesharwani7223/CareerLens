"use strict";

const { Router } = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  sendError,
  sendSuccess,
} = require("../helpers/response");
const database = require("../config/database").default;
const sendFeedbackEmail = require("../services/feedbackEmail.service");

const router = Router();

// POST /api/feedback
// Save feedback first; email notification is best-effort.
router.post("/", authenticate, async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return sendError(res, "Unauthorized", 401);
    }

    const { rating, comment } = req.body || {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return sendError(
        res,
        "Rating must be an integer between 1 and 5",
        400
      );
    }

    if (comment !== undefined && typeof comment !== "string") {
      return sendError(res, "Comment must be text", 400);
    }

    const feedback = await database.feedback.create({
      data: {
        userId: req.user.userId,
        rating,
        comment:
          typeof comment === "string"
            ? comment.trim().slice(0, 1000)
            : "",
      },
    });

    // SMTP failure should never delete or invalidate saved feedback.
    try {
      const user = await database.user.findUnique({
        where: { id: req.user.userId },
        select: {
          name: true,
          email: true,
        },
      });

      const emailResult = await sendFeedbackEmail({
        feedback,
        user,
      });

      if (!emailResult.sent) {
        console.warn(
          `[Feedback email] Not sent (${emailResult.reason}). Feedback ID: ${feedback.id}`
        );
      }
    } catch (emailError) {
      console.error(
        `[Feedback email] Failed for feedback ${feedback.id}:`,
        emailError?.message || emailError
      );
    }

    return sendSuccess(
      res,
      {
        id: feedback.id,
        message: "Thank you for your feedback!",
        emailNotification: "attempted",
      },
      201
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;