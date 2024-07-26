import { ActivateCodeModel, UserModel } from "../typegoose/models";
import { IJWTManager, ITSGooseHandler } from "../data/instances";
import { AddActivateCodeParams, RegisterUser, UserInterface } from "../types";
import CryptManager from "../utils/CryptManager";

class UserModelClass {
  static async deleteAccount({ idUser }: { idUser: string }) {
    try {
      //Verificar que el usuario existe
      const user = await ITSGooseHandler.searchOne({
        Model: UserModel,
        condition: { _id: idUser },
      });

      if (!user) return { error: "User not found" };

      await ITSGooseHandler.removeDocuments({
        Model: ActivateCodeModel,
        condition: { idUser },
      });

      const resultUser = await ITSGooseHandler.removeDocument({
        Model: UserModel,
        id: idUser,
      });

      return resultUser;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  static async obtainUsers() {
    try {
      const data = await ITSGooseHandler.searchAll({ Model: UserModel });

      return data;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  static async registerUser({
    userData,
  }: {
    userData: RegisterUser;
  }): Promise<UserInterface> {
    try {
      const hashPassword = await CryptManager.encryptBcrypt({
        data: userData.password,
      });

      const newUser = {
        ...userData,
        password: hashPassword,
      };

      //TODO: Falta buscar el tipo del UserModel, que sea compatible con el _id sin modificar la clase
      const result: UserInterface = await ITSGooseHandler.addDocument({
        Model: UserModel,
        data: newUser,
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Error registering user. Error: ${error}`);
    }
  }

  static async addActivateCode({ code, idUser }: AddActivateCodeParams) {
    try {
      //TODO: Buscar el tipo directamente de la instancia de un Activate code model, que sea compatible con el _id sin modificar la clase
      const result = await ITSGooseHandler.addDocument({
        Model: ActivateCodeModel,
        data: { code, idUser },
      });

      return result;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  static async searchUserExist({
    userName,
    email,
  }: {
    userName?: string;
    email?: string;
  }) {
    try {
      const condition = {
        $or: [
          ...(userName ? [{ userName }] : []),
          ...(email ? [{ email }] : []),
        ],
      };

      const data = await ITSGooseHandler.searchOne({
        Model: UserModel,
        condition,
      });

      return data ? data : false;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  static async searchUserId({ id }: { id: string }): Promise<UserInterface> {
    try {
      const user = await ITSGooseHandler.searchOne({
        Model: UserModel,
        condition: { _id: id },
      });

      return user as UserInterface;
    } catch (error) {
      console.error(error);
      throw new Error(`Error searching user by id ${error}`);
    }
  }

  static async activateUser({ id }: { id: string }) {
    try {
      const updatedUser = await ITSGooseHandler.editDocument({
        Model: UserModel,
        id,
        newData: { active: true },
      });

      return updatedUser;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  static async decreaseAttempts({ id }: { id: string }) {
    try {
      const { attempts } = await UserModelClass.searchUserId({ id });

      if (Number(attempts) === 0) return;

      const newAttempts = attempts - 1;

      const result = await ITSGooseHandler.editDocument({
        Model: UserModel,
        id,
        newData: { attempts: newAttempts },
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Error decreasing attempts. Error ${error}`);
    }
  }

  static async blockUser({ id }: { id: string }) {
    try {
      const result = await ITSGooseHandler.editDocument({
        Model: UserModel,
        id,
        newData: { blocked: true },
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Error blocking user. Error ${error}`);
    }
  }

  // TODO: IMPLEMENTAR
  //!WARNING AUN NO SE USA
  static async unblockUser({ id }: { id: string }) {
    try {
      const result = await ITSGooseHandler.editDocument({
        Model: UserModel,
        id,
        newData: { blocked: false },
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Error unblocking user. Error ${error}`);
    }
  }

  static async resetAttempts({ id }: { id: string }) {
    try {
      const result = await ITSGooseHandler.editDocument({
        Model: UserModel,
        id,
        newData: { attempts: 3 },
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new Error(`Error resetting attempts. Error ${error}`);
    }
  }

  static async generateToken({
    id,
    userName,
    email,
    image,
  }: {
    id: string;
    userName: string;
    email: string;
    image?: string;
  }) {
    try {
      const dataToken = IJWTManager.generateToken({
        id,
        email,
        userName,
        image,
      });

      return dataToken;
    } catch (error) {
      console.log("Error in generateToken() in UserModelClass.ts: ", error);
      throw new Error(`Error generating token. Error ${error}`);
    }
  }

  static async editUser({
    id,
    userData,
  }: {
    id: string;
    userData: Partial<UserInterface>;
  }) {
    try {
      const updatedUser = await ITSGooseHandler.editDocument({
        Model: UserModel,
        id,
        newData: userData,
      });

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error(`Error editing user. Error ${error}`);
    }
  }

  static async getUserInfo({ idUser }: { idUser: string }) {
    try {
      const user = await ITSGooseHandler.searchOne({
        Model: UserModel,
        condition: { _id: idUser },
      });

      return user;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  static async verifyUserExist({ userOrEmail }: { userOrEmail: string }) {
    try {
      const user = await ITSGooseHandler.searchOne({
        Model: UserModel,
        condition: { $or: [{ userName: userOrEmail }, { email: userOrEmail }] },
        transform: {
          password: 0,
          dateOfBirth: 0,
          attempts: 0,
          active: 0,
          blocked: 0,
          idArtist: 0,
        },
      });

      return user;
    } catch (error) {
      console.error(error);
      throw new Error(`Error verifying user exist. Error ${error}`);
    }
  }
}

export default UserModelClass;
