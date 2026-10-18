"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const google_auth_library_1 = require("google-auth-library");
const auth_service_1 = require("../services/auth.service");
const auth_1 = require("../validators/auth");
const response_1 = require("../helpers/response");
const env_1 = require("../config/env");
class AuthController {
    async register(req, res, next) {
        try {
            const data = auth_1.registerSchema.parse(req.body);
            const result = await auth_service_1.authService.register(data);
            (0, response_1.sendSuccess)(res, result, 201);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Email already registered") {
                (0, response_1.sendError)(res, error.message, 409);
                return;
            }
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const data = auth_1.loginSchema.parse(req.body);
            const result = await auth_service_1.authService.login(data);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message === "Invalid email or password") {
                (0, response_1.sendError)(res, error.message, 401);
                return;
            }
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, "Unauthorized", 401);
                return;
            }
            const user = await auth_service_1.authService.getProfile(req.user.userId);
            (0, response_1.sendSuccess)(res, user);
        }
        catch (error) {
            next(error);
        }
    }
    async googleAuth(req, res, next) {
        try {
            const parsed = auth_1.googleAuthBodySchema.safeParse(req.body);
            if (!parsed.success) {
                const first = parsed.error.issues[0];
                (0, response_1.sendError)(res, first?.message || "Invalid request body", 400);
                return;
            }
            const token = parsed.data.credential.trim();
            const isLikelyIdToken = token.split(".").length === 3;
            let email;
            let name;
            let picture;
            // If JWT: verifyIdToken. Otherwise (or on failure): Bearer access token → server-side userinfo only (no client profile).
            if (isLikelyIdToken && env_1.env.GOOGLE_CLIENT_ID) {
                try {
                    const client = new google_auth_library_1.OAuth2Client(env_1.env.GOOGLE_CLIENT_ID);
                    const ticket = await client.verifyIdToken({
                        idToken: token,
                        audience: env_1.env.GOOGLE_CLIENT_ID,
                    });
                    const payload = ticket.getPayload();
                    if (payload?.email) {
                        email = payload.email;
                        name = payload.name;
                        picture = payload.picture;
                    }
                }
                catch {
                    // Not a valid ID token for this client — may be a JWT-shaped access token; try userinfo below
                }
            }
            if (!email) {
                const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!userInfoRes.ok) {
                    (0, response_1.sendError)(res, "Could not verify Google account. Please try again.", 401);
                    return;
                }
                const p = (await userInfoRes.json());
                if (!p?.email) {
                    (0, response_1.sendError)(res, "Could not verify Google account. Please try again.", 401);
                    return;
                }
                email = p.email;
                name = p.name;
                picture = p.picture;
            }
            const result = await auth_service_1.authService.googleAuth({
                email: email,
                name: name || email.split("@")[0],
                picture: picture || "",
            });
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("Token used too late")) {
                (0, response_1.sendError)(res, "Google token expired. Please try again.", 401);
                return;
            }
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
