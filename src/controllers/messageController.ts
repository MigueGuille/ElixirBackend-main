import { Request, Response } from "express";
import MessagesModelClass from "../models/MessagesModel";

class MessageController {
  static async getAllChats(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      const page = parseInt(req.params.page) || 1;

      const result = await MessagesModelClass.gettAllChatsByUser({
        idUser,
        page,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al obtener los mensajes: ${error}`);
      throw new Error(`Error getting messages: ${error}`);
    }
  }

  static addMessages = async (req: Request, res: Response) => {
    try {
      const { idUser } = req as any;
      const { idReceiver, content } = req.body;

      //Debemos validar que content, tenga esta estructura
      // {type: "text", content: "Hola", "message": string}

      const result = await MessagesModelClass.addMessage({
        idSender: idUser,
        idReceiver,
        content,
      });

      return res.json(result);
    } catch (error) {
      console.error(error);
      throw new Error(`Error adding message: ${error}`);
    }
  };

  static getMessageChat = async (req: Request, res: Response) => {
    try {
      const { idUser } = req as any;
      const { idChat, page } = req.params;
      const parsedPage = parseInt(page) || 1;

      const result = await MessagesModelClass.getMessageByChat({
        idChat,
        page: parsedPage,
        idUser,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al obtener los mensajes: ${error}`);
      throw new Error(`Error getting messages: ${error}`);
    }
  };

  static addChat = async (req: Request, res: Response) => {
    try {
      const { idUser } = req as any;
      const { idUserReceiver } = req.body;

      const result = await MessagesModelClass.addChat({
        idUserSender: idUser,
        idUserReceiver,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al obtener los mensajes: ${error}`);
      throw new Error(`Error getting messages: ${error}`);
    }
  };

  static verifyChatUser = async (req: Request, res: Response) => {
    try {
      const { idUser } = req as any;
      const { idUserReceiver } = req.params;

      const result = await MessagesModelClass.verifyChatUser({
        idUser,
        idUserReceiver,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al obtener los mensajes: ${error}`);
      throw new Error(`Error getting messages: ${error}`);
    }
  };

  static deleteChat = async (req: Request, res: Response) => {
    try {
      const { idChat } = req.params;

      const result = await MessagesModelClass.deleteChat({
        idChat,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al obtener los mensajes: ${error}`);
      throw new Error(`Error getting messages: ${error}`);
    }
  };
}

export default MessageController;
