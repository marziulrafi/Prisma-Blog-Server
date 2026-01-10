import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@app.com>',
          to: user.email,
          subject: "Email Verification",
          html:
            `
                <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email - Prisma Blog</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f4f4f9;
      color: #333333;
      line-height: 1.6;
    }
    .container {
      max-width: 580px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 25px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .content {
      padding: 40px 35px;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white !important;
      text-decoration: none;
      padding: 16px 42px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      margin: 30px 0;
      transition: all 0.2s;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    .button:hover {
      background: #5a67d8;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    .footer {
      background: #f8f9fc;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    h1 { font-size: 28px; margin-bottom: 16px; }
    h2 { font-size: 24px; margin-bottom: 24px; }
    p { margin-bottom: 20px; }
    @media only screen and (max-width: 600px) {
      .container { margin: 20px; }
      .content, .header { padding: 30px 20px; }
      h1 { font-size: 24px; }
      h2 { font-size: 20px; }
      .button { width: 100%; text-align: center; padding: 14px 30px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Prisma Blog!</h1>
    </div>
    
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hello, ${user.name},</p>
      <p>Thank you for signing up!<br>
      Please confirm your email address to get started.</p>

      <a href="${verificationUrl}" class="button" target="_blank">
        Verify Email Address →
      </a>

      <p style="margin: 40px 0 20px; font-size: 15px; color: #475569;">
        Or copy and paste this link in your browser:
      </p>
      
      <p style="word-break: break-all; font-size: 14px; color: #64748b; background: #f1f5f9; padding: 16px; border-radius: 8px;">
        ${url}
      </p>

      <p style="margin-top: 40px; font-size: 14px; color: #64748b;">
        This link will expire in <strong>24 hours</strong> for security reasons.
      </p>
    </div>

    <div class="footer">
      <p>Prisma Blog • Made with ❤️ for writers & readers</p>
      <p>If you didn't create an account, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
                `
        });

        console.log("Message sent : ", info.messageId);

      }
      catch (err) {
        console.error(err);
        throw err
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});