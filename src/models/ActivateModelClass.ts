import { ITSGooseHandler } from "../data/instances";
import { ActivateCodeModel } from "../typegoose/models";

class ActivateModelClass {
  static async removeActivateDocument({
    idActivation,
  }: {
    idActivation: string;
  }) {
    try {
      const result = await ITSGooseHandler.removeDocument({
        Model: ActivateCodeModel,
        id: idActivation,
      });

      return result;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }

  static async searchOneActivation({
    code,
    idUser,
  }: {
    code?: string;
    idUser?: string;
  }) {
    try {
      const condition = {
        ...(code ? { code } : {}),
        ...(idUser ? { idUser } : {}),
      };

      const result = await ITSGooseHandler.searchOne({
        Model: ActivateCodeModel,
        condition,
      });

      return result;
    } catch (error) {
      console.error(error);
      return { error };
    }
  }
}

export default ActivateModelClass;
