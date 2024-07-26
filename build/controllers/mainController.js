"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MainController {
    static root(_req, res) {
        res.json({ message: "This is page for main route" });
    }
}
exports.default = MainController;
