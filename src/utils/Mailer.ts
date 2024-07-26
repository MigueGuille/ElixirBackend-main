import { SentMessageInfo, Transporter } from "nodemailer";
import { MailOptions, MailerConfig } from "../types";
import { Hosts } from "../constants";
import nodemailer from "nodemailer";

/**
 * Clase que representa un objeto Mailer.
 */
class Mailer {
  private host: string;
  private user: string;
  private password: string;
  private mailHost: string;
  private port: number;
  private secure: boolean;
  private transporter: Transporter | null;

  /**
   * Crea un objeto Mailer.
   * @param {Object} options - El objeto de opciones.
   * @param {Object} options.config - El objeto de configuración.
   * @param {string} options.config.host - El host del correo electrónico.
   * @param {string} options.config.user - El usuario del correo electrónico.
   * @param {string} options.config.password - La contraseña del correo electrónico.
   */
  constructor({ config }: { config: MailerConfig }) {
    this.host = config.host.toLowerCase();
    this.user = config.user.toLowerCase();
    this.password = config.password;

    const hostConfig = Hosts[this.host];
    this.mailHost = hostConfig.host;
    this.port = hostConfig.port;
    this.secure = hostConfig.secure;

    try {
      /**
       * El objeto transporter de nodemailer.
       * @type {Object}
       */
      this.transporter = nodemailer.createTransport({
        host: this.mailHost,
        port: this.port,
        secure: this.secure,
        auth: {
          user: this.user,
          pass: this.password,
        },
        tls: {
          // no fallar en certificados inválidos
          rejectUnauthorized: false,
        },
      });
    } catch (error) {
      console.error(error);
      this.transporter = null;
    }
  }

  /**
   * Envía un correo electrónico de texto.
   * @async
   * @param {Object} options - El objeto de opciones.
   * @param {string} options.to - El destinatario del correo electrónico.
   * @param {string} options.subject - El asunto del correo electrónico.
   * @param {string} options.text - El cuerpo del correo electrónico.
   * @returns {Promise<Object>} El resultado del envío del correo electrónico.
   */
  sendMailText = async ({
    to,
    subject,
    text,
  }: MailOptions): Promise<SentMessageInfo | { error: any }> => {
    try {
      const result = await this.transporter!.sendMail({
        from: this.user,
        to,
        subject,
        text,
      });

      return result;
    } catch (error) {
      return { error };
    }
  };

  /**
   * Envía un correo electrónico HTML.
   * @async
   * @param {Object} options - El objeto de opciones.
   * @param {string} options.to - El destinatario del correo electrónico.
   * @param {string} options.subject - El asunto del correo electrónico.
   * @param {string} options.html - El cuerpo del correo electrónico en formato HTML.
   * @returns {Promise<Object>} El resultado del envío del correo electrónico.
   */
  sendMailHtml = async ({
    to,
    subject,
    html,
  }: MailOptions & { html: string }): Promise<SentMessageInfo | { error: any }> => {
    try {
      const result = await this.transporter!.sendMail({
        from: this.user,
        to,
        subject,
        html,
      });

      return result;
    } catch (error) {
      console.log(error)
      return { error };
    }
  };
}

export default Mailer;