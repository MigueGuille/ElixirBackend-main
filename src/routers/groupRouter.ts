import { Request, Response } from "express";
import { Router } from "express";
import GroupModelClass from "../models/GroupsModelClass";

const groupRouter = Router();

groupRouter.get("/getAllGroupsUser", async (req: Request, res: Response) => {
  try {
    const { idUser } = req as any;

    const result = await GroupModelClass.getAllGroupsUser(idUser);

    return res.json(result);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

groupRouter.get(
  "/obtainGroupMessages/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(id)

      const result = await GroupModelClass.obtainGroupMessages(id);

      return res.json(result);
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
);

groupRouter.get("/getGroupById/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await GroupModelClass.getGroupById(id);

    return res.json(result);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

groupRouter.post("/createGroup", async (req: Request, res: Response) => {
  try {
    const { idUser } = req as any;
    const { name, description, image, idUsers } = req.body;

    const result = await GroupModelClass.createGroup({
      name,
      description,
      image,
      idUserOwner: idUser,
      idUsers,
    });

    const resultParsed = JSON.parse(JSON.stringify(result));

    return res.json(resultParsed);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

groupRouter.post("/addMessageToGroup", async (req: Request, res: Response) => {
  try {
    const { idUser } = req as any;
    const { idGroup, message } = req.body;

    const result = await GroupModelClass.addMessageToGroup({
      idGroup,
      idUser,
      message,
    });

    return res.json(result);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

groupRouter.delete("/deleteGroup/:id", async (req: Request, res: Response) => {
  try {
    const { idUser } = req as any;
    const { id } = req.params;

    const result = await GroupModelClass.deleteGroup(id, idUser);

    return res.json(result);
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
});

export default groupRouter;
