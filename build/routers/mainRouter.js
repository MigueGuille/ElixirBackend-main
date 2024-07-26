"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mainController_1 = __importDefault(require("../controllers/mainController"));
const mainRouter = (0, express_1.Router)();
mainRouter.get("/", mainController_1.default.root);
exports.default = mainRouter;
