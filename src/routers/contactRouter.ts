import { Router } from "express";
import ContactController from "../controllers/contactController";

const contactRouter = Router();

contactRouter.get("/getAllContacts", ContactController.getAllContacts);

contactRouter.get("/getSimpleContacts", ContactController.getSimpleContacts);

contactRouter.post("/addContact", ContactController.addContact);

contactRouter.delete("/deleteContact/:idContact", ContactController.deleteContact);

export default contactRouter;
