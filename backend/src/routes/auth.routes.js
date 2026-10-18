"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post("/register", (req, res, next) => auth_controller_1.authController.register(req, res, next));
// POST /api/auth/login
router.post("/login", (req, res, next) => auth_controller_1.authController.login(req, res, next));
// POST /api/auth/google
router.post("/google", (req, res, next) => auth_controller_1.authController.googleAuth(req, res, next));
// GET /api/auth/profile
router.get("/profile", auth_1.authenticate, (req, res, next) => auth_controller_1.authController.getProfile(req, res, next));
exports.default = router;
