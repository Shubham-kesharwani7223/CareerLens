"use strict";

const { Router } = require("express");
const database = require("../config/database").default;
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/admin");
const { sendError } = require("../helpers/response");
const env = require("../config/env").env;
const Razorpay = require("razorpay").default || require("razorpay");

const router = Router();
router.use(authenticate, requireAdmin);

function parsePaging(req) {
  const pageRaw = Number.parseInt(String(req.query.page || "1"), 10);
  const limitRaw = Number.parseInt(String(req.query.limit || "25"), 10);
  const page = Number.isFinite(pageRaw) ? Math.max(1, pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) ? Math.min(50, Math.max(1, limitRaw)) : 25;
  return { page, limit, skip: (page - 1) * limit };
}

function searchWhere(search) {
  const q = String(search || "").trim();
  if (!q) return {};
  return {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ],
  };
}

function validObjectId(value) {
  return typeof value === "string" && /^[a-f\d]{24}$/i.test(value);
}

function cleanReason(value) {
  return typeof value === "string" ? value.trim().slice(0, 300) : "";
}

function getRazorpay() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
}

async function writeAudit(tx, req, entry) {
  return tx.adminAuditLog.create({
    data: {
      adminUserId: req.adminUser.id,
      adminEmail: req.adminUser.email,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId || null,
      reason: entry.reason,
      beforeValue: entry.beforeValue === undefined ? null : JSON.stringify(entry.beforeValue),
      afterValue: entry.afterValue === undefined ? null : JSON.stringify(entry.afterValue),
    },
  });
}

async function getEditableUser(id, req, res) {
  if (!validObjectId(id)) {
    sendError(res, "Invalid user ID", 400);
    return null;
  }
  const target = await database.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, isPro: true, aiCredits: true, subscriptionCredits: true, isSuspended: true, razorpaySubscriptionId: true },
  });
  if (!target) {
    sendError(res, "User not found", 404);
    return null;
  }
  if (target.id === req.adminUser.id) {
    sendError(res, "You cannot change your own administrator account from this panel", 400);
    return null;
  }
  return target;
}

// GET /api/admin/overview
router.get("/overview", async (_req, res, next) => {
  try {
    const [totalUsers, proUsers, suspendedUsers, totalResumes, totalPayments, totalFeedback, paymentAggregate, pendingRefunds, recentAudit] = await Promise.all([
      database.user.count(),
      database.user.count({ where: { isPro: true } }),
      database.user.count({ where: { isSuspended: true } }),
      database.resume.count(),
      database.payment.count(),
      database.feedback.count(),
      database.payment.aggregate({ _sum: { amount: true, refundedAmount: true } }),
      database.payment.count({ where: { refundStatus: "pending" } }),
      database.adminAuditLog.findMany({ take: 6, orderBy: { createdAt: "desc" }, select: { id: true, adminEmail: true, action: true, targetType: true, targetId: true, reason: true, createdAt: true } }),
    ]);
    const gross = Number(paymentAggregate?._sum?.amount || 0);
    const refunded = Number(paymentAggregate?._sum?.refundedAmount || 0);
    return res.json({
      success: true,
      data: {
        totalUsers,
        proUsers,
        freeUsers: Math.max(0, totalUsers - proUsers),
        suspendedUsers,
        totalResumes,
        verifiedPayments: totalPayments,
        totalFeedback,
        verifiedPaymentAmountPaise: gross,
        refundedAmountPaise: refunded,
        netStoredAmountPaise: Math.max(0, gross - refunded),
        pendingRefunds,
        recentAudit,
      },
    });
  } catch (error) { return next(error); }
});

// GET /api/admin/users?page=1&limit=25&search=name-or-email
router.get("/users", async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req);
    const where = searchWhere(req.query.search);
    const [total, items] = await Promise.all([
      database.user.count({ where }),
      database.user.findMany({
        where, skip, take: limit, orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, isPro: true, aiCredits: true, subscriptionCredits: true, isSuspended: true, razorpaySubscriptionId: true, createdAt: true },
      }),
    ]);
    return res.json({ success: true, data: { items, total, page, limit } });
  } catch (error) { return next(error); }
});

// POST /api/admin/users/:id/credits { delta: number, reason: string }
router.post("/users/:id/credits", async (req, res, next) => {
  try {
    const delta = Number(req.body?.delta);
    const reason = cleanReason(req.body?.reason);
    if (!Number.isSafeInteger(delta) || delta === 0 || Math.abs(delta) > 5000) {
      return sendError(res, "Credit adjustment must be a non-zero whole number between -5000 and 5000", 400);
    }
    if (reason.length < 3) return sendError(res, "Please enter a reason (at least 3 characters)", 400);
    const target = await getEditableUser(req.params.id, req, res);
    if (!target) return;
    if (target.isSuspended) return sendError(res, "Reactivate this account before adjusting credits", 400);
    const outcome = await database.$transaction(async (tx) => {
      const current = await tx.user.findUnique({ where: { id: target.id }, select: { aiCredits: true } });
      if (!current) throw new Error("User not found");
      const nextBalance = Number(current.aiCredits || 0) + delta;
      if (nextBalance < 0) throw new Error("Credit balance cannot become negative");
      const updated = await tx.user.update({ where: { id: target.id }, data: { aiCredits: nextBalance }, select: { id: true, name: true, email: true, aiCredits: true } });
      await writeAudit(tx, req, { action: delta > 0 ? "user.credits.added" : "user.credits.deducted", targetType: "user", targetId: target.id, reason, beforeValue: { aiCredits: current.aiCredits }, afterValue: { aiCredits: updated.aiCredits, delta } });
      return updated;
    });
    return res.json({ success: true, data: outcome, message: "AI credits updated" });
  } catch (error) {
    if (error instanceof Error && (error.message === "Credit balance cannot become negative" || error.message === "User not found")) return sendError(res, error.message, 400);
    return next(error);
  }
});

// PATCH /api/admin/users/:id/pro { isPro: boolean, reason: string }
router.patch("/users/:id/pro", async (req, res, next) => {
  try {
    if (typeof req.body?.isPro !== "boolean") return sendError(res, "isPro must be true or false", 400);
    const reason = cleanReason(req.body?.reason);
    if (reason.length < 3) return sendError(res, "Please enter a reason (at least 3 characters)", 400);
    const target = await getEditableUser(req.params.id, req, res);
    if (!target) return;
    if (target.isSuspended) return sendError(res, "Reactivate this account before changing Pro access", 400);
    if (!req.body.isPro && target.razorpaySubscriptionId) {
      const razorpay = getRazorpay();
      if (!razorpay) return sendError(res, "Razorpay is not configured; verify the linked subscription before revoking Pro access", 503);
      const subscription = await razorpay.subscriptions.fetch(target.razorpaySubscriptionId);
      const subscriptionStatus = String(subscription.status || "").toLowerCase();
      const stillBilling = ["created", "authenticated", "active", "pending"].includes(subscriptionStatus);
      if (stillBilling) {
        return sendError(res, `This user has a ${subscriptionStatus} Razorpay subscription. Cancel it in Razorpay first; otherwise a billing webhook may re-enable Pro access.`, 409);
      }
    }
    const updated = await database.$transaction(async (tx) => {
      const value = await tx.user.update({ where: { id: target.id }, data: { isPro: req.body.isPro }, select: { id: true, name: true, email: true, isPro: true } });
      await writeAudit(tx, req, { action: req.body.isPro ? "user.pro.granted" : "user.pro.revoked", targetType: "user", targetId: target.id, reason, beforeValue: { isPro: target.isPro }, afterValue: { isPro: value.isPro } });
      return value;
    });
    return res.json({ success: true, data: updated, message: "Pro access updated" });
  } catch (error) { return next(error); }
});

// PATCH /api/admin/users/:id/suspension { suspended: boolean, reason: string }
router.patch("/users/:id/suspension", async (req, res, next) => {
  try {
    if (typeof req.body?.suspended !== "boolean") return sendError(res, "suspended must be true or false", 400);
    const reason = cleanReason(req.body?.reason);
    if (reason.length < 3) return sendError(res, "Please enter a reason (at least 3 characters)", 400);
    const target = await getEditableUser(req.params.id, req, res);
    if (!target) return;
    const updated = await database.$transaction(async (tx) => {
      const value = await tx.user.update({ where: { id: target.id }, data: { isSuspended: req.body.suspended }, select: { id: true, name: true, email: true, isSuspended: true } });
      await writeAudit(tx, req, { action: req.body.suspended ? "user.suspended" : "user.reactivated", targetType: "user", targetId: target.id, reason, beforeValue: { isSuspended: Boolean(target.isSuspended) }, afterValue: { isSuspended: value.isSuspended } });
      return value;
    });
    return res.json({ success: true, data: updated, message: req.body.suspended ? "User suspended" : "User reactivated" });
  } catch (error) { return next(error); }
});

// GET /api/admin/payments?page=1&limit=25
router.get("/payments", async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req);
    const [total, rows] = await Promise.all([
      database.payment.count(),
      database.payment.findMany({ skip, take: limit, orderBy: { createdAt: "desc" }, select: { id: true, paymentId: true, userId: true, planId: true, amount: true, credits: true, refundedAmount: true, refundId: true, refundStatus: true, refundReason: true, lastRefundAt: true, createdAt: true } }),
    ]);
    const userIds = [...new Set(rows.map((row) => row.userId))];
    const users = userIds.length ? await database.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } }) : [];
    const userById = new Map(users.map((user) => [user.id, user]));
    const items = rows.map((row) => ({ ...row, user: userById.get(row.userId) || null, refundedAmount: Number(row.refundedAmount || 0) }));
    return res.json({ success: true, data: { items, total, page, limit } });
  } catch (error) { return next(error); }
});

// POST /api/admin/payments/:paymentId/refund { amountPaise: integer, reason: string }
router.post("/payments/:paymentId/refund", async (req, res, next) => {
  try {
    const paymentId = String(req.params.paymentId || "").trim();
    const amountPaise = Number(req.body?.amountPaise);
    const reason = cleanReason(req.body?.reason);
    if (!paymentId) return sendError(res, "Payment ID is required", 400);
    if (!Number.isSafeInteger(amountPaise) || amountPaise <= 0) return sendError(res, "Refund amount must be a positive whole number of paise", 400);
    if (reason.length < 5) return sendError(res, "Please enter a refund reason (at least 5 characters)", 400);
    const localPayment = await database.payment.findUnique({ where: { paymentId } });
    if (!localPayment) return sendError(res, "Payment record not found in CareerLens", 404);
    const razorpay = getRazorpay();
    if (!razorpay) return sendError(res, "Razorpay is not configured on the backend", 503);
    if (localPayment.refundStatus === "pending") return sendError(res, "A refund is already pending for this payment. Refresh the status before retrying.", 409);

    const providerPayment = await razorpay.payments.fetch(paymentId);
    if (providerPayment.status !== "captured") return sendError(res, `Only captured payments can be refunded. Razorpay status: ${providerPayment.status}`, 400);
    const originalAmount = Number(providerPayment.amount || localPayment.amount || 0);
    const alreadyRefunded = Math.max(Number(localPayment.refundedAmount || 0), Number(providerPayment.amount_refunded || 0));
    const remaining = originalAmount - alreadyRefunded;
    if (remaining <= 0) return sendError(res, "This payment is already fully refunded", 409);
    if (amountPaise > remaining) return sendError(res, `Refund exceeds remaining refundable balance of ${(remaining / 100).toFixed(2)} INR`, 400);

    // Refund is performed by Razorpay; do not mark it complete unless its response says so.
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amountPaise,
      notes: {
        reason,
        adminEmail: req.adminUser.email,
        source: "CareerLens Admin Console",
      },
    });
    const refundAmount = Number(refund.amount || amountPaise);
    const nextStatus = String(refund.status || "pending");
    const nextRefundedAmount = nextStatus === "failed"
      ? alreadyRefunded
      : Math.min(originalAmount, alreadyRefunded + refundAmount);

    await database.$transaction(async (tx) => {
      await tx.payment.update({
        where: { paymentId },
        data: {
          refundedAmount: nextRefundedAmount,
          refundId: refund.id || null,
          refundStatus: nextStatus,
          refundReason: reason,
          lastRefundAmount: refundAmount,
          lastRefundAt: new Date(),
        },
      });
      await writeAudit(tx, req, {
        action: "payment.refund.initiated",
        targetType: "payment",
        targetId: paymentId,
        reason,
        beforeValue: { refundedAmount: alreadyRefunded, remaining },
        afterValue: { refundId: refund.id || null, refundStatus: nextStatus, refundAmount, refundedAmount: nextRefundedAmount },
      });
    });

    return res.json({ success: true, data: { paymentId, refundId: refund.id || null, refundStatus: nextStatus, refundAmount, refundedAmount: nextRefundedAmount, remainingAmount: originalAmount - nextRefundedAmount }, message: "Refund request submitted to Razorpay" });
  } catch (error) { return next(error); }
});

// POST /api/admin/payments/:paymentId/refund-status — reconcile a pending refund with Razorpay.
router.post("/payments/:paymentId/refund-status", async (req, res, next) => {
  try {
    const paymentId = String(req.params.paymentId || "").trim();
    const localPayment = await database.payment.findUnique({ where: { paymentId } });
    if (!localPayment) return sendError(res, "Payment record not found in CareerLens", 404);
    if (!localPayment.refundId) return sendError(res, "No refund ID is saved for this payment", 400);
    const razorpay = getRazorpay();
    if (!razorpay) return sendError(res, "Razorpay is not configured on the backend", 503);
    const refund = await razorpay.payments.fetchRefund(paymentId, localPayment.refundId);
    const payment = await razorpay.payments.fetch(paymentId);
    const previousStatus = localPayment.refundStatus || "pending";
    const nextStatus = String(refund.status || previousStatus);
    const providerRefunded = Number(payment.amount_refunded || 0);
    const savedRefunded = Number(localPayment.refundedAmount || 0);
    const pendingAmount = Number(localPayment.lastRefundAmount || 0);
    let nextRefunded = Math.min(Number(payment.amount || localPayment.amount || 0), Math.max(savedRefunded, providerRefunded));
    if (nextStatus === "failed" && previousStatus === "pending") {
      nextRefunded = Math.min(Number(payment.amount || localPayment.amount || 0), Math.max(providerRefunded, savedRefunded - pendingAmount));
    }
    await database.$transaction(async (tx) => {
      await tx.payment.update({ where: { paymentId }, data: { refundStatus: nextStatus, refundedAmount: nextRefunded, lastRefundAt: localPayment.lastRefundAt || new Date() } });
      await writeAudit(tx, req, { action: "payment.refund.status_synced", targetType: "payment", targetId: paymentId, reason: "Admin synced refund status from Razorpay", beforeValue: { refundStatus: previousStatus, refundedAmount: savedRefunded }, afterValue: { refundStatus: nextStatus, refundedAmount: nextRefunded, refundId: refund.id || localPayment.refundId } });
    });
    return res.json({ success: true, data: { paymentId, refundId: refund.id || localPayment.refundId, refundStatus: nextStatus, refundedAmount: nextRefunded }, message: "Refund status synced from Razorpay" });
  } catch (error) { return next(error); }
});

// GET /api/admin/feedback?page=1&limit=25
router.get("/feedback", async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req);
    const [total, rows] = await Promise.all([
      database.feedback.count(),
      database.feedback.findMany({ skip, take: limit, orderBy: { createdAt: "desc" }, select: { id: true, userId: true, rating: true, comment: true, adminStatus: true, createdAt: true } }),
    ]);
    const userIds = [...new Set(rows.map((row) => row.userId))];
    const users = userIds.length ? await database.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } }) : [];
    const userById = new Map(users.map((user) => [user.id, user]));
    const items = rows.map((row) => ({ ...row, adminStatus: row.adminStatus || "new", user: userById.get(row.userId) || null }));
    return res.json({ success: true, data: { items, total, page, limit } });
  } catch (error) { return next(error); }
});

// PATCH /api/admin/feedback/:id/status { status: new|in_review|resolved, reason? }
router.patch("/feedback/:id/status", async (req, res, next) => {
  try {
    if (!validObjectId(req.params.id)) return sendError(res, "Invalid feedback ID", 400);
    const allowed = ["new", "in_review", "resolved"];
    const status = String(req.body?.status || "");
    if (!allowed.includes(status)) return sendError(res, "Invalid feedback status", 400);
    const reason = cleanReason(req.body?.reason) || `Feedback status changed to ${status}`;
    const existing = await database.feedback.findUnique({ where: { id: req.params.id }, select: { id: true, adminStatus: true } });
    if (!existing) return sendError(res, "Feedback not found", 404);
    const updated = await database.$transaction(async (tx) => {
      const value = await tx.feedback.update({ where: { id: req.params.id }, data: { adminStatus: status }, select: { id: true, adminStatus: true } });
      await writeAudit(tx, req, { action: "feedback.status.updated", targetType: "feedback", targetId: existing.id, reason, beforeValue: { status: existing.adminStatus || "new" }, afterValue: { status: value.adminStatus || status } });
      return value;
    });
    return res.json({ success: true, data: updated, message: "Feedback status updated" });
  } catch (error) { return next(error); }
});

// GET /api/admin/audit-log?page=1&limit=25
router.get("/audit-log", async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req);
    const [total, items] = await Promise.all([
      database.adminAuditLog.count(),
      database.adminAuditLog.findMany({ skip, take: limit, orderBy: { createdAt: "desc" }, select: { id: true, adminEmail: true, action: true, targetType: true, targetId: true, reason: true, beforeValue: true, afterValue: true, createdAt: true } }),
    ]);
    return res.json({ success: true, data: { items, total, page, limit } });
  } catch (error) { return next(error); }
});

module.exports = router;
