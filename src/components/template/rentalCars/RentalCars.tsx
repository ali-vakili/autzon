"use client"

import CarCard from "@/components/module/CarCard";
import CarsFilter from "@/components/module/CarsFilter";
import City from "@/components/module/filters/City";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetRentalCars } from "@/hooks/useGetRentalCars";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { Loader2 } from "lucide-react"


type rentalCars = {
  id: string;
  title: string;
  description: string;
  gallery: {
    id: string;
    name: string;
    is_verified: boolean;
    image: {
      url: string;
    } | null;
    city: {
      name_en: string;
      province: {
        name_en: string;
      };
    };
  };
  car_seat: {
    id: number;
    seats_count: string;
  };
  build_year_id: number;
  build_year: {
    year: string;
  };
  model_id: number;
  model: {
    id: number;
    name: string;
    brand: {
      id: number;
      name: string;
    };
  };
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
    car_id: string;
    price_per_day: number;
    pick_up_place: string;
    drop_off_place: string;
    reservation_fee_percentage: number;
    late_return_fee_per_hour: number | null;
    extra_time: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
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
  const [carsData, setCarsData] = useState<rentalCars[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>("52");
  const cityName = cities.find(city => `${city.id}` === selectedCityId)?.name_en;
  const router = useRouter();

  const { data: carsFromApi, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetRentalCars(selectedCityId);

  const handleCityChange = (newCityId: string) => {
    setSelectedCityId(newCityId);
    const citySlug = cities.find(city => `${city.id}` === newCityId)?.slug;
    router.push(`/rent-car?city=${citySlug?.toLowerCase()}`);
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
            <Badge variant={"outline"} className="gap-2 text-sm w-fit text-muted-foreground"><span className="text-white bg-primary py-1 px-3 rounded-full">{carsData.length}</span>Vehicles to rent</Badge>
          )}
        </div>
        {isFetching ? (
          <Skeleton className="h-5 w-[200px] rounded-full mt-4 mb-8" />
        ) : (
          <h4 className="text-muted-foreground text-sm mt-4 mb-8">Total {carsData.length} rental cars in {cityName}</h4>
        )}
        {isFetching && (
          <Badge variant={"secondary"} className="gap-2 text-sm w-fit text-muted-foreground mb-4"><Loader2 className="h-4 w-4 animate-spin" /> Loading</Badge>
        )}
        <div className={`grid ${((carsData && carsData.length > 0) || isLoading) && 'LPhone:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] grid-cols-[repeat(auto-fill,minmax(auto,1fr))]'} gap-y-4 gap-x-2`}>
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
      <aside className="lg:flex flex-col hidden col-span-2 rounded-md h-full">
        <City provinces={provinces} cities={cities} defaultValue={selectedCityId} setFilterOptions={setSelectedCityId}/>
        <CarsFilter carsFromApi={carsFromApi} setCarsData={setCarsData} brandsAndModels={brandsAndModels} buildYears={buildYears} categories={categories} carSeats={carSeats} fuelTypes={fuelTypes}/>
      </aside>
    </div>
  )
}

export default RentalCars