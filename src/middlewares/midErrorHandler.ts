import { Request, Response, NextFunction } from "express";
import { ERROR_HANDLERS } from "../constants";

export default function midErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isTokenError =
    err.message.includes("TokenExpiredError") ||
    err.message.includes("JsonWebTokenError");

  const errorHandlerKey = isTokenError
    ? err.message.includes("TokenExpiredError")
      ? "TokenExpiredError"
      : "JsonWebTokenError"
    : err.name;

  const handler =
    ERROR_HANDLERS[errorHandlerKey] || ERROR_HANDLERS.defaultError;

  handler(res, isTokenError ? err.message : undefined);
}
