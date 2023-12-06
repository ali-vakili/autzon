import EditRentalCarPage from "@/components/template/car/EditRentalCarPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import { redirect } from "next/navigation";

import type { Metadata } from 'next'


type requestProps = {
  params: {
    id: string
  }
}

export const generateMetadata = async ({ params: { id } }: requestProps): Promise<Metadata> => {
  const car = await prisma.car.findFirst({
    where: {
      id
    }
  })

  return {
    title: `Edit Rental Car ${car?.title}`,
    description: car?.description
  };
};

export default async function EditRentalCar({ params: { id } }: requestProps) {
  const session = await getServerSession(authOptions);
  if(!session || !session.user) redirect("/sign-in");
  const user = session.user;

  const gallery = await prisma.autoGallery.findFirst({
    where: {
      agent_id: user.id,
      AND: { agent: { email: user.email }}
    }
  });

  if (!gallery) redirect("/dashboard/gallery/create");

  const car = await prisma.car.findFirst({
    where: {
      id,
      AND: { gallery_id: gallery.id }
    },
    select: {
      id: true,
      title: true,
      model: true,
      model_id: true,
      car_seat: true,
      car_seat_id: true,
      build_year: true,
      build_year_id: true,
      fuel_type: true,
      fuel_type_id: true,
      category: true,
      category_id: true,
      images: {
        select: {
          id: true,
          url: true,
          car_id: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
      description: true,
      is_published: true,
    },
  })

  if (!car) redirect("/dashboard");

  const rentalCar = await prisma.rentalCar.findFirst({
    where: {
      car_id: car.id,
    }
  })

  if (!rentalCar) redirect("/dashboard");

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

  return (
    <EditRentalCarPage galleryAddress={gallery.address} brandsAndModels={brandsAndModels} fuelTypes={fuelTypes} buildYears={buildYears} categories={categories} carDetail={car} rentalCarDetail={rentalCar} carSeats={carSeats} />
  )
}