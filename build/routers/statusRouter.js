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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StatusModel_1 = __importDefault(require("../models/StatusModel"));
const statusRouter = (0, express_1.Router)();
statusRouter.get("/getAllStatusContacts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const result = yield StatusModel_1.default.getAllStatusContacts({ idUser });
        if (!result[0])
            return res.json({ data: [] });
        return res.json({ data: result });
    }
    catch (error) {
        throw new Error(error);
    }
}));
statusRouter.get("/getStatusUser/:idUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req.params;
        console.log(`El id del usuario es: ${idUser}`);
        const result = yield StatusModel_1.default.getStatusUser({ idUser });
        return res.json(result);
    }
    catch (error) {
        throw new Error(error);
    }
}));
statusRouter.post("/createStatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, image } = req.body;
        const { idUser } = req;
        const status = {
            idUser,
            description,
            image,
        };
        const result = yield StatusModel_1.default.createStatus(status);
        return res.json(result);
    }
    catch (error) {
        throw new Error("Error to create status");
    }
}));
statusRouter.delete("/deleteStatus/:idStatus", (req, res) => {
    try {
        const { idUser } = req;
        const { idStatus } = req.params;
        const result = StatusModel_1.default.deleteStatus({ idStatus, idUser });
        return res.json(result);
    }
    catch (error) {
        throw new Error("Error to delete status");
    }
});
statusRouter.get("/getMyStatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const result = yield StatusModel_1.default.obtainMyActivesStatus({ idUser });
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        throw new Error("Error to get my status");
    }
}));
exports.default = statusRouter;
