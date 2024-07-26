import "dotenv/config";
import { Response } from "express";
import { ErrorHandler, HostConfig } from "./types";

export const PORT = Number(process.env.PORT) || 3000;

export const Hosts: Record<string, HostConfig> = {
  gmail: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  },
  outlook: {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
  },
};

export const ERROR_HANDLERS: Record<string, ErrorHandler> = {
  CastError: (res: Response) =>
    res.status(400).json({ error: "Malformatted ID" }),
  ValidationError: (res: Response) =>
    res.status(409).json({ error: "Validation error" }),
  JsonWebTokenError: (res: Response, message?: string) =>
    res.status(401).json({ error: "Invalid token", message }),
  TokenExpiredError: (res: Response, message?: string) =>
    res.status(401).json({ error: "Expired token", message }),
  defaultError: (res: Response) =>
    res.status(500).json({ error: "Something went wrong" }),
};

// export const BASE_URL:string = process.env.BASE_URL || `http://localhost:${PORT}`;
export const BASE_URL: string =
  process.env.BASE_URL || `http://192.168.109.126:${PORT}`;

export const CONFIG_SERVER_SOCKET = {
  cors: {
    origin: "*",
  },
};





export const HTMLS_RESPONSES = { 
  ACTIVE_USER: 
  "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Account Activated</title><style>body {font-family: Arial, sans-serif;background-color: #f4f4f4;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;height: 100vh;}.container {background-color: #fff;padding: 20px;border-radius: 10px;box-shadow: 0 0 10px rgba(0,0,0,0.1);text-align: center;}h1 {color: #4CAF50;}p {color: #555;}</style></head><body><div class=\"container\"><h1>Account Activated!</h1><p>Your account has been successfully activated. You can now use all the features available.</p></div></body></html>",
  ERROR:
  "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>Error</title><style>body {font-family: Arial, sans-serif;background-color: #f4f4f4;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;height: 100vh;}.container {background-color: #fff;padding: 20px;border-radius: 10px;box-shadow: 0 0 10px rgba(0,0,0,0.1);text-align: center;}h1 {color: #f44336;}p {color: #555;}</style></head><body><div class=\"container\"><h1>Error</h1><p>Something went wrong. Please try again later.</p></div></body></html>",
 };