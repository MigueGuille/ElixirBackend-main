"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const picocolors_1 = __importDefault(require("picocolors"));
function startServer({ app, PORT }) {
    app.listen(PORT, () => {
        console.log(picocolors_1.default.bgBlack(picocolors_1.default.green(`SERVER RUNNING ON PORT ${PORT}`)));
    });
    return;
}
exports.startServer = startServer;
