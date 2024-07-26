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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const MessagesModel_1 = __importDefault(require("../models/MessagesModel"));
class MessageController {
    static getAllChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                const page = parseInt(req.params.page) || 1;
                const result = yield MessagesModel_1.default.gettAllChatsByUser({
                    idUser,
                    page,
                });
                return res.json(result);
            }
            catch (error) {
                console.error(`Hubo un error al obtener los mensajes: ${error}`);
                throw new Error(`Error getting messages: ${error}`);
            }
        });
    }
}
_a = MessageController;
MessageController.addMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const { idReceiver, content } = req.body;
        //Debemos validar que content, tenga esta estructura
        // {type: "text", content: "Hola", "message": string}
        const result = yield MessagesModel_1.default.addMessage({
            idSender: idUser,
            idReceiver,
            content,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(error);
        throw new Error(`Error adding message: ${error}`);
    }
});
MessageController.getMessageChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const { idChat, page } = req.params;
        const parsedPage = parseInt(page) || 1;
        const result = yield MessagesModel_1.default.getMessageByChat({
            idChat,
            page: parsedPage,
            idUser,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al obtener los mensajes: ${error}`);
        throw new Error(`Error getting messages: ${error}`);
    }
});
MessageController.addChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const { idUserReceiver } = req.body;
        const result = yield MessagesModel_1.default.addChat({
            idUserSender: idUser,
            idUserReceiver,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al obtener los mensajes: ${error}`);
        throw new Error(`Error getting messages: ${error}`);
    }
});
MessageController.verifyChatUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const { idUserReceiver } = req.params;
        const result = yield MessagesModel_1.default.verifyChatUser({
            idUser,
            idUserReceiver,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al obtener los mensajes: ${error}`);
        throw new Error(`Error getting messages: ${error}`);
    }
});
MessageController.deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idChat } = req.params;
        const result = yield MessagesModel_1.default.deleteChat({
            idChat,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al obtener los mensajes: ${error}`);
        throw new Error(`Error getting messages: ${error}`);
    }
});
exports.default = MessageController;
