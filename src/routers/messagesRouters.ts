import { Router } from "express";
import MessageController from "../controllers/messageController";

const messagesRouter = Router();

messagesRouter.get("/getAllChats/:page", MessageController.getAllChats);

messagesRouter.get(
  "/getMessages/:idChat/:page",
  MessageController.getMessageChat
);


messagesRouter.get("/verifyChatUser/:idUserReceiver", MessageController.verifyChatUser)

messagesRouter.post("/addMessage", MessageController.addMessages);

messagesRouter.post("/addChat", MessageController.addChat);

messagesRouter.delete("/deleteChat/:idChat", MessageController.deleteChat);


export default messagesRouter;

