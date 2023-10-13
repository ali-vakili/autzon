import nodemailer from "nodemailer";

type sendMailParams = {
  email: string,
  token: string
}

const sendMail = async ({ email, token }: sendMailParams) => {

  const transport = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "verify email",
    html: `<p>Click <a href="${process.env.NEXTAUTH_URL}/api/auth/agent/verify/${token}">Activate Account</a></p>`
  }
  
  await transport.sendMail(mailOptions)
}

export default sendMail