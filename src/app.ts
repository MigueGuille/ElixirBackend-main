import express from "express";
import { CONFIG_SERVER_SOCKET, PORT } from "./constants";
import { startServer } from "./functions";
import {
  midConnectDB,
  midCors,
  midJson,
  midNotFound,
  midNotJson,
  midValidJson,
  midErrorHandler,
  midToken,
} from "./middlewares/middlewares";
import R from "./routers/allRouters";
import { Routes } from "./enums";
import http from "node:http";
import { Server } from "socket.io";
import { configureSocket } from "./socket";

const app = express();
const server = http.createServer(app);
const io = new Server(server, CONFIG_SERVER_SOCKET);

//{ Middlewares
app.use(midJson());
app.use(midValidJson);
app.use(midCors());
app.use(midNotJson);
app.use(midConnectDB);

//!TODO: Colocar de nuevo los tokens
//{ Routes
app.use(Routes.AUTH, R.authRouter);
app.use(Routes.PROFILE, midToken, R.profileRouter);
app.use(Routes.MESSAGES, midToken, R.messagesRouter);
app.use(Routes.CONTACTS, midToken, R.contactRouter);
app.use(Routes.STATUS, midToken, R.statusRouter);
app.use(Routes.GROUPS, midToken, R.groupRouter);

app.use(midErrorHandler);
app.use(midNotFound);

configureSocket(io);

startServer({ app: server, PORT });
