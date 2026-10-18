"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json(data);
}
function sendError(res, message, statusCode = 400, errors) {
    return res.status(statusCode).json({ message, errors });
}
