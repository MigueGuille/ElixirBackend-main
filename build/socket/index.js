"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSocket = void 0;
const instances_1 = require("../data/instances");
const UserModelClass_1 = __importDefault(require("../models/UserModelClass"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const userSocketMap = {};
const configureSocket = (io) => {
    // console.log("cree el socket");
    io.on("connection", (socket) => {
        socket.on("register", (token) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!token || !token.toLowerCase().startsWith("bearer")) {
                    socket.emit("error", "Token not found");
                    return;
                }
                const cleanedToken = token.replace("Bearer ", "");
                const decodedToken = instances_1.IJWTManager.verifyToken(cleanedToken);
                if (!cleanedToken || !decodedToken.id) {
                    socket.emit("error", "Token not found");
                    return;
                }
                const user = (yield UserModelClass_1.default.searchUserId({
                    id: decodedToken.id,
                }));
                if (!user) {
                    socket.emit("error", "User not found");
                    return;
                }
                socket.data.idUser = user.id;
                socket.data.userName = user.userName;
                socket.data.email = user.email;
                socket.data.image = user === null || user === void 0 ? void 0 : user.image;
                socket.data.role = user.role;
                userSocketMap[user.id] = socket.id;
                socket.emit("registered", `User ${user.id} successfully registered`);
            }
            catch (error) {
                console.error(error);
                socket.emit("error", "An error occurred during registration");
            }
        }));
        socket.on("privateMessage", ({ sender, receiver, message }) => {
            const receiverSocketId = userSocketMap[receiver];
            if (receiverSocketId) {
                const dataSend = {
                    sender,
                    message,
                    date: new Date().toISOString(),
                    senderData: {
                        userName: socket.data.userName,
                        email: socket.data.email,
                    },
                };
                io.to(receiverSocketId).emit("privateMessage", dataSend);
            }
            else {
                console.log(`User ${receiver} is not connected`);
            }
        });
        socket.on("joinGroup", (group) => {
            console.log(`User ${socket.data.idUser} joined group ${group}`);
            socket.join(group);
        });
        socket.on("groupMessage", ({ group, sender, message }) => {
            console.log(`User ${sender} sent message to group ${group}`);
            const dataSend = {
                id: node_crypto_1.default.randomUUID(),
                sender,
                message,
                date: new Date().toISOString(),
                senderData: {
                    userName: socket.data.userName,
                    email: socket.data.email,
                    image: socket.data.image,
                },
            };
            io.to(group).emit("groupMessage", dataSend);
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            // Eliminar el ID del socket del mapa cuando el usuario se desconecta
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                    break;
                }
            }
        });
    });
};
exports.configureSocket = configureSocket;
