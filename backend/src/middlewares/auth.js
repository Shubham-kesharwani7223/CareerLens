// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.authenticate = authenticate;
// const jwt_1 = require("../helpers/jwt");
// const response_1 = require("../helpers/response");
// function authenticate(req, res, next) {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader?.startsWith("Bearer ")) {
//             (0, response_1.sendError)(res, "Authentication required", 401);
//             return;
//         }
//         const token = authHeader.split(" ")[1];
//         const payload = (0, jwt_1.verifyToken)(token);
//         req.user = payload;
//         next();
//     }
//     catch {
//         (0, response_1.sendError)(res, "Invalid or expired token", 401);
//     }
// }











































"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;

const database_1 = require("../config/database");
const jwt_1 = require("../helpers/jwt");
const response_1 = require("../helpers/response");

/**
 * Verify the bearer token and check account status server-side.
 * Suspended users cannot continue making authenticated API requests with an old token.
 */
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        (0, response_1.sendError)(res, "Authentication required", 401);
        return;
    }

    let payload;
    try {
        const token = authHeader.split(" ")[1];
        payload = (0, jwt_1.verifyToken)(token);
    }
    catch {
        (0, response_1.sendError)(res, "Invalid or expired token", 401);
        return;
    }

    try {
        const account = await database_1.default.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, isSuspended: true },
        });

        if (!account) {
            (0, response_1.sendError)(res, "Account not found", 401);
            return;
        }

        if (account.isSuspended === true) {
            (0, response_1.sendError)(res, "This account is suspended. Contact CareerLens support.", 403);
            return;
        }

        req.user = payload;
        next();
    }
    catch (error) {
        next(error);
    }
}
