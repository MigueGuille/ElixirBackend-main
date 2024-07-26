import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import crypto from "node:crypto";

import {
  CompareBcryptParams,
  EncryptBcryptParams,
  SimetrycEncryptParams,
} from "../types";

class CryptManager {
  /**
   * Encrypt data using Bcrypt Library
   */
  static async encryptBcrypt({
    data,
    saltRounts = 10,
  }: EncryptBcryptParams): Promise<string | { error: string }> {
    try {
      const hash = await bcrypt.hash(data, saltRounts);
      return hash;
    } catch (error) {
      console.error(error);
      return { error: `Error encrypting data. Error:${error}` };
    }
  }

  /**
   * Compare data with hash using Bcrypt Library.
   */
  static async compareBcrypt({ data, hash }: CompareBcryptParams) {
    try {
      const result = await bcrypt.compare(data, hash);
      return result;
    } catch (error) {
      return { error: `Error decoding or comparing data. Error: ${error}` };
    }
  }

  /**
   * Encrypt data using AES from CryptoJS Library
   */
  static simetrycEncrypt({
    data,
    keyDecrypt,
  }: SimetrycEncryptParams): string | { error: string } {
    try {
      const ciphertext = CryptoJS.AES.encrypt(data, keyDecrypt).toString();

      return ciphertext;
    } catch (error) {
      return { error: `Error encrypting data. Error: ${error}` };
    }
  }

  /**
   * Decrypt data using AES from CryptoJS Library
   */
  static simetrycDecrypt({
    data,
    keyDecrypt,
  }: SimetrycEncryptParams): string | { error: string } {
    try {
      const bytes = CryptoJS.AES.decrypt(data, keyDecrypt);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return originalText;
    } catch (error) {
      return { error: `Error decrypting data. Error: ${error}` };
    }
  }

  static generateRandom = ({ size = 8 } = {}) => {
    const random = crypto.randomBytes(8).toString("hex");
    const randomElement = random.slice(0, size);

    return randomElement;
  };
}

export default CryptManager;
