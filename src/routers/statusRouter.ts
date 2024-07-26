import { Router } from "express";
import StatusModelClass from "../models/StatusModel";

const statusRouter = Router();

statusRouter.get("/getAllStatusContacts", async (req, res) => {
  try {
    const { idUser } = req as any;

    const result = await StatusModelClass.getAllStatusContacts({ idUser });

    if (!result[0]) return res.json({ data: [] });

    return res.json({ data: result });
  } catch (error: any) {
    throw new Error(error);
  }
});

statusRouter.get("/getStatusUser/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    console.log(`El id del usuario es: ${idUser}`);

    const result = await StatusModelClass.getStatusUser({ idUser });

    return res.json(result);
  } catch (error: any) {
    throw new Error(error);
  }
})

statusRouter.post("/createStatus", async (req, res) => {
  try {
    const { description, image } = req.body;

    const { idUser } = req as any;

    const status = {
      idUser,
      description,
      image,
    };

    const result = await StatusModelClass.createStatus(status);

    return res.json(result);
  } catch (error) {
    throw new Error("Error to create status");
  }
});

statusRouter.delete("/deleteStatus/:idStatus", (req, res) => {
  try {
    const { idUser } = req as any;
    const { idStatus } = req.params;

    const result = StatusModelClass.deleteStatus({ idStatus, idUser });

    return res.json(result);
  } catch (error) {
    throw new Error("Error to delete status");
  }
});

statusRouter.get("/getMyStatus", async (req, res) => {
  try {
    const { idUser } = req as any;

    const result = await StatusModelClass.obtainMyActivesStatus({ idUser });

    return res.json(result);
  } catch (error) {
    console.error(error);
    throw new Error("Error to get my status");
  }
});

export default statusRouter;
