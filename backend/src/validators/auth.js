"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthBodySchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(100),
    role: zod_1.z.enum([
        "fresher",
        "developer",
        "software_engineer",
        "ai_engineer",
        "ai_ml_engineer",
        "other",
    ]),
    customRole: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
/** Google sign-in: only a verified token; `.strict()` rejects any extra fields (e.g. client `profile`). */
exports.googleAuthBodySchema = zod_1.z
    .object({
    credential: zod_1.z.string().min(1, "Google credential is required"),
})
    .strict();
