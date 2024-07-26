import { Request, Response } from "express";
import { User } from "./typegoose/schemasDefinitions";
import { Types } from "mongoose";

export interface StartServerProps {
  app: Express;
  PORT: number;
}

export interface ErrorResponse {
  error: string;
}

export interface EncryptBcryptParams {
  data: string;
  saltRounts?: number;
}

export interface CompareBcryptParams {
  data: string;
  hash: string;
}

export interface SimetrycEncryptParams {
  data: string;
  keyDecrypt: string;
}

export interface TSGooseHandlerProps {
  connectionString: string;
}

export type ClazzT<T> = new () => T;

export interface CreateModelParams<T> {
  clazz: ClazzT<T>;
}

type DefineModelSchemasType =
  | BasePropOptions
  | ArrayPropOptions
  | MapPropOptions
  | PropOoptionsForNumber
  | VirtualOptions
  | undefined;

export interface DefineModelParams<T> {
  name: string;
  schema: Record<string, DefineModelSchemasType>;
}

export interface AddDocumentParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  data: T;
}

export interface RemoveDocumentParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  id: string;
}

export interface EditDocumentParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  id: string;
  newData: Partial<T>;
}

export interface SearchIdParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  id: string;
  transform?: Record<string, number>;
}

export interface SearchAll<T> {
  Model: ReturnModelType<ClazzT<T>>;
  transform?: Record<string, number>;
  condition?: Object; //TODO: CAMBIAR
}

export interface SearchRelationsParams<T> {
  Model: ReturnModelType<any>;
  id?: string;
  relationField: string;
  onlyId?: boolean;
  idField?: string;
  transform?: (doc: any) => any;
}

export interface FetchoParams {
  url: string;
  method?: HttpMethod;
  body?: any;
  token?: string;
  isCors?: boolean;
  headers?: Record<string, string>;
}

export interface HostConfig {
  host: string;
  port: number;
  secure: boolean;
}

export interface MailerConfig {
  host: string;
  user: string;
  password: string;
}

export interface ReqRes {
  req: Request;
  res: Response;
}

export interface RegisterUser {
  userName: string;
  email: string;
  password: string;
  image?: string;
  dateOfBirth: Date;
}

export interface RegisteredUser {
  data: RegisterUser;
  code: string;
}

export interface SearchOneParams<T> {
  Model: ReturnModelType<ClazzT<T>>;
  condition: Partial<T>;
  transform?: Record<string, number>;
}

export type ValidatorFunction = (v: string | Date) => boolean;

export interface MailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface AddActivateCodeParams {
  code: string;
  idUser: string;
}

export interface UserInterface {
  id?: string;
  _id: string;
  userName: string;
  email: string;
  password: string;
  attempts: number;
  blocked: boolean;
  active: boolean;
  dateOfBirth: Date;
  role?: string;
  image?: string;
}

type ErrorHandler = (res: Response, message?: string) => void;

export type JWTManagerProps = {
  SECRET_WORD: string;
  expiresIn?: string;
};

export interface GenerateTokenData {
  id: string;
  userName: string;
  email: string;
  image?: string;
}

export interface MessageInterface {
  type: MessageType;
  content: string;
}

export type MessageType = "text" | "image" | "audio";
