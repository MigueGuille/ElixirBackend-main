import { NextFunction, Request, Response } from "express";
import { ITSGooseHandler } from "../data/instances";

export default async function midConnectDB(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (!ITSGooseHandler.isConnected()) {
    // Wait for 3 seconds before checking the connection again
    await new Promise((resolve) => setTimeout(resolve, 2100));

    if (!ITSGooseHandler.isConnected()) {
      return res.status(503).json({
        message: "messageUnable to process operation. DB Is not working",
      });
    } else {
      next();
      return;
    }
  } else {
    next();
    return;
  }
}
