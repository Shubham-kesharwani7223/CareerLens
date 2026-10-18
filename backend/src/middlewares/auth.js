"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_1 = require("../helpers/jwt");
const response_1 = require("../helpers/response");
function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            (0, response_1.sendError)(res, "Authentication required", 401);
            return;
        }
        const token = authHeader.split(" ")[1];
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        (0, response_1.sendError)(res, "Invalid or expired token", 401);
    }
}
