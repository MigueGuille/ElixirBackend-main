import jwt from "jsonwebtoken";
import { GenerateTokenData, JWTManagerProps } from "../types";

class JWTManager {
  private SECRET_WORD: string;
  public expiresIn: string;

  constructor({ SECRET_WORD, expiresIn = "2h" }: JWTManagerProps) {
    this.SECRET_WORD = SECRET_WORD;
    this.expiresIn = expiresIn;
  }

  generateToken(props: GenerateTokenData) {
    try {
      const { id, userName, email , image} = props;
      const token = jwt.sign({ id, userName, email, image }, this.SECRET_WORD, {
        expiresIn: this.expiresIn,
      });

      const tokenFormated = `Bearer ${token}`;
      return tokenFormated;
    } catch (error) {
      throw new Error(`Error generating token: ${error}`);
    }
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.SECRET_WORD);
      return decoded;
    } catch (error) {
      throw new Error(`Error verifying token: ${error}`);
    }
  }
}

export default JWTManager;
