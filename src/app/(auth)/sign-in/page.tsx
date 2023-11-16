import SignIn from "@/template/SignIn";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Sign in",
}

const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");
  
  return <SignIn />
}

export default SignInPage;