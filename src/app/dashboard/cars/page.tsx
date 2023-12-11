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
    where: { gallery_id: gallery.id },
    select: {
      id: true,
      title:true,
      build_year_id: true,
      model_id: true,
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
          color: true,
        }
      },
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
          id: true,
          seats_count: true
        }
      },
      fuel_type: {
        select: {
          id: true,
          type: true
        }
      },
      description: true,
      is_published: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  })

  const brandsAndModels = await prisma.brand.findMany({
    select: {
      id: true,
      name: true,
      models: {
        select: {
          id: true,
          brand_id: true,
          name: true,
          fuel_type: true,
          fuel_type_id: true,
        }
      }
    }
  })

  const buildYears = await prisma.buildYear.findMany({
    select: {
      id: true,
      year: true
    },
    orderBy: {
      id: 'desc',
    }
  })

  const fuelTypes = await prisma.fuelType.findMany({
    select: {
      id: true,
      type: true,
    }
  })

  const categories = await prisma.autoGalleryAndCarCategory.findMany({
    select: {
      id: true,
      category: true,
      abbreviation: true
    }
  })

  const carSeats = await prisma.carSeat.findMany({
    select: {
      id: true,
      seats: true,
      seats_count: true
    }
  })

  const colors = await prisma.carColor.findMany({
    select: {
      id: true,
      color_name: true,
      color_code: true
    }
  })

  return (
    <div className="z-10 mx-auto">
      <AllCars cars={cars} gallery_id={gallery.id} brandsAndModels={brandsAndModels} buildYears={buildYears} categories={categories} carSeats={carSeats} fuelTypes={fuelTypes} colors={colors}/>
    </div>
  )
}