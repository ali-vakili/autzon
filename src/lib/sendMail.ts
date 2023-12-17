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
    subject: "Autzon Account Email Verification",
    html: (token: string) => `
      <div style="display: flex;">
        <img src="https://dszakkhmayujfuivuhja.supabase.co/storage/v1/object/public/assets/autzon-logo" alt="autzon-logo" style="width: 60px; margin-left: auto; margin-right: auto;"/>
      </div>
      <div style="display: flex;">
        <h3 style="font-weight: 600; font-size: 24px; margin-left: auto; margin-right: auto;">Welcome to autzon</h3>
      </div>
      <hr style="display: block; height: 1px; border: 0; border-top: 1px solid #e7e7e9; margin: 1em 0; padding: 0;"/>
      <div style="display: flex;">
        <h4 style="font-weight: 600; font-size: 20px; margin-left: auto; margin-right: auto; margin-bottom: 16px;">Email Verification</h4>
      </div>
      <div style="display: flex; text-align: center;">
        <p style="color: #64748b; font-size: 14px; margin-left: auto; margin-right: auto; text-align: center; max-width: 640px; margin-bottom: 20px;">This is a verification email that sent to you, Please confirm the verify email to verify your email to continue in autzon. Otherwise if you are not aware of this email you can ignore it.</p>
      </div>
      <div style="display: flex;">
        <a href="${process.env.NEXTAUTH_URL}/api/auth/agent/verify/${token}" style="padding: 16px; background-color: #0F172A; width: 300px; border-radius: 8px; border: 1px solid #FFFFFF; color: #FFFFFF; font-size: 16px; text-align: center; margin-bottom: 8px; margin-left: auto; margin-right: auto; text-transform: uppercase;">Verify Email</a>
      </div>
    `
  },
  RESET_PASSWORD: {
    subject: "Autzon Account Password Reset",
    html: (token: string) => `
      <div style="display: flex;">
        <img src="https://dszakkhmayujfuivuhja.supabase.co/storage/v1/object/public/assets/autzon-logo" alt="autzon-logo" style="width: 60px; margin-left: auto; margin-right: auto;"/>
      </div>
      <div style="display: flex;">
      <h4 style="font-weight: 600; font-size: 20px; margin-left: auto; margin-right: auto; margin-bottom: 16px;">Reset Password</h4>
      </div>
      <hr style="display: block; height: 1px; border: 0; border-top: 1px solid #e7e7e9; margin: 1em 0; padding: 0;"/>
      <div style="display: flex; text-align: center;">
        <p style="color: #64748b; font-size: 14px; margin-left: auto; margin-right: auto; text-align: center; max-width: 640px; margin-bottom: 20px;">We have received a request to reset your password. Please confirm the reset to choose a new password. Otherwise, you can ignore this email.</p>
      </div>
      <div style="display: flex;">
        <a href="${process.env.NEXTAUTH_URL}/reset-password/${token}" style="padding: 16px; background-color: #0F172A; width: 300px; border-radius: 8px; border: 1px solid #FFFFFF; color: #FFFFFF; font-size: 16px; text-align: center; margin-bottom: 8px; margin-left: auto; margin-right: auto; text-transform: uppercase;">Reset Password</a>
      </div>
    `
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