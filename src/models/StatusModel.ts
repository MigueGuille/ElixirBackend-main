import { ITSGooseHandler } from "../data/instances";
import { ContactModel, StatusModel, UserModel } from "../typegoose/models";
import UserModelClass from "./UserModelClass";

export default class StatusModelClass {
  private static verifyLast24Hours = (dateString: string) => {
    const date = new Date(dateString); // C
    const dateActual = new Date();
    const diff = Math.abs(dateActual.getTime() - date.getTime());
    const hours = Math.ceil(diff / (1000 * 60 * 60));

    return hours <= 24;
  };

  static async getAllStatusContacts({ idUser }: { idUser: string }) {
    try {
      const contacts = await ITSGooseHandler.searchAll({
        Model: ContactModel,
        condition: { idUserOwner: idUser },
      });

      const contactWithStatusAndUser = await Promise.all(
        contacts.map(async (contact: any) => {
          const status = await ITSGooseHandler.searchAll({
            Model: StatusModel,
            condition: { idUser: contact.idUserContact },
            transform: { id: 1, description: 1, image: 1, date: 1, seen: 1 },
          });

          const statusActive = status.filter((status: any) => this.verifyLast24Hours(status.date));

          const user = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: contact.idUserContact },
            transform: { id: 1, userName: 1, image: 1 },
          });

          if (status.length === 0 || !status) return false;

          const sendObj = {
            contact: {
              id: contact.id,
              name: contact.name,
              image: user.image,
              userName: user.userName,
              idUser: user.id,
            },
            status: statusActive,
          };

          return sendObj;
        })
      );
      return contactWithStatusAndUser;
    } catch (error) {
      throw error;
    }
  }

  static async getStatusUser({ idUser }: { idUser: string }) {
    try {
      const status = await ITSGooseHandler.searchAll({
        Model: StatusModel,
        condition: { idUser },
      });

      console.log(status);

      const statusActive = status.filter((status: any) => this.verifyLast24Hours(status.date));

      console.log('LLos estados del usuario son: ');
      console.log(statusActive);

      return statusActive;
    } catch (error) {
      throw error;
    }
  }

  static async createStatus(status: StatusInfo) {
    try {
      const { idUser, description, image } = status;

      const statusCreated = await ITSGooseHandler.addDocument({
        Model: StatusModel,
        data: {
          idUser,
          description,
          image,
          date: new Date(),
        },
      });

      return statusCreated;
    } catch (error) {
      throw error;
    }
  }

  static async deleteStatus({
    idStatus,
    idUser,
  }: {
    idStatus: string;
    idUser: string;
  }) {
    try {
      //Verificar se o status pertence ao usuário
      const status = await ITSGooseHandler.searchOne({
        Model: StatusModel,
        condition: { _id: idStatus, idUser },
      });

      if (!status) throw new Error("Status not found");

      const statusDeleted = await ITSGooseHandler.removeDocument({
        Model: StatusModel,
        id: idStatus,
      });

      return statusDeleted;
    } catch (error) {
      console.error(error);
      throw new Error("Error to delete status");
    }
  }

  static async obtainMyActivesStatus({ idUser }: { idUser: string }) {
    try {
      const status = await ITSGooseHandler.searchAll({
        Model: StatusModel,
        condition: { idUser },
      });

      const statusActive = status.filter((status: any) => this.verifyLast24Hours(status.date));

      const userInfo = await UserModelClass.getUserInfo({ idUser });

      if (!statusActive) return { userInfo, status: [] };

      const objResponse = { contact: userInfo, status: statusActive };

      return objResponse;
    } catch (error) {
      throw error;
    }
  }
}

interface StatusInfo {
  idUser: string;
  description: string;
  image: string;
}


