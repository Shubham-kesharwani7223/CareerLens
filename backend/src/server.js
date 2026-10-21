"use strict";

var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? (function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;

        var desc = Object.getOwnPropertyDescriptor(m, k);

        if (
          !desc ||
          ("get" in desc
            ? !m.__esModule
            : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }

        Object.defineProperty(o, k2, desc);
      })
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });

var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", {
          enumerable: true,
          value: v,
        });
      }
    : function (o, v) {
        o["default"] = v;
      });

var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];

          for (var k in o) {
            if (Object.prototype.hasOwnProperty.call(o, k)) {
              ar[ar.length] = k;
            }
          }

          return ar;
        };

      return ownKeys(o);
    };

    return function (mod) {
      if (mod && mod.__esModule) return mod;

      var result = {};

      if (mod != null) {
        for (
          var k = ownKeys(mod), i = 0;
          i < k.length;
          i++
        ) {
          if (k[i] !== "default") {
            __createBinding(result, mod, k[i]);
          }
        }
      }

      __setModuleDefault(result, mod);

      return result;
    };
  })();

var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule
      ? mod
      : { default: mod };
  };

Object.defineProperty(exports, "__esModule", {
  value: true,
});

const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));

const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const stats_routes_1 = __importDefault(
  require("./routes/stats.routes")
);
const errorHandler_1 = require("./middlewares/errorHandler");
const ignoreAssetNoise_1 = require("./middlewares/ignoreAssetNoise");

const app = (0, express_1.default)();

// CORS first (before helmet).
// Use a callback so requests without an Origin header are handled.
const alizaOrPreviewVercel =
  /^https:\/\/([a-z0-9-]+-)?aliza-resume-analyzer\.vercel\.app$/i;

/**
 * Example:
 * aliza-resume-analyzer-git-main-user.vercel.app
 * Vercel branch deployments
 */
function isAlizaVercelHost(url) {
  try {
    const { hostname, protocol } = new URL(url);

    if (protocol !== "https:") {
      return false;
    }

    return (
      hostname.endsWith(".vercel.app") &&
      hostname.includes("aliza-resume-analyzer")
    );
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (
      env_1.allowedCorsOrigins.includes(origin) ||
      alizaOrPreviewVercel.test(origin) ||
      isAlizaVercelHost(origin)
    ) {
      callback(null, true);
      return;
    }

    console.warn(`[CORS] Blocked: ${origin}`);
    callback(null, false);
  },

  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400,

  methods: [
    "GET",
    "HEAD",
    "PUT",
    "PATCH",
    "POST",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cookie",
  ],

  exposedHeaders: ["Set-Cookie"],
};

app.use((0, cors_1.default)(corsOptions));

// Security middleware
app.use(
  (0, helmet_1.default)({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// Razorpay webhook needs the raw body for signature verification.
app.use(
  "/api/razorpay/webhook",
  express_1.default.raw({
    type: "application/json",
  }),
  (req, _res, next) => {
    req.rawBody = req.body;
    next();
  }
);

// Parsing middleware
app.use(
  express_1.default.json({
    limit: "10mb",
  })
);

app.use(
  express_1.default.urlencoded({
    extended: true,
  })
);

app.use((0, cookie_parser_1.default)());

// Static backend/public files
// Fall through if files do not exist.
const publicDir = path_1.default.resolve(
  __dirname,
  "../public"
);

if (fs_1.default.existsSync(publicDir)) {
  app.use(
    express_1.default.static(publicDir, {
      index: false,
    })
  );
}

app.use(ignoreAssetNoise_1.ignoreAssetNoise);

// API routes
const apiRouter = (0, express_1.Router)();

apiRouter.use(stats_routes_1.default);
apiRouter.use(routes_1.default);

app.use("/api", apiRouter);

// Logging: skip noisy asset probes in all environments.
const morganSkip = (req) => {
  const p = req.path.toLowerCase();

  return (
    p === "/favicon.ico" ||
    p === "/favicon.png" ||
    p === "/apple-touch-icon.png" ||
    p === "/apple-touch-icon-precomposed.png"
  );
};

if (env_1.env.NODE_ENV === "development") {
  app.use(
    (0, morgan_1.default)("dev", {
      skip: morganSkip,
    })
  );
}

// Static uploaded resumes
// Use /tmp/uploads on Vercel, local UPLOAD_DIR in development.
const uploadDir = process.env.VERCEL
  ? "/tmp/uploads"
  : path_1.default.resolve(env_1.env.UPLOAD_DIR);

app.use(
  "/uploads",
  express_1.default.static(uploadDir)
);

// Health check — root route
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "CareerLens API is running",
    version: "1.0.0",
    docs: "/api",
  });
});

// Error handling
app.use(errorHandler_1.errorHandler);

// Start server only in non-serverless environments.
// Vercel manages the server lifecycle itself via the exported app.
if (!process.env.VERCEL) {
  app.listen(env_1.env.PORT, () => {
    console.log(`
     Environment: ${env_1.env.NODE_ENV.padEnd(30)}
     Port:        ${String(env_1.env.PORT).padEnd(30)}
     API URL:     http://localhost:${String(env_1.env.PORT).padEnd(17)}
    `);
  });
}

exports.default = app;