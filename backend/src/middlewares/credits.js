"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.requireCredits = requireCredits;
exports.deductCredit = deductCredit;
exports.requirePro = requirePro;
exports.isAdmin = isAdmin;

const database_1 = require("../config/database");
const response_1 = require("../helpers/response");
const env_1 = require("../config/env");

function isAdmin(email) {
  const configuredEmail = String(env_1.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();

  return Boolean(
    configuredEmail &&
    email &&
    String(email).trim().toLowerCase() === configuredEmail
  );
}

/**
 * Pro-only authorization.
 * Frontend gates improve UX, but this middleware enforces access on the API.
 */
async function requirePro(req, res, next) {
  try {
    if (!req.user) {
      return (0, response_1.sendError)(
        res,
        "Authentication required",
        401
      );
    }

    if (isAdmin(req.user.email)) {
      return next();
    }

    const user = await database_1.default.user.findUnique({
      where: { id: req.user.userId },
      select: { isPro: true },
    });

    if (!user) {
      return (0, response_1.sendError)(
        res,
        "User not found",
        404
      );
    }

    if (!user.isPro) {
      return (0, response_1.sendError)(
        res,
        "CareerLens Pro subscription required. Upgrade to unlock this feature.",
        403
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

/**
 * Ensure a signed-in user has AI credits.
 * The configured admin account bypasses this check.
 */
async function requireCredits(req, res, next) {
  try {
    if (!req.user) {
      return (0, response_1.sendError)(
        res,
        "Authentication required",
        401
      );
    }

    if (isAdmin(req.user.email)) {
      return next();
    }

    const user = await database_1.default.user.findUnique({
      where: { id: req.user.userId },
      select: {
        aiCredits: true,
        subscriptionCredits: true,
        isPro: true,
      },
    });

    if (!user) {
      return (0, response_1.sendError)(
        res,
        "User not found",
        404
      );
    }

    if (user.aiCredits <= 0) {
      const message = user.isPro
        ? "You've used all available AI credits. Your Pro monthly credits refresh when the next subscription charge succeeds; you can also buy an extra credit pack."
        : "You've used your free AI credit. Buy an AI credit pack or upgrade to CareerLens Pro.";

      return (0, response_1.sendError)(res, message, 403);
    }

    req.userCredits = user.aiCredits;
    return next();
  } catch (error) {
    return next(error);
  }
}

/**
 * Deduct one credit, spending current subscription credits first.
 * aiCredits remains the total balance for backward compatibility.
 */
async function deductCredit(userId) {
  const initialUser = await database_1.default.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (initialUser && isAdmin(initialUser.email)) {
    return 999; // Admin has unlimited credits.
  }

  return database_1.default.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        aiCredits: true,
        subscriptionCredits: true,
      },
    });

    if (!user || user.aiCredits <= 0) {
      return Math.max(0, user?.aiCredits || 0);
    }

    const data = {
      aiCredits: { decrement: 1 },
    };

    if ((user.subscriptionCredits || 0) > 0) {
      data.subscriptionCredits = { decrement: 1 };
    }

    const updated = await tx.user.update({
      where: { id: userId },
      data,
      select: { aiCredits: true },
    });

    return updated.aiCredits;
  });
}