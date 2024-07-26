import {
  GroupMessageModel,
  GroupModel,
  UserModel,
} from "../typegoose/models";
import { ITSGooseHandler } from "../data/instances";

export default class GroupModelClass {
  static async getAllGroupsUser(idUser: string) {
    try {
      const results = await ITSGooseHandler.searchAll({
        Model: GroupModel,
        condition: { idUsers: { $in: [idUser] } },
    });
      //Ahora obtenemos el ultimo mensaje de ese grupo
      const resultWithLastMessage = await Promise.all(
        results.map(async (group: any) => {
          const lastMessage = await ITSGooseHandler.searchOne({
            Model: GroupMessageModel,
            condition: { idGroup: group.id },
          });

          const lastMessageWithUser = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: lastMessage.idUser },
            transform: { id: 1, image: 1, userName: 1 },
          });

          const lastMessageObj = {
            message: lastMessage.message,
            date: lastMessage.date,
            user: lastMessageWithUser,
          };

          const lastMessageParsed = !lastMessage
            ? {
                message: {
                  type: "text",
                  content: "No hay mensajes",
                },
                user: {
                  userName: "No hay mensajes",
                  image:
                    "https://icones.pro/wp-content/uploads/2021/03/icone-de-groupe-symbole-png-vert.png",
                  id: "Nada",
                },
              }
            : lastMessageObj;

          return {
            ...group,
            lastMessage: lastMessageParsed,
          };
        })
      );

      const lastMessageAndUser = await Promise.all(
        resultWithLastMessage.map(async (group: any) => {
          const user = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: group.idUserOwner },
            transform: { id: 1, image: 1, userName: 1 },
          });

          return {
            ...group,
            userLastMessage: user,
          };
        })
      );

      return lastMessageAndUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async obtainGroupMessages(idGroup: string) {
    try {
console.log(`El id del grupo es ${idGroup}`);

      const messages = await ITSGooseHandler.searchAll({
        Model: GroupMessageModel,
        condition: { idGroup },
        sort: { _id: -1 },
      });

      console.log('Los mensajes del grupo son')
      console.log(messages);

      const messageReversed = messages.reverse() as any;

      const result = await Promise.all(
        messageReversed.map(async (message: any) => {
          const user = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: message.idUser },
            transform: { id: 1, image: 1, userName: 1, email: 1 },
          });

          const objResult = {
            id: message.id,
            sender: user.id,
            message: {
              type: message.message.type,
              content: message.message.content,
            },
            date: message.date,
            senderData: {
              userName: user.userName,
              image: user.image,
              email: user.email,
              id: user.id,
            },
            type: message.message.type,
          };

          console.log(objResult);
          return objResult;
        })
      );
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async getGroupById(idGroup: string) {
    try {
      const result = await ITSGooseHandler.searchOne({
        Model: GroupModel,
        condition: { _id: idGroup },
      });

      const resultsWithUsers = await Promise.all(
        result.idUsers.map(async (idUser: any) => {
          const user = await ITSGooseHandler.searchOne({
            Model: UserModel,
            condition: { _id: idUser },
            transform: { id: 1, image: 1, userName: 1 },
          });

          return user;
        })
      )

      return {
        ...result,
        users: resultsWithUsers,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async createGroup({
    name,
    description,
    image = "https://icones.pro/wp-content/uploads/2021/03/icone-de-groupe-symbole-png-vert.png",
    idUserOwner,
    idUsers,
  }: {
    name: string;
    description: string;
    image?: string;
    idUserOwner: string;
    idUsers: string[];
  }) {
    try {
      console.log(idUsers);
      const newIdUsers = [...idUsers, idUserOwner];

      const newGroup = await ITSGooseHandler.addDocument({
        Model: GroupModel,
        data: { name, description, image, idUserOwner, idUsers: newIdUsers },
      });

      return newGroup;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async deleteGroup(groupId: string, idUser: string) {
    try {
      const group = await ITSGooseHandler.searchOne({
        Model: GroupModel,
        condition: { _id: groupId },
      });

      if (group.idUserOwner !== idUser) {
        return false;
      }

      const result = await ITSGooseHandler.removeDocument({
        Model: GroupModel,
        id: groupId,
      });

      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async addMessageToGroup({
    idGroup,
    idUser,
    message,
  }: {
    idGroup: string;
    idUser: string;
    message: any;
  }) {
    try {
      const newMessage = {
        idGroup,
        idUser,
        message,
        date: new Date().toISOString(),
      };

      const resultPost = await ITSGooseHandler.addDocument({
        Model: GroupMessageModel,
        data: newMessage,
      });

      return resultPost;
    } catch (error) {
      console.error(error);
      throw new Error(`Error adding message: ${error}`);
    }
  }
}
