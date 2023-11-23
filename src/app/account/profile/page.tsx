import EditProfile from "@/components/template/account/EditProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Profile",
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
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone_number: true,
      bio: true,
      image: {
        select: {
          url: true
        }
      }
    }
  })

  if (!agent) return;

  return (
    <EditProfile user={agent}/>
  )
}