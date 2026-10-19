const nodemailer = require("nodemailer");

const sendFeedbackEmail = async ({
  rating,
  comment,
  user,
  createdAt,
}) => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    FEEDBACK_TO_EMAIL,
  } = process.env;

  const required = {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    FEEDBACK_TO_EMAIL,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing email configuration: ${missing.join(", ")}`
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const submittedAt = new Date(
    createdAt || Date.now()
  ).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: FEEDBACK_TO_EMAIL,
    subject: `CareerLens Feedback — ${rating}/5 stars`,
    text: [
      "New feedback received on CareerLens",
      "",
      `Rating: ${rating}/5`,
      `User name: ${user?.name || "Not available"}`,
      `User email: ${user?.email || "Not available"}`,
      `Submitted at: ${submittedAt}`,
      "",
      "Feedback comment:",
      comment?.trim() || "No comment provided.",
    ].join("\n"),
  });

  console.log("CareerLens feedback email sent successfully.");
};

module.exports = { sendFeedbackEmail };
