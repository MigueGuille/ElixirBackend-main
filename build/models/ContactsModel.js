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
const instances_1 = require("../data/instances");
const models_1 = require("../typegoose/models");
class ContactModelClass {
    static deleteContact(_b) {
        return __awaiter(this, arguments, void 0, function* ({ idContact }) {
            try {
                const result = yield instances_1.ITSGooseHandler.removeDocument({
                    Model: models_1.ContactModel,
                    id: idContact,
                });
                return result;
            }
            catch (error) {
                console.error(`Hubo un error al eliminar el contacto: ${error}`);
                throw new Error(`Error deleting contact: ${error}`);
            }
        });
    }
    static getSimpleContacts(_b) {
        return __awaiter(this, arguments, void 0, function* ({ idUser }) {
            try {
                const result = yield instances_1.ITSGooseHandler.searchAll({
                    Model: models_1.ContactModel,
                    condition: { idUserOwner: idUser },
                    transform: { idUserContact: 1, name: 1 },
                });
                const mappedContacts = yield Promise.all(result.map((contact) => {
                    return {
                        id: contact.idUserContact,
                        text: contact.name,
                    };
                }));
                return mappedContacts;
            }
            catch (error) {
                console.error(`Hubo un error al obtener los contactos: ${error}`);
                throw new Error(`Error getting contacts: ${error}`);
            }
        });
    }
}
_a = ContactModelClass;
ContactModelClass.getAllContacts = (_b) => __awaiter(void 0, [_b], void 0, function* ({ idUser, page = 1, limit = 20, }) {
    try {
        const offset = (page - 1) * limit;
        const result = yield instances_1.ITSGooseHandler.searchAll({
            Model: models_1.ContactModel,
            condition: { idUserOwner: idUser },
            offset,
            limit,
        });
        // Mapping to include user contact data
        const resultMapped = yield Promise.all(result.map((contact) => __awaiter(void 0, void 0, void 0, function* () {
            const objMap = yield instances_1.ITSGooseHandler.searchOne({
                Model: models_1.UserModel,
                condition: { _id: contact.idUserContact },
                transform: { _id: 1, userName: 1, email: 1, image: 1 },
            });
            return Object.assign(Object.assign({}, contact), { userContactData: objMap });
        })));
        return resultMapped;
    }
    catch (error) {
        console.error(`Hubo un error al obtener los contactos: ${error}`);
        throw new Error(`Error getting contacts: ${error}`);
    }
});
ContactModelClass.addContact = (_c) => __awaiter(void 0, [_c], void 0, function* ({ idUser, idUserContact, nameContact, }) {
    try {
        if (idUser === idUserContact) {
            return {
                error: {
                    message: "No puedes agregarte a ti mismo como contacto",
                },
            };
        }
        //Verifica que si ya existe un contacto nuestro con esa id en la base de datos no lo agreguie
        const resultExist = yield instances_1.ITSGooseHandler.searchOne({
            Model: models_1.ContactModel,
            condition: { idUserOwner: idUser, idUserContact },
        });
        if (resultExist.length > 0 || resultExist)
            return {
                error: {
                    message: "El contacto ya existe",
                },
            };
        const dataToAdd = {
            idUserOwner: idUser,
            idUserContact,
            name: nameContact,
        };
        const resultAdd = yield instances_1.ITSGooseHandler.addDocument({
            Model: models_1.ContactModel,
            data: dataToAdd,
        });
        console.log(`Agrege este contacto`);
        return resultAdd;
    }
    catch (error) {
        console.error(`Hubo un error al agregar el contacto: ${error}`);
        throw new Error(`Error adding contact: ${error}`);
    }
});
exports.default = ContactModelClass;
