"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("./env");
// Vercel's filesystem is read-only except for /tmp
// Use /tmp/uploads in production (Vercel), local UPLOAD_DIR in development
const uploadDir = process.env.VERCEL
    ? "/tmp/uploads"
    : path_1.default.resolve(env_1.env.UPLOAD_DIR);
// Ensure upload directory exists (safe on both local and /tmp)
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `resume-${uniqueSuffix}${ext}`);
    },
});
const ALLOWED_MIMES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];
const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only PDF and DOCX files are allowed"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: env_1.env.MAX_FILE_SIZE,
    },
});
