import { ITSGooseHandler } from "../data/instances";
import {
  User,
  ActivateCode,
  Contact,
  Group,
  GroupMessage,
  Status,
  Message,
  Chat,
  ChatMessage,
} from "../typegoose/schemasDefinitions";

const UserModel = ITSGooseHandler.createModel<User>({ clazz: User });

const ActivateCodeModel = ITSGooseHandler.createModel<ActivateCode>({
  clazz: ActivateCode,
});

const ContactModel = ITSGooseHandler.createModel<Contact>({ clazz: Contact });

const GroupModel = ITSGooseHandler.createModel<Group>({ clazz: Group });

const GroupMessageModel = ITSGooseHandler.createModel<GroupMessage>({
  clazz: GroupMessage,
});

const StatusModel = ITSGooseHandler.createModel<Status>({ clazz: Status });

const MessageModel = ITSGooseHandler.createModel<Message>({ clazz: Message });

const ChatModel = ITSGooseHandler.createModel<Chat>({ clazz: Chat });

const ChatMessageModel = ITSGooseHandler.createModel<ChatMessage>({
  clazz: ChatMessage,
});

export {
  UserModel,
  ActivateCodeModel,
  ContactModel,
  GroupModel,
  GroupMessageModel,
  StatusModel,
  MessageModel,
  ChatModel,
  ChatMessageModel,
};
