import { Request, Response } from "express";
import { RegisterUser, RegisteredUser, UserInterface } from "../types";
import REGISTER_VALIDATORS from "../schemas/registerValidators";
import { INodeMailer } from "../data/instances";
import CryptManager from "../utils/CryptManager";
import { Constants, URLS } from "../enums";
import UserModelClass from "../models/UserModelClass";
import ActivateModelClass from "../models/ActivateModelClass";
import { HTMLS_RESPONSES } from "../constants";

class AuthController {
  private static verifyData({ req }: { req: Request }): void {
    const body = req.body as RegisterUser;
    const { userName, email, password, dateOfBirth } = body;


    if (!userName || !email || !password || !dateOfBirth) {
      throw new Error("Missing required fields");
    }

    for (const field in body) {
      if (
        field in REGISTER_VALIDATORS &&
        !REGISTER_VALIDATORS[field]((body as any)[field])
      ) {
        throw new Error(`${field} is not valid!`);
      }
    }

    return 
}

  private static async verifyUser({ req }: { req: Request }): Promise<void> {
    const body = req.body as RegisterUser;
    const { email, userName } = body;

    const data = await UserModelClass.searchUserExist({ userName, email });

    if (data) {
      throw new Error("User or email already exist");
    }

    return
  }

  private static async registerUser({
    req,
  }: {
    req: Request;
  }): Promise<Boolean | Object> {
    try {
      const body = req.body as RegisterUser;

      const userAdded = (await UserModelClass.registerUser({
        userData: body,
      })) as UserInterface;

      //Generate hash
      const code = CryptManager.generateRandom();

      //Add verification code to Database
      await UserModelClass.addActivateCode({ code, idUser: userAdded?._id });

      return { data: userAdded, code };
    } catch (error) {
      console.error(`Error registering user: ${error}`);
      return false;
    }
  }

  //TODO: Esto hay que hacerlo mejor en el modelo
  private static async sendVerificationMail({
    userData,
    code,
  }: {
    userData: RegisterUser;
    code: string;
  }): Promise<Boolean> {
    try {
      console.log("Los datos de registro son");
      console.log(userData);

      const htmlContent = `
        <div style="text-align: center; font-family: 'Arial', sans-serif; background-color: #000; color: #FFF; padding: 20px; border-radius: 10px;">
  <h1 style="color: #007BFF;">Elixir</h1>
  <p style="font-size: 1.2em;">Thank you for registering with us!</p>
  <p style="font-size: 1.2em;">Please click the button below to activate your account.</p>
  <a href="${URLS.ACTIVATE_USER}/${code}" 
     style="display: inline-block; background-color: #007BFF; color: #FFF; padding: 10px 20px; text-decoration: none; font-size: 1.5em; margin: 20px auto; border-radius: 5px; transition: background-color 0.3s, color 0.3s;">
    Activate Account
  </a>
</div>

<style>
  a:hover {
    background-color: #FFF;
    color: #000;
    border: 2px solid #007BFF;
  }
</style>
      `;

      INodeMailer.sendMailHtml({
        to: userData.email,
        subject: "Activate your account - ELIXIR",
        html: htmlContent,
      });

      return true;
    } catch (error) {
      console.error(`Error sending verification mail: ${error}`);
      return false;
    }
  }

  public static async activateUser(req: Request, res: Response) {
    try {
      const { code } = req.params;

      // Buscar el activationRecord
      const activationRecord = await ActivateModelClass.searchOneActivation({
        code,
      });

      if (!activationRecord)
        return res.json({ error: "Activation record not found" });

      // Buscar el usuario asociado con el activationRecord

      const id = activationRecord.idUser;
      const user = await UserModelClass.searchUserId({ id });

      if (!user) return res.json({ error: "User not found" });

      // Cambiar la propiedad activate del usuario a true
      const updatedUser = await UserModelClass.activateUser({ id });

      if (Constants.ERROR in updatedUser)
        return res.json({ error: "Error activating user" });

      // Eliminar el activationRecord
      const deletedRecord = await ActivateModelClass.removeActivateDocument({
        idActivation: activationRecord.id,
      });

      if (Constants.ERROR in deletedRecord) {
        console.error("Error deleting activation record");
        return res.send(HTMLS_RESPONSES.ERROR);
      }

      return res.send(HTMLS_RESPONSES.ACTIVE_USER);
    } catch (error) {
      console.error(error);
      return res.send(HTMLS_RESPONSES.ERROR);
    }
  }

  public static async register(req: Request, res: Response) {
    try {
      
      AuthController.verifyData({ req });
      
      await AuthController.verifyUser({ req });

      const data = (await AuthController.registerUser({
        req,
      })) as RegisteredUser;
      

      console.log('Mi data es')
      console.log(data)

      const isMailSent = await AuthController.sendVerificationMail({
        userData: data?.data,
        code: data?.code,
      });

      console.log(isMailSent)

      if (!isMailSent) throw new Error("Error sending verification mail");

      return res.status(201).json({
        message: "User registered successfully, please activate your account",
      });
    } catch (error) {
      console.error(`Error registering user: ${error}`);
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  private static async verifyLoginData({ userName }: { userName: string }) {
    try {
      const result = await UserModelClass.searchUserExist({ userName });

      if (!result) return false;

      return result._id || result.id;
    } catch (error) {
      return { error };
    }
  }

  private static async verifyBlockUser({
    userData,
  }: {
    userData: UserInterface;
  }): Promise<Boolean> {
    try {
      return userData.blocked;
    } catch (error) {
      throw new Error(`New error: ${error}`);
    }
  }

  private static async verifyPassword({
    userData,
    passwordSend,
  }: {
    userData: UserInterface;
    passwordSend: string;
  }) {
    try {
      const { password } = userData;

      const result = await CryptManager.compareBcrypt({
        data: passwordSend,
        hash: password,
      });

      return result;
    } catch (error) {
      throw new Error(`New error: ${error}`);
    }
  }

  private static async decreaseAttempts({ id }: { id: string }) {
    try {
      const result = await UserModelClass.decreaseAttempts({ id });

      return result;
    } catch (error) {
      throw new Error(`New error: ${error}`);
    }
  }

  //Este se encarga de bloquear al usuario
  private static async blockUser({ id }: { id: string }) {
    try {
      const result = await UserModelClass.blockUser({ id });

      return result;
    } catch (error) {
      throw new Error(`New error: ${error}`);
    }
  }

  //Este se encarga de desbloquear al usuario
  //TODO: ARREGLAR
  //!WARNING
  //@ts-ignore
  private static async unblockUser({ id }: { id: string }) {
    try {
      const result = await UserModelClass.unblockUser({ id });

      return result;
    } catch (error) {
      throw new Error(`New error: ${error}`);
    }
  }

  private static async resetAttempts({ id }: { id: string }) {
    try {
      const result = await UserModelClass.resetAttempts({ id });

      return result;
    } catch (error) {
      throw new Error(`New error: ${error}`);
    }
  }

  //!IMPORTANTE
  private static async verifyActiveUser({ id }: { id: string }) {
    try {
      const user = await UserModelClass.searchUserId({ id });

      if (!user) return false;
      const { active } = user;

      if (active) return active;

      const isCodeActive = await ActivateModelClass.searchOneActivation({
        idUser: id,
      });

      if (isCodeActive) return false;

      const code = CryptManager.generateRandom();
      await AuthController.sendVerificationMail({ userData: user, code });

      return;
    } catch (error) {
      throw new Error(`New error: ${error}`);
    }
  }

  //Este se encarga de hacer el login
  public static async login(req: Request, res: Response) {
    try {
      const { userName, password } = req.body;

      const id = await AuthController.verifyLoginData({ userName });

      if (!id) return res.status(401).json({ error: "User not found" });

      const userData = await UserModelClass.searchUserId({ id });

      if (!userData) return res.status(401).json({ error: "User not found" });

      const isBlocked = await AuthController.verifyBlockUser({ userData });

      if (isBlocked) return res.status(401).json({ error: "User is blocked" });

      const isPasswordCorrect = await AuthController.verifyPassword({
        userData,
        passwordSend: password,
      });

      if (!isPasswordCorrect) {
        await AuthController.decreaseAttempts({ id });

        const user = await UserModelClass.searchUserId({ id });

        if (user.attempts <= 0) {
          await AuthController.blockUser({ id });
          return res.status(401).json({ error: "User is blocked" });
        }

        return res.status(401).json({ error: "Password is incorrect" });
      }

      if (!(await AuthController.verifyActiveUser({ id })))
        return res
          .status(401)
          .json({ error: `User is not active. Verify mail ${userData.email}` });

      await AuthController.resetAttempts({ id });

      const token = await UserModelClass.generateToken({
        id,
        userName,
        email: userData.email,
        image: userData.image,
      });

      const response = {
        message: "User logged in successfully",
        token,
        userName,
        email: userData.email,
        idUser: id,
      };

      return res.json(response);
    } catch (error) {
      throw new Error(`Error in login. New error: ${error}`);
    }
  }

  public static logout = (_req: Request, res: Response) =>
    res.json({ message: "Logout" });

  public static async deleteAccount(req: Request, res: Response) {
    try {
      const { idUser } = req as any;

      const result = await UserModelClass.deleteAccount({ idUser });

      if (result) return res.json({ message: "Account deleted successfully" });

      return res.json({ error: "Error deleting account" });
    } catch (error) {
      return res.json({ error: "Error deleting account" });
    }
  }

  public static async editUser(req: Request, res: Response) {
    try {
      const { idUser } = req as any;

      const userData = req.body as any;

      if (userData.password) {
        try {
          userData.password = await CryptManager.encryptBcrypt({
            data: userData.password,
          });
        } catch (error) {
          console.error(error);
          return;
        }
      }

      const updatedUser = await UserModelClass.editUser({
        id: idUser,
        userData,
      });

      if (updatedUser.error)
        return res.status(400).json({ error: updatedUser.error });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred while editing the user." });
    }
  }

  public static async getUserInfo(req: Request, res: Response) {
    try {
      const { idUser } = req as any;
      console.log(idUser);

      // Fetch user information based on idUser
      const userInfo = await UserModelClass.getUserInfo({ idUser });

      // Check if userInfo exists
      if (!userInfo) {
        return res.status(404).json({ error: "User not found" });
      }

      // If userInfo is found, return it
      return res.status(200).json(userInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while fetching the user information.",
      });
    }
  }

  public static async getUserInfoById(req: Request, res: Response) {
    try {
      const { idUser } = req.params;

      // Fetch user information based on idUser
      const userInfo = await UserModelClass.getUserInfo({ idUser });

      // Check if userInfo exists
      if (!userInfo) {
        return res.status(404).json({ error: "User not found" });
      }

      const mappedUserInfo = {
        userName: userInfo.userName,
        email: userInfo.email,
        image: userInfo.image,
        role: userInfo.role,
        dateOfBirth: userInfo.dateOfBirth,
        id: userInfo.id,
      };

      return res.status(200).json(mappedUserInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while fetching the user information.",
      });
    }
  }

  static async verifyUserExist(req: Request, res: Response) {
    try {
      const { userOrEmail } = req.params;

      const user = await UserModelClass.verifyUserExist({ userOrEmail });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(
        `Hubo un error al verificar si el usuario existe: ${error}`
      );
      return res.status(500).json({ error: "Error verifying if user exists" });
    }
  }
}

export default AuthController;
