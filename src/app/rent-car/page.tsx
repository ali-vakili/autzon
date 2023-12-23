import RentalCars from "@/components/template/rentalCars/RentalCars";
import { prisma, validateSession } from "@/lib";
import { NextResponse } from "next/server";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Rent Car',
}

export default async function RentCar() {

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

  const provinces = await prisma.province.findMany({ 
    select: { id: true, name_en: true }, 
    orderBy: { name_en: 'asc' },
  })

  const cities = await prisma.city.findMany({ 
    select: { id: true, name_en: true, province_id: true, slug: true },
    orderBy: { name_en: 'asc' },
  })

  let userCityId = null

  const session = await validateSession();
  if (!(session instanceof NextResponse)) {
    userCityId = session.user.city?.id;
  };

  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <RentalCars userCityId={userCityId} provinces={provinces} cities={cities} brandsAndModels={brandsAndModels} buildYears={buildYears} categories={categories} carSeats={carSeats} fuelTypes={fuelTypes} />
    </main>
  )
}
