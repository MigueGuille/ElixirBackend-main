"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
function midErrorHandler(err, _req, res, _next) {
    const isTokenError = err.message.includes("TokenExpiredError") ||
        err.message.includes("JsonWebTokenError");
    const errorHandlerKey = isTokenError
        ? err.message.includes("TokenExpiredError")
            ? "TokenExpiredError"
            : "JsonWebTokenError"
        : err.name;
    const handler = constants_1.ERROR_HANDLERS[errorHandlerKey] || constants_1.ERROR_HANDLERS.defaultError;
    handler(res, isTokenError ? err.message : undefined);
}
exports.default = midErrorHandler;
