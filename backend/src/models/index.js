"use strict";
// Models are defined in prisma/schema.prisma
// This file re-exports the Prisma client for convenience
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = void 0;
var client_1 = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return client_1.PrismaClient; } });
