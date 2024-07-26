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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
const mongoose_1 = __importDefault(require("mongoose"));
class TSGooseHandler {
    constructor({ connectionString }) {
        this.isConnected = () => mongoose_1.default.connection.readyState === 1;
        this.connectionString = connectionString;
        this.connectToDB();
    }
    connectToDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(this.connectionString);
                console.log("Connected to database");
                return;
            }
            catch (error) {
                console.error(`Error connecting to database: ${error}`);
                return { error: `Error connecting to database: ${error}` };
            }
        });
    }
    disconnectFromDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.disconnect();
                return;
            }
            catch (error) {
                console.error(`Error disconnecting from database: ${error}`);
                return { error: `Error disconnecting from database: ${error}` };
            }
        });
    }
    /**
     * Create a model using Typegoose
     */
    createModel({ clazz }) {
        try {
            const Model = (0, typegoose_1.getModelForClass)(clazz);
            Model.schema.set("toJSON", {
                transform: (_document, returnedObject) => {
                    returnedObject.id = returnedObject._id.toString();
                    delete returnedObject._id;
                    delete returnedObject.__v;
                },
            });
            return Model;
        }
        catch (error) {
            console.error(error);
            throw new Error(`Error creating model for class ${clazz.name}`);
        }
    }
    /**
     * Define a class and create a model using Typegoose
     */
    defineModel({ name, schema, }) {
        class DynamicClass {
            constructor() {
                for (const key in schema) {
                    if (schema.hasOwnProperty(key)) {
                        const element = schema[key];
                        (0, typegoose_1.prop)(element)(this, key);
                    }
                }
            }
        }
        Object.defineProperty(DynamicClass, "name", { value: name });
        const Model = (0, typegoose_1.getModelForClass)(DynamicClass);
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
    addDocument(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, data }) {
            try {
                const document = new Model(data);
                yield document.save();
                return document;
            }
            catch (error) {
                console.error(error);
                return {
                    error: `Error adding document to model ${Model.modelName}. Error: ${error}`,
                };
            }
        });
    }
    /**
     * Remove a document from a model by its ID
     */
    removeDocument(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, id }) {
            try {
                const document = yield Model.findByIdAndDelete(id);
                return document;
            }
            catch (error) {
                console.error(error);
                return { error: `Error removing document from model ${Model.modelName}` };
            }
        });
    }
    removeDocuments(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, condition, }) {
            try {
                const result = yield Model.deleteMany(condition);
                return result;
            }
            catch (error) {
                console.error(error);
                return {
                    error: `Error removing documents from model ${Model.modelName}`,
                };
            }
        });
    }
    /**
     * Edit a document in a model by its ID with the new data
     */
    editDocument(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, id, newData }) {
            try {
                const document = yield Model.findByIdAndUpdate(id, newData, {
                    new: true,
                });
                return document;
            }
            catch (error) {
                console.error(error);
                return { error: `Error editing document in model ${Model.modelName}` };
            }
        });
    }
    /**
     * Search for one document in a model by a condition
     */
    searchOne(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, condition, transform }) {
            try {
                const allConditionsMet = Object.values(condition).every((value) => Boolean(value));
                if (!allConditionsMet)
                    return false;
                // Ordena por el campo '_id' en orden descendente para obtener el documento más reciente.
                const document = yield Model.findOne(condition, transform).sort({ _id: -1 });
                const parsedDocument = JSON.parse(JSON.stringify(document));
                return document ? parsedDocument : false;
            }
            catch (error) {
                console.error(error);
                return {
                    error: `Error searching for one document in model ${Model.modelName}`,
                };
            }
        });
    }
    /**
     * Search for a document in a model by its ID
     */
    searchId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, id, transform }) {
            try {
                const document = yield Model.findById(id, transform);
                if (!document) {
                    console.log(`No document found in model ${Model.modelName} with id ${id}`);
                    return null;
                }
                return document;
            }
            catch (error) {
                console.error(`Error searching for document in model ${Model.modelName}: ${error}`);
                return null;
            }
        });
    }
    /**
     * Search for all documents in a model
     */
    searchAll(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, transform, limit = 10, offset = 0, condition = {}, sort = {}, }) {
            try {
                const documents = yield Model.find(condition, transform, {
                    skip: offset,
                    limit: limit,
                    sort: sort, // Added sort property
                });
                const JSONDocuments = JSON.parse(JSON.stringify(documents));
                console.log(JSONDocuments);
                return JSONDocuments;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error searching for all documents in model ${Model.modelName}: ${error}`);
            }
        });
    }
    /**
     * Search for all documents in a model and their relations
     */
    searchRelations(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, id, relationField, onlyId = false, idField = "id", transform, lean = false, }) {
            // Añadir a la interfaz
            try {
                const query = id ? { [relationField]: id } : {};
                let documents = onlyId
                    ? yield Model.find(query).populate(relationField, idField).lean(lean)
                    : yield Model.find(query).populate(relationField).lean(lean);
                if (onlyId) {
                    documents = documents.map((doc) => (Object.assign(Object.assign({}, doc.toObject()), { [relationField]: doc[relationField][idField] })));
                }
                // Default transformation
                const defaultTransform = (doc) => {
                    const { _id, __v } = doc, rest = __rest(doc, ["_id", "__v"]);
                    return Object.assign({ id: _id }, rest);
                };
                // Apply default transformation
                documents = documents.map(defaultTransform);
                // Apply custom transformation if provided
                if (transform)
                    documents = documents.map(transform);
                return documents;
            }
            catch (error) {
                console.error(error);
                throw new Error(`Error searching for all documents in model ${Model.modelName}. Error: ${error}. In searchRelations method in TSGooseHandler.ts`);
            }
        });
    }
    /**
     * Remove all documents from a model that match a specific condition
     */
    removeAllDocumentsByCondition(_a) {
        return __awaiter(this, arguments, void 0, function* ({ Model, condition, }) {
            try {
                const result = yield Model.deleteMany(condition);
                return result;
            }
            catch (error) {
                console.error(error);
                return {
                    error: `Error removing documents from model ${Model.modelName}`,
                };
            }
        });
    }
}
exports.default = TSGooseHandler;
