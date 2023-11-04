import Account from "@/components/template/Account";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Account",
}

export default async function General() {
  const session = await getServerSession(authOptions);

  if(!session || !session.user) return;
  const user = session.user

  return (
    <Account user={user}/>
  )
}