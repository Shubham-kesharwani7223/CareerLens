"use strict";

const prisma = require("../config/database").default;
const { getGamificationPool } = require("../config/gamificationDb");

/**
 * MongoDB is still the source of truth for CareerLens AI credits.
 * CreditGrant.eventKey makes a retry safe: one event can increment the balance once.
 * MongoDB deployments must support transactions (MongoDB Atlas replica sets do).
 */
async function applyCreditGrant({ userId, eventKey, credits, sourceType, sourceId }) {
  const amount = Math.max(0, Number.parseInt(String(credits || 0), 10) || 0);
  if (!amount) return { applied: false, duplicate: false };

  try {
    let applied = false;
    await prisma.$transaction(async (tx) => {
      const existing = await tx.creditGrant.findUnique({ where: { eventKey } });
      if (existing) return;

      await tx.creditGrant.create({
        data: {
          eventKey,
          userId,
          credits: amount,
          sourceType,
          sourceId: String(sourceId),
        },
      });
      await tx.user.update({
        where: { id: userId },
        data: { aiCredits: { increment: amount } },
      });
      applied = true;
    });
    return { applied, duplicate: !applied };
  } catch (error) {
    // A concurrent retry can hit the unique key after checking it; that is not a second reward.
    if (error && error.code === "P2002") return { applied: false, duplicate: true };
    throw error;
  }
}

async function deliverReward(eventKey) {
  const pool = getGamificationPool();
  const { rows } = await pool.query(
    "SELECT event_key, user_id, source_type, source_id, credits_earned, status FROM reward_transactions WHERE event_key = $1 LIMIT 1",
    [eventKey]
  );
  const row = rows[0];
  if (!row || row.status === "applied") return row || null;

  if (Number(row.credits_earned) > 0) {
    await applyCreditGrant({
      userId: row.user_id,
      eventKey: row.event_key,
      credits: row.credits_earned,
      sourceType: row.source_type,
      sourceId: row.source_id,
    });
  }
  await pool.query(
    "UPDATE reward_transactions SET status = 'applied', applied_at = NOW() WHERE event_key = $1 AND status <> 'applied'",
    [eventKey]
  );
  return { ...row, status: "applied" };
}

async function retryPendingRewards(userId) {
  const pool = getGamificationPool();
  const { rows } = await pool.query(
    "SELECT event_key FROM reward_transactions WHERE user_id = $1 AND status = 'pending' ORDER BY id ASC LIMIT 20",
    [userId]
  );
  const results = [];
  for (const row of rows) {
    try {
      await deliverReward(row.event_key);
      results.push({ eventKey: row.event_key, delivered: true });
    } catch (error) {
      console.error(`[Gamification reward] Retry failed for ${row.event_key}:`, error.message);
      results.push({ eventKey: row.event_key, delivered: false });
    }
  }
  return results;
}

module.exports = { applyCreditGrant, deliverReward, retryPendingRewards };
