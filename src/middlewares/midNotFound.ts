import { Request, Response, NextFunction } from "express";

const midNotFound = (_req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Not Found" });
  next();
};

export default midNotFound;
