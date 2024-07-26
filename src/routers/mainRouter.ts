import { Router } from "express";
import MainController from "../controllers/mainController";

const mainRouter = Router();

mainRouter.get("/", MainController.root);


export default mainRouter;