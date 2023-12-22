import GalleryDetail from "@/components/template/galleryDetail/GalleryDetail";
import { prisma } from "@/lib";

import type { Metadata } from 'next'


type requestProps = {
  params: {
    id: string
  }
}

export const generateMetadata = async ({ params: { id } }: requestProps): Promise<Metadata> => {
  const gallery = await prisma.autoGallery.findFirst({
    where: {
      id
    }
  })

  return {
    title: `Gallery Detail ${gallery?.name}`,
    description: gallery?.about
  };
};
export default async function GalleryDetailPage({ params: { id } }: requestProps) {

  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <GalleryDetail galleryId={id}/>
    </main>
  )
}
