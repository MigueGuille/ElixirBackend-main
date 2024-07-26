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
const instances_1 = require("../data/instances");
const models_1 = require("../typegoose/models");
class ActivateModelClass {
    static removeActivateDocument(_a) {
        return __awaiter(this, arguments, void 0, function* ({ idActivation, }) {
            try {
                const result = yield instances_1.ITSGooseHandler.removeDocument({
                    Model: models_1.ActivateCodeModel,
                    id: idActivation,
                });
                return result;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
    static searchOneActivation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, idUser, }) {
            try {
                const condition = Object.assign(Object.assign({}, (code ? { code } : {})), (idUser ? { idUser } : {}));
                const result = yield instances_1.ITSGooseHandler.searchOne({
                    Model: models_1.ActivateCodeModel,
                    condition,
                });
                return result;
            }
            catch (error) {
                console.error(error);
                return { error };
            }
        });
    }
}
exports.default = ActivateModelClass;
