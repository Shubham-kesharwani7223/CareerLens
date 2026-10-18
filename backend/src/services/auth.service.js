// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.authService = exports.AuthService = void 0;
// const node_crypto_1 = require("node:crypto");
// const database_1 = __importDefault(require("../config/database"));
// const password_1 = require("../helpers/password");
// const jwt_1 = require("../helpers/jwt");
// class AuthService {
//     async register(data) {
//         const existingUser = await database_1.default.user.findUnique({
//             where: { email: data.email },
//         });
//         if (existingUser) {
//             throw new Error("Email already registered");
//         }
//         const hashedPassword = await (0, password_1.hashPassword)(data.password);
//         const user = await database_1.default.user.create({
//             data: {
//                 name: data.name,
//                 email: data.email,
//                 password: hashedPassword,
//                 role: data.role === "other" && data.customRole ? data.customRole : data.role,
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 isPro: true,
//                 aiCredits: true,
//                 createdAt: true,
//             },
//         });
//         const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email });
//         return { user, token };
//     }
//     async login(data) {
//         const user = await database_1.default.user.findUnique({
//             where: { email: data.email },
//         });
//         if (!user) {
//             throw new Error("Invalid email or password");
//         }
//         const isValidPassword = await (0, password_1.comparePassword)(data.password, user.password);
//         if (!isValidPassword) {
//             throw new Error("Invalid email or password");
//         }
//         const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email });
//         return {
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 isPro: user.isPro,
//                 aiCredits: user.aiCredits,
//                 createdAt: user.createdAt,
//             },
//             token,
//         };
//     }
//     async getProfile(userId) {
//         const user = await database_1.default.user.findUnique({
//             where: { id: userId },
//             select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 role: true,
//                 isPro: true,
//                 aiCredits: true,
//                 createdAt: true,
//             },
//         });
//         if (!user) {
//             throw new Error("User not found");
//         }
//         return user;
//     }
//     async googleAuth(data) {
//         // Check if user exists
//         let user = await database_1.default.user.findUnique({
//             where: { email: data.email },
//             select: { id: true, name: true, email: true, role: true, isPro: true, aiCredits: true, createdAt: true },
//         });
//         if (!user) {
//             // Unusable random password (Google-only; bcrypt requires a valid hash, not an empty string)
//             const randomSecret = (0, node_crypto_1.randomBytes)(32).toString("hex");
//             const oauthOnlyPassword = await (0, password_1.hashPassword)(randomSecret);
//             user = await database_1.default.user.create({
//                 data: {
//                     name: data.name,
//                     email: data.email,
//                     password: oauthOnlyPassword,
//                     role: "fresher",
//                     isPro: false,
//                     aiCredits: 5,
//                 },
//                 select: { id: true, name: true, email: true, role: true, isPro: true, aiCredits: true, createdAt: true },
//             });
//         }
//         const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email });
//         return { user, token };
//     }
// }
// exports.AuthService = AuthService;
// exports.authService = new AuthService();
































"use strict";

var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule
            ? mod
            : { default: mod };
    };

Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;

const node_crypto_1 = require("node:crypto");
const database_1 = __importDefault(require("../config/database"));
const password_1 = require("../helpers/password");
const jwt_1 = require("../helpers/jwt");

class AuthService {
    async register(data) {
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await (0, password_1.hashPassword)(
            data.password
        );

        const user = await database_1.default.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role:
                    data.role === "other" && data.customRole
                        ? data.customRole
                        : data.role,
                aiCredits: 5, // New users get 5 free AI credits
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPro: true,
                aiCredits: true,
                createdAt: true,
            },
        });

        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });

        return { user, token };
    }

    async login(data) {
        const user = await database_1.default.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isValidPassword = await (0, password_1.comparePassword)(
            data.password,
            user.password
        );

        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }

        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPro: user.isPro,
                aiCredits: user.aiCredits,
                createdAt: user.createdAt,
            },
            token,
        };
    }

    async getProfile(userId) {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPro: true,
                aiCredits: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async googleAuth(data) {
        // Check whether the user already exists
        let user = await database_1.default.user.findUnique({
            where: { email: data.email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isPro: true,
                aiCredits: true,
                createdAt: true,
            },
        });

        if (!user) {
            // Generate a random password for Google-only accounts
            const randomSecret = (0, node_crypto_1.randomBytes)(32).toString(
                "hex"
            );

            const oauthOnlyPassword = await (0, password_1.hashPassword)(
                randomSecret
            );

            user = await database_1.default.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: oauthOnlyPassword,
                    role: "fresher",
                    isPro: false,
                    aiCredits: 5, // New Google users get 5 free AI credits
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isPro: true,
                    aiCredits: true,
                    createdAt: true,
                },
            });
        }

        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });

        return { user, token };
    }
}

exports.AuthService = AuthService;
exports.authService = new AuthService();
