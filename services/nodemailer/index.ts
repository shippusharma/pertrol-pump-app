import { configs } from '@/configs';
import { type SendMailOptions, type Transporter, createTransport } from 'nodemailer';

export interface TEmailMessage {
  to: string[] | string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  text: string;
  html?: string;
  // eslint-disable-next-line no-undef
  attachments?: { filename: string; content: Buffer | string; contentType: string }[];
}

const {
  appName,
  email: { host, port, user, password },
} = configs;

class NodemailerService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host,
      port,
      secure: false, //true for 465 port, false for other ports
      auth: { user, pass: password },
    });
  }

  send = async ({
    to,
    cc = [],
    bcc = [],
    subject,
    text,
    html,
    attachments = [],
  }: TEmailMessage): Promise<string | Error> => {
    try {
      const mailOptions: SendMailOptions = {
        from: `"${appName}" <${user}>`,
        to,
        cc,
        bcc,
        subject,
        text,
        html,
        attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      // if (!isProduction) logger.info('Email sent successfully via nodemailer', info.response);
      return info.response;
    } catch (error) {
      return error as Error;
    }
  };
}

export const emailService = new NodemailerService();
