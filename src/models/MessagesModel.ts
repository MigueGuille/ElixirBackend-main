import {
  ChatModel,
  ChatMessageModel,
  MessageModel,
  UserModel,
  // UserModel,
} from "../typegoose/models";
import { ITSGooseHandler } from "../data/instances";
import { MessageInterface } from "../types";

export default class MessagesModelClass {
  static addMessage = async ({
    idSender,
    idReceiver,
    content,
  }: {
    idSender: string;
    idReceiver: string;
    content: MessageInterface;
  }) => {
    try {
      //Primero vamos a agregar a la coleccion de mensajes
      const newMessage = {
        idUserSender: idSender,
        idUserReceiver: idReceiver,
        content,
        date: new Date(),
        read: false,
      };

      const resultMessageDB = await ITSGooseHandler.addDocument({
        Model: MessageModel,
        data: newMessage,
      });

      //Luego vamos a buscar en chats donde idUser = idSender y idUserSender = idReceiver o viceversa
      const CONDITION_CHAT_RECEIVER = {
        $or: [{ idUser: idReceiver, idUserReceiver: idSender }],
      };

      const chatReceiverData = await ITSGooseHandler.searchOne({
        Model: ChatModel,
        condition: CONDITION_CHAT_RECEIVER,
      });

      //Si no existe el chat en el receptor lo creamos
      const dataNullChatReceiver =
        chatReceiverData.length === 0 || !chatReceiverData;

      const resultCreateChatReceiver = dataNullChatReceiver
        ? await ITSGooseHandler.addDocument({
            Model: ChatModel,
            data: {
              idUser: idReceiver,
              idUserReceiver: idSender,
            },
          })
        : chatReceiverData;

      //Vamos a encontrar el chat del que envia
      const CONDITION_CHAT_SENDER = {
        $or: [{ idUser: idSender, idUserReceiver: idReceiver }],
      };

      //Este siempre va a existir, el es el que envia el mensaje
      const chatSenderData = await ITSGooseHandler.searchOne({
        Model: ChatModel,
        condition: CONDITION_CHAT_SENDER,
      });

      //Al encontrar los chats de cada uno vamos a agregar el mensaje a cada chat
      //Este es para el que envia
      const resultSend = await ITSGooseHandler.addDocument({
        Model: ChatMessageModel,
        data: {
          idChat: chatSenderData.id,
          idMessage: resultMessageDB.id,
          idUser: idSender,
        },
      });

      const resultReceiver = await ITSGooseHandler.addDocument({
        Model: ChatMessageModel,
        data: {
          idChat: resultCreateChatReceiver.id,
          idMessage: resultMessageDB.id,
          idUser: idReceiver,
        },
      });

      return {
        resultSend,
        resultReceiver,
      };
    } catch (error) {
      console.error(`Hubo un error al agregar el mensaje: ${error}`);
      throw new Error(`Error adding message: ${error}`);
    }
  };

  static getMessageByChat = async ({
    idChat,
    page = 1,
    idUser,
  }: {
    idChat: string;
    page?: number;
    idUser: string;
  }) => {
    try {
      const LIMIT_PAGE_MESSAGE = 300;

      //Ok ahora necesito hacer una logica, para que me traiga los mensajes pero los ultimos registros, y a medida que vaya aumentando la pagina me traiga los anteriores

      // Verificar que el chat realmente existe
      const chat = await ChatModel.findById(idChat);
      if (!chat) {
        throw new Error(`Chat with id ${idChat} does not exist`);
      }

      const messages = await ITSGooseHandler.searchAll({
        Model: ChatMessageModel,
        condition: { idChat },
        limit: LIMIT_PAGE_MESSAGE,
        offset: (page - 1) * LIMIT_PAGE_MESSAGE,
        sort: { _id: -1 },
      });

      const messageReversed = messages.reverse();

      const formattedMessages = await Promise.all(
        messageReversed.map(async (message: any) => {
          const content = await ITSGooseHandler.searchOne({
            Model: MessageModel,
            condition: { _id: message.idMessage },
            transform: { content: 1, date: 1, read: 1, id: 1, idUserSender: 1 },
          });

          const userSender = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: content.idUserSender },
            transform: { userName: 1, id: 1, image: 1, email: 1 },
          });

          return {
            id: content.id,
            sender: content.idUserSender,
            message: {
              type: content.content.type,
              content: content.content.message,
            },
            date: content.date,
            senderData: {
              userName: userSender.userName,
              email: userSender.email,
            },
            type: message.type,
          };
        })
      );

      //Ahora voy a verificar si yo soy el mismo que lo envie, para agregar una prop de isSendByMe
      const formattedMessagesWithIsSendByMe = formattedMessages.map(
        (message: any) => {
          return {
            ...message,
            isSendByMe: message.sender === idUser,
          };
        }
      );

      return formattedMessagesWithIsSendByMe;
    } catch (error) {
      console.error(`Hubo un error al obtener los mensajes: ${error}`);
      throw new Error(`Error getting messages: ${error}`);
    }
  };

  static gettAllChatsByUser = async ({
    idUser,
    page = 1,
  }: {
    idUser: string;
    page: number;
  }) => {
    try {
      const LIMIT_PAGE_CHAT = 15;
  
      const chats = (await ITSGooseHandler.searchAll({
        Model: ChatModel,
        condition: { idUser },
        limit: LIMIT_PAGE_CHAT,
        offset: (page - 1) * LIMIT_PAGE_CHAT,
      })) as any;
  
      // Paso 1: Obtener chats con el último mensaje
      const chatsWithLastMessage = (await Promise.all(
        chats.map(async (chat: any) => {
          const lastMessage = await ITSGooseHandler.searchOne({
            Model: ChatMessageModel,
            condition: { idChat: chat.id },
            transform: { idMessage: 1 },
          });
  
          if (!lastMessage) return null;
  
          const lastMessageContent = await ITSGooseHandler.searchOne({
            Model: MessageModel,
            condition: { _id: lastMessage.idMessage },
            transform: { content: 1, date: 1, read: 1, id: 1, idUserSender: 1 },
          });
  
          if (!lastMessageContent) return null;
  
          const lastMessageContentParsed = {
            id: lastMessageContent.id,
            idUserSender: lastMessageContent.idUserSender,
            sender: lastMessageContent.idUserSender,
            message: {
              type: lastMessageContent.content.type,
              content: lastMessageContent.content.message,
            },
            date: lastMessageContent.date,
          };
  
          return {
            ...chat,
            lastMessageContent: lastMessageContentParsed,
          };
        })
      )).filter(chat => chat !== null); // Filtrar chats sin último mensaje
  
      // Paso 2: Obtener chats con receptor
      const chatsWithLastMessageAndUser = (await Promise.all(
        chatsWithLastMessage.map(async (chat: any) => {
          if (!chat.lastMessageContent) return null;
  
          const userLastMessage = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: chat.lastMessageContent.idUserSender },
            transform: { userName: 1, id: 1, image: 1 },
          });
  
          if (!userLastMessage) return null;
  
          const userReceiver = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: chat.idUserReceiver },
            transform: { userName: 1, id: 1, image: 1 },
          });
  
          if (!userReceiver) return null;
  
          return {
            ...chat,
            userLastMessage,
            userReceiver,
          };
        })
      )).filter(chat => chat !== null); // Filtrar chats sin receptor
  
      return chatsWithLastMessageAndUser;
    } catch (error) {
      console.error(`Hubo un error al obtener los chats: ${error}`);
      throw new Error(`Error getting chats: ${error}`);
    }
  };

  static addChat = async ({
    idUserSender,
    idUserReceiver,
    twoChats = true,
  }: {
    idUserSender: string;
    idUserReceiver: string;
    twoChats?: boolean;
  }) => {
    try {
      //Primero vamos a verificar si ya existe un chat entre los dos
      const chatExist = await ITSGooseHandler.searchOne({
        Model: ChatModel,
        condition: { idUser: idUserSender, idUserReceiver },
      });

      const addChatToSender = chatExist
        ? chatExist
        : await ITSGooseHandler.addDocument({
            Model: ChatModel,
            data: {
              idUser: idUserSender,
              idUserReceiver,
            },
          });

      const chatExistReceiver = await ITSGooseHandler.searchOne({
        Model: ChatModel,
        condition: { idUser: idUserReceiver, idUserReceiver: idUserSender },
      });

      const addChatToReceiver = twoChats
        ? chatExistReceiver
          ? chatExistReceiver
          : await ITSGooseHandler.addDocument({
              Model: ChatModel,
              data: {
                idUser: idUserReceiver,
                idUserReceiver: idUserSender,
              },
            })
        : null;

      return { addChatToReceiver, addChatToSender };
    } catch (error) {
      console.error(`Hubo un error al agregar el chat: ${error}`);
      throw new Error(`Error adding chat: ${error}`);
    }
  };

  static verifyChatUser = async ({
    idUser,
    idUserReceiver,
  }: {
    idUser: string;
    idUserReceiver: string;
  }) => {
    try {
      const result = await ITSGooseHandler.searchOne({
        Model: ChatModel,
        condition: { idUser, idUserReceiver },
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Error verifying chat: ${error}`);
    }
  };

  static deleteChat = async ({ idChat }: { idChat: string }) => {
    try {
      const data1 = await ITSGooseHandler.removeDocument({
        Model: ChatModel,
        id: idChat,
      });

      const data2 = await ITSGooseHandler.removeAllDocumentsByCondition({
        Model: ChatMessageModel,
        condition: { idChat },
      });

      return { data1, data2 };
    } catch (error) {
      console.error(`Hubo un error al eliminar el chat: ${error}`);
      throw new Error(`Error deleting chat: ${error}`);
    }
  };
}
