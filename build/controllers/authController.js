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
const registerValidators_1 = __importDefault(require("../schemas/registerValidators"));
const instances_1 = require("../data/instances");
const CryptManager_1 = __importDefault(require("../utils/CryptManager"));
const enums_1 = require("../enums");
const UserModelClass_1 = __importDefault(require("../models/UserModelClass"));
const ActivateModelClass_1 = __importDefault(require("../models/ActivateModelClass"));
const constants_1 = require("../constants");
class AuthController {
    static verifyData({ req }) {
        const body = req.body;
        const { userName, email, password, dateOfBirth } = body;
        if (!userName || !email || !password || !dateOfBirth) {
            throw new Error("Missing required fields");
        }
        for (const field in body) {
            if (field in registerValidators_1.default &&
                !registerValidators_1.default[field](body[field])) {
                throw new Error(`${field} is not valid!`);
            }
        }
        return;
    }
    static verifyUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ req }) {
            const body = req.body;
            const { email, userName } = body;
            const data = yield UserModelClass_1.default.searchUserExist({ userName, email });
            if (data) {
                throw new Error("User or email already exist");
            }
            return;
        });
    }
    static registerUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ req, }) {
            try {
                const body = req.body;
                const userAdded = (yield UserModelClass_1.default.registerUser({
                    userData: body,
                }));
                //Generate hash
                const code = CryptManager_1.default.generateRandom();
                //Add verification code to Database
                yield UserModelClass_1.default.addActivateCode({ code, idUser: userAdded === null || userAdded === void 0 ? void 0 : userAdded._id });
                return { data: userAdded, code };
            }
            catch (error) {
                console.error(`Error registering user: ${error}`);
                return false;
            }
        });
    }
    //TODO: Esto hay que hacerlo mejor en el modelo
    static sendVerificationMail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userData, code, }) {
            try {
                console.log("Los datos de registro son");
                console.log(userData);
                const htmlContent = `
        <div style="text-align: center; font-family: 'Arial', sans-serif; background-color: #000; color: #FFF; padding: 20px; border-radius: 10px;">
  <p style="font-size: 1.2em;">Please click the button below to activate your account.</p>
  <a href="${enums_1.URLS.ACTIVATE_USER}/${code}" 
     style="display: inline-block; background-color: #007BFF; color: #FFF; padding: 10px 20px; text-decoration: none; font-size: 1.5em; margin: 20px auto; border-radius: 5px; transition: background-color 0.3s, color 0.3s;">
    Activate Account
  </a>
</div>

<style>
  a:hover {
    background-color: #FFF;
    color: #000;
    border: 2px solid #007BFF;
  }
</style>
      `;
                instances_1.INodeMailer.sendMailHtml({
                    to: userData.email,
                    subject: "Activate your account",
                    html: htmlContent,
                });
                return true;
            }
            catch (error) {
                console.error(`Error sending verification mail: ${error}`);
                return false;
            }
        });
    }
    static activateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.params;
                // Buscar el activationRecord
                const activationRecord = yield ActivateModelClass_1.default.searchOneActivation({
                    code,
                });
                if (!activationRecord)
                    return res.json({ error: "Activation record not found" });
                // Buscar el usuario asociado con el activationRecord
                const id = activationRecord.idUser;
                const user = yield UserModelClass_1.default.searchUserId({ id });
                if (!user)
                    return res.json({ error: "User not found" });
                // Cambiar la propiedad activate del usuario a true
                const updatedUser = yield UserModelClass_1.default.activateUser({ id });
                if (enums_1.Constants.ERROR in updatedUser)
                    return res.json({ error: "Error activating user" });
                // Eliminar el activationRecord
                const deletedRecord = yield ActivateModelClass_1.default.removeActivateDocument({
                    idActivation: activationRecord.id,
                });
                if (enums_1.Constants.ERROR in deletedRecord) {
                    console.error("Error deleting activation record");
                    return res.send(constants_1.HTMLS_RESPONSES.ERROR);
                }
                return res.send(constants_1.HTMLS_RESPONSES.ACTIVE_USER);
            }
            catch (error) {
                console.error(error);
                return res.send(constants_1.HTMLS_RESPONSES.ERROR);
            }
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                AuthController.verifyData({ req });
                yield AuthController.verifyUser({ req });
                const data = (yield AuthController.registerUser({
                    req,
                }));
                console.log('Mi data es');
                console.log(data);
                const isMailSent = yield AuthController.sendVerificationMail({
                    userData: data === null || data === void 0 ? void 0 : data.data,
                    code: data === null || data === void 0 ? void 0 : data.code,
                });
                console.log(isMailSent);
                if (!isMailSent)
                    throw new Error("Error sending verification mail");
                return res.status(201).json({
                    message: "User registered successfully, please activate your account",
                });
            }
            catch (error) {
                console.error(`Error registering user: ${error}`);
                return res.status(400).json({ error: error.message });
            }
        });
    }
    static verifyLoginData(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userName }) {
            try {
                const result = yield UserModelClass_1.default.searchUserExist({ userName });
                if (!result)
                    return false;
                return result._id || result.id;
            }
            catch (error) {
                return { error };
            }
        });
    }
    static verifyBlockUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userData, }) {
            try {
                return userData.blocked;
            }
            catch (error) {
                throw new Error(`New error: ${error}`);
            }
        });
    }
    static verifyPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userData, passwordSend, }) {
            try {
                const { password } = userData;
                const result = yield CryptManager_1.default.compareBcrypt({
                    data: passwordSend,
                    hash: password,
                });
                return result;
            }
            catch (error) {
                throw new Error(`New error: ${error}`);
            }
        });
    }
    static decreaseAttempts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = yield UserModelClass_1.default.decreaseAttempts({ id });
                return result;
            }
            catch (error) {
                throw new Error(`New error: ${error}`);
            }
        });
    }
    //Este se encarga de bloquear al usuario
    static blockUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = yield UserModelClass_1.default.blockUser({ id });
                return result;
            }
            catch (error) {
                throw new Error(`New error: ${error}`);
            }
        });
    }
    //Este se encarga de desbloquear al usuario
    //TODO: ARREGLAR
    //!WARNING
    //@ts-ignore
    static unblockUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = yield UserModelClass_1.default.unblockUser({ id });
                return result;
            }
            catch (error) {
                throw new Error(`New error: ${error}`);
            }
        });
    }
    static resetAttempts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const result = yield UserModelClass_1.default.resetAttempts({ id });
                return result;
            }
            catch (error) {
                throw new Error(`New error: ${error}`);
            }
        });
    }
    //!IMPORTANTE
    static verifyActiveUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            try {
                const user = yield UserModelClass_1.default.searchUserId({ id });
                if (!user)
                    return false;
                const { active } = user;
                if (active)
                    return active;
                const isCodeActive = yield ActivateModelClass_1.default.searchOneActivation({
                    idUser: id,
                });
                if (isCodeActive)
                    return false;
                const code = CryptManager_1.default.generateRandom();
                yield AuthController.sendVerificationMail({ userData: user, code });
                return;
            }
            catch (error) {
                throw new Error(`New error: ${error}`);
            }
        });
    }
    //Este se encarga de hacer el login
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, password } = req.body;
                const id = yield AuthController.verifyLoginData({ userName });
                if (!id)
                    return res.status(401).json({ error: "User not found" });
                const userData = yield UserModelClass_1.default.searchUserId({ id });
                if (!userData)
                    return res.status(401).json({ error: "User not found" });
                const isBlocked = yield AuthController.verifyBlockUser({ userData });
                if (isBlocked)
                    return res.status(401).json({ error: "User is blocked" });
                const isPasswordCorrect = yield AuthController.verifyPassword({
                    userData,
                    passwordSend: password,
                });
                if (!isPasswordCorrect) {
                    yield AuthController.decreaseAttempts({ id });
                    const user = yield UserModelClass_1.default.searchUserId({ id });
                    if (user.attempts <= 0) {
                        yield AuthController.blockUser({ id });
                        return res.status(401).json({ error: "User is blocked" });
                    }
                    return res.status(401).json({ error: "Password is incorrect" });
                }
                if (!(yield AuthController.verifyActiveUser({ id })))
                    return res
                        .status(401)
                        .json({ error: `User is not active. Verify mail ${userData.email}` });
                yield AuthController.resetAttempts({ id });
                const token = yield UserModelClass_1.default.generateToken({
                    id,
                    userName,
                    email: userData.email,
                    image: userData.image,
                });
                const response = {
                    message: "User logged in successfully",
                    token,
                    userName,
                    email: userData.email,
                    idUser: id,
                };
                return res.json(response);
            }
            catch (error) {
                throw new Error(`Error in login. New error: ${error}`);
            }
        });
    }
    static deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                const result = yield UserModelClass_1.default.deleteAccount({ idUser });
                if (result)
                    return res.json({ message: "Account deleted successfully" });
                return res.json({ error: "Error deleting account" });
            }
            catch (error) {
                return res.json({ error: "Error deleting account" });
            }
        });
    }
    static editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                const userData = req.body;
                if (userData.password) {
                    try {
                        userData.password = yield CryptManager_1.default.encryptBcrypt({
                            data: userData.password,
                        });
                    }
                    catch (error) {
                        console.error(error);
                        return;
                    }
                }
                const updatedUser = yield UserModelClass_1.default.editUser({
                    id: idUser,
                    userData,
                });
                if (updatedUser.error)
                    return res.status(400).json({ error: updatedUser.error });
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                console.error(error);
                return res
                    .status(500)
                    .json({ error: "An error occurred while editing the user." });
            }
        });
    }
    static getUserInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req;
                console.log(idUser);
                // Fetch user information based on idUser
                const userInfo = yield UserModelClass_1.default.getUserInfo({ idUser });
                // Check if userInfo exists
                if (!userInfo) {
                    return res.status(404).json({ error: "User not found" });
                }
                // If userInfo is found, return it
                return res.status(200).json(userInfo);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: "An error occurred while fetching the user information.",
                });
            }
        });
    }
    static getUserInfoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idUser } = req.params;
                // Fetch user information based on idUser
                const userInfo = yield UserModelClass_1.default.getUserInfo({ idUser });
                // Check if userInfo exists
                if (!userInfo) {
                    return res.status(404).json({ error: "User not found" });
                }
                const mappedUserInfo = {
                    userName: userInfo.userName,
                    email: userInfo.email,
                    image: userInfo.image,
                    role: userInfo.role,
                    dateOfBirth: userInfo.dateOfBirth,
                    id: userInfo.id,
                };
                return res.status(200).json(mappedUserInfo);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    error: "An error occurred while fetching the user information.",
                });
            }
        });
    }
    static verifyUserExist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userOrEmail } = req.params;
                const user = yield UserModelClass_1.default.verifyUserExist({ userOrEmail });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                console.error(`Hubo un error al verificar si el usuario existe: ${error}`);
                return res.status(500).json({ error: "Error verifying if user exists" });
            }
        });
    }
}
AuthController.logout = (_req, res) => res.json({ message: "Logout" });
exports.default = AuthController;
