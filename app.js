"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Vercel entry when "Root Directory" = repository root.
 * Vercel only accepts a direct `import` of `express` in the entry (not `require()` in a tiny stub).
 * For "Root Directory" = `backend/`, the entry is `backend/src/server.ts` instead; this file is ignored.
 */
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("./backend/src/server"));
void express_1.default;
exports.default = server_1.default;
