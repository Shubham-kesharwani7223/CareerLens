"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeService = exports.ResumeService = void 0;
const database_1 = __importDefault(require("../config/database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const analysis_service_1 = require("./analysis.service");
function detectExt(file) {
    const e = path_1.default.extname(file.originalname).toLowerCase();
    if (e === ".pdf" || e === ".docx")
        return e;
    if (file.mimetype === "application/pdf")
        return ".pdf";
    if (file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return ".docx";
    }
    return null;
}
class ResumeService {
    async upload(userId, file) {
        const resume = await database_1.default.resume.create({
            data: {
                userId,
                fileUrl: file.path,
                fileName: file.originalname,
            },
            include: {
                analysis: true,
            },
        });
        // ── Persist extracted text now, while the bytes are still in this serverless invocation.
        // On Vercel, `/tmp` is *not* shared between invocations — so a later /analyze call
        // would not see the file at all. Caching the text here makes /analyze deterministic.
        try {
            const ext = detectExt(file);
            if (!ext) {
                console.warn("[Resume upload] Unsupported extension/mime:", file.originalname, file.mimetype);
            }
            else {
                let buffer = null;
                if (file.buffer && file.buffer.length > 0) {
                    buffer = file.buffer;
                }
                else if (file.path && fs_1.default.existsSync(file.path)) {
                    buffer = fs_1.default.readFileSync(file.path);
                }
                if (!buffer) {
                    console.error("[Resume upload] No buffer or readable file path — cannot pre-extract text");
                }
                else {
                    const extracted = await (0, analysis_service_1.extractTextFromBuffer)(buffer, ext, file.originalname, file.path);
                    if (extracted.trim()) {
                        await database_1.default.resume.update({
                            where: { id: resume.id },
                            data: { storedResumeText: extracted.slice(0, 500000) },
                        });
                        const refreshed = await database_1.default.resume.findFirst({
                            where: { id: resume.id, userId },
                            include: { analysis: true },
                        });
                        if (refreshed)
                            return refreshed;
                    }
                    else {
                        console.warn(`[Resume upload] Extraction yielded 0 words for ${file.originalname} — analyze will likely fail until user uploads a text-based PDF/DOCX.`);
                    }
                }
            }
        }
        catch (err) {
            console.error("[Resume upload] Pre-extraction failed (non-fatal):", err);
        }
        return resume;
    }
    async getHistory(userId) {
        const resumes = await database_1.default.resume.findMany({
            where: { userId },
            include: { analysis: true },
            orderBy: { createdAt: "desc" },
        });
        return resumes;
    }
    async getById(id, userId) {
        const resume = await database_1.default.resume.findFirst({
            where: { id, userId },
            include: { analysis: true },
        });
        if (!resume) {
            throw new Error("Resume not found");
        }
        return resume;
    }
    async delete(id, userId) {
        const resume = await database_1.default.resume.findFirst({
            where: { id, userId },
        });
        if (!resume) {
            throw new Error("Resume not found");
        }
        try {
            const filePath = path_1.default.resolve(resume.fileUrl);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        catch {
            /* file may already be gone (e.g. /tmp wiped) */
        }
        await database_1.default.resume.delete({
            where: { id },
        });
        return { message: "Resume deleted successfully" };
    }
}
exports.ResumeService = ResumeService;
exports.resumeService = new ResumeService();
