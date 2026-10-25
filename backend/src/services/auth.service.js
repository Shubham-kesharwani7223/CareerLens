
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

// Admin access is determined by the server's configured email.
function isAdminEmail(email) {
  const adminEmail = String(env_1.env.ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();

  const userEmail = String(email || "")
    .trim()
    .toLowerCase();

  return Boolean(adminEmail && userEmail && userEmail === adminEmail);
}

// Return a consistent, safe user object for the frontend.
function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isPro: user.isPro,
    isSuspended: user.isSuspended === true,
    aiCredits: user.aiCredits,
    subscriptionCredits: user.subscriptionCredits || 0,
    createdAt: user.createdAt,
    isAdmin: isAdminEmail(user.email),
  };
}

function assertNotSuspended(user) {
  if (user.isSuspended === true) {
    throw new Error(
      "Your account has been suspended. Please contact support."
    );
  }
}

// Validate a referral code without trusting client-provided user IDs.
async function findReferrer(referralCode, newUserEmail) {
  const code = String(referralCode || "").trim().toUpperCase();

  if (!code) {
    return null;
  }

  const referrer = await database_1.default.user.findUnique({
    where: { referralCode: code },
    select: {
      id: true,
      email: true,
      isSuspended: true,
    },
  });

  if (!referrer) {
    throw new Error("Invalid referral code.");
  }

  if (referrer.isSuspended === true) {
    throw new Error("This referral code is not available.");
  }

  if (
    String(referrer.email).trim().toLowerCase() ===
    String(newUserEmail || "").trim().toLowerCase()
  ) {
    throw new Error("You cannot use your own referral code.");
  }

  return referrer;
}

// Attach the referrer to the new account during signup.
async function getReferralData(referralCode, newUserEmail) {
  const referrer = await findReferrer(referralCode, newUserEmail);

  return referrer ? { referredById: referrer.id } : {};
}

class AuthService {
  async register(data) {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    // The configured admin account must use verified Google authentication.
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

    const referralData = await getReferralData(
      data.referralCode,
      email
    );

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
        ...referralData,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isPro: true,
        isSuspended: true,
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
      user: toPublicUser(user),
      token,
    };
  }

  async login(data) {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    // The configured administrator account uses Google Login.
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

    assertNotSuspended(user);

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
      user: toPublicUser(user),
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
        isSuspended: true,
        aiCredits: true,
        subscriptionCredits: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    assertNotSuspended(user);

    return toPublicUser(user);
  }

  async googleAuth(data) {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      throw new Error("Google account email is missing");
    }

    // The controller must verify the Google token on the backend.
    if (data.emailVerified !== true) {
      throw new Error("Please use a verified Google account.");
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
        isSuspended: true,
        aiCredits: true,
        subscriptionCredits: true,
        createdAt: true,
      },
    });

    let authenticatedUser = user;

    if (data.mode === "login" && !user) {
      throw new Error(
        "Google account not registered. Please sign up first."
      );
    }

    if (user) {
      assertNotSuspended(user);
    }

    if (data.mode === "signup" && user) {
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

      // Validate referral before creating the new account.
      const referralData = await getReferralData(
        data.referralCode,
        email
      );

      // Google-only accounts receive a random hashed password.
      const randomSecret = (0, node_crypto_1.randomBytes)(32).toString(
        "hex"
      );

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
          ...referralData,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isPro: true,
          isSuspended: true,
          aiCredits: true,
          subscriptionCredits: true,
          createdAt: true,
        },
      });
    }

    if (!authenticatedUser) {
      throw new Error("Google authentication failed.");
    }

    const token = (0, jwt_1.generateToken)({
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
    });

    return {
      user: toPublicUser(authenticatedUser),
      token,
    };
  }
}

exports.AuthService = AuthService;
exports.authService = new AuthService();
