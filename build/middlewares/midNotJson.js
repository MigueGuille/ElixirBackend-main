"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const midNotJson = (err, _req, res, next) => {
    if (err instanceof SyntaxError) {
        return res
            .status(400)
            .json({ error: "The request body is not valid JSON" });
    }
    next();
};
exports.default = midNotJson;
