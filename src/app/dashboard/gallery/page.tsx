import Gallery from "@/components/template/gallery/Gallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import { redirect } from "next/navigation";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Gallery",
}

export default async function AgentGallery() {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) redirect("/sign-in");
  const user = session.user;

  const gallery = await prisma.autoGallery.findFirst({
    where: {
      agent_id: user.id,
      AND: { agent: { email: user.email }}
    },
    select: {
      id: true,
      name: true,
      image: {
        select: {
          id: true,
          url: true
        }
      },
      address: true,
      city_id: true,
      phone_numbers: {
        select: {
          id: true,
          number: true
        }
      },
      categories: {
        select: {
          id: true,
        }
      },
      about: true,
    }
  });

  if (!gallery) redirect("/dashboard/gallery/create");

  return (
    <Gallery gallery={gallery} />
  )
}