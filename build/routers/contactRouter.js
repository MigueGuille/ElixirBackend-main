"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = __importDefault(require("../controllers/contactController"));
const contactRouter = (0, express_1.Router)();
contactRouter.get("/getAllContacts", contactController_1.default.getAllContacts);
contactRouter.get("/getSimpleContacts", contactController_1.default.getSimpleContacts);
contactRouter.post("/addContact", contactController_1.default.addContact);
contactRouter.delete("/deleteContact/:idContact", contactController_1.default.deleteContact);
exports.default = contactRouter;
