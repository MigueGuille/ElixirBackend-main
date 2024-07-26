export class UserValidations {
  static userNameValidate = () => ({
    validator: (v: string) => /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ]{4,16}$/.test(v),
    message:
      "Username must be 6-10 characters long and contain only letters and numbers, including accents and Ñ.",
  });

  static emailValidate = () => ({
    validator: (v: string) => /\S+@\S+\.\S+/.test(v),
    message: "Email is not valid!",
  });

  static imageValidate = () => ({
    validator: (v: string) =>
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v),
    message: "Image must be a valid URL.",
  });

  static dateOfBirtValidate = () => ({
    validator: (v: any) => !isNaN(new Date(v).getTime()),
    message: "Date of birth must be a valid date.",
  });
}

