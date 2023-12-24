import GalleryDetail from "@/components/template/galleryDetail/GalleryDetail";
import { prisma, validateSession } from "@/lib";

import type { Metadata } from 'next'
import { NextResponse } from "next/server";


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

  let agentGalleryId = null;

  const session = await validateSession();
  if (!(session instanceof NextResponse)) {
    const agentGallery = await prisma.autoGallery.findFirst({
      where: {
        agent_id: session.user.id
      },
      select: {
        id: true
      }
    })
    if(agentGallery) {
      agentGalleryId = agentGallery.id;
    }
  };

  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <GalleryDetail galleryId={id} agentGalleryId={agentGalleryId}/>
    </main>
  )
}
