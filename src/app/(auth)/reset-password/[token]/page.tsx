import ResetPassword from "@/template/ResetPassword";
import { redirect } from "next/navigation";
import { prisma } from "@/lib";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Reset Password",
}

type ResetPasswordPagePropsType = {
  params: {
    token: string
  }
}

const ResetPasswordPage = async ({ params }: ResetPasswordPagePropsType) => {
  const oneHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { 
      token: params.token,
      AND: [
        {
          resetAt: null,
        },
        {
          createdAt: {
            gt: oneHoursAgo, // 1 hour ago
          }
        }
      ]
    },
    include: { agent: true }
  })

  if (!passwordResetToken || passwordResetToken.createdAt <= oneHoursAgo || passwordResetToken.resetAt !== null) {
    redirect("/sign-in?message=Invalid password reset credentials&messageType=error")
  }
  
  return <ResetPassword token={params.token}/>
}

export default ResetPasswordPage;