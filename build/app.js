"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const functions_1 = require("./functions");
const middlewares_1 = require("./middlewares/middlewares");
const allRouters_1 = __importDefault(require("./routers/allRouters"));
const enums_1 = require("./enums");
const node_http_1 = __importDefault(require("node:http"));
const socket_io_1 = require("socket.io");
const socket_1 = require("./socket");
const app = (0, express_1.default)();
const server = node_http_1.default.createServer(app);
const io = new socket_io_1.Server(server, constants_1.CONFIG_SERVER_SOCKET);
//{ Middlewares
app.use((0, middlewares_1.midJson)());
app.use(middlewares_1.midValidJson);
app.use((0, middlewares_1.midCors)());
app.use(middlewares_1.midNotJson);
app.use(middlewares_1.midConnectDB);
//!TODO: Colocar de nuevo los tokens
//{ Routes
app.use(enums_1.Routes.AUTH, allRouters_1.default.authRouter);
app.use(enums_1.Routes.PROFILE, middlewares_1.midToken, allRouters_1.default.profileRouter);
app.use(enums_1.Routes.MESSAGES, middlewares_1.midToken, allRouters_1.default.messagesRouter);
app.use(enums_1.Routes.CONTACTS, middlewares_1.midToken, allRouters_1.default.contactRouter);
app.use(enums_1.Routes.STATUS, middlewares_1.midToken, allRouters_1.default.statusRouter);
app.use(enums_1.Routes.GROUPS, middlewares_1.midToken, allRouters_1.default.groupRouter);
app.use(middlewares_1.midErrorHandler);
app.use(middlewares_1.midNotFound);
(0, socket_1.configureSocket)(io);
(0, functions_1.startServer)({ app: server, PORT: constants_1.PORT });
