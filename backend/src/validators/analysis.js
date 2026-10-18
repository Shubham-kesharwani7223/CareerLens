"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobMatchSchema = exports.analyzeSchema = void 0;
const zod_1 = require("zod");
// MongoDB ObjectId is a 24-character hex string
const objectId = zod_1.z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID format");
exports.analyzeSchema = zod_1.z.object({
    resumeId: objectId,
});
exports.jobMatchSchema = zod_1.z.object({
    resumeId: objectId,
    jobDescription: zod_1.z.string().min(10, "Job description must be at least 10 characters"),
});
