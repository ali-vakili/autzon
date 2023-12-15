"use client"

import CarCard from "@/components/module/CarCard";
import CarsFilter from "@/components/module/CarsFilter";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetRentalCars } from "@/hooks/useGetRentalCars";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import { Loader2 } from "lucide-react"


export type cars = {
  id: string;
  title: string;
  description: string;
  car_seat: {
    id: number;
    seats_count: string;
  };
  build_year_id: number;
  model_id: number;
  category: {
    id: number;
    category: string;
    abbreviation: string | null;
  };
  fuel_type: {
    id: number;
    type: string;
  }
  images: {
    id: string;
    url: string;
  }[];
  for_rent: {
    id: string;
    price_per_day: number;
    extra_time: boolean;
  };
  is_car_rented: {
    id: string;
    rented_user_id: string;
    car_id: string;
    days: number;
    pick_up_date: Date;
    drop_off_date: Date;
    reservation_fee: number | null;
    total_price: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

type rentalCarsPropType = {
  brandsAndModels: {
    id: number;
    name: string;
    models: models[];
  }[],
  buildYears: {
    id: number;
    year: string;
  }[],
  fuelTypes: {
    id: number;
    type: string;
  }[],
  carSeats: {
    id: number;
    seats: string;
    seats_count: string;
  }[]
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[]
  cities: {
    id: number;
    name_en: string;
    province_id: number;
    slug: string;
  }[],
  provinces: {
    id: number;
    name_en: string;
  }[]
}

type models = {
  id: number;
  name: string;
  brand_id: number;
  fuel_type_id: number | null;
  fuel_type: {
    id: number;
    type: string;
  } | null;
}

const RentalCars = ({ cities, provinces, brandsAndModels, buildYears, categories, fuelTypes, carSeats }: rentalCarsPropType) => {
  const [carsData, setCarsData] = useState<cars[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>("52");
  const router = useRouter();

  const { data: carsFromApi, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetRentalCars(selectedCityId);

  const handleCityChange = (newCityId: string) => {
    setSelectedCityId(newCityId);
    const citySlug = cities.find(city => `${city.id}` === newCityId)?.slug;
    router.push(`/rent-car?city=${citySlug}`);
  };

  useEffect(() => {
    isSuccess && setCarsData(carsFromApi.data);
    //@ts-ignore
    isError === true && error && toast.error(error?.response.data.error);
  }, [carsFromApi, isError])

  useEffect(() => {
    handleCityChange(selectedCityId);
    refetch();
  }, [selectedCityId])

  return (
    <div className="relative grid grid-cols-8">
      <div className="lg:col-span-6 col-span-8 bg-white rounded-md lg:me-6 px-5 py-6 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-blue-600">Rental Cars</h2>
          {isFetching ? (
            <Skeleton className="h-9 w-[100px] rounded-full" />
          ) : (
            <Badge variant={"outline"} className="gap-2 text-sm w-fit text-muted-foreground"><span className="text-white bg-primary py-1 px-3 rounded-full">{carsData.length}</span>Vehicles to rent </Badge>
          )}
        </div>
        <h4 className="text-muted-foreground text-sm mb-8">Try to find the car that suits your needs</h4>
        {isFetching && (
          <Badge variant={"secondary"} className="gap-2 text-sm w-fit text-muted-foreground mb-4"><Loader2 className="h-4 w-4 animate-spin" /> Loading</Badge>
        )}
        <div className={`grid ${((carsData && carsData.length > 0) || isLoading) && 'grid-cols-[repeat(auto-fill,minmax(320px,1fr))]'} gap-5`}>
          {isLoading ? (
              <>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
              </>
            ) : (
              carsData && carsData.length > 0 ? (
                carsData.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))
              ) : (
                <div className="flex flex-col place-items-center mx-auto col-span-1 gap-2">
                  <h3 className="text-lg font-semibold">Couldn't find any car!</h3>
                  <h4 className="text-sm font-medium">Try to change your filters</h4>
                </div>
              )
            )
          }
        </div>
      </div>
      <CarsFilter carsFromApi={carsFromApi} setCarsData={setCarsData} selectedCityId={selectedCityId} setSelectedCityId={setSelectedCityId} provinces={provinces} cities={cities} brandsAndModels={brandsAndModels} buildYears={buildYears} categories={categories} carSeats={carSeats} fuelTypes={fuelTypes}/>
    </div>
  )
}

export default RentalCars