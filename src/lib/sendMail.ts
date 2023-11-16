import nodemailer from "nodemailer";

type sendMailParams = {
  email: string,
  token: string,
  type: "VERIFY" | "RESET_PASSWORD";
}

const user = process.env.NODEMAILER_EMAIL;
const pass = process.env.NODEMAILER_PASSWORD;

const emailTemplates = {
  VERIFY: {
    subject: "Verify Email",
    html: (token: string) => `<p>Click <a href="${process.env.NEXTAUTH_URL}/api/auth/agent/verify/${token}">Activate Account</a></p>`
  },
  RESET_PASSWORD: {
    subject: "Reset Your Password",
    html: (token: string) => `<p>Click <a href="${process.env.NEXTAUTH_URL}/reset-password/${token}">Reset Password</a></p>`
  }
};

const sendMail = async ({ email, token, type }: sendMailParams) => {

  const transport = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user,
      pass
    },
  });

  const { subject, html } = emailTemplates[type];
  
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject,
    html: html(token)
  }
  
  await transport.sendMail(mailOptions)
}

export default sendMail