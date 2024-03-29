import Account from "@/components/template/account/Account";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Account",
}

export default async function General() {
  const session = await getServerSession(authOptions);

  if(!session || !session.user) redirect("/sign-in");
  const user = session.user

  return (
    <Account user={user}/>
  )
}