// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.googleAuthBodySchema = exports.loginSchema = exports.registerSchema = void 0;
// const zod_1 = require("zod");
// exports.registerSchema = zod_1.z.object({
//     name: zod_1.z.string().min(2).max(50),
//     email: zod_1.z.string().email(),
//     password: zod_1.z.string().min(6).max(100),
//     role: zod_1.z.enum([
//     "fresher",
//     "developer",
//     "software_engineer",
//     "ai_engineer",
//     "ai_ml_engineer",
//     "other",
//     ]).default("fresher"),

//     customRole: zod_1.z.string().trim().max(50).optional(),
// });
// exports.loginSchema = zod_1.z.object({
//     email: zod_1.z.string().email(),
//     password: zod_1.z.string().min(1),
// });
// /** Google sign-in: only a verified token; `.strict()` rejects any extra fields (e.g. client `profile`). */
// exports.googleAuthBodySchema = zod_1.z
//     .object({
//     credential: zod_1.z.string().min(1, "Google credential is required"),
// })
//     .strict();












































"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.googleAuthBodySchema = exports.loginSchema = exports.registerSchema = void 0;

const zod_1 = require("zod");

const roleSchema = zod_1.z.enum([
  "fresher",
  "developer",
  "software_engineer",
  "ai_engineer",
  "ai_ml_engineer",
  "other",
]);

exports.registerSchema = zod_1.z
  .object({
    name: zod_1.z.string().trim().min(2).max(50),
    email: zod_1.z.string().trim().email(),
    password: zod_1.z.string().min(6).max(100),
    role: roleSchema.default("fresher"),
    customRole: zod_1.z.string().trim().max(50).optional(),
  })
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

exports.loginSchema = zod_1.z.object({
  email: zod_1.z.string().email(),
  password: zod_1.z.string().min(1),
});

/**
 * Google authentication:
 * - login: existing account only
 * - signup: create an account if it doesn't exist
 *
 * .strict() rejects unexpected request fields.
 */
exports.googleAuthBodySchema = zod_1.z
  .object({
    credential: zod_1.z.string().min(1, "Google credential is required"),
    mode: zod_1.z.enum(["login", "signup"]),
    role: roleSchema.optional(),
    customRole: zod_1.z.string().trim().max(50).optional(),
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