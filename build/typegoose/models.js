"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessageModel = exports.ChatModel = exports.MessageModel = exports.StatusModel = exports.GroupMessageModel = exports.GroupModel = exports.ContactModel = exports.ActivateCodeModel = exports.UserModel = void 0;
const instances_1 = require("../data/instances");
const schemasDefinitions_1 = require("../typegoose/schemasDefinitions");
const UserModel = instances_1.ITSGooseHandler.createModel({ clazz: schemasDefinitions_1.User });
exports.UserModel = UserModel;
const ActivateCodeModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.ActivateCode,
});
exports.ActivateCodeModel = ActivateCodeModel;
const ContactModel = instances_1.ITSGooseHandler.createModel({ clazz: schemasDefinitions_1.Contact });
exports.ContactModel = ContactModel;
const GroupModel = instances_1.ITSGooseHandler.createModel({ clazz: schemasDefinitions_1.Group });
exports.GroupModel = GroupModel;
const GroupMessageModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.GroupMessage,
});
exports.GroupMessageModel = GroupMessageModel;
const StatusModel = instances_1.ITSGooseHandler.createModel({ clazz: schemasDefinitions_1.Status });
exports.StatusModel = StatusModel;
const MessageModel = instances_1.ITSGooseHandler.createModel({ clazz: schemasDefinitions_1.Message });
exports.MessageModel = MessageModel;
const ChatModel = instances_1.ITSGooseHandler.createModel({ clazz: schemasDefinitions_1.Chat });
exports.ChatModel = ChatModel;
const ChatMessageModel = instances_1.ITSGooseHandler.createModel({
    clazz: schemasDefinitions_1.ChatMessage,
});
exports.ChatMessageModel = ChatMessageModel;
