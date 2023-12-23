import GalleryRentRequest from "@/components/template/GalleryRentRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Saves',
}

export default async function GalleryRentRequestPage() {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) redirect("/sign-in");
  const user = session.user;

  const gallery = await prisma.autoGallery.findFirst({
    where: {
      agent_id: user.id,
      AND: { agent: {
        email: user.email
      }}
    }
  });

  if (!gallery) redirect("/dashboard/gallery/create");

  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8 bg-white rounded-md">
      <GalleryRentRequest galleryId={gallery.id}/>
    </main>
  )
}
