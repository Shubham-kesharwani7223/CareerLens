"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeController = exports.ResumeController = void 0;
const resume_service_1 = require("../services/resume.service");
const response_1 = require("../helpers/response");
class ResumeController {
    async upload(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            if (!req.file) {
                (0, response_1.sendError)(res, "No file uploaded", 400);
                return;
            }
            const resume = await resume_service_1.resumeService.upload(req.user.userId, req.file);
            (0, response_1.sendSuccess)(res, resume, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getHistory(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const resumes = await resume_service_1.resumeService.getHistory(req.user.userId);
            (0, response_1.sendSuccess)(res, resumes);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const id = req.params.id;
            const resume = await resume_service_1.resumeService.getById(id, req.user.userId);
            (0, response_1.sendSuccess)(res, resume);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const id = req.params.id;
            const result = await resume_service_1.resumeService.delete(id, req.user.userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Resume not found") {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
}
exports.ResumeController = ResumeController;
exports.resumeController = new ResumeController();
