import { Request, Response } from "express";
import ContactModelClass from "../models/ContactsModel";
import UserModelClass from "../models/UserModelClass";

export default class ContactController {
  static getAllContacts = async (req: Request, res: Response) => {
    try {
      const { idUser } = req as any;
      const { page = 1 } = req.query;
      const result = await ContactModelClass.getAllContacts({
        idUser,
        page: +page,
      });

      console.log(result);
      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al obtener los contactos: ${error}`);
      throw new Error(`Error getting contacts: ${error}`);
    }
  };

  static addContact = async (req: Request, res: Response) => {
    try {
      const { idUser } = req as any;
      const { userOrEmail, nameContact } = req.body;

      //Verificar si el usuario existe
      const resultExist = await UserModelClass.verifyUserExist({ userOrEmail });

      if (!resultExist) {
        return res.status(404).json({ message: "User not found" });
      }

      //Agregar contacto
      const result = await ContactModelClass.addContact({
        idUser,
        idUserContact: resultExist.id,
        nameContact,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al agregar el contacto: ${error}`);
      throw new Error(`Error adding contact: ${error}`);
    }
  };

  static deleteContact = async (req: Request, res: Response) => {
    try {
      const { idContact } = req.params;

      const result = await ContactModelClass.deleteContact({
        idContact,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al eliminar el contacto: ${error}`);
      throw new Error(`Error deleting contact: ${error}`);
    }
  };

  static getSimpleContacts = async (req: Request, res: Response) => {
    try {
      const { idUser } = req as any;
      const result = await ContactModelClass.getSimpleContacts({
        idUser,
      });

      return res.json(result);
    } catch (error) {
      console.error(`Hubo un error al obtener los contactos: ${error}`);
      throw new Error(`Error getting contacts: ${error}`);
    }
  };
}
