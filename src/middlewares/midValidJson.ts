import { NextFunction, Response, Request } from "express";

const midValidJson = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError) {
    return res
      .status(400)
      .json({ error: "El cuerpo de la solicitud no es un JSON válido" });
  }
  next();
  return;
};

export default midValidJson;
