import RentalCars from "@/components/template/rentalCars/RentalCars";
import { prisma, validateSession } from "@/lib";
import { NextResponse } from "next/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Rent Car',
}

export const dynamic = 'force-dynamic'

// Revalidate cache every hour
export const revalidate = 3600

async function getFilterData() {
  const [
    brandsAndModels,
    buildYears,
    fuelTypes,
    categories,
    carSeats,
    colors,
    provinces,
    cities
  ] = await Promise.all([
    prisma.brand.findMany({
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
    }),
    prisma.buildYear.findMany({
      select: {
        id: true,
        year: true
      },
      orderBy: {
        id: 'desc',
      }
    }),
    prisma.fuelType.findMany({
      select: {
        id: true,
        type: true,
      }
    }),
    prisma.autoGalleryAndCarCategory.findMany({
      select: {
        id: true,
        category: true,
        abbreviation: true
      }
    }),
    prisma.carSeat.findMany({
      select: {
        id: true,
        seats: true,
        seats_count: true
      }
    }),
    prisma.carColor.findMany({
      select: {
        id: true,
        color_name: true,
        color_code: true
      }
    }),
    prisma.province.findMany({ 
      select: { id: true, name_en: true }, 
      orderBy: { name_en: 'asc' },
    }),
    prisma.city.findMany({ 
      select: { id: true, name_en: true, province_id: true, slug: true },
      orderBy: { name_en: 'asc' },
    })
  ]);

  return {
    brandsAndModels,
    buildYears,
    fuelTypes,
    categories,
    carSeats,
    colors,
    provinces,
    cities
  };
}

async function getUserData() {
  const session = await validateSession();
  if (session instanceof NextResponse) return { userCityId: null, agentGalleryId: null };

  const userCityId = session.user.city?.id;
  const agentGallery = await prisma.autoGallery.findFirst({
    where: {
      agent_id: session.user.id
    },
    select: {
      id: true
    }
  });

  return { 
    userCityId, 
    agentGalleryId: agentGallery ? agentGallery.id : null 
  };
}

export default async function RantCar() {
  return (
    <main className="flex min-h-full flex-col px-5 md:px-8 py-8">
      <Suspense fallback={<SkeletonLoading />}>
        <RentCarWrapper />
      </Suspense>
    </main>
  )
}

async function RentCarWrapper() {
  const [filterData, userData] = await Promise.all([getFilterData(), getUserData()]);

  return (
    <RentalCars 
      userCityId={userData.userCityId} 
      agentGalleryId={userData.agentGalleryId} 
      {...filterData}
    />
  );
}

const SkeletonLoading = () => {
  return(
    <div className="relative grid grid-cols-8 gap-6">
      <div className="lg:col-span-6 col-span-8 bg-white rounded-md px-5 py-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-5 w-64 mb-8" />
        <div className="flex flex-col items-center justify-center h-64">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
      <aside className="lg:flex flex-col hidden col-span-2 space-y-6">
        <Skeleton className="h-10 w-24 ml-auto" />
        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </aside>
    </div>
  )
}
