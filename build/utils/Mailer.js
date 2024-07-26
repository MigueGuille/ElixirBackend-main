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
const constants_1 = require("../constants");
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Clase que representa un objeto Mailer.
 */
class Mailer {
    /**
     * Crea un objeto Mailer.
     * @param {Object} options - El objeto de opciones.
     * @param {Object} options.config - El objeto de configuración.
     * @param {string} options.config.host - El host del correo electrónico.
     * @param {string} options.config.user - El usuario del correo electrónico.
     * @param {string} options.config.password - La contraseña del correo electrónico.
     */
    constructor({ config }) {
        /**
         * Envía un correo electrónico de texto.
         * @async
         * @param {Object} options - El objeto de opciones.
         * @param {string} options.to - El destinatario del correo electrónico.
         * @param {string} options.subject - El asunto del correo electrónico.
         * @param {string} options.text - El cuerpo del correo electrónico.
         * @returns {Promise<Object>} El resultado del envío del correo electrónico.
         */
        this.sendMailText = (_a) => __awaiter(this, [_a], void 0, function* ({ to, subject, text, }) {
            try {
                const result = yield this.transporter.sendMail({
                    from: this.user,
                    to,
                    subject,
                    text,
                });
                return result;
            }
            catch (error) {
                return { error };
            }
        });
        /**
         * Envía un correo electrónico HTML.
         * @async
         * @param {Object} options - El objeto de opciones.
         * @param {string} options.to - El destinatario del correo electrónico.
         * @param {string} options.subject - El asunto del correo electrónico.
         * @param {string} options.html - El cuerpo del correo electrónico en formato HTML.
         * @returns {Promise<Object>} El resultado del envío del correo electrónico.
         */
        this.sendMailHtml = (_b) => __awaiter(this, [_b], void 0, function* ({ to, subject, html, }) {
            try {
                const result = yield this.transporter.sendMail({
                    from: this.user,
                    to,
                    subject,
                    html,
                });
                return result;
            }
            catch (error) {
                console.log(error);
                return { error };
            }
        });
        this.host = config.host.toLowerCase();
        this.user = config.user.toLowerCase();
        this.password = config.password;
        const hostConfig = constants_1.Hosts[this.host];
        this.mailHost = hostConfig.host;
        this.port = hostConfig.port;
        this.secure = hostConfig.secure;
        try {
            /**
             * El objeto transporter de nodemailer.
             * @type {Object}
             */
            this.transporter = nodemailer_1.default.createTransport({
                host: this.mailHost,
                port: this.port,
                secure: this.secure,
                auth: {
                    user: this.user,
                    pass: this.password,
                },
                tls: {
                    // no fallar en certificados inválidos
                    rejectUnauthorized: false,
                },
            });
        }
        catch (error) {
            console.error(error);
            this.transporter = null;
        }
    }
}
exports.default = Mailer;
