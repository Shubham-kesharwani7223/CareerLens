
"use strict";

var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;

const node_crypto_1 = require("node:crypto");
const database_1 = __importDefault(require("../config/database"));
const env_1 = require("../config/env");
const password_1 = require("../helpers/password");
const jwt_1 = require("../helpers/jwt");

// Admin access is determined by the configured email, not career role.
function isAdminEmail(email) {
  const adminEmail = String(env_1.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();

  const userEmail = String(email || "")
    .trim()
    .toLowerCase();

  return Boolean(
    adminEmail && userEmail && userEmail === adminEmail
  );
}

class AuthService {
  async register(data) {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    // The configured administrator must use verified Google authentication.
    if (isAdminEmail(email)) {
      throw new Error(
        "Use verified Google sign-up for the administrator account."
      );
    }

    const existingUser = await database_1.default.user.findUnique({
      where: { email },
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
        email,
        password: hashedPassword,
        role:
          data.role === "other" && data.customRole?.trim()
            ? data.customRole.trim()
            : data.role || "fresher",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isPro: true,
        aiCredits: true,
        subscriptionCredits: true,
        createdAt: true,
      },
    });

    const token = (0, jwt_1.generateToken)({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        ...user,
        isAdmin: isAdminEmail(user.email),
      },
      token,
    };
  }

  async login(data) {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    // The configured admin account uses Google Login.
    if (isAdminEmail(email)) {
      throw new Error(
        "Please use Google Login for the administrator account."
      );
    }

    const user = await database_1.default.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await (
      0,
      password_1.comparePassword
    )(data.password, user.password);

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
        subscriptionCredits: user.subscriptionCredits || 0,
        isAdmin: isAdminEmail(user.email),
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
        subscriptionCredits: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user,
      isAdmin: isAdminEmail(user.email),
    };
  }

  async googleAuth(data) {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      throw new Error("Google account email is missing");
    }

    if (data.mode !== "login" && data.mode !== "signup") {
      throw new Error("Invalid Google authentication mode");
    }

    const user = await database_1.default.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isPro: true,
        aiCredits: true,
        subscriptionCredits: true,
        createdAt: true,
      },
    });

    let authenticatedUser = user;

    if (data.mode === "login" && !user) {
      // Login must not silently register a new account.
      throw new Error(
        "Google account not registered. Please sign up first."
      );
    }

    if (data.mode === "signup" && user) {
      // Signup should not silently log in an existing account.
      throw new Error(
        "Google account already registered. Please log in instead."
      );
    }

    if (data.mode === "signup" && !user) {
      const requestedRole =
        data.role === "other" && data.customRole?.trim()
          ? data.customRole.trim()
          : data.role || "fresher";

      if (
        data.role === "other" &&
        (!data.customRole || data.customRole.trim().length < 2)
      ) {
        throw new Error("Please specify your career role.");
      }

      // Google-only accounts receive a random hashed password.
      const randomSecret = (0, node_crypto_1.randomBytes)(32)
        .toString("hex");

      const oauthOnlyPassword = await (
        0,
        password_1.hashPassword
      )(randomSecret);

      authenticatedUser = await database_1.default.user.create({
        data: {
          name: data.name,
          email,
          password: oauthOnlyPassword,
          role: requestedRole,
          isPro: false,
          aiCredits: 1,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isPro: true,
          aiCredits: true,
          subscriptionCredits: true,
          createdAt: true,
        },
      });
    }

    const token = (0, jwt_1.generateToken)({
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
    });

    return {
      user: {
        ...authenticatedUser,
        isAdmin: isAdminEmail(authenticatedUser.email),
      },
      token,
    };
  }
}

exports.AuthService = AuthService;
exports.authService = new AuthService();
