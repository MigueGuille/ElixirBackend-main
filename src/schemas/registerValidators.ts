import { ValidatorFunction } from "../types";

const REGISTER_VALIDATORS: { [key: string]: ValidatorFunction } = {
  userName: (v: string | Date) =>
    typeof v === "string" && /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ]{4,16}$/.test(v),
  email: (v: string | Date) => typeof v === "string" && /\S+@\S+\.\S+/.test(v),
  dateOfBirth: (v: string | Date) => {
    if (typeof v === "string") {
      v = new Date(v);
    }
    return v instanceof Date && !isNaN(v.getTime());
  },
};

export default REGISTER_VALIDATORS;