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
const models_1 = require("../typegoose/models");
const instances_1 = require("../data/instances");
const CryptManager_1 = __importDefault(require("../utils/CryptManager"));
class UserModelClass {
    static deleteAccount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                //Verificar que el usuario existe
                const user = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.UserModel,
                    condition: { _id: idUser },
                });
                if (!user)
                    return { error: "User not found" };
                yield instances_1.ITSGooseHandler.removeDocuments({
                    Model: models_1.ActivateCodeModel,
                    condition: { idUser },
                });
                const resultUser = yield instances_1.ITSGooseHandler.removeDocument({
                    Model: models_1.UserModel,
                    id: idUser,
                });
                return resultUser;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
    static obtainUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield instances_1.ITSGooseHandler.searchAll({ Model: models_1.UserModel });
                return data;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
    static registerUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userData, }) {
            try {
                const hashPassword = yield CryptManager_1.default.encryptBcrypt({
                    data: userData.password,
                });
                const newUser = Object.assign(Object.assign({}, userData), { password: hashPassword });
                //TODO: Falta buscar el tipo del UserModel, que sea compatible con el _id sin modificar la clase
                const result = yield instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.UserModel,
                    data: newUser,
                });
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error registering user. Error: ${error}`);
            }
        });
    }
    static addActivateCode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, idUser }) {
            try {
                //TODO: Buscar el tipo directamente de la instancia de un Activate code model, que sea compatible con el _id sin modificar la clase
                const result = yield instances_1.ITSGooseHandler.addDocument({
                    Model: models_1.ActivateCodeModel,
                    data: { code, idUser },
                });
                return result;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
    static searchUserExist(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userName, email, }) {
            try {
                const condition = {
                    $or: [
                        ...(userName ? [{ userName }] : []),
                        ...(email ? [{ email }] : []),
                    ],
                };
                const data = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.UserModel,
                    condition,
                });
                return data ? data : false;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
    static searchUserId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const user = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.UserModel,
                    condition: { _id: id },
                });
                return user;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error searching user by id ${error}`);
            }
        });
    }
    static activateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const updatedUser = yield instances_1.ITSGooseHandler.editDocument({
                    Model: models_1.UserModel,
                    id,
                    newData: { active: true },
                });
                return updatedUser;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
    static decreaseAttempts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const { attempts } = yield UserModelClass.searchUserId({ id });
                if (Number(attempts) === 0)
                    return;
                const newAttempts = attempts - 1;
                const result = yield instances_1.ITSGooseHandler.editDocument({
                    Model: models_1.UserModel,
                    id,
                    newData: { attempts: newAttempts },
                });
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error decreasing attempts. Error ${error}`);
            }
        });
    }
    static blockUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = yield instances_1.ITSGooseHandler.editDocument({
                    Model: models_1.UserModel,
                    id,
                    newData: { blocked: true },
                });
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error blocking user. Error ${error}`);
            }
        });
    }
    // TODO: IMPLEMENTAR
    //!WARNING AUN NO SE USA
    static unblockUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = yield instances_1.ITSGooseHandler.editDocument({
                    Model: models_1.UserModel,
                    id,
                    newData: { blocked: false },
                });
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error unblocking user. Error ${error}`);
            }
        });
    }
    static resetAttempts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = yield instances_1.ITSGooseHandler.editDocument({
                    Model: models_1.UserModel,
                    id,
                    newData: { attempts: 3 },
                });
                return result;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error resetting attempts. Error ${error}`);
            }
        });
    }
    static generateToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, userName, email, image, }) {
            try {
                const dataToken = instances_1.IJWTManager.generateToken({
                    id,
                    email,
                    userName,
                    image,
                });
                return dataToken;
            }
            catch (error) {
                console.log("Error in generateToken() in UserModelClass.ts: ", error);
                throw new Error(`Error generating token. Error ${error}`);
            }
        });
    }
    static editUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, userData, }) {
            try {
                const updatedUser = yield instances_1.ITSGooseHandler.editDocument({
                    Model: models_1.UserModel,
                    id,
                    newData: userData,
                });
                return updatedUser;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error editing user. Error ${error}`);
            }
        });
    }
    static getUserInfo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                const user = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.UserModel,
                    condition: { _id: idUser },
                });
                return user;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
    static verifyUserExist(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userOrEmail }) {
            try {
                const user = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.UserModel,
                    condition: { $or: [{ userName: userOrEmail }, { email: userOrEmail }] },
                    transform: {
                        password: 0,
                        dateOfBirth: 0,
                        attempts: 0,
                        active: 0,
                        blocked: 0,
                        idArtist: 0,
                    },
                });
                return user;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error verifying user exist. Error ${error}`);
            }
        });
    }
}
exports.default = UserModelClass;
