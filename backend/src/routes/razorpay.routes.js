"use strict";

var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, "__esModule", { value: true });

const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const auth_1 = require("../middlewares/auth");
const response_1 = require("../helpers/response");
const env_1 = require("../config/env");
const database_1 = __importDefault(require("../config/database"));

const router = (0, express_1.Router)();

function getRazorpay() {
  if (
    !env_1.env.RAZORPAY_KEY_ID ||
    !env_1.env.RAZORPAY_KEY_SECRET
  ) {
    return null;
  }

  return new razorpay_1.default({
    key_id: env_1.env.RAZORPAY_KEY_ID,
    key_secret: env_1.env.RAZORPAY_KEY_SECRET,
  });
}

function safeSignatureEqual(actual, expected) {
  const a = Buffer.from(String(actual || ""), "hex");
  const b = Buffer.from(String(expected || ""), "hex");

  return (
    a.length === b.length &&
    a.length > 0 &&
    crypto_1.default.timingSafeEqual(a, b)
  );
}

/**
 * Replace unused monthly subscription credits with a fresh 100-credit
 * allowance. Non-subscription credits are preserved.
 */
async function grantMonthlyProCredits(tx, userId, subscriptionId) {
  const current = await tx.user.findUnique({
    where: { id: userId },
    select: {
      aiCredits: true,
      subscriptionCredits: true,
    },
  });

  if (!current) {
    throw new Error("User not found while applying Pro credits");
  }

  const nonSubscriptionCredits = Math.max(
    0,
    (current.aiCredits || 0) - (current.subscriptionCredits || 0)
  );

  return await tx.user.update({
    where: { id: userId },
    data: {
      isPro: true,
      aiCredits: nonSubscriptionCredits + 100,
      subscriptionCredits: 100,
      razorpaySubscriptionId: subscriptionId,
    },
    select: {
      aiCredits: true,
      subscriptionCredits: true,
      isPro: true,
    },
  });
}

const CREDIT_PLANS = {
  starter: {
    amount: 4900,
    credits: 5,
    label: "Starter (5 AI Credits)",
  },
  pro: {
    amount: 14900,
    credits: 20,
    label: "Growth Credits (20 AI Credits)",
  },
};

// Create the monthly CareerLens Pro subscription.
router.post(
  "/create-subscription",
  auth_1.authenticate,
  async (req, res, next) => {
    try {
      if (!req.user) {
        return (0, response_1.sendError)(
          res,
          "Unauthorized",
          401
        );
      }

      const razorpay = getRazorpay();

      if (!razorpay) {
        return (0, response_1.sendError)(
          res,
          "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
          500
        );
      }

      if (!env_1.env.RAZORPAY_PRO_PLAN_ID) {
        return (0, response_1.sendError)(
          res,
          "Set RAZORPAY_PRO_PLAN_ID to your monthly CareerLens Pro plan ID in Razorpay Dashboard.",
          500
        );
      }

      const user = await database_1.default.user.findUnique({
        where: { id: req.user.userId },
      });

      if (!user) {
        return (0, response_1.sendError)(
          res,
          "User not found",
          404
        );
      }

      if (user.isPro) {
        return (0, response_1.sendError)(
          res,
          "You are already on the Pro plan!",
          400
        );
      }

      const subscription = await razorpay.subscriptions.create({
        plan_id: env_1.env.RAZORPAY_PRO_PLAN_ID,
        customer_notify: 1,
        total_count: 12,
        notes: {
          userId: user.id,
          product: "CareerLens Pro",
        },
      });

      return (0, response_1.sendSuccess)(res, {
        keyId: env_1.env.RAZORPAY_KEY_ID,
        subscriptionId: subscription.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify the first successful subscription payment.
router.post(
  "/verify-subscription",
  auth_1.authenticate,
  async (req, res, next) => {
    try {
      if (!req.user) {
        return (0, response_1.sendError)(
          res,
          "Unauthorized",
          401
        );
      }

      const razorpay = getRazorpay();

      if (!razorpay) {
        return (0, response_1.sendError)(
          res,
          "Razorpay is not configured",
          500
        );
      }

      const {
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
      } = req.body || {};

      if (
        !razorpay_payment_id ||
        !razorpay_subscription_id ||
        !razorpay_signature
      ) {
        return (0, response_1.sendError)(
          res,
          "Payment verification details are missing",
          400
        );
      }

      const expected = crypto_1.default
        .createHmac("sha256", env_1.env.RAZORPAY_KEY_SECRET)
        .update(
          `${razorpay_payment_id}|${razorpay_subscription_id}`
        )
        .digest("hex");

      if (!safeSignatureEqual(razorpay_signature, expected)) {
        return (0, response_1.sendError)(
          res,
          "Invalid payment signature",
          400
        );
      }

      const subscription = await razorpay.subscriptions.fetch(
        razorpay_subscription_id
      );

      if (subscription.notes?.userId !== req.user.userId) {
        return (0, response_1.sendError)(
          res,
          "Subscription does not belong to this account",
          403
        );
      }

      const payment = await razorpay.payments.fetch(
        razorpay_payment_id
      );

      if (payment.status !== "captured") {
        return (0, response_1.sendError)(
          res,
          "Payment is not captured yet",
          400
        );
      }

      if (
        payment.subscription_id &&
        payment.subscription_id !== razorpay_subscription_id
      ) {
        return (0, response_1.sendError)(
          res,
          "Payment/subscription mismatch",
          400
        );
      }

      const existing = await database_1.default.payment.findUnique({
        where: { paymentId: razorpay_payment_id },
      });

      if (existing) {
        const current = await database_1.default.user.findUnique({
          where: { id: req.user.userId },
          select: {
            aiCredits: true,
            isPro: true,
          },
        });

        return (0, response_1.sendSuccess)(res, {
          success: true,
          alreadyProcessed: true,
          credits: current?.aiCredits,
          isPro: current?.isPro,
        });
      }

      const updated = await database_1.default.$transaction(
        async (tx) => {
          await tx.payment.create({
            data: {
              paymentId: razorpay_payment_id,
              userId: req.user.userId,
              planId: "career-pro-monthly",
              amount: payment.amount || 0,
              credits: 100,
            },
          });

          return await grantMonthlyProCredits(
            tx,
            req.user.userId,
            razorpay_subscription_id
          );
        }
      );

      return (0, response_1.sendSuccess)(res, {
        success: true,
        credits: updated.aiCredits,
        isPro: updated.isPro,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create a one-time order for AI credits.
router.post(
  "/create-order",
  auth_1.authenticate,
  async (req, res, next) => {
    try {
      if (!req.user) {
        return (0, response_1.sendError)(
          res,
          "Unauthorized",
          401
        );
      }

      const razorpay = getRazorpay();

      if (!razorpay) {
        return (0, response_1.sendError)(
          res,
          "Razorpay is not configured",
          500
        );
      }

      const plan = CREDIT_PLANS[req.body?.planId];

      if (!plan) {
        return (0, response_1.sendError)(
          res,
          "Invalid credit plan selected",
          400
        );
      }

      const order = await razorpay.orders.create({
        amount: plan.amount,
        currency: "INR",
        receipt: `cl_${req.user.userId.slice(-8)}_${Date.now()}`,
        notes: {
          userId: req.user.userId,
          planId: req.body.planId,
          credits: String(plan.credits),
        },
      });

      return (0, response_1.sendSuccess)(res, {
        keyId: env_1.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        name: plan.label,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify one-time AI credit pack payments.
router.post(
  "/verify-payment",
  auth_1.authenticate,
  async (req, res, next) => {
    try {
      if (!req.user) {
        return (0, response_1.sendError)(
          res,
          "Unauthorized",
          401
        );
      }

      const razorpay = getRazorpay();

      if (!razorpay) {
        return (0, response_1.sendError)(
          res,
          "Razorpay is not configured",
          500
        );
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId,
      } = req.body || {};

      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !planId
      ) {
        return (0, response_1.sendError)(
          res,
          "Payment verification details are missing",
          400
        );
      }

      const plan = CREDIT_PLANS[planId];

      if (!plan) {
        return (0, response_1.sendError)(
          res,
          "Invalid credit plan",
          400
        );
      }

      const expected = crypto_1.default
        .createHmac("sha256", env_1.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (!safeSignatureEqual(razorpay_signature, expected)) {
        return (0, response_1.sendError)(
          res,
          "Invalid payment signature",
          400
        );
      }

      const [order, payment, existing] = await Promise.all([
        razorpay.orders.fetch(razorpay_order_id),
        razorpay.payments.fetch(razorpay_payment_id),
        database_1.default.payment.findUnique({
          where: { paymentId: razorpay_payment_id },
        }),
      ]);

      if (existing) {
        return (0, response_1.sendSuccess)(res, {
          success: true,
          alreadyProcessed: true,
        });
      }

      if (
        order.notes?.userId !== req.user.userId ||
        order.notes?.planId !== planId
      ) {
        return (0, response_1.sendError)(
          res,
          "Order does not belong to this account",
          403
        );
      }

      if (
        payment.order_id !== razorpay_order_id ||
        payment.amount !== plan.amount ||
        payment.currency !== "INR" ||
        payment.status !== "captured"
      ) {
        return (0, response_1.sendError)(
          res,
          "Payment amount or status could not be verified",
          400
        );
      }

      // A credit pack adds credits only. It must not activate Pro.
      const updated = await database_1.default.$transaction(
        async (tx) => {
          await tx.payment.create({
            data: {
              paymentId: razorpay_payment_id,
              userId: req.user.userId,
              planId,
              amount: plan.amount,
              credits: plan.credits,
            },
          });

          return await tx.user.update({
            where: { id: req.user.userId },
            data: {
              aiCredits: { increment: plan.credits },
            },
            select: {
              aiCredits: true,
              isPro: true,
            },
          });
        }
      );

      return (0, response_1.sendSuccess)(res, {
        success: true,
        credits: updated.aiCredits,
        isPro: updated.isPro,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Razorpay webhooks use the raw request body mounted in server.js
// before express.json().
router.post("/webhook", async (req, res) => {
  if (!env_1.env.RAZORPAY_WEBHOOK_SECRET) {
    return res.status(500).json({
      error: "Razorpay webhook secret is not configured",
    });
  }

  const rawBody = req.rawBody || req.body;
  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto_1.default
    .createHmac("sha256", env_1.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (!safeSignatureEqual(signature, expected)) {
    return res.status(400).json({
      error: "Invalid webhook signature",
    });
  }

  let event;

  try {
    event = JSON.parse(
      Buffer.isBuffer(rawBody)
        ? rawBody.toString("utf8")
        : String(rawBody)
    );
  } catch {
    return res.status(400).json({
      error: "Invalid webhook payload",
    });
  }

  try {
    const subscriptionEntity =
      event.payload?.subscription?.entity;
    const paymentEntity = event.payload?.payment?.entity;

    const subscriptionId =
      subscriptionEntity?.id ||
      paymentEntity?.subscription_id;

    // Remove Pro and unused subscription credits when cancelled/halted.
    if (
      (
        event.event === "subscription.cancelled" ||
        event.event === "subscription.halted"
      ) &&
      subscriptionId
    ) {
      const user = await database_1.default.user.findFirst({
        where: { razorpaySubscriptionId: subscriptionId },
        select: {
          id: true,
          aiCredits: true,
          subscriptionCredits: true,
        },
      });

      if (user) {
        const monthlyCreditsLeft = Math.max(
          0,
          user.subscriptionCredits || 0
        );

        await database_1.default.user.update({
          where: { id: user.id },
          data: {
            isPro: false,
            aiCredits: Math.max(
              0,
              (user.aiCredits || 0) - monthlyCreditsLeft
            ),
            subscriptionCredits: 0,
          },
        });
      }
    }

    // Subscription renewal: process each payment once.
    if (
      event.event === "subscription.charged" &&
      subscriptionId &&
      paymentEntity?.id
    ) {
      const existing = await database_1.default.payment.findUnique({
        where: { paymentId: paymentEntity.id },
      });

      if (!existing) {
        const userIdFromNotes = subscriptionEntity?.notes?.userId;

        const user = await database_1.default.user.findFirst({
          where: {
            OR: [
              { razorpaySubscriptionId: subscriptionId },
              ...(userIdFromNotes
                ? [{ id: userIdFromNotes }]
                : []),
            ],
          },
        });

        if (user) {
          await database_1.default.$transaction(async (tx) => {
            await tx.payment.create({
              data: {
                paymentId: paymentEntity.id,
                userId: user.id,
                planId: "career-pro-monthly",
                amount: paymentEntity.amount || 0,
                credits: 100,
              },
            });

            await grantMonthlyProCredits(
              tx,
              user.id,
              subscriptionId
            );
          });
        }
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error(
      "[Razorpay Webhook] Processing failed:",
      error
    );

    return res.status(500).json({
      error: "Webhook processing failed",
    });
  }
});

exports.default = router;