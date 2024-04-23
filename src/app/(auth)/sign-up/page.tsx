import SignUpUser from "@/components/template/SignUpUser";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Sign up",
}

const SignUpPage = () => <SignUpUser />

export default SignUpPage;