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
const models_1 = require("../typegoose/models");
const UserModelClass_1 = __importDefault(require("./UserModelClass"));
class StatusModelClass {
    static getAllStatusContacts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                const contacts = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.ContactModel,
                    condition: { idUserOwner: idUser },
                });
                const contactWithStatusAndUser = yield Promise.all(contacts.map((contact) => __awaiter(this, void 0, void 0, function* () {
                    const status = yield instances_1.ITSGooseHandler.searchAll({
                        Model: models_1.StatusModel,
                        condition: { idUser: contact.idUserContact },
                        transform: { id: 1, description: 1, image: 1, date: 1, seen: 1 },
                    });
                    const statusActive = status.filter((status) => this.verifyLast24Hours(status.date));
                    const user = yield instances_1.ITSGooseHandler.searchOne({
                        Model: models_1.UserModel,
                        condition: { _id: contact.idUserContact },
                        transform: { id: 1, userName: 1, image: 1 },
                    });
                    if (status.length === 0 || !status)
                        return false;
                    const sendObj = {
                        contact: {
                            id: contact.id,
                            name: contact.name,
                            image: user.image,
                            userName: user.userName,
                            idUser: user.id,
                        },
                        status: statusActive,
                    };
                    return sendObj;
                })));
                return contactWithStatusAndUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getStatusUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                const status = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.StatusModel,
                    condition: { idUser },
                });
                console.log(status);
                const statusActive = status.filter((status) => this.verifyLast24Hours(status.date));
                console.log('LLos estados del usuario son: ');
                console.log(statusActive);
                return statusActive;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static createStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser, description, image } = status;
                const statusCreated = yield instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.StatusModel,
                    data: {
                        idUser,
                        description,
                        image,
                        date: new Date(),
                    },
                });
                return statusCreated;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idStatus, idUser, }) {
            try {
                //Verificar se o status pertence ao usuário
                const status = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.StatusModel,
                    condition: { _id: idStatus, idUser },
                });
                if (!status)
                    throw new Error("Status not found");
                const statusDeleted = yield instances_1.ITSGooseHandler.removeDocument({
                    Model: models_1.StatusModel,
                    id: idStatus,
                });
                return statusDeleted;
            }
            catch (error) {
                console.error(error);
                throw new Error("Error to delete status");
            }
        });
    }
    static obtainMyActivesStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                const status = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.StatusModel,
                    condition: { idUser },
                });
                const statusActive = status.filter((status) => this.verifyLast24Hours(status.date));
                const userInfo = yield UserModelClass_1.default.getUserInfo({ idUser });
                if (!statusActive)
                    return { userInfo, status: [] };
                const objResponse = { contact: userInfo, status: statusActive };
                return objResponse;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
StatusModelClass.verifyLast24Hours = (dateString) => {
    const date = new Date(dateString); // C
    const dateActual = new Date();
    const diff = Math.abs(dateActual.getTime() - date.getTime());
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    return hours <= 24;
};
exports.default = StatusModelClass;
