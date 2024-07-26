"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTManager {
    constructor({ SECRET_WORD, expiresIn = "2h" }) {
        this.SECRET_WORD = SECRET_WORD;
        this.expiresIn = expiresIn;
    }
    generateToken(props) {
        try {
            const { id, userName, email, image } = props;
            const token = jsonwebtoken_1.default.sign({ id, userName, email, image }, this.SECRET_WORD, {
                expiresIn: this.expiresIn,
            });
            const tokenFormated = `Bearer ${token}`;
            return tokenFormated;
        }
        catch (error) {
            throw new Error(`Error generating token: ${error}`);
        }
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.SECRET_WORD);
            return decoded;
        }
        catch (error) {
            throw new Error(`Error verifying token: ${error}`);
        }
    }
}
exports.default = JWTManager;
