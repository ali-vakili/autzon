import GalleriesInCity from "@/components/template/galleries/GalleriesInCity";
import { prisma } from "@/lib";

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

  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <GalleriesInCity provinces={provinces} cities={cities} categories={categories}/>
    </main>
  )
}
