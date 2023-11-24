import EditGalleryForm from "@/components/template/gallery/EditGallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import { redirect } from "next/navigation";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: "Edit Gallery",
}

export default async function EditGallery() {
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
    <EditGalleryForm gallery={gallery} categories={autoGalleryCategories} cities={cities} provinces={provinces}/>
  )
}