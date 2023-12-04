"use client";

import { Separator } from "@/components/ui/separator"
import { buttonVariants } from "@/ui/button";
import { Car } from 'lucide-react';
import Link from "next/link";
import { FiPlus } from "react-icons/fi";


type CarDetailsPropType = {
  cars: {
    is_published: boolean;
    for_rent: {
      id: string;
    } | null;
    for_sale: {
      id: string;
    } | null;
  }[]
}

const CarDetails = ({ cars }: CarDetailsPropType) => {
  return (
    <div className="bg-white w-full rounded p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center font-semibold w-fit"><Car className="bg-gray-100 rounded p-1.5 me-1.5" size={36}/>Cars</h2>
        <div className="space-x-2">
          <Link href={"/dashboard/cars/rental/create"} className={`${buttonVariants({ variant: "outline", size: "sm" })} text-blue-500`}>
            <FiPlus size={16} className="me-1.5"/>
            Add a rental car
          </Link>
          <Link href={"/dashboard/cars/sale/create"} className={`${buttonVariants({ variant: "outline", size: "sm" })} text-green-500`}>
            <FiPlus size={16} className="me-1.5"/>
            Add a sale car
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 md:px-10">
        <div className="flex flex-col flex-grow border p-4 rounded-md">
          <h4 className="text-lg font-semibold w-fit">Total</h4>
          <p className="text-sm text-muted-foreground w-fit max-w-[240px] mb-4">Your Rental and Sales cars count, published and unpublished</p>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-grow'>
              <h4 className="text-sm">Published</h4>
              <h3 className="text-3xl font-semibold w-fit ms-auto">{cars.filter(car => car.is_published).length}</h3>
            </div>
            <Separator orientation="vertical" />
            <div className='flex-grow'>
              <h4 className="text-sm">Unpublished</h4>
              <h3 className="text-3xl font-semibold w-fit  ms-auto">{cars.filter(car => !car.is_published).length}</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow border p-4 rounded-md">
          <h4 className="text-lg font-semibold w-fit text-blue-500">Rental</h4>
          <p className="text-sm text-muted-foreground w-fit max-w-[240px] mb-4">Your Rental cars count, published and unpublished</p>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-grow'>
              <h4 className="text-sm">Published</h4>
              <h3 className="text-3xl font-semibold w-fit ms-auto">{cars.filter(car => car.is_published && car.for_rent).length}</h3>
            </div>
            <Separator orientation="vertical" />
            <div className='flex-grow'>
              <h4 className="text-sm">Unpublished</h4>
              <h3 className="text-3xl font-semibold w-fit  ms-auto">{cars.filter(car => !car.is_published && car.for_rent).length}</h3>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow border p-4 rounded-md">
          <h4 className="text-lg font-semibold w-fit text-green-500">Sales</h4>
          <p className="text-sm text-muted-foreground w-fit max-w-[240px] mb-4">Your Sales cars count, published and unpublished</p>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-grow'>
              <h4 className="text-sm">Published</h4>
              <h3 className="text-3xl font-semibold w-fit ms-auto">{cars.filter(car => car.is_published && car.for_sale).length}</h3>
            </div>
            <Separator orientation="vertical" />
            <div className='flex-grow'>
              <h4 className="text-sm">Unpublished</h4>
              <h3 className="text-3xl font-semibold w-fit  ms-auto">{cars.filter(car => !car.is_published && car.for_sale).length}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails