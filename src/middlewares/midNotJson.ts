import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types";

const midNotJson = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void | Response<ErrorResponse> => {
  if (err instanceof SyntaxError) {
    return res
      .status(400)
      .json({ error: "The request body is not valid JSON" });
  }
  next();
};

export default midNotJson;
