import Management from "@/components/template/account/Management";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Account Management",
}

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if(!session || !session.user) return;

  const agent = await prisma.autoGalleryAgent.findUnique({
    where: { 
      email: session.user.email,
      AND: { id: session.user.id}
    },
    select: {
      email: true,
    }
  })

  if (!agent) return;

  return (
    <Management user={agent}/>
  )
}