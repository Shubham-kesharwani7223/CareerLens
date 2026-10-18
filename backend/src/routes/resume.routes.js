"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resume_controller_1 = require("../controllers/resume.controller");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
// POST /api/resume/upload
router.post("/upload", auth_1.authenticate, multer_1.upload.single("resume"), (req, res, next) => resume_controller_1.resumeController.upload(req, res, next));
// GET /api/resume/history
router.get("/history", auth_1.authenticate, (req, res, next) => resume_controller_1.resumeController.getHistory(req, res, next));
// GET /api/resume/:id
router.get("/:id", auth_1.authenticate, (req, res, next) => resume_controller_1.resumeController.getById(req, res, next));
// DELETE /api/resume/:id
router.delete("/:id", auth_1.authenticate, (req, res, next) => resume_controller_1.resumeController.delete(req, res, next));
exports.default = router;
