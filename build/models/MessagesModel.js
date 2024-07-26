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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../typegoose/models");
const instances_1 = require("../data/instances");
class MessagesModelClass {
}
_a = MessagesModelClass;
MessagesModelClass.addMessage = (_b) => __awaiter(void 0, [_b], void 0, function* ({ idSender, idReceiver, content, }) {
    try {
        //Primero vamos a agregar a la coleccion de mensajes
        const newMessage = {
            idUserSender: idSender,
            idUserReceiver: idReceiver,
            content,
            date: new Date(),
            read: false,
        };
        const resultMessageDB = yield instances_1.ITSGooseHandler.addDocument({
            Model: models_1.MessageModel,
            data: newMessage,
        });
        //Luego vamos a buscar en chats donde idUser = idSender y idUserSender = idReceiver o viceversa
        const CONDITION_CHAT_RECEIVER = {
            $or: [{ idUser: idReceiver, idUserReceiver: idSender }],
        };
        const chatReceiverData = yield instances_1.ITSGooseHandler.searchOne({
            Model: models_1.ChatModel,
            condition: CONDITION_CHAT_RECEIVER,
        });
        //Si no existe el chat en el receptor lo creamos
        const dataNullChatReceiver = chatReceiverData.length === 0 || !chatReceiverData;
        const resultCreateChatReceiver = dataNullChatReceiver
            ? yield instances_1.ITSGooseHandler.addDocument({
                Model: models_1.ChatModel,
                data: {
                    idUser: idReceiver,
                    idUserReceiver: idSender,
                },
            })
            : chatReceiverData;
        //Vamos a encontrar el chat del que envia
        const CONDITION_CHAT_SENDER = {
            $or: [{ idUser: idSender, idUserReceiver: idReceiver }],
        };
        //Este siempre va a existir, el es el que envia el mensaje
        const chatSenderData = yield instances_1.ITSGooseHandler.searchOne({
            Model: models_1.ChatModel,
            condition: CONDITION_CHAT_SENDER,
        });
        //Al encontrar los chats de cada uno vamos a agregar el mensaje a cada chat
        //Este es para el que envia
        const resultSend = yield instances_1.ITSGooseHandler.addDocument({
            Model: models_1.ChatMessageModel,
            data: {
                idChat: chatSenderData.id,
                idMessage: resultMessageDB.id,
                idUser: idSender,
            },
        });
        const resultReceiver = yield instances_1.ITSGooseHandler.addDocument({
            Model: models_1.ChatMessageModel,
            data: {
                idChat: resultCreateChatReceiver.id,
                idMessage: resultMessageDB.id,
                idUser: idReceiver,
            },
        });
        return {
            resultSend,
            resultReceiver,
        };
    }
    catch (error) {
        console.error(`Hubo un error al agregar el mensaje: ${error}`);
        throw new Error(`Error adding message: ${error}`);
    }
});
MessagesModelClass.getMessageByChat = (_c) => __awaiter(void 0, [_c], void 0, function* ({ idChat, page = 1, idUser, }) {
    try {
        const LIMIT_PAGE_MESSAGE = 300;
        //Ok ahora necesito hacer una logica, para que me traiga los mensajes pero los ultimos registros, y a medida que vaya aumentando la pagina me traiga los anteriores
        // Verificar que el chat realmente existe
        const chat = yield models_1.ChatModel.findById(idChat);
        if (!chat) {
            throw new Error(`Chat with id ${idChat} does not exist`);
        }
        const messages = yield instances_1.ITSGooseHandler.searchAll({
            Model: models_1.ChatMessageModel,
            condition: { idChat },
            limit: LIMIT_PAGE_MESSAGE,
            offset: (page - 1) * LIMIT_PAGE_MESSAGE,
            sort: { _id: -1 },
        });
        const messageReversed = messages.reverse();
        const formattedMessages = yield Promise.all(messageReversed.map((message) => __awaiter(void 0, void 0, void 0, function* () {
            const content = yield instances_1.ITSGooseHandler.searchOne({
                Model: models_1.MessageModel,
                condition: { _id: message.idMessage },
                transform: { content: 1, date: 1, read: 1, id: 1, idUserSender: 1 },
            });
            const userSender = yield instances_1.ITSGooseHandler.searchOne({
                Model: models_1.UserModel,
                condition: { _id: content.idUserSender },
                transform: { userName: 1, id: 1, image: 1, email: 1 },
            });
            return {
                id: content.id,
                sender: content.idUserSender,
                message: {
                    type: content.content.type,
                    content: content.content.message,
                },
                date: content.date,
                senderData: {
                    userName: userSender.userName,
                    email: userSender.email,
                },
                type: message.type,
            };
        })));
        //Ahora voy a verificar si yo soy el mismo que lo envie, para agregar una prop de isSendByMe
        const formattedMessagesWithIsSendByMe = formattedMessages.map((message) => {
            return Object.assign(Object.assign({}, message), { isSendByMe: message.sender === idUser });
        });
        return formattedMessagesWithIsSendByMe;
    }
    catch (error) {
        console.error(`Hubo un error al obtener los mensajes: ${error}`);
        throw new Error(`Error getting messages: ${error}`);
    }
});
MessagesModelClass.gettAllChatsByUser = (_d) => __awaiter(void 0, [_d], void 0, function* ({ idUser, page = 1, }) {
    try {
        const LIMIT_PAGE_CHAT = 15;
        const chats = (yield instances_1.ITSGooseHandler.searchAll({
            Model: models_1.ChatModel,
            condition: { idUser },
            limit: LIMIT_PAGE_CHAT,
            offset: (page - 1) * LIMIT_PAGE_CHAT,
        }));
        // Paso 1: Obtener chats con el último mensaje
        const chatsWithLastMessage = (yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            const lastMessage = yield instances_1.ITSGooseHandler.searchOne({
                Model: models_1.ChatMessageModel,
                condition: { idChat: chat.id },
                transform: { idMessage: 1 },
            });
            if (!lastMessage)
                return null;
            const lastMessageContent = yield instances_1.ITSGooseHandler.searchOne({
                Model: models_1.MessageModel,
                condition: { _id: lastMessage.idMessage },
                transform: { content: 1, date: 1, read: 1, id: 1, idUserSender: 1 },
            });
            if (!lastMessageContent)
                return null;
            const lastMessageContentParsed = {
                id: lastMessageContent.id,
                idUserSender: lastMessageContent.idUserSender,
                sender: lastMessageContent.idUserSender,
                message: {
                    type: lastMessageContent.content.type,
                    content: lastMessageContent.content.message,
                },
                date: lastMessageContent.date,
            };
            return Object.assign(Object.assign({}, chat), { lastMessageContent: lastMessageContentParsed });
        })))).filter(chat => chat !== null); // Filtrar chats sin último mensaje
        // Paso 2: Obtener chats con receptor
        const chatsWithLastMessageAndUser = (yield Promise.all(chatsWithLastMessage.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            if (!chat.lastMessageContent)
                return null;
            const userLastMessage = yield instances_1.ITSGooseHandler.searchOne({
                Model: models_1.UserModel,
                condition: { _id: chat.lastMessageContent.idUserSender },
                transform: { userName: 1, id: 1, image: 1 },
            });
            if (!userLastMessage)
                return null;
            const userReceiver = yield instances_1.ITSGooseHandler.searchOne({
                Model: models_1.UserModel,
                condition: { _id: chat.idUserReceiver },
                transform: { userName: 1, id: 1, image: 1 },
            });
            if (!userReceiver)
                return null;
            return Object.assign(Object.assign({}, chat), { userLastMessage,
                userReceiver });
        })))).filter(chat => chat !== null); // Filtrar chats sin receptor
        return chatsWithLastMessageAndUser;
    }
    catch (error) {
        console.error(`Hubo un error al obtener los chats: ${error}`);
        throw new Error(`Error getting chats: ${error}`);
    }
});
MessagesModelClass.addChat = (_e) => __awaiter(void 0, [_e], void 0, function* ({ idUserSender, idUserReceiver, twoChats = true, }) {
    try {
        //Primero vamos a verificar si ya existe un chat entre los dos
        const chatExist = yield instances_1.ITSGooseHandler.searchOne({
            Model: models_1.ChatModel,
            condition: { idUser: idUserSender, idUserReceiver },
        });
        const addChatToSender = chatExist
            ? chatExist
            : yield instances_1.ITSGooseHandler.addDocument({
                Model: models_1.ChatModel,
                data: {
                    idUser: idUserSender,
                    idUserReceiver,
                },
            });
        const chatExistReceiver = yield instances_1.ITSGooseHandler.searchOne({
            Model: models_1.ChatModel,
            condition: { idUser: idUserReceiver, idUserReceiver: idUserSender },
        });
        const addChatToReceiver = twoChats
            ? chatExistReceiver
                ? chatExistReceiver
                : yield instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.ChatModel,
                    data: {
                        idUser: idUserReceiver,
                        idUserReceiver: idUserSender,
                    },
                })
            : null;
        return { addChatToReceiver, addChatToSender };
    }
    catch (error) {
        console.error(`Hubo un error al agregar el chat: ${error}`);
        throw new Error(`Error adding chat: ${error}`);
    }
});
MessagesModelClass.verifyChatUser = (_f) => __awaiter(void 0, [_f], void 0, function* ({ idUser, idUserReceiver, }) {
    try {
        const result = yield instances_1.ITSGooseHandler.searchOne({
            Model: models_1.ChatModel,
            condition: { idUser, idUserReceiver },
        });
        return result;
    }
    catch (error) {
        console.error(error);
        throw new Error(`Error verifying chat: ${error}`);
    }
});
MessagesModelClass.deleteChat = (_g) => __awaiter(void 0, [_g], void 0, function* ({ idChat }) {
    try {
        const data1 = yield instances_1.ITSGooseHandler.removeDocument({
            Model: models_1.ChatModel,
            id: idChat,
        });
        const data2 = yield instances_1.ITSGooseHandler.removeAllDocumentsByCondition({
            Model: models_1.ChatMessageModel,
            condition: { idChat },
        });
        return { data1, data2 };
    }
    catch (error) {
        console.error(`Hubo un error al eliminar el chat: ${error}`);
        throw new Error(`Error deleting chat: ${error}`);
    }
});
exports.default = MessagesModelClass;
