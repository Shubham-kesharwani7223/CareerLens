"use strict";

const { Router } = require("express");
const database = require("../config/database").default;
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/admin");

const router = Router();

// Har admin endpoint par authentication aur server-side authorization.
router.use(authenticate, requireAdmin);

function parsePaging(req) {
  const pageRaw = Number.parseInt(String(req.query.page || "1"), 10);
  const limitRaw = Number.parseInt(String(req.query.limit || "25"), 10);

  const page = Number.isFinite(pageRaw)
    ? Math.max(1, pageRaw)
    : 1;

  const limit = Number.isFinite(limitRaw)
    ? Math.min(50, Math.max(1, limitRaw))
    : 25;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
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

// GET /api/admin/overview
router.get("/overview", async (_req, res, next) => {
  try {
    const [
      totalUsers,
      proUsers,
      totalResumes,
      totalPayments,
      totalFeedback,
      paymentAggregate,
    ] = await Promise.all([
      database.user.count(),
      database.user.count({ where: { isPro: true } }),
      database.resume.count(),
      database.payment.count(),
      database.feedback.count(),
      database.payment.aggregate({
        _sum: { amount: true },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers,
        proUsers,
        freeUsers: Math.max(0, totalUsers - proUsers),
        totalResumes,
        verifiedPayments: totalPayments,
        totalFeedback,
        // Payment amounts are stored in paise.
        verifiedPaymentAmountPaise:
          paymentAggregate?._sum?.amount || 0,
      },
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/admin/users?page=1&limit=25&search=name-or-email
router.get("/users", async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req);
    const where = searchWhere(req.query.search);

    const [total, items] = await Promise.all([
      database.user.count({ where }),
      database.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isPro: true,
          aiCredits: true,
          createdAt: true,
        },
      }),
    ]);

    return res.json({
      success: true,
      data: { items, total, page, limit },
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/admin/payments?page=1&limit=25
router.get("/payments", async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req);

    const [total, rows] = await Promise.all([
      database.payment.count(),
      database.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          paymentId: true,
          userId: true,
          planId: true,
          amount: true,
          credits: true,
          createdAt: true,
        },
      }),
    ]);

    const userIds = [...new Set(rows.map((row) => row.userId))];

    const users = userIds.length
      ? await database.user.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })
      : [];

    const userById = new Map(
      users.map((user) => [user.id, user])
    );

    const items = rows.map((row) => ({
      ...row,
      user: userById.get(row.userId) || null,
    }));

    return res.json({
      success: true,
      data: { items, total, page, limit },
    });
  } catch (error) {
    return next(error);
  }
});

// GET /api/admin/feedback?page=1&limit=25
router.get("/feedback", async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePaging(req);

    const [total, rows] = await Promise.all([
      database.feedback.count(),
      database.feedback.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userId: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      }),
    ]);

    const userIds = [...new Set(rows.map((row) => row.userId))];

    const users = userIds.length
      ? await database.user.findMany({
          where: { id: { in: userIds } },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })
      : [];

    const userById = new Map(
      users.map((user) => [user.id, user])
    );

    const items = rows.map((row) => ({
      ...row,
      user: userById.get(row.userId) || null,
    }));

    return res.json({
      success: true,
      data: { items, total, page, limit },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;