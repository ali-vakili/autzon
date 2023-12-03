"use client";

import { Car } from 'lucide-react';


type CarDetailsPropType = {
  cars: {
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
    <div className="bg-white w-full rounded p-4 space-y-4">
      <h2 className="flex items-center font-semibold w-fit"><Car className="bg-gray-100 rounded p-1.5 me-1.5" size={36}/>Cars</h2>

      <div className="flex flex-wrap gap-4 md:px-10">
        <div className="flex flex-col flex-grow border p-4 rounded-md">
          <h4 className="text-lg font-semibold w-fit">Total</h4>
          <p className="text-sm text-muted-foreground w-fit max-w-[240px] mb-3">Your Rental and Sales cars count, published and unpublished together</p>
          <h3 className="text-3xl font-semibold w-fit self-end">{cars.length}</h3>
        </div>
        <div className="flex flex-col flex-grow border p-4 rounded-md">
          <h4 className="text-lg font-semibold w-fit text-blue-500">Rental</h4>
          <p className="text-sm text-muted-foreground w-fit max-w-[240px] mb-3">Your Rental cars count, published and unpublished together</p>
          <h3 className="text-3xl font-semibold w-fit self-end">{cars.filter(car => car.for_rent).length}</h3>
        </div>
        <div className="flex flex-col flex-grow border p-4 rounded-md">
          <h4 className="text-lg font-semibold w-fit text-green-500">Sales</h4>
          <p className="text-sm text-muted-foreground w-fit max-w-[240px] mb-3">Your Sales cars count, published and unpublished together</p>
          <h3 className="text-3xl font-semibold w-fit self-end">{cars.filter(car => car.for_sale).length}</h3>
        </div>
      </div>
    </div>
  )
}

export default CarDetails