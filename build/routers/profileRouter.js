"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const profileRouter = (0, express_1.Router)();
profileRouter.delete("/delete", authController_1.default.deleteAccount);
profileRouter.put("/update", authController_1.default.editUser);
profileRouter.get("/info", authController_1.default.getUserInfo);
profileRouter.get("/info/userExist/:userOrEmail", authController_1.default.verifyUserExist);
profileRouter.get("/info/:idUser", authController_1.default.getUserInfoById);
exports.default = profileRouter;
