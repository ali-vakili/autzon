import ForgotPassword from "@/template/ForgotPassword";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Reset Password",
}

const ForgotPasswordPage = async () => {
  return <ForgotPassword />
}

export default ForgotPasswordPage;