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
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const node_crypto_1 = __importDefault(require("node:crypto"));
class CryptManager {
    /**
     * Encrypt data using Bcrypt Library
     */
    static encryptBcrypt(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, saltRounts = 10, }) {
            try {
                const hash = yield bcrypt_1.default.hash(data, saltRounts);
                return hash;
            }
            catch (error) {
                console.error(error);
                return { error: `Error encrypting data. Error:${error}` };
            }
        });
    }
    /**
     * Compare data with hash using Bcrypt Library.
     */
    static compareBcrypt(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, hash }) {
            try {
                const result = yield bcrypt_1.default.compare(data, hash);
                return result;
            }
            catch (error) {
                return { error: `Error decoding or comparing data. Error: ${error}` };
            }
        });
    }
    /**
     * Encrypt data using AES from CryptoJS Library
     */
    static simetrycEncrypt({ data, keyDecrypt, }) {
        try {
            const ciphertext = crypto_js_1.default.AES.encrypt(data, keyDecrypt).toString();
            return ciphertext;
        }
        catch (error) {
            return { error: `Error encrypting data. Error: ${error}` };
        }
    }
    /**
     * Decrypt data using AES from CryptoJS Library
     */
    static simetrycDecrypt({ data, keyDecrypt, }) {
        try {
            const bytes = crypto_js_1.default.AES.decrypt(data, keyDecrypt);
            const originalText = bytes.toString(crypto_js_1.default.enc.Utf8);
            return originalText;
        }
        catch (error) {
            return { error: `Error decrypting data. Error: ${error}` };
        }
    }
}
CryptManager.generateRandom = ({ size = 8 } = {}) => {
    const random = node_crypto_1.default.randomBytes(8).toString("hex");
    const randomElement = random.slice(0, size);
    return randomElement;
};
exports.default = CryptManager;
