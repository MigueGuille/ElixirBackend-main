"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = __importDefault(require("../controllers/messageController"));
const messagesRouter = (0, express_1.Router)();
messagesRouter.get("/getAllChats/:page", messageController_1.default.getAllChats);
messagesRouter.get("/getMessages/:idChat/:page", messageController_1.default.getMessageChat);
messagesRouter.get("/verifyChatUser/:idUserReceiver", messageController_1.default.verifyChatUser);
messagesRouter.post("/addMessage", messageController_1.default.addMessages);
messagesRouter.post("/addChat", messageController_1.default.addChat);
messagesRouter.delete("/deleteChat/:idChat", messageController_1.default.deleteChat);
exports.default = messagesRouter;
