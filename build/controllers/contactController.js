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
const ContactsModel_1 = __importDefault(require("../models/ContactsModel"));
const UserModelClass_1 = __importDefault(require("../models/UserModelClass"));
class ContactController {
}
_a = ContactController;
ContactController.getAllContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const { page = 1 } = req.query;
        const result = yield ContactsModel_1.default.getAllContacts({
            idUser,
            page: +page,
        });
        console.log(result);
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al obtener los contactos: ${error}`);
        throw new Error(`Error getting contacts: ${error}`);
    }
});
ContactController.addContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const { userOrEmail, nameContact } = req.body;
        //Verificar si el usuario existe
        const resultExist = yield UserModelClass_1.default.verifyUserExist({ userOrEmail });
        if (!resultExist) {
            return res.status(404).json({ message: "User not found" });
        }
        //Agregar contacto
        const result = yield ContactsModel_1.default.addContact({
            idUser,
            idUserContact: resultExist.id,
            nameContact,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al agregar el contacto: ${error}`);
        throw new Error(`Error adding contact: ${error}`);
    }
});
ContactController.deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idContact } = req.params;
        const result = yield ContactsModel_1.default.deleteContact({
            idContact,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al eliminar el contacto: ${error}`);
        throw new Error(`Error deleting contact: ${error}`);
    }
});
ContactController.getSimpleContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req;
        const result = yield ContactsModel_1.default.getSimpleContacts({
            idUser,
        });
        return res.json(result);
    }
    catch (error) {
        console.error(`Hubo un error al obtener los contactos: ${error}`);
        throw new Error(`Error getting contacts: ${error}`);
    }
});
exports.default = ContactController;
