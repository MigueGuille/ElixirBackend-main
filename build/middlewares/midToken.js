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
const instances_1 = require("../data/instances");
const UserModelClass_1 = __importDefault(require("../models/UserModelClass"));
function midToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { authorization } = req.headers;
            if (!authorization && !(authorization === null || authorization === void 0 ? void 0 : authorization.toLowerCase().startsWith("bearer"))) {
                return res.status(401).json({ message: "Token not found" });
            }
            const token = authorization.replace("Bearer ", "");
            const decodedToken = instances_1.IJWTManager.verifyToken(token);
            if (!token || !decodedToken.id)
                res.status(401).json({ message: "Token not found" });
            const { id } = decodedToken;
            const user = (yield UserModelClass_1.default.searchUserId({ id }));
            if (!user)
                return res.status(401).json({ message: "User not found" });
            if (!token) {
                return res.status(401).json({ message: "Token not found" });
            }
            req.idUser = user.id;
            req.username = user.userName;
            req.email = user.email;
            req.role = user.role;
            req.image = user === null || user === void 0 ? void 0 : user.image;
            return next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = midToken;
