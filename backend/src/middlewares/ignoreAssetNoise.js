"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreAssetNoise = ignoreAssetNoise;
/**
 * Respond with 204 so browsers/probes don't hit the API 404 for common asset paths.
 * Keeps Vercel/runtime logs cleaner than a missing static file.
 */
function ignoreAssetNoise(req, res, next) {
    const p = req.path.toLowerCase();
    if (p === "/favicon.ico" ||
        p === "/favicon.png" ||
        p === "/apple-touch-icon.png" ||
        p === "/apple-touch-icon-precomposed.png") {
        res.status(204).end();
        return;
    }
    next();
}
