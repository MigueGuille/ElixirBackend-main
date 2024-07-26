"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const midNotFound = (_req, res, next) => {
    res.status(404).json({ error: "Not Found" });
    next();
};
exports.default = midNotFound;
