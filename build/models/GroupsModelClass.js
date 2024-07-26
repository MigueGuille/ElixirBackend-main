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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../typegoose/models");
const instances_1 = require("../data/instances");
class GroupModelClass {
    static getAllGroupsUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.GroupModel,
                    condition: { idUsers: { $in: [idUser] } },
                });
                //Ahora obtenemos el ultimo mensaje de ese grupo
                const resultWithLastMessage = yield Promise.all(results.map((group) => __awaiter(this, void 0, void 0, function* () {
                    const lastMessage = yield instances_1.ITSGooseHandler.searchOne({
                        Model: models_1.GroupMessageModel,
                        condition: { idGroup: group.id },
                    });
                    const lastMessageWithUser = yield instances_1.ITSGooseHandler.searchOne({
                        Model: models_1.UserModel,
                        condition: { _id: lastMessage.idUser },
                        transform: { id: 1, image: 1, userName: 1 },
                    });
                    const lastMessageObj = {
                        message: lastMessage.message,
                        date: lastMessage.date,
                        user: lastMessageWithUser,
                    };
                    const lastMessageParsed = !lastMessage
                        ? {
                            message: {
                                type: "text",
                                content: "No hay mensajes",
                            },
                            user: {
                                userName: "No hay mensajes",
                                image: "https://icones.pro/wp-content/uploads/2021/03/icone-de-groupe-symbole-png-vert.png",
                                id: "Nada",
                            },
                        }
                        : lastMessageObj;
                    return Object.assign(Object.assign({}, group), { lastMessage: lastMessageParsed });
                })));
                const lastMessageAndUser = yield Promise.all(resultWithLastMessage.map((group) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield instances_1.ITSGooseHandler.searchOne({
                        Model: models_1.UserModel,
                        condition: { _id: group.idUserOwner },
                        transform: { id: 1, image: 1, userName: 1 },
                    });
                    return Object.assign(Object.assign({}, group), { userLastMessage: user });
                })));
                return lastMessageAndUser;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    static obtainGroupMessages(idGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`El id del grupo es ${idGroup}`);
                const messages = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.GroupMessageModel,
                    condition: { idGroup },
                    sort: { _id: -1 },
                });
                console.log('Los mensajes del grupo son');
                console.log(messages);
                const messageReversed = messages.reverse();
                const result = yield Promise.all(messageReversed.map((message) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield instances_1.ITSGooseHandler.searchOne({
                        Model: models_1.UserModel,
                        condition: { _id: message.idUser },
                        transform: { id: 1, image: 1, userName: 1, email: 1 },
                    });
                    const objResult = {
                        id: message.id,
                        sender: user.id,
                        message: {
                            type: message.message.type,
                            content: message.message.content,
                        },
                        date: message.date,
                        senderData: {
                            userName: user.userName,
                            image: user.image,
                            email: user.email,
                            id: user.id,
                        },
                        type: message.message.type,
                    };
                    console.log(objResult);
                    return objResult;
                })));
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    static getGroupById(idGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.GroupModel,
                    condition: { _id: idGroup },
                });
                const resultsWithUsers = yield Promise.all(result.idUsers.map((idUser) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield instances_1.ITSGooseHandler.searchOne({
                        Model: models_1.UserModel,
                        condition: { _id: idUser },
                        transform: { id: 1, image: 1, userName: 1 },
                    });
                    return user;
                })));
                return Object.assign(Object.assign({}, result), { users: resultsWithUsers });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    static createGroup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, description, image = "https://icones.pro/wp-content/uploads/2021/03/icone-de-groupe-symbole-png-vert.png", idUserOwner, idUsers, }) {
            try {
                console.log(idUsers);
                const newIdUsers = [...idUsers, idUserOwner];
                const newGroup = yield instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.GroupModel,
                    data: { name, description, image, idUserOwner, idUsers: newIdUsers },
                });
                return newGroup;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    static deleteGroup(groupId, idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.GroupModel,
                    condition: { _id: groupId },
                });
                if (group.idUserOwner !== idUser) {
                    return false;
                }
                const result = yield instances_1.ITSGooseHandler.removeDocument({
                    Model: models_1.GroupModel,
                    id: groupId,
                });
                return result;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    static addMessageToGroup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idGroup, idUser, message, }) {
            try {
                const newMessage = {
                    idGroup,
                    idUser,
                    message,
                    date: new Date().toISOString(),
                };
                const resultPost = yield instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.GroupMessageModel,
                    data: newMessage,
                });
                return resultPost;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error adding message: ${error}`);
            }
        });
    }
}
exports.default = GroupModelClass;
