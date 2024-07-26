import { Request as ExpressRequest, Response, NextFunction } from "express";
import { IJWTManager } from "../data/instances";
import UserModelClass from "../models/UserModelClass";
import { GenerateTokenData } from "../types";

// Extiende la interfaz Request para incluir las nuevas propiedades
interface Request extends ExpressRequest {
  idUser?: string;
  username?: string;
  email?: string;
  role?: string;
  idArtist?: string;
  image?: string;
}

export default async function midToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers;

    if (!authorization && !authorization?.toLowerCase().startsWith("bearer")) {
      return res.status(401).json({ message: "Token not found" });
    }

    const token = authorization.replace("Bearer ", "");
    const decodedToken = IJWTManager.verifyToken(token) as GenerateTokenData;

    if (!token || !decodedToken.id)
      res.status(401).json({ message: "Token not found" });

    const { id } = decodedToken;

    const user = (await UserModelClass.searchUserId({ id })) as any;

    if (!user) return res.status(401).json({ message: "User not found" });

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    req.idUser = user.id;
    req.username = user.userName;
    req.email = user.email;
    req.role = user.role;
    req.image = user?.image;

    return next();
  } catch (error) {
    next(error);
  }
}
