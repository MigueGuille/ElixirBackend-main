import { Request, Response } from "express";

class MainController {
  static root(_req: Request, res: Response) {
    res.json({ message: "This is page for main route" });
  }
}

export default MainController;
