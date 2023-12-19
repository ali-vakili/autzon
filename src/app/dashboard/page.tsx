import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib';
import { Suspense } from 'react';
import DashboardSkeletonLoading from '@/components/module/DashboardSkeletonLoading';
import CreateGalleryWarning from '@/components/module/CreateGalleryWarning';
import TotalCars from '@/components/module/TotalCars';

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Home() {
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

  if (!gallery) {
    return (
      <CreateGalleryWarning />
    )
  }

  const cars = await prisma.car.findMany({
    select: {
      for_rent: {
        select: {
          id: true
        }
      },
      for_sale: {
        select: {
          id: true
        }
      },
      is_published: true
    }
  })

  return (
    <div className="z-10 mx-auto">
      <Suspense fallback={<DashboardSkeletonLoading />}>
        <TotalCars cars={cars}/>
      </Suspense>
    </div>
  )
}