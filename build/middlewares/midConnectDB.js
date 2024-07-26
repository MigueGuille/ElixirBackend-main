"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const instances_1 = require("../data/instances");
function midConnectDB(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!instances_1.ITSGooseHandler.isConnected()) {
            // Wait for 3 seconds before checking the connection again
            yield new Promise((resolve) => setTimeout(resolve, 2100));
            if (!instances_1.ITSGooseHandler.isConnected()) {
                return res.status(503).json({
                    message: "messageUnable to process operation. DB Is not working",
                });
            }
            else {
                next();
                return;
            }
        }
        else {
            next();
            return;
        }
    });
}
exports.default = midConnectDB;
