"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const midValidJson = (err, _req, res, next) => {
    if (err instanceof SyntaxError) {
        return res
            .status(400)
            .json({ error: "El cuerpo de la solicitud no es un JSON válido" });
    }
    next();
    return;
};
exports.default = midValidJson;
