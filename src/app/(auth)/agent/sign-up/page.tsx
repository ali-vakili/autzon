import SignUpAgent from "@/components/template/SignUpAgent";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Agent Sign up",
}

const SignUpPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return <SignUpAgent />
}

export default SignUpPage;