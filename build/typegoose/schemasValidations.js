"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
class UserValidations {
}
exports.UserValidations = UserValidations;
UserValidations.userNameValidate = () => ({
    validator: (v) => /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ]{4,16}$/.test(v),
    message: "Username must be 6-10 characters long and contain only letters and numbers, including accents and Ñ.",
});
UserValidations.emailValidate = () => ({
    validator: (v) => /\S+@\S+\.\S+/.test(v),
    message: "Email is not valid!",
});
UserValidations.imageValidate = () => ({
    validator: (v) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v),
    message: "Image must be a valid URL.",
});
UserValidations.dateOfBirtValidate = () => ({
    validator: (v) => !isNaN(new Date(v).getTime()),
    message: "Date of birth must be a valid date.",
});
