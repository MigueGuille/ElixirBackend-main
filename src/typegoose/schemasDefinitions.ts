//TODO: AGREGAR VALIDACIONES QUE YA SE CREAERON
//TODO: AL USUARIO LE FALTA EL ROL
import { index, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { UserValidations } from "./schemasValidations";
import { MessageInterface } from "../types";

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class User {
  @prop({
    required: true,
    type: String,
    validate: UserValidations.userNameValidate(),
  })
  public userName!: string;

  @prop({
    required: true,
    type: String,
    validate: UserValidations.emailValidate(),
  })
  public email!: string;

  @prop({
    required: true,
    type: String,
  })
  public password!: string;

  @prop({
    required: false,
    type: String,
    validate: UserValidations.imageValidate(),
    default:
      "https://st2.depositphotos.com/47577860/46269/v/450/depositphotos_462698004-stock-illustration-account-avatar-interface-icon-flat.jpg",
  })
  public image?: string;

  @prop({
    required: false,
    type: Date,
    validate: UserValidations.dateOfBirtValidate(),
  })
  public dateOfBirth!: Date;

  @prop({ required: false, type: Number, default: 1000 })
  public attempts!: number;

  @prop({ required: false, type: Boolean, default: false })
  public blocked!: boolean;

  @prop({ required: false, type: Boolean, default: false })
  public active!: boolean;

  @prop({ required: false, type: String, default: "user" })
  public role!: string;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class ActivateCode {
  @prop({ required: true, type: String })
  public code!: string;

  @prop({ required: true, type: String })
  public idUser!: string;

  @prop({ default: Date.now, type: Date })
  public createdAt?: Date;

  @prop({ expires: 12000, type: Date })
  public expireAt?: Date;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class Contact {
  @prop({ required: true, type: String, ref: () => User })
  public idUserContact!: Ref<User>;

  @prop({ required: true, type: String, ref: () => User })
  public idUserOwner!: Ref<User>;

  @prop({ required: true, type: String })
  public name!: string;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class Group {
  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: false, type: String })
  public description!: string;

  @prop({ required: true, type: String, ref: () => User })
  public idUserOwner!: Ref<User>;

  @prop({ required: true, type: Array<User>, ref: () => User })
  public idUsers!: Ref<User>[];

  @prop({ required: false, type: String })
  public image!: string;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class GroupMessage {
  @prop({ required: true, type: String, ref: () => Group })
  public idGroup!: Ref<Group>;

  @prop({ required: true, type: String, ref: () => User })
  public idUser!: Ref<User>;

  @prop({ required: true, type: Object })
  public message!: MessageInterface;

  @prop({ required: false, type: Date })
  public date!: Date;

  @prop({ required: false, type: Array<User> })
  public seen!: Array<User>;
}
@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class Status {
  @prop({ required: true, type: String, ref: () => User })
  public idUser!: Ref<User>;

  @prop({ required: true, type: Array<User>, ref: () => User })
  public seen!: Array<User>;

  @prop({ required: false, type: String, default: "" })
  public description!: string;

  @prop({ required: true, type: String })
  public image!: string;

  @prop({ required: true, type: Date })
  public date!: Date;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class Message {
  @prop({ required: true, type: String, ref: () => User })
  public idUserSender!: Ref<User>;

  @prop({ required: true, type: String, ref: () => User })
  public idUserReceiver!: Ref<User>;

  @prop({ required: true, type: Object })
  public content!: MessageInterface;

  @prop({ required: true, type: Date })
  public date!: Date;

  @prop({ required: false, type: Boolean, default: false })
  public read!: boolean;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
@index({ idUser: 1, idUserReceiver: 1 }, { unique: true })
export class Chat {
  @prop({ required: true, type: String, ref: () => User })
  public idUser!: Ref<User>;

  @prop({ required: true, type: String, ref: () => User })
  public idUserReceiver!: Ref<User>;
}

@modelOptions({
  schemaOptions: {
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class ChatMessage {
  @prop({ required: true, type: String, ref: () => Chat })
  public idChat!: Ref<Chat>;

  @prop({ required: true, type: String, ref: () => User })
  public idUser!: Ref<User>;

  @prop({ required: true, type: String, ref: () => Message })
  public idMessage!: Ref<Message>;
}
