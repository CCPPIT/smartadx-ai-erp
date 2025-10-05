import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

export interface EmailServiceConfig {
  provider: 'smtp' | 'sendgrid';
  smtp?: {
    host: string;
    port: number;
    secure?: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sendgrid?: {
    apiKey: string;
  };
  from: {
    email: string;
    name: string;
  };
}

class EmailService {
  private transporter: Transporter | null = null;
  private config: EmailServiceConfig;

  constructor() {
    this.config = this.loadConfig();
    this.initialize();
  }

  private loadConfig(): EmailServiceConfig {
    const provider = process.env.EMAIL_PROVIDER || 'smtp';

    if (provider === 'sendgrid') {
      return {
        provider: 'sendgrid',
        sendgrid: {
          apiKey: process.env.SENDGRID_API_KEY || '',
        },
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'noreply@smartadx.ai',
          name: process.env.SENDGRID_FROM_NAME || 'SmartAdX AI ERP',
        },
      };
    }

    // Default to SMTP
    return {
      provider: 'smtp',
      smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASSWORD || '',
        },
      },
      from: {
        email: process.env.SMTP_FROM || 'noreply@smartadx.ai',
        name: process.env.SMTP_FROM_NAME || 'SmartAdX AI ERP',
      },
    };
  }

  private initialize() {
    if (this.config.provider === 'smtp' && this.config.smtp) {
      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        auth: this.config.smtp.auth,
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.error('Email transporter not initialized');
        return false;
      }

      const from = options.from || `${this.config.from.name} <${this.config.from.email}>`;

      await this.transporter.sendMail({
        from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : undefined,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      if (!this.transporter) return false;
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const emailService = new EmailService();
