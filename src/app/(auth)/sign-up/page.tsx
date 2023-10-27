import SignUp from "@/template/SignUp";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return <SignUp />
}

export default SignUpPage;