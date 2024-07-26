import { Router } from "express";
import AuthController from "../controllers/authController";

const profileRouter = Router();

profileRouter.delete("/delete", AuthController.deleteAccount);

profileRouter.put("/update", AuthController.editUser);

profileRouter.get("/info", AuthController.getUserInfo);

profileRouter.get("/info/userExist/:userOrEmail", AuthController.verifyUserExist);

profileRouter.get("/info/:idUser", AuthController.getUserInfoById);


export default profileRouter;
