"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = exports.Chat = exports.Message = exports.Status = exports.GroupMessage = exports.Group = exports.Contact = exports.ActivateCode = exports.User = void 0;
//TODO: AGREGAR VALIDACIONES QUE YA SE CREAERON
//TODO: AL USUARIO LE FALTA EL ROL
const typegoose_1 = require("@typegoose/typegoose");
const schemasValidations_1 = require("./schemasValidations");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typegoose_1.prop)({
        required: true,
        type: String,
        validate: schemasValidations_1.UserValidations.userNameValidate(),
    })
], User.prototype, "userName", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: true,
        type: String,
        validate: schemasValidations_1.UserValidations.emailValidate(),
    })
], User.prototype, "email", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: true,
        type: String,
    })
], User.prototype, "password", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: false,
        type: String,
        validate: schemasValidations_1.UserValidations.imageValidate(),
        default: "https://st2.depositphotos.com/47577860/46269/v/450/depositphotos_462698004-stock-illustration-account-avatar-interface-icon-flat.jpg",
    })
], User.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({
        required: false,
        type: Date,
        validate: schemasValidations_1.UserValidations.dateOfBirtValidate(),
    })
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Number, default: 1000 })
], User.prototype, "attempts", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Boolean, default: false })
], User.prototype, "blocked", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Boolean, default: false })
], User.prototype, "active", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String, default: "user" })
], User.prototype, "role", void 0);
exports.User = User = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], User);
let ActivateCode = class ActivateCode {
};
exports.ActivateCode = ActivateCode;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], ActivateCode.prototype, "code", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], ActivateCode.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: Date.now, type: Date })
], ActivateCode.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ expires: 12000, type: Date })
], ActivateCode.prototype, "expireAt", void 0);
exports.ActivateCode = ActivateCode = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], ActivateCode);
let Contact = class Contact {
};
exports.Contact = Contact;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Contact.prototype, "idUserContact", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Contact.prototype, "idUserOwner", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Contact.prototype, "name", void 0);
exports.Contact = Contact = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Contact);
let Group = class Group {
};
exports.Group = Group;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Group.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String })
], Group.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Group.prototype, "idUserOwner", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: (Array), ref: () => User })
], Group.prototype, "idUsers", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String })
], Group.prototype, "image", void 0);
exports.Group = Group = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Group);
let GroupMessage = class GroupMessage {
};
exports.GroupMessage = GroupMessage;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => Group })
], GroupMessage.prototype, "idGroup", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], GroupMessage.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Object })
], GroupMessage.prototype, "message", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Date })
], GroupMessage.prototype, "date", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: (Array) })
], GroupMessage.prototype, "seen", void 0);
exports.GroupMessage = GroupMessage = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], GroupMessage);
let Status = class Status {
};
exports.Status = Status;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Status.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: (Array), ref: () => User })
], Status.prototype, "seen", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: String, default: "" })
], Status.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String })
], Status.prototype, "image", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Date })
], Status.prototype, "date", void 0);
exports.Status = Status = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Status);
let Message = class Message {
};
exports.Message = Message;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Message.prototype, "idUserSender", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Message.prototype, "idUserReceiver", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Object })
], Message.prototype, "content", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: Date })
], Message.prototype, "date", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: false, type: Boolean, default: false })
], Message.prototype, "read", void 0);
exports.Message = Message = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], Message);
let Chat = class Chat {
};
exports.Chat = Chat;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Chat.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], Chat.prototype, "idUserReceiver", void 0);
exports.Chat = Chat = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    }),
    (0, typegoose_1.index)({ idUser: 1, idUserReceiver: 1 }, { unique: true })
], Chat);
let ChatMessage = class ChatMessage {
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => Chat })
], ChatMessage.prototype, "idChat", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => User })
], ChatMessage.prototype, "idUser", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: String, ref: () => Message })
], ChatMessage.prototype, "idMessage", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            toJSON: {
                transform: (_doc, ret) => {
                    ret.id = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                },
            },
        },
    })
], ChatMessage);
