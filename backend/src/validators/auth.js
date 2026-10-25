
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.googleAuthBodySchema =
  exports.loginSchema =
  exports.registerSchema =
    void 0;

const zod_1 = require("zod");

const roleSchema = zod_1.z.enum([
  "fresher",
  "developer",
  "software_engineer",
  "ai_engineer",
  "ai_ml_engineer",
  "other",
]);

// Referral code is optional, normalized and length-limited.
const referralCodeSchema = zod_1.z
  .string()
  .trim()
  .max(20, "Referral code is too long")
  .transform((value) => value.toUpperCase())
  .optional();

// Normal email/password registration
exports.registerSchema = zod_1.z
  .object({
    name: zod_1.z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),

    email: zod_1.z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(254),

    password: zod_1.z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be at most 100 characters"),

    role: roleSchema.default("fresher"),

    customRole: zod_1.z
      .string()
      .trim()
      .max(50, "Custom role must be at most 50 characters")
      .optional(),

    referralCode: referralCodeSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      data.role === "other" &&
      (!data.customRole || data.customRole.length < 2)
    ) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        path: ["customRole"],
        message: "Please specify your career role.",
      });
    }
  });

// Normal email/password login
exports.loginSchema = zod_1.z
  .object({
    email: zod_1.z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(254),

    password: zod_1.z
      .string()
      .min(1, "Password is required")
      .max(100, "Password must be at most 100 characters"),
  })
  .strict();

/**
 * Google authentication request:
 * - credential: Google ID token returned by the frontend
 * - login: existing account only
 * - signup: create a new account if it doesn't exist
 *
 * The backend must verify the Google credential.
 * Never accept isAdmin or emailVerified from the client.
 */
exports.googleAuthBodySchema = zod_1.z
  .object({
    credential: zod_1.z
      .string()
      .min(1, "Google credential is required"),

    mode: zod_1.z.enum(["login", "signup"]),

    role: roleSchema.optional(),

    customRole: zod_1.z
      .string()
      .trim()
      .max(50, "Custom role must be at most 50 characters")
      .optional(),

    referralCode: referralCodeSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.mode === "signup" && !data.role) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        path: ["role"],
        message: "Please select your career role.",
      });
    }

    if (
      data.mode === "signup" &&
      data.role === "other" &&
      (!data.customRole || data.customRole.length < 2)
    ) {
      ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        path: ["customRole"],
        message: "Please specify your career role.",
      });
    }
  });
