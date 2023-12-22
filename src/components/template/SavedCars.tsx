"use client"

import CarCard from "@/module/CarCard"
import { Button } from "@/ui/button"
import { FiRefreshCw } from "react-icons/fi"
import { useGetUserSavedCars } from "@/hooks/useGetUserSavedCars"
import { useEffect, useState } from "react"
import { Skeleton } from "@/ui/skeleton"
import { Badge } from "@/ui/badge"

import { BookmarkMinus } from "lucide-react"


type savedCar = {
  id: string;
  title: string;
  gallery: {
    id: string;
    name: string;
    is_verified: boolean;
    image: {
      url: string;
    } | null;
    phone_numbers: {
      number: string;
      id: string;
    }[];
    city: {
      name_en: string;
      province: {
        name_en: string;
      };
    };
  };
  description: string;
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
  }[] | [];
  for_rent?: {
    id: string;
    car_id: string;
    price_per_day: number;
    pick_up_place: string;
    drop_off_place: string;
    reservation_fee_percentage: number | null;
    late_return_fee_per_hour: number | null;
    extra_time: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  for_sale?: {
    id: string;
    price: number;
    mileage: number;
    color: {
      id: number;
      color_name: string;
      color_code: string;
    };
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

const SavedCars = () => {
  const [carsData, setCarsData] = useState<{car :savedCar}[]>([]);
  const { data: userSavedCars, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetUserSavedCars();

  useEffect(() => {
    isSuccess && setCarsData(userSavedCars.data);
    //@ts-ignore
    isError === true && error && toast.error(error?.response.data.error);
  }, [userSavedCars, isError])

  return (
    <div className="flex flex-col items-start w-full bg-white rounded-md px-5 py-6 gap-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-lg font-semibold">Saved cars</h2>
        {isFetching ? (
          <Skeleton className="h-9 w-[100px] rounded-full" />
        ) : (
          <Badge variant={"outline"} className="gap-2 text-sm w-fit text-muted-foreground"><span className="text-white bg-primary py-1 px-3 rounded-full">{carsData.length}</span>Saved cars</Badge>
        )}
      </div>
      <Button onClick={() => refetch()} size="sm" variant={"outline"} type="button" disabled={isFetching} isLoading={isFetching} className="w-fit text-xs h-8">{isFetching ? 'Refreshing' : <><FiRefreshCw className="me-1.5" />Refresh</>}</Button>
      <div className="grid w-full">
        <div className={`grid ${((carsData && carsData.length > 0) || isLoading) && 'LPhone:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] grid-cols-[repeat(auto-fill,minmax(auto,1fr))]'} gap-y-4 gap-x-2`}>
          {isLoading ? (
            <>
              <Skeleton className="h-72 w-full rounded-md"/>
              <Skeleton className="h-72 w-full rounded-md"/>
              <Skeleton className="h-72 w-full rounded-md"/>
            </>
          ) : (
            carsData && carsData.length > 0 ? (
              carsData.map(({ car }) => (
                //@ts-ignore
                <CarCard key={car.id} car={car} userSavedCars={userSavedCars.data} savedCarsRefetch={refetch}/>
              ))
            ) : (
              <div className="flex flex-col place-items-center mx-auto col-span-1 gap-3">
                <h3 className="inline-flex items-center text-lg font-semibold"><BookmarkMinus size={20} className="me-1.5"/>You don&apos;t have any saved cars to show</h3>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default SavedCars