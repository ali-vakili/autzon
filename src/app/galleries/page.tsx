import GalleriesInCity from "@/components/template/galleries/GalleriesInCity";
import { prisma, validateSession } from "@/lib";
import { NextResponse } from "next/server";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Galleries',
}

export default async function Galleries() {

  const categories = await prisma.autoGalleryAndCarCategory.findMany({
    select: {
      id: true,
      category: true,
      abbreviation: true
    }
  })

  const provinces = await prisma.province.findMany({ 
    select: { id: true, name_en: true }, 
    orderBy: { name_en: 'asc' },
  })

  const cities = await prisma.city.findMany({ 
    select: { id: true, name_en: true, province_id: true, slug: true },
    orderBy: { name_en: 'asc' },
  })

  let userCityId = null

  const session = await validateSession();
  if (!(session instanceof NextResponse)) {
    userCityId = session.user.city?.id;
  };

  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <GalleriesInCity userCityId={userCityId} provinces={provinces} cities={cities} categories={categories}/>
    </main>
  )
}
