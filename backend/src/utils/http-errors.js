"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = void 0;
/** Thrown for client-visible failures (Express handlers map to JSON + status). */
class ClientError extends Error {
    constructor(message, statusCode = 422, code) {
        super(message);
        this.name = "ClientError";
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.ClientError = ClientError;
