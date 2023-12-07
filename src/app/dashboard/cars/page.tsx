import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib';
import AllCars from '@/components/template/car/AllCars';

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Cars',
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

  if (!gallery) redirect("/dashboard/gallery/create");

  const cars = await prisma.car.findMany({
    select: {
      for_rent: {
        select: {
          id: true,
          price_per_day: true,
          extra_time: true,
        }
      },
      for_sale: {
        select: {
          id: true,
          price: true,
        }
      },
      id: true,
      title:true,
      images: {
        select: {
          id: true,
          url: true,
        }
      },
      is_car_rented: true,
      category: {
        select: {
          id: true,
          category: true,
          abbreviation: true
        }
      },
      car_seat:{
        select: {
          seats_count: true
        }
      },
      fuel_type: {
        select: {
          id: true,
          type: true
        }
      },
      is_published: true
    }
  })

  return (
    <div className="z-10 mx-auto">
      <AllCars cars={cars}/> 
    </div>
  )
}