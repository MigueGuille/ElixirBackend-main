import { ITSGooseHandler } from "../data/instances";
import { ContactModel, UserModel } from "../typegoose/models";

export default class ContactModelClass {
  static getAllContacts = async ({
    idUser,
    page = 1,
    limit = 20,
  }: {
    idUser: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const offset = (page - 1) * limit;

      const result = await ITSGooseHandler.searchAll({
        Model: ContactModel,
        condition: { idUserOwner: idUser },
        offset,
        limit,
      });

      // Mapping to include user contact data
      const resultMapped = await Promise.all(
        result.map(async (contact: any) => {
          const objMap = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: contact.idUserContact },
            transform: { _id: 1, userName: 1, email: 1, image: 1 },
          });

          return {
            ...contact,
            userContactData: objMap,
          };
        })
      );

      return resultMapped;
    } catch (error) {
      console.error(`Hubo un error al obtener los contactos: ${error}`);
      throw new Error(`Error getting contacts: ${error}`);
    }
  };

  static addContact = async ({
    idUser,
    idUserContact,
    nameContact,
  }: {
    idUser: string;
    idUserContact: string;
    nameContact: string;
  }) => {
    try {
      if (idUser === idUserContact) {
        return {
          error: {
            message: "No puedes agregarte a ti mismo como contacto",
          },
        };
      }

      //Verifica que si ya existe un contacto nuestro con esa id en la base de datos no lo agreguie
      const resultExist = await ITSGooseHandler.searchOne({
        Model: ContactModel,
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

      const resultAdd = await ITSGooseHandler.addDocument({
        Model: ContactModel,
        data: dataToAdd,
      });

      console.log(`Agrege este contacto`);
      return resultAdd;
    } catch (error) {
      console.error(`Hubo un error al agregar el contacto: ${error}`);
      throw new Error(`Error adding contact: ${error}`);
    }
  };

  static async deleteContact({ idContact }: { idContact: string }) {
    try {
      const result = await ITSGooseHandler.removeDocument({
        Model: ContactModel,
        id: idContact,
      });

      return result;
    } catch (error) {
      console.error(`Hubo un error al eliminar el contacto: ${error}`);
      throw new Error(`Error deleting contact: ${error}`);
    }
  }

  static async getSimpleContacts({ idUser }: { idUser: string }) {
    try {
      const result = await ITSGooseHandler.searchAll({
        Model: ContactModel,
        condition: { idUserOwner: idUser },
        transform: { idUserContact: 1, name: 1 },
      });

      const mappedContacts = await Promise.all(
        result.map((contact: any) => {
          return {
            id: contact.idUserContact,
            text: contact.name,
          };
        })
      );

      return mappedContacts;
    } catch (error) {
      console.error(`Hubo un error al obtener los contactos: ${error}`);
      throw new Error(`Error getting contacts: ${error}`);
    }
  }
}
