"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IJWTManager = exports.INodeMailer = exports.ITSGooseHandler = void 0;
require("dotenv/config");
const TSGooseHandler_1 = __importDefault(require("../utils/TSGooseHandler"));
const mailerConfig_json_1 = __importDefault(require("./jsons/mailerConfig.json"));
const Mailer_1 = __importDefault(require("../utils/Mailer"));
const JWTManager_1 = __importDefault(require("../utils/JWTManager"));
const connectionString = process.env.ConnectionString;
exports.ITSGooseHandler = new TSGooseHandler_1.default({ connectionString });
exports.INodeMailer = new Mailer_1.default({
    config: mailerConfig_json_1.default,
});
exports.IJWTManager = new JWTManager_1.default({
    SECRET_WORD: process.env.SECRET_WORD,
    expiresIn: process.env.JWT_EXPIRES_IN,
});
