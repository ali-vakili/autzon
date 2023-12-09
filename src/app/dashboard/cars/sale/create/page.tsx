import AddSaleCarForm from "@/components/template/car/AddSaleCar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib";
import { redirect } from "next/navigation";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Add Sale Car",
}

export default async function CreateSaleCar() {
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
    <AddSaleCarForm galleryAddress={gallery.address} brandsAndModels={brandsAndModels} fuelTypes={fuelTypes} buildYears={buildYears} categories={categories} carSeats={carSeats} colors={colors} />
  )
}