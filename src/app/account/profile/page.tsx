import EditProfile from "@/components/template/account/EditProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

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
      city_id: true,
      city: {
        select: {
          id: true,
          name_en: true,
          latitude: true,
          longitude: true,
          province: {
            select: {
              id: true,
              name_en: true,
              latitude: true,
              longitude: true
            }
          }
        }
      },
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

  const provinces = await prisma.province.findMany({ 
    select: { id: true, name_en: true, latitude: true, longitude: true }, 
    orderBy: { name_en: 'asc' },
  })

  const cities = await prisma.city.findMany({ 
    select: { id: true, name_en: true, province_id: true, latitude: true, longitude: true },
    orderBy: { name_en: 'asc' },
  })

  return (
    <Suspense fallback={<div className="flex h-full w-full justify-center items-center"><Loader2 className="animate-spin"/></div>}>
      <EditProfile provinces={provinces} cities={cities} user={agent}/>
    </Suspense>
  )
}