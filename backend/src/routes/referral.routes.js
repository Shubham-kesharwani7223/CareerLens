"use strict";

const { Router } = require("express");
const { randomBytes } = require("node:crypto");
const prisma = require("../config/database").default;
const { authenticate } = require("../middlewares/auth");

const router = Router();

// All referral endpoints require authentication.
router.use(authenticate);

// GET /api/referrals/me
router.get("/me", async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Find the logged-in user.
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        referralCode: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Generate a unique referral code for existing users.
    for (
      let attempt = 0;
      !user.referralCode && attempt < 5;
      attempt += 1
    ) {
      const code = `CL${randomBytes(4)
        .toString("hex")
        .toUpperCase()}`;

      try {
        user = await prisma.user.update({
          where: { id: userId },
          data: { referralCode: code },
          select: {
            id: true,
            referralCode: true,
          },
        });
      } catch (error) {
        // Retry if the generated code conflicts with an existing code.
        if (error?.code !== "P2002") {
          throw error;
        }

        user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            referralCode: true,
          },
        });
      }
    }

    if (!user?.referralCode) {
      return res.status(500).json({
        success: false,
        message: "Could not generate a referral code. Please try again.",
      });
    }

    // Count users who successfully signed up through this referrer.
    const [total, referrals] = await Promise.all([
      prisma.user.count({
        where: { referredById: userId },
      }),

      prisma.user.findMany({
        where: { referredById: userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        total,
        referrals: referrals.map((item) => ({
          id: item.id,
          name: item.name,
          joinedAt: item.createdAt,
        })),
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
