"use strict";

const nodemailer = require("nodemailer");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || host.startsWith("your-")) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure:
      String(process.env.SMTP_SECURE || "false").toLowerCase() ===
      "true",
    auth: { user, pass },
  });
}

async function sendFeedbackEmail({ feedback, user }) {
  const to = process.env.FEEDBACK_TO_EMAIL;

  if (!to) {
    console.warn(
      "[Feedback email] FEEDBACK_TO_EMAIL is not configured; feedback was saved but no email was sent."
    );

    return {
      sent: false,
      reason: "feedback_to_email_not_configured",
    };
  }

  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      "[Feedback email] SMTP is not configured; feedback was saved but no email was sent."
    );

    return {
      sent: false,
      reason: "smtp_not_configured",
    };
  }

  const name = user?.name || "CareerLens user";
  const email = user?.email || "Not available";
  const comment = feedback.comment || "(No comment provided)";

  const createdAt = new Date(
    feedback.createdAt || Date.now()
  ).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeComment = escapeHtml(comment).replace(/\r?\n/g, "<br>");
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: `CareerLens feedback: ${feedback.rating}/5 stars`,

    text: [
      "New CareerLens feedback received",
      "",
      `Rating: ${feedback.rating}/5`,
      `User: ${name}`,
      `User email: ${email}`,
      `Submitted: ${createdAt}`,
      `Feedback: ${comment}`,
      `Feedback ID: ${feedback.id}`,
    ].join("\n"),

    html: `<!doctype html>
<html>
<body style="font-family:Arial,sans-serif;color:#2c1930;line-height:1.6">
  <div style="max-width:600px;margin:auto;padding:24px;border:1px solid #e5d5e1;border-radius:16px">
    <h2 style="margin-top:0;color:#71516f">New CareerLens feedback</h2>
    <p style="font-size:20px"><strong>Rating:</strong> ${feedback.rating}/5 ★</p>
    <p><strong>User:</strong> ${safeName}</p>
    <p><strong>User email:</strong> ${safeEmail}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(createdAt)}</p>
    <div style="padding:16px;background:#fffaf2;border-radius:10px">
      <strong>Comment</strong>
      <p>${safeComment}</p>
    </div>
    <p style="font-size:12px;color:#78677c">
      Feedback ID: ${escapeHtml(feedback.id)}
    </p>
  </div>
</body>
</html>`,
  });

  return { sent: true };
}

module.exports = sendFeedbackEmail;