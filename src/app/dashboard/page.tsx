import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib';
import { Suspense } from 'react';
import DashboardSkeletonLoading from '@/components/module/DashboardSkeletonLoading';
import CreateGalleyWarning from '@/components/module/CreateGalleyWarning';
import CarDetails from '@/components/module/CarDetails';

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
      <CreateGalleyWarning />
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
        <CarDetails cars={cars}/>
      </Suspense>
    </div>
  )
}