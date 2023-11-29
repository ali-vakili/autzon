import CreateGalleryForm from "@/components/template/gallery/CreateGallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import { redirect } from "next/navigation";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Create Gallery",
}

export default async function CreateGallery() {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) redirect("/sign-in");
  const user = session.user;

  const agent = await prisma.autoGalleryAgent.findUnique({
    where: {
      email: user.email,
      AND: { id: user.id}
    },
    include: { gallery: true },
  });

  !agent || agent!.gallery.length > 0 && redirect("/dashboard");

  const autoGalleryCategories = await prisma.autoGalleryCategory.findMany({
    select: {
      id: true,
      category: true,
      abbreviation: true,
    }
  })

  const provinces = await prisma.province.findMany({ 
    select: { id: true, name_en: true }, 
    orderBy: { name_en: 'asc' },
  })

  const cities = await prisma.city.findMany({ 
    select: { id: true, name_en: true, province_id: true },
    orderBy: { name_en: 'asc' },
  })

  return (
    <CreateGalleryForm categories={autoGalleryCategories} cities={cities} provinces={provinces}/>
  )
}