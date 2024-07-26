import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import mongoose from "mongoose";
import {
  AddDocumentParams,
  ClazzT,
  CreateModelParams,
  DefineModelParams,
  EditDocumentParams,
  RemoveDocumentParams,
  SearchAll,
  SearchIdParams,
  SearchOneParams,
  SearchRelationsParams,
  TSGooseHandlerProps,
} from "../types";

class TSGooseHandler implements TSGooseHandlerProps {
  connectionString: string;

  constructor({ connectionString }: TSGooseHandlerProps) {
    this.connectionString = connectionString;
    this.connectToDB();
  }

  public isConnected = (): boolean => mongoose.connection.readyState === 1;

  private async connectToDB() {
    try {
      await mongoose.connect(this.connectionString);
      console.log("Connected to database");
      return;
    } catch (error) {
      console.error(`Error connecting to database: ${error}`);
      return { error: `Error connecting to database: ${error}` };
    }
  }

  async disconnectFromDB() {
    try {
      await mongoose.disconnect();
      return;
    } catch (error) {
      console.error(`Error disconnecting from database: ${error}`);
      return { error: `Error disconnecting from database: ${error}` };
    }
  }

  /**
   * Create a model using Typegoose
   */
  createModel<T>({ clazz }: CreateModelParams<T>): ReturnModelType<ClazzT<T>> {
    try {
      const Model = getModelForClass(clazz);
      Model.schema.set("toJSON", {
        transform: (_document, returnedObject) => {
          returnedObject.id = returnedObject._id.toString();
          delete returnedObject._id;
          delete returnedObject.__v;
        },
      });
      return Model;
    } catch (error) {
      console.error(error);
      throw new Error(`Error creating model for class ${clazz.name}`);
    }
  }

  /**
   * Define a class and create a model using Typegoose
   */
  defineModel<T>({
    name,
    schema,
  }: DefineModelParams<T>): ReturnModelType<ClazzT<T>> {
    class DynamicClass {
      constructor() {
        for (const key in schema) {
          if (schema.hasOwnProperty(key)) {
            const element = schema[key];
            prop(element)(this, key);
          }
        }
      }
    }
    Object.defineProperty(DynamicClass, "name", { value: name });
    const Model = getModelForClass(DynamicClass as ClazzT<T>);
    Model.schema.set("toJSON", {
      transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    });
    return Model;
  }

  /**
   * Add a document to a model with the provided data
   */
  async addDocument<T>({ Model, data }: AddDocumentParams<T>) {
    try {
      const document = new Model(data);
      await document.save();
      return document;
    } catch (error) {
      console.error(error);
      return {
        error: `Error adding document to model ${Model.modelName}. Error: ${error}`,
      };
    }
  }

  /**
   * Remove a document from a model by its ID
   */
  async removeDocument<T>({ Model, id }: RemoveDocumentParams<T>) {
    try {
      const document = await Model.findByIdAndDelete(id);
      return document;
    } catch (error) {
      console.error(error);
      return { error: `Error removing document from model ${Model.modelName}` };
    }
  }

  async removeDocuments<T>({
    Model,
    condition,
  }: {
    Model: ReturnModelType<ClazzT<T>>;
    condition: Partial<T>;
  }) {
    try {
      const result = await Model.deleteMany(condition);
      return result;
    } catch (error) {
      console.error(error);
      return {
        error: `Error removing documents from model ${Model.modelName}`,
      };
    }
  }

  /**
   * Edit a document in a model by its ID with the new data
   */
  async editDocument<T>({ Model, id, newData }: EditDocumentParams<T>) {
    try {
      const document = await Model.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return document;
    } catch (error) {
      console.error(error);
      return { error: `Error editing document in model ${Model.modelName}` };
    }
  }

  /**
   * Search for one document in a model by a condition
   */
  async searchOne<T>({ Model, condition, transform }: SearchOneParams<T>) {
    try {
      const allConditionsMet = Object.values(condition).every((value) =>
        Boolean(value)
      );
      if (!allConditionsMet) return false;
  
      // Ordena por el campo '_id' en orden descendente para obtener el documento más reciente.
      const document = await Model.findOne(condition, transform).sort({ _id: -1 });
  
      const parsedDocument = JSON.parse(JSON.stringify(document));
  
      return document ? parsedDocument : false;
    } catch (error) {
      console.error(error);
      return {
        error: `Error searching for one document in model ${Model.modelName}`,
      };
    }
  }
  /**
   * Search for a document in a model by its ID
   */
  async searchId<T>({ Model, id, transform }: SearchIdParams<T>) {
    try {
      const document = await Model.findById(id, transform);
      if (!document) {
        console.log(
          `No document found in model ${Model.modelName} with id ${id}`
        );
        return null;
      }
      return document;
    } catch (error) {
      console.error(
        `Error searching for document in model ${Model.modelName}: ${error}`
      );
      return null;
    }
  }

  /**
   * Search for all documents in a model
   */
  async searchAll<T>({
    Model,
    transform,
    limit = 10,
    offset = 0,
    condition = {},
    sort = {},
  }: SearchAll<T> & {
    limit?: number;
    offset?: number;
    condition?: any;
    transform?: any;
    sort?: any;
  }): Promise<Array<T>> {
    try {
      const documents = await Model.find(condition, transform, {
        skip: offset,
        limit: limit,
        sort: sort, // Added sort property
      });

      const JSONDocuments = JSON.parse(JSON.stringify(documents));

      console.log(JSONDocuments);

      return JSONDocuments;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error searching for all documents in model ${Model.modelName}: ${error}`
      );
    }
  }

  /**
   * Search for all documents in a model and their relations
   */
  async searchRelations<T>({
    Model,
    id,
    relationField,
    onlyId = false,
    idField = "id",
    transform,
    lean = false,
  }: SearchRelationsParams<T> & { lean?: boolean }) {
    // Añadir a la interfaz
    try {
      const query = id ? { [relationField]: id } : {};

      let documents = onlyId
        ? await Model.find(query).populate(relationField, idField).lean(lean)
        : await Model.find(query).populate(relationField).lean(lean);

      if (onlyId) {
        documents = documents.map((doc: any) => ({
          ...doc.toObject(),
          [relationField]: doc[relationField][idField],
        }));
      }

      // Default transformation
      const defaultTransform = (doc: any) => {
        const { _id, __v, ...rest } = doc;
        return { id: _id, ...rest };
      };

      // Apply default transformation
      documents = documents.map(defaultTransform);

      // Apply custom transformation if provided
      if (transform) documents = documents.map(transform);

      return documents;
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error searching for all documents in model ${Model.modelName}. Error: ${error}. In searchRelations method in TSGooseHandler.ts`
      );
    }
  }

  /**
   * Remove all documents from a model that match a specific condition
   */
  async removeAllDocumentsByCondition<T>({
    Model,
    condition,
  }: {
    Model: ReturnModelType<ClazzT<T>>;
    condition: Object;
  }) {
    try {
      const result = await Model.deleteMany(condition);
      return result;
    } catch (error) {
      console.error(error);
      return {
        error: `Error removing documents from model ${Model.modelName}`,
      };
    }
  }
}

export default TSGooseHandler;
