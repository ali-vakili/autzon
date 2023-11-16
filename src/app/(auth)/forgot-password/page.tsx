import ForgotPassword from "@/template/ForgotPassword";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Reset Password",
}

const ForgotPasswordPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  
  return <ForgotPassword />
}

export default ForgotPasswordPage;