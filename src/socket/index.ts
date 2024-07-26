import { Server } from "socket.io";
import { IJWTManager } from "../data/instances";
import UserModelClass from "../models/UserModelClass";
import { GenerateTokenData } from "../types";
import crypto from "node:crypto";

interface UserSocketMap {
  [userId: string]: string;
}

const userSocketMap: UserSocketMap = {};

export const configureSocket = (io: Server) => {
  // console.log("cree el socket");

  io.on("connection", (socket) => {
    socket.on("register", async (token: string) => {
      try {
        if (!token || !token.toLowerCase().startsWith("bearer")) {
          socket.emit("error", "Token not found");
          return;
        }

        const cleanedToken = token.replace("Bearer ", "");
        const decodedToken = IJWTManager.verifyToken(
          cleanedToken
        ) as GenerateTokenData;

        if (!cleanedToken || !decodedToken.id) {
          socket.emit("error", "Token not found");
          return;
        }

        const user = (await UserModelClass.searchUserId({
          id: decodedToken.id,
        })) as any;

        if (!user) {
          socket.emit("error", "User not found");
          return;
        }

        socket.data.idUser = user.id;
        socket.data.userName = user.userName;
        socket.data.email = user.email;
        socket.data.image = user?.image;
        socket.data.role = user.role;

        userSocketMap[user.id] = socket.id;

        socket.emit("registered", `User ${user.id} successfully registered`);
      } catch (error) {
        console.error(error);
        socket.emit("error", "An error occurred during registration");
      }
    });

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
      } else {
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
        id: crypto.randomUUID(),
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
