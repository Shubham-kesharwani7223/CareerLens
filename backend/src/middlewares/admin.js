"use strict";

const database = require("../config/database").default;
const { env } = require("../config/env");
const { sendError } = require("../helpers/response");

/**
 * Re-check the account in MongoDB.
 * Never trust only the frontend isAdmin flag.
 */
async function requireAdmin(req, res, next) {
  try {
    if (!req.user || !req.user.userId) {
      return sendError(res, "Authentication required", 401);
    }

    const configuredEmail = String(env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();

    if (!configuredEmail) {
      return sendError(
        res,
        "Admin access is not configured. Set ADMIN_EMAIL in backend/.env.",
        503
      );
    }

    const account = await database.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (
      !account ||
      String(account.email || "").trim().toLowerCase() !==
        configuredEmail
    ) {
      return sendError(res, "Admin access denied", 403);
    }

    req.adminUser = {
      id: account.id,
      email: account.email,
      name: account.name,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { requireAdmin };