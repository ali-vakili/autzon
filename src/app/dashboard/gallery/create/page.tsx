import CreateGalleryForm from "@/components/template/CreateGallery";
import { prisma } from "@/lib";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Create Gallery",
}

export default async function CreateGallery() {

  const autoGalleryCategories = await prisma.autoGalleryCategory.findMany({
    select: {
      id: true,
      category: true,
      abbreviation: true,
    }
  })

  return (
    <CreateGalleryForm categories={autoGalleryCategories} />
  )
}