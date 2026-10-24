"use strict";

const { Router } = require("express");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/admin");
const prisma = require("../config/database").default;
const { getGamificationPool } = require("../config/gamificationDb");
const { deliverReward, retryPendingRewards } = require("../services/gamificationRewards.service");

const router = Router();
router.use(authenticate);

const DEFAULT_TYPING_TEXT = "Practice a little every day and build skills for your next career opportunity.";
const asId = (value) => {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
};
const asInt = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : fallback;
};
const asText = (value, max = 1000) => String(value ?? "").trim().slice(0, max);
const sendOk = (res, data, status = 200) => res.status(status).json({ success: true, data });
const sendFail = (res, message, status = 400) => res.status(status).json({ success: false, message });
const sendAsyncError = (next, error) => next(error);

function activeSchedule(alias = "q") {
  return `${alias}.status = 'active' AND (${alias}.starts_at IS NULL OR ${alias}.starts_at <= NOW()) AND (${alias}.ends_at IS NULL OR ${alias}.ends_at >= NOW())`;
}

async function getActor(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, aiCredits: true },
  });
}

async function getRule(client, ruleKey, fallback) {
  const result = await client.query(
    "SELECT * FROM reward_rules WHERE rule_key = $1 AND is_active = TRUE LIMIT 1",
    [ruleKey]
  );
  return result.rows[0] || fallback;
}

async function earnedToday(client, userId, sourceType, column) {
  const allowedColumns = new Set(["credits_earned", "xp_earned"]);
  if (!allowedColumns.has(column)) throw new Error("Invalid reward balance column.");
  const result = await client.query(
    `SELECT COALESCE(SUM(${column}), 0)::int AS total FROM reward_transactions
     WHERE user_id = $1 AND source_type = $2 AND created_at >= date_trunc('day', NOW())
       AND status IN ('pending','applied')`,
    [userId, sourceType]
  );
  return Number(result.rows[0]?.total || 0);
}

async function reserveDailyAmount(client, userId, rule, requested, sourceType, metric) {
  if (!rule || requested <= 0) return 0;
  const conditions = typeof rule.condition_data === "object" && rule.condition_data ? rule.condition_data : {};
  const isCredits = metric === "credits";
  const capValue = isCredits
    ? (conditions.daily_credit_cap ?? rule.limit_count ?? 0)
    : (conditions.daily_xp_cap ?? (sourceType === "quiz" ? 200 : 100));
  const cap = Math.max(0, Number(capValue));
  if (!cap) return 0;
  const already = await earnedToday(client, userId, sourceType, isCredits ? "credits_earned" : "xp_earned");
  return Math.max(0, Math.min(requested, cap - already));
}

async function reserveDailyCreditAmount(client, userId, rule, requestedCredits, sourceType) {
  return reserveDailyAmount(client, userId, rule, requestedCredits, sourceType, "credits");
}

async function reserveDailyXpAmount(client, userId, rule, requestedXp, sourceType) {
  return reserveDailyAmount(client, userId, rule, requestedXp, sourceType, "xp");
}

async function finishAttemptReward(eventKey) {
  try {
    await deliverReward(eventKey);
    return true;
  } catch (error) {
    console.error(`[Gamification] Reward delivery pending for ${eventKey}:`, error.message);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Student APIs
// ---------------------------------------------------------------------------
router.get("/health", async (_req, res, next) => {
  try {
    const result = await getGamificationPool().query("SELECT NOW() AS database_time");
    return sendOk(res, { connected: true, databaseTime: result.rows[0].database_time });
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/categories", async (_req, res, next) => {
  try {
    const result = await getGamificationPool().query(
      `SELECT c.id, c.name, c.description, c.icon,
        (SELECT COUNT(*)::int FROM quizzes q WHERE q.category_id = c.id AND ${activeSchedule("q")}) AS quiz_count
       FROM categories c WHERE c.is_active = TRUE ORDER BY c.name`
    );
    return sendOk(res, result.rows);
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/quizzes", async (req, res, next) => {
  try {
    const pool = getGamificationPool();
    const categoryId = req.query.categoryId ? asId(req.query.categoryId) : null;
    const difficulty = ["beginner", "intermediate", "advanced"].includes(String(req.query.difficulty)) ? String(req.query.difficulty) : null;
    const result = await pool.query(
      `SELECT q.id, q.title, q.description, q.difficulty, q.time_limit_seconds,
              q.total_marks, q.reward_xp, q.reward_credits, q.created_at,
              c.id AS category_id, c.name AS category_name, c.icon AS category_icon,
              (SELECT COUNT(*)::int FROM questions qu WHERE qu.quiz_id = q.id) AS question_count
       FROM quizzes q JOIN categories c ON c.id = q.category_id
       WHERE ${activeSchedule("q")} AND c.is_active = TRUE
         AND ($1::bigint IS NULL OR q.category_id = $1)
         AND ($2::text IS NULL OR q.difficulty = $2)
       ORDER BY q.created_at DESC`,
      [categoryId, difficulty]
    );
    return sendOk(res, result.rows);
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/quizzes/:quizId/start", async (req, res, next) => {
  try {
    const quizId = asId(req.params.quizId);
    if (!quizId) return sendFail(res, "Invalid quiz ID.", 400);
    const pool = getGamificationPool();
    const actor = await getActor(req.user?.userId);
    if (!actor) return sendFail(res, "Account not found.", 401);

    const quizResult = await pool.query(
      `SELECT q.id, q.title, q.description, q.difficulty, q.time_limit_seconds,
              q.reward_xp, q.reward_credits, c.name AS category_name
       FROM quizzes q JOIN categories c ON c.id = q.category_id
       WHERE q.id = $1 AND ${activeSchedule("q")} AND c.is_active = TRUE LIMIT 1`,
      [quizId]
    );
    const quiz = quizResult.rows[0];
    if (!quiz) return sendFail(res, "This quiz is not currently available.", 404);

    const qResult = await pool.query(
      "SELECT id, question_text, options, marks, position FROM questions WHERE quiz_id = $1 ORDER BY position ASC, id ASC",
      [quizId]
    );
    if (!qResult.rows.length) return sendFail(res, "This quiz does not have questions yet.", 409);

    const previous = await pool.query(
      `SELECT id, started_at FROM quiz_attempts
       WHERE user_id = $1 AND quiz_id = $2 AND status = 'in_progress'
         AND started_at > NOW() - INTERVAL '2 hours'
       ORDER BY started_at DESC LIMIT 1`,
      [actor.id, quizId]
    );
    let attemptId;
    let startedAt;
    if (previous.rows[0]) {
      attemptId = previous.rows[0].id;
      startedAt = previous.rows[0].started_at;
    } else {
      const inserted = await pool.query(
        "INSERT INTO quiz_attempts (user_id, user_name, quiz_id, status) VALUES ($1,$2,$3,'in_progress') RETURNING id, started_at",
        [actor.id, actor.name || "CareerLens Learner", quizId]
      );
      attemptId = inserted.rows[0].id;
      startedAt = inserted.rows[0].started_at;
    }

    return sendOk(res, {
      attemptId,
      startedAt,
      quiz: { ...quiz, id: Number(quiz.id), timeLimitSeconds: Number(quiz.time_limit_seconds) },
      questions: qResult.rows.map((question) => ({
        id: Number(question.id),
        questionText: question.question_text,
        options: question.options,
        marks: Number(question.marks),
        position: Number(question.position),
      })),
    }, 201);
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/attempts/:attemptId/submit", async (req, res, next) => {
  const attemptId = asId(req.params.attemptId);
  if (!attemptId) return sendFail(res, "Invalid attempt ID.", 400);
  const answers = req.body?.answers;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return sendFail(res, "Answers must be an object keyed by question ID.", 400);

  let pool;
  let client;
  try { pool = getGamificationPool(); client = await pool.connect(); } catch (error) { return sendAsyncError(next, error); }
  let eventKey = `quiz-attempt:${attemptId}`;
  let resultPayload;
  try {
    await client.query("BEGIN");
    const attemptResult = await client.query(
      `SELECT a.*, q.title, q.time_limit_seconds, q.reward_xp, q.reward_credits
       FROM quiz_attempts a JOIN quizzes q ON q.id = a.quiz_id
       WHERE a.id = $1 AND a.user_id = $2 FOR UPDATE OF a`,
      [attemptId, req.user?.userId]
    );
    const attempt = attemptResult.rows[0];
    if (!attempt) {
      await client.query("ROLLBACK");
      return sendFail(res, "Quiz attempt not found.", 404);
    }

    if (attempt.status === "completed") {
      await client.query("COMMIT");
      await finishAttemptReward(eventKey);
      const existing = await pool.query("SELECT * FROM quiz_attempts WHERE id = $1", [attemptId]);
      const row = existing.rows[0];
      return sendOk(res, {
        attemptId,
        score: Number(row.score), totalMarks: Number(row.total_marks), accuracy: Number(row.accuracy),
        xpEarned: Number(row.xp_earned), creditsEarned: Number(row.credits_earned),
        timeTakenSeconds: Number(row.time_taken_seconds), alreadySubmitted: true, review: [],
      });
    }
    if (attempt.status !== "in_progress") {
      await client.query("ROLLBACK");
      return sendFail(res, "This attempt is no longer active. Start the quiz again.", 409);
    }

    const questionsResult = await client.query(
      "SELECT id, question_text, options, correct_option, explanation, marks FROM questions WHERE quiz_id = $1 ORDER BY position ASC, id ASC",
      [attempt.quiz_id]
    );
    const questions = questionsResult.rows;
    if (!questions.length) {
      await client.query("ROLLBACK");
      return sendFail(res, "This quiz no longer has questions.", 409);
    }

    const timeTaken = Math.max(1, Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000));
    if (timeTaken > Number(attempt.time_limit_seconds) + 10) {
      await client.query("UPDATE quiz_attempts SET status = 'expired' WHERE id = $1", [attemptId]);
      await client.query("COMMIT");
      return sendFail(res, "The quiz time limit expired. Start another attempt to try again.", 409);
    }

    let score = 0;
    let totalMarks = 0;
    const review = questions.map((question) => {
      const marks = Number(question.marks) || 1;
      totalMarks += marks;
      const rawSelected = answers[String(question.id)];
      const selected = rawSelected === undefined || rawSelected === null || rawSelected === "" ? null : Number(rawSelected);
      const correct = selected !== null && Number.isInteger(selected) && selected === Number(question.correct_option);
      if (correct) score += marks;
      return {
        id: Number(question.id),
        questionText: question.question_text,
        options: question.options,
        selectedOption: selected,
        correctOption: Number(question.correct_option),
        isCorrect: correct,
        explanation: question.explanation,
        marks,
      };
    });
    const accuracy = totalMarks ? Math.round((score / totalMarks) * 10000) / 100 : 0;
    const ruleResult = await client.query("SELECT * FROM reward_rules WHERE rule_key = 'quiz_completion' FOR UPDATE");
    const rule = ruleResult.rows[0] || { is_active: true, reward_xp: 40, reward_credits: 1, limit_count: 3, condition_data: { min_accuracy: 70, daily_credit_cap: 3, daily_xp_cap: 200, min_duration_seconds: 15 } };
    const conditions = rule.condition_data || {};
    const ruleEnabled = rule.is_active !== false;
    const passed = ruleEnabled && accuracy >= Number(conditions.min_accuracy ?? 70) && timeTaken >= Number(conditions.min_duration_seconds ?? 15);
    const configuredXp = Math.min(Number(attempt.reward_xp || 0), Number(rule.reward_xp || 0));
    const configuredCredits = Math.min(Number(attempt.reward_credits || 0), Number(rule.reward_credits || 0));
    const minDuration = Number(conditions.min_duration_seconds ?? 15);
    const xpCandidate = !ruleEnabled ? 0 : passed ? configuredXp : timeTaken >= minDuration ? Math.floor(configuredXp * accuracy / 100 * 0.25) : 0;
    const xpEarned = await reserveDailyXpAmount(client, req.user.userId, rule, xpCandidate, "quiz");
    const creditsEarned = passed ? await reserveDailyCreditAmount(client, req.user.userId, rule, configuredCredits, "quiz") : 0;

    await client.query(
      `UPDATE quiz_attempts SET score=$2, total_marks=$3, time_taken_seconds=$4, accuracy=$5,
       xp_earned=$6, credits_earned=$7, status='completed', completed_at=NOW() WHERE id=$1`,
      [attemptId, score, totalMarks, timeTaken, accuracy, xpEarned, creditsEarned]
    );
    await client.query(
      `INSERT INTO reward_transactions (event_key,user_id,source_type,source_id,xp_earned,credits_earned,status)
       VALUES ($1,$2,'quiz',$3,$4,$5,'pending') ON CONFLICT (event_key) DO NOTHING`,
      [eventKey, req.user.userId, String(attemptId), xpEarned, creditsEarned]
    );
    await client.query("COMMIT");
    resultPayload = { attemptId, score, totalMarks, accuracy, passed, xpEarned, creditsEarned, timeTakenSeconds: timeTaken, review };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return sendAsyncError(next, error);
  } finally {
    client.release();
  }

  const rewardDelivered = await finishAttemptReward(eventKey);
  return sendOk(res, { ...resultPayload, rewardDelivered, rewardMessage: rewardDelivered ? undefined : "Your result is saved. Credits are syncing and will retry when you open the rewards wallet." });
});

router.get("/games", async (_req, res, next) => {
  try {
    const result = await getGamificationPool().query(
      `SELECT id, title, game_type, description, reward_xp, reward_credits, created_at
       FROM games g WHERE ${activeSchedule("g")} ORDER BY created_at DESC`
    );
    return sendOk(res, result.rows.map((game) => ({ ...game, id: Number(game.id), rewardXp: Number(game.reward_xp), rewardCredits: Number(game.reward_credits) })));
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/games/:gameId/start", async (req, res, next) => {
  try {
    const gameId = asId(req.params.gameId);
    if (!gameId) return sendFail(res, "Invalid game ID.", 400);
    const pool = getGamificationPool();
    const actor = await getActor(req.user?.userId);
    if (!actor) return sendFail(res, "Account not found.", 401);
    const result = await pool.query(`SELECT * FROM games g WHERE g.id=$1 AND ${activeSchedule("g")} LIMIT 1`, [gameId]);
    const game = result.rows[0];
    if (!game) return sendFail(res, "This game is not currently available.", 404);
    const config = game.config && typeof game.config === "object" ? game.config : {};
    const challengeText = asText(config.challengeText || DEFAULT_TYPING_TEXT, 700) || DEFAULT_TYPING_TEXT;
    const timeLimitSeconds = Math.min(300, Math.max(30, asInt(config.timeLimitSeconds, 90)));
    const inserted = await pool.query(
      `INSERT INTO game_scores (user_id,user_name,game_id,status,max_score,challenge_text,time_limit_seconds)
       VALUES ($1,$2,$3,'in_progress',100,$4,$5) RETURNING id,started_at`,
      [actor.id, actor.name || "CareerLens Learner", gameId, challengeText, timeLimitSeconds]
    );
    return sendOk(res, {
      attemptId: Number(inserted.rows[0].id),
      startedAt: inserted.rows[0].started_at,
      game: { id: Number(game.id), title: game.title, gameType: game.game_type, rewardXp: Number(game.reward_xp), rewardCredits: Number(game.reward_credits) },
      challengeText,
      timeLimitSeconds,
    }, 201);
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/games/:gameId/submit", async (req, res, next) => {
  const gameId = asId(req.params.gameId);
  const attemptId = asId(req.body?.attemptId);
  const typedText = String(req.body?.typedText ?? "").slice(0, 3000);
  if (!gameId || !attemptId) return sendFail(res, "Invalid game or attempt ID.", 400);
  let pool;
  let client;
  try { pool = getGamificationPool(); client = await pool.connect(); } catch (error) { return sendAsyncError(next, error); }
  let eventKey = `typing-sprint:${attemptId}`;
  let payload;
  try {
    await client.query("BEGIN");
    const query = await client.query(
      `SELECT s.*, g.title, g.config, g.reward_xp, g.reward_credits
       FROM game_scores s JOIN games g ON g.id=s.game_id
       WHERE s.id=$1 AND s.game_id=$2 AND s.user_id=$3 FOR UPDATE`,
      [attemptId, gameId, req.user?.userId]
    );
    const attempt = query.rows[0];
    if (!attempt) { await client.query("ROLLBACK"); return sendFail(res, "Game attempt not found.", 404); }
    if (attempt.status === "completed") {
      await client.query("COMMIT");
      await finishAttemptReward(eventKey);
      const result = await pool.query("SELECT * FROM game_scores WHERE id=$1", [attemptId]);
      const row = result.rows[0];
      return sendOk(res, { attemptId, score: Number(row.score), accuracy: Number(row.accuracy), xpEarned: Number(row.xp_earned), creditsEarned: Number(row.credits_earned), timeTakenSeconds: Number(row.time_taken_seconds), alreadySubmitted: true });
    }
    if (attempt.status !== "in_progress") { await client.query("ROLLBACK"); return sendFail(res, "This game attempt is no longer active.", 409); }
    const config = attempt.config && typeof attempt.config === "object" ? attempt.config : {};
    const target = String(attempt.challenge_text || config.challengeText || DEFAULT_TYPING_TEXT).slice(0, 700);
    const timeTaken = Math.max(1, Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000));
    if (timeTaken > Number(attempt.time_limit_seconds || 90) + 10) {
      await client.query("UPDATE game_scores SET status='expired' WHERE id=$1", [attemptId]);
      await client.query("COMMIT");
      return sendFail(res, "The game time limit expired. Start another round to try again.", 409);
    }
    const expected = target.replace(/\s+/g, " ").trim();
    const submitted = typedText.replace(/\s+/g, " ").trim();
    let matched = 0;
    for (let i = 0; i < Math.min(expected.length, submitted.length); i += 1) if (expected[i] === submitted[i]) matched += 1;
    const accuracy = expected.length ? Math.round((matched / expected.length) * 10000) / 100 : 0;
    const words = submitted ? submitted.split(/\s+/).length : 0;
    const wpm = Math.round(words / Math.max(timeTaken / 60, 1 / 60));
    const score = Math.min(100, Math.max(0, Math.round(accuracy * 0.75 + Math.min(wpm, 100) * 0.25)));
    const ruleResult = await client.query("SELECT * FROM reward_rules WHERE rule_key='typing_sprint' FOR UPDATE");
    const rule = ruleResult.rows[0] || { is_active: true, reward_xp: 20, reward_credits: 1, limit_count: 2, condition_data: { min_accuracy: 75, daily_credit_cap: 2, daily_xp_cap: 100, min_duration_seconds: 10 } };
    const conditions = rule.condition_data || {};
    const ruleEnabled = rule.is_active !== false;
    const passed = ruleEnabled && accuracy >= Number(conditions.min_accuracy ?? 75) && timeTaken >= Number(conditions.min_duration_seconds ?? 10);
    const configuredXp = Math.min(Number(attempt.reward_xp || 0), Number(rule.reward_xp || 0));
    const configuredCredits = Math.min(Number(attempt.reward_credits || 0), Number(rule.reward_credits || 0));
    const xpEarned = passed ? await reserveDailyXpAmount(client, req.user.userId, rule, configuredXp, "typing_sprint") : 0;
    const creditsEarned = passed ? await reserveDailyCreditAmount(client, req.user.userId, rule, configuredCredits, "typing_sprint") : 0;
    await client.query(
      `UPDATE game_scores SET score=$2,max_score=100,time_taken_seconds=$3,accuracy=$4,xp_earned=$5,credits_earned=$6,status='completed',completed_at=NOW() WHERE id=$1`,
      [attemptId, score, timeTaken, accuracy, xpEarned, creditsEarned]
    );
    await client.query(
      `INSERT INTO reward_transactions (event_key,user_id,source_type,source_id,xp_earned,credits_earned,status)
       VALUES ($1,$2,'typing_sprint',$3,$4,$5,'pending') ON CONFLICT(event_key) DO NOTHING`,
      [eventKey, req.user.userId, String(attemptId), xpEarned, creditsEarned]
    );
    await client.query("COMMIT");
    payload = { attemptId, score, accuracy, wpm, xpEarned, creditsEarned, passed, timeTakenSeconds: timeTaken };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return sendAsyncError(next, error);
  } finally { client.release(); }
  const rewardDelivered = await finishAttemptReward(eventKey);
  return sendOk(res, { ...payload, rewardDelivered });
});

router.get("/leaderboard", async (req, res, next) => {
  try {
    const period = ["week", "month", "all"].includes(String(req.query.period)) ? String(req.query.period) : "week";
    const dateFilter = period === "week" ? "AND completed_at >= NOW() - INTERVAL '7 days'" : period === "month" ? "AND completed_at >= NOW() - INTERVAL '30 days'" : "";
    const sql = `WITH score_rows AS (
        SELECT user_id,user_name,xp_earned,credits_earned,accuracy,completed_at FROM quiz_attempts WHERE status='completed' ${dateFilter}
        UNION ALL
        SELECT user_id,user_name,xp_earned,credits_earned,accuracy,completed_at FROM game_scores WHERE status='completed' ${dateFilter}
      )
      SELECT user_id, MAX(user_name) AS user_name, COALESCE(SUM(xp_earned),0)::int AS xp,
             COALESCE(SUM(credits_earned),0)::int AS credits, COUNT(*)::int AS attempts,
             COALESCE(ROUND(AVG(accuracy)::numeric,1),0)::float AS average_accuracy
      FROM score_rows GROUP BY user_id ORDER BY xp DESC, average_accuracy DESC, attempts DESC LIMIT 100`;
    const result = await getGamificationPool().query(sql);
    return sendOk(res, { period, items: result.rows.map((row, index) => ({ rank: index + 1, userId: row.user_id, name: row.user_name, xp: Number(row.xp), credits: Number(row.credits), attempts: Number(row.attempts), averageAccuracy: Number(row.average_accuracy) })) });
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/wallet", async (req, res, next) => {
  try {
    await retryPendingRewards(req.user.userId);
    const actor = await getActor(req.user.userId);
    if (!actor) return sendFail(res, "Account not found.", 401);
    const pool = getGamificationPool();
    const [stats, history] = await Promise.all([
      pool.query(
        `WITH score_rows AS (
          SELECT xp_earned,credits_earned FROM quiz_attempts WHERE user_id=$1 AND status='completed'
          UNION ALL SELECT xp_earned,credits_earned FROM game_scores WHERE user_id=$1 AND status='completed'
        ) SELECT COALESCE(SUM(xp_earned),0)::int AS xp, COALESCE(SUM(credits_earned),0)::int AS earned_credits, COUNT(*)::int AS attempts FROM score_rows`,
        [actor.id]
      ),
      pool.query(
        "SELECT source_type,source_id,xp_earned,credits_earned,status,created_at FROM reward_transactions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 25",
        [actor.id]
      ),
    ]);
    return sendOk(res, {
      aiCredits: Number(actor.aiCredits || 0),
      xp: Number(stats.rows[0]?.xp || 0),
      earnedCredits: Number(stats.rows[0]?.earned_credits || 0),
      attempts: Number(stats.rows[0]?.attempts || 0),
      history: history.rows,
    });
  } catch (error) { return sendAsyncError(next, error); }
});

// ---------------------------------------------------------------------------
// Admin APIs — the backend verifies ADMIN_EMAIL on every route.
// ---------------------------------------------------------------------------
router.use("/admin", requireAdmin);

router.get("/admin/overview", async (_req, res, next) => {
  try {
    const pool = getGamificationPool();
    const [quizzes, questions, games, attempts, credits, learners] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='active')::int AS active FROM quizzes"),
      pool.query("SELECT COUNT(*)::int AS total FROM questions"),
      pool.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status='active')::int AS active FROM games"),
      pool.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE completed_at >= NOW()-INTERVAL '7 days')::int AS recent FROM quiz_attempts WHERE status='completed'"),
      pool.query("SELECT COALESCE(SUM(credits_earned),0)::int AS credits FROM reward_transactions WHERE status='applied'"),
      pool.query(`SELECT COUNT(DISTINCT user_id)::int AS total FROM (
        SELECT user_id FROM quiz_attempts WHERE completed_at >= NOW()-INTERVAL '7 days'
        UNION SELECT user_id FROM game_scores WHERE completed_at >= NOW()-INTERVAL '7 days'
      ) activity`),
    ]);
    return sendOk(res, {
      quizzes: quizzes.rows[0], questions: questions.rows[0].total, games: games.rows[0],
      attempts: attempts.rows[0], creditsDistributed: credits.rows[0].credits, activeLearners7Days: learners.rows[0].total,
    });
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/admin/categories", async (_req, res, next) => {
  try {
    const result = await getGamificationPool().query(
      `SELECT c.*, (SELECT COUNT(*)::int FROM quizzes q WHERE q.category_id=c.id) AS quiz_count FROM categories c ORDER BY c.name`
    );
    return sendOk(res, result.rows);
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/admin/categories", async (req, res, next) => {
  try {
    const name = asText(req.body?.name, 80);
    if (name.length < 2) return sendFail(res, "Category name must be at least 2 characters.");
    const result = await getGamificationPool().query(
      "INSERT INTO categories (name,description,icon) VALUES ($1,$2,$3) RETURNING *",
      [name, asText(req.body?.description, 500), asText(req.body?.icon || "book-open", 40)]
    );
    return sendOk(res, result.rows[0], 201);
  } catch (error) {
    if (error.code === "23505") return sendFail(res, "A category with this name already exists.", 409);
    return sendAsyncError(next, error);
  }
});

router.patch("/admin/categories/:id", async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id || typeof req.body?.isActive !== "boolean") return sendFail(res, "A valid category ID and isActive boolean are required.");
    const result = await getGamificationPool().query(
      "UPDATE categories SET is_active=$2,updated_at=NOW() WHERE id=$1 RETURNING *", [id, req.body.isActive]
    );
    if (!result.rows[0]) return sendFail(res, "Category not found.", 404);
    return sendOk(res, result.rows[0]);
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/admin/quizzes", async (_req, res, next) => {
  try {
    const result = await getGamificationPool().query(
      `SELECT q.*, c.name AS category_name,
        (SELECT COUNT(*)::int FROM questions qu WHERE qu.quiz_id=q.id) AS question_count
       FROM quizzes q JOIN categories c ON c.id=q.category_id ORDER BY q.created_at DESC`
    );
    return sendOk(res, result.rows);
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/admin/quizzes", async (req, res, next) => {
  try {
    const categoryId = asId(req.body?.categoryId);
    const title = asText(req.body?.title, 160);
    if (!categoryId || title.length < 3) return sendFail(res, "Select a category and enter a quiz title.");
    const difficulty = ["beginner", "intermediate", "advanced"].includes(req.body?.difficulty) ? req.body.difficulty : "beginner";
    const timeLimitSeconds = Math.min(7200, Math.max(30, asInt(req.body?.timeLimitSeconds, 600)));
    const rewardXp = Math.min(10000, Math.max(0, asInt(req.body?.rewardXp, 40)));
    const rewardCredits = Math.min(20, Math.max(0, asInt(req.body?.rewardCredits, 1)));
    const requestedStatus = ["draft", "active", "inactive"].includes(req.body?.status) ? req.body.status : "draft";
    // Never expose an empty quiz even if the admin selects Active at creation time.
    const status = requestedStatus === "active" ? "draft" : requestedStatus;
    const actor = await getActor(req.user.userId);
    const result = await getGamificationPool().query(
      `INSERT INTO quizzes (category_id,title,description,difficulty,time_limit_seconds,reward_xp,reward_credits,status,starts_at,ends_at,created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [categoryId, title, asText(req.body?.description, 1000), difficulty, timeLimitSeconds, rewardXp, rewardCredits, status,
        req.body?.startsAt ? new Date(req.body.startsAt) : null, req.body?.endsAt ? new Date(req.body.endsAt) : null, actor?.email || "admin"]
    );
    return sendOk(res, result.rows[0], 201);
  } catch (error) { return sendAsyncError(next, error); }
});

router.patch("/admin/quizzes/:id", async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return sendFail(res, "Invalid quiz ID.");
    const existing = await getGamificationPool().query("SELECT * FROM quizzes WHERE id=$1", [id]);
    if (!existing.rows[0]) return sendFail(res, "Quiz not found.", 404);
    const old = existing.rows[0];
    const b = req.body || {};
    const categoryId = b.categoryId === undefined ? old.category_id : asId(b.categoryId);
    const status = b.status === undefined ? old.status : (["draft", "active", "inactive"].includes(b.status) ? b.status : null);
    const difficulty = b.difficulty === undefined ? old.difficulty : (["beginner", "intermediate", "advanced"].includes(b.difficulty) ? b.difficulty : null);
    if (!categoryId || !status || !difficulty) return sendFail(res, "Invalid category, status or difficulty.");
    if (status === "active") {
      const countResult = await getGamificationPool().query(
        "SELECT COUNT(*)::int AS total FROM questions WHERE quiz_id = $1",
        [id]
      );
      if (Number(countResult.rows[0]?.total || 0) < 1) {
        return sendFail(res, "Add at least one question before publishing this quiz.", 409);
      }
    }
    const result = await getGamificationPool().query(
      `UPDATE quizzes SET category_id=$2,title=$3,description=$4,difficulty=$5,time_limit_seconds=$6,
       reward_xp=$7,reward_credits=$8,status=$9,starts_at=$10,ends_at=$11,updated_at=NOW() WHERE id=$1 RETURNING *`,
      [id, categoryId, b.title === undefined ? old.title : asText(b.title, 160),
        b.description === undefined ? old.description : asText(b.description, 1000), difficulty,
        b.timeLimitSeconds === undefined ? old.time_limit_seconds : Math.min(7200, Math.max(30, asInt(b.timeLimitSeconds, old.time_limit_seconds))),
        b.rewardXp === undefined ? old.reward_xp : Math.min(10000, Math.max(0, asInt(b.rewardXp, old.reward_xp))),
        b.rewardCredits === undefined ? old.reward_credits : Math.min(20, Math.max(0, asInt(b.rewardCredits, old.reward_credits))), status,
        b.startsAt === undefined ? old.starts_at : b.startsAt ? new Date(b.startsAt) : null,
        b.endsAt === undefined ? old.ends_at : b.endsAt ? new Date(b.endsAt) : null]
    );
    return sendOk(res, result.rows[0]);
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/admin/quizzes/:id/questions", async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return sendFail(res, "Invalid quiz ID.");
    const result = await getGamificationPool().query(
      "SELECT id,quiz_id,question_text,options,correct_option,explanation,marks,position FROM questions WHERE quiz_id=$1 ORDER BY position,id", [id]
    );
    return sendOk(res, result.rows);
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/admin/quizzes/:id/questions", async (req, res, next) => {
  try {
    const quizId = asId(req.params.id);
    const questionText = asText(req.body?.questionText, 3000);
    const options = Array.isArray(req.body?.options) ? req.body.options.map((value) => asText(value, 500)) : [];
    const correctOption = asInt(req.body?.correctOption, -1);
    const marks = Math.min(100, Math.max(1, asInt(req.body?.marks, 1)));
    if (!quizId || questionText.length < 5 || options.length !== 4 || options.some((option) => !option) || correctOption < 0 || correctOption > 3) {
      return sendFail(res, "Question needs text, four non-empty options and a correct option (0–3).");
    }
    const pool = getGamificationPool();
    const created = await pool.query(
      `INSERT INTO questions (quiz_id,question_text,options,correct_option,explanation,marks,position)
       VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7) RETURNING id,quiz_id,question_text,options,correct_option,explanation,marks,position`,
      [quizId, questionText, JSON.stringify(options), correctOption, asText(req.body?.explanation, 2000), marks, Math.max(1, asInt(req.body?.position, 1))]
    );
    await pool.query("UPDATE quizzes SET total_marks=(SELECT COALESCE(SUM(marks),0)::int FROM questions WHERE quiz_id=$1),updated_at=NOW() WHERE id=$1", [quizId]);
    return sendOk(res, created.rows[0], 201);
  } catch (error) { return sendAsyncError(next, error); }
});

router.patch("/admin/questions/:id", async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return sendFail(res, "Invalid question ID.");
    const pool = getGamificationPool();
    const lookup = await pool.query("SELECT * FROM questions WHERE id=$1", [id]);
    const old = lookup.rows[0];
    if (!old) return sendFail(res, "Question not found.", 404);
    const b = req.body || {};
    const options = b.options === undefined ? old.options : Array.isArray(b.options) ? b.options.map((value) => asText(value, 500)) : null;
    const correctOption = b.correctOption === undefined ? Number(old.correct_option) : asInt(b.correctOption, -1);
    if (!Array.isArray(options) || options.length !== 4 || options.some((value) => !value) || correctOption < 0 || correctOption > 3) return sendFail(res, "A question must have four options and a correct option 0–3.");
    const result = await pool.query(
      `UPDATE questions SET question_text=$2,options=$3::jsonb,correct_option=$4,explanation=$5,marks=$6,position=$7 WHERE id=$1 RETURNING *`,
      [id, b.questionText === undefined ? old.question_text : asText(b.questionText, 3000), JSON.stringify(options), correctOption,
        b.explanation === undefined ? old.explanation : asText(b.explanation, 2000), b.marks === undefined ? old.marks : Math.min(100, Math.max(1, asInt(b.marks, old.marks))), b.position === undefined ? old.position : Math.max(1, asInt(b.position, old.position))]
    );
    await pool.query("UPDATE quizzes SET total_marks=(SELECT COALESCE(SUM(marks),0)::int FROM questions WHERE quiz_id=$1),updated_at=NOW() WHERE id=$1", [old.quiz_id]);
    return sendOk(res, result.rows[0]);
  } catch (error) { return sendAsyncError(next, error); }
});

router.delete("/admin/questions/:id", async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return sendFail(res, "Invalid question ID.");
    const pool = getGamificationPool();
    const found = await pool.query("SELECT quiz_id FROM questions WHERE id=$1", [id]);
    if (!found.rows[0]) return sendFail(res, "Question not found.", 404);
    await pool.query("DELETE FROM questions WHERE id=$1", [id]);
    await pool.query(
      `UPDATE quizzes SET total_marks=(SELECT COALESCE(SUM(marks),0)::int FROM questions WHERE quiz_id=$1),
       status=CASE WHEN (SELECT COUNT(*) FROM questions WHERE quiz_id=$1)=0 THEN 'draft' ELSE status END,
       updated_at=NOW() WHERE id=$1`,
      [found.rows[0].quiz_id]
    );
    return sendOk(res, { deleted: true, id });
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/admin/games", async (_req, res, next) => {
  try {
    const result = await getGamificationPool().query("SELECT * FROM games ORDER BY created_at DESC");
    return sendOk(res, result.rows);
  } catch (error) { return sendAsyncError(next, error); }
});

router.post("/admin/games", async (req, res, next) => {
  try {
    const title = asText(req.body?.title, 160);
    if (title.length < 3) return sendFail(res, "Game title must be at least 3 characters.");
    const status = ["draft", "active", "inactive"].includes(req.body?.status) ? req.body.status : "draft";
    const config = {
      challengeText: asText(req.body?.challengeText || DEFAULT_TYPING_TEXT, 700) || DEFAULT_TYPING_TEXT,
      timeLimitSeconds: Math.min(300, Math.max(30, asInt(req.body?.timeLimitSeconds, 90))),
    };
    const actor = await getActor(req.user.userId);
    const result = await getGamificationPool().query(
      `INSERT INTO games (title,game_type,description,config,reward_xp,reward_credits,status,created_by)
       VALUES ($1,'typing_sprint',$2,$3::jsonb,$4,$5,$6,$7) RETURNING *`,
      [title, asText(req.body?.description, 1000), JSON.stringify(config), Math.min(10000, Math.max(0, asInt(req.body?.rewardXp, 20))), Math.min(10, Math.max(0, asInt(req.body?.rewardCredits, 1))), status, actor?.email || "admin"]
    );
    return sendOk(res, result.rows[0], 201);
  } catch (error) { return sendAsyncError(next, error); }
});

router.patch("/admin/games/:id", async (req, res, next) => {
  try {
    const id = asId(req.params.id);
    if (!id) return sendFail(res, "Invalid game ID.");
    const pool = getGamificationPool();
    const found = await pool.query("SELECT * FROM games WHERE id=$1", [id]);
    const old = found.rows[0];
    if (!old) return sendFail(res, "Game not found.", 404);
    const b = req.body || {};
    const status = b.status === undefined ? old.status : b.status;
    if (!["draft", "active", "inactive"].includes(status)) return sendFail(res, "Invalid game status.");
    const title = b.title === undefined ? old.title : asText(b.title, 160);
    if (title.length < 3) return sendFail(res, "Game title must be at least 3 characters.");
    const oldConfig = old.config && typeof old.config === "object" ? old.config : {};
    const config = {
      ...oldConfig,
      challengeText: b.challengeText === undefined
        ? asText(oldConfig.challengeText || DEFAULT_TYPING_TEXT, 700)
        : asText(b.challengeText || DEFAULT_TYPING_TEXT, 700),
      timeLimitSeconds: b.timeLimitSeconds === undefined
        ? Math.min(300, Math.max(30, asInt(oldConfig.timeLimitSeconds, 90)))
        : Math.min(300, Math.max(30, asInt(b.timeLimitSeconds, 90))),
    };
    const description = b.description === undefined ? old.description : asText(b.description, 1000);
    const rewardXp = b.rewardXp === undefined ? Number(old.reward_xp) : Math.min(10000, Math.max(0, asInt(b.rewardXp, Number(old.reward_xp))));
    const rewardCredits = b.rewardCredits === undefined ? Number(old.reward_credits) : Math.min(10, Math.max(0, asInt(b.rewardCredits, Number(old.reward_credits))));
    const result = await pool.query(
      `UPDATE games SET title=$2, description=$3, config=$4::jsonb, reward_xp=$5,
       reward_credits=$6, status=$7, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [id, title, description, JSON.stringify(config), rewardXp, rewardCredits, status]
    );
    return sendOk(res, result.rows[0]);
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/admin/reward-rules", async (_req, res, next) => {
  try {
    const result = await getGamificationPool().query("SELECT * FROM reward_rules ORDER BY id");
    return sendOk(res, result.rows);
  } catch (error) { return sendAsyncError(next, error); }
});

router.patch("/admin/reward-rules/:key", async (req, res, next) => {
  try {
    const key = asText(req.params.key, 80);
    const pool = getGamificationPool();
    const oldResult = await pool.query("SELECT * FROM reward_rules WHERE rule_key=$1", [key]);
    const old = oldResult.rows[0];
    if (!old) return sendFail(res, "Reward rule not found.", 404);
    const b = req.body || {};
    const currentConditions = old.condition_data || {};
    const conditionData = b.conditionData && typeof b.conditionData === "object" ? b.conditionData : currentConditions;
    const rewardXp = b.rewardXp === undefined ? Number(old.reward_xp) : Math.min(10000, Math.max(0, asInt(b.rewardXp, Number(old.reward_xp))));
    const rewardCredits = b.rewardCredits === undefined ? Number(old.reward_credits) : Math.min(20, Math.max(0, asInt(b.rewardCredits, Number(old.reward_credits))));
    const limitCount = b.limitCount === undefined ? Number(old.limit_count) : Math.max(0, asInt(b.limitCount, Number(old.limit_count)));
    const isActive = b.isActive === undefined ? old.is_active : Boolean(b.isActive);
    const result = await pool.query(
      "UPDATE reward_rules SET condition_data=$2::jsonb,reward_xp=$3,reward_credits=$4,limit_count=$5,is_active=$6,updated_at=NOW() WHERE rule_key=$1 RETURNING *",
      [key, JSON.stringify(conditionData), rewardXp, rewardCredits, limitCount, isActive]
    );
    return sendOk(res, result.rows[0]);
  } catch (error) { return sendAsyncError(next, error); }
});

router.get("/admin/analytics", async (_req, res, next) => {
  try {
    const pool = getGamificationPool();
    const [attempts, recent, categories, creditsByDay] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS attempts, COALESCE(ROUND(AVG(accuracy)::numeric,1),0)::float AS average_accuracy,
        COALESCE(SUM(xp_earned),0)::int AS xp FROM (
          SELECT accuracy,xp_earned FROM quiz_attempts WHERE status='completed'
          UNION ALL SELECT accuracy,xp_earned FROM game_scores WHERE status='completed'
        ) t`),
      pool.query(`SELECT date_trunc('day',created_at)::date AS day, COUNT(*)::int AS attempts
        FROM (SELECT completed_at AS created_at FROM quiz_attempts WHERE status='completed' UNION ALL SELECT completed_at FROM game_scores WHERE status='completed') activity
        WHERE created_at >= NOW()-INTERVAL '7 days' GROUP BY 1 ORDER BY 1`),
      pool.query(`SELECT c.name,COUNT(a.id)::int AS attempts,COALESCE(ROUND(AVG(a.accuracy)::numeric,1),0)::float AS average_accuracy
        FROM categories c LEFT JOIN quizzes q ON q.category_id=c.id LEFT JOIN quiz_attempts a ON a.quiz_id=q.id AND a.status='completed'
        GROUP BY c.id ORDER BY attempts DESC,c.name`),
      pool.query(`SELECT date_trunc('day',created_at)::date AS day,COALESCE(SUM(credits_earned),0)::int AS credits
        FROM reward_transactions WHERE status='applied' AND created_at >= NOW()-INTERVAL '7 days' GROUP BY 1 ORDER BY 1`),
    ]);
    return sendOk(res, { summary: attempts.rows[0], attemptsLast7Days: recent.rows, categories: categories.rows, creditsLast7Days: creditsByDay.rows });
  } catch (error) { return sendAsyncError(next, error); }
});

module.exports = router;
