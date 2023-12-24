"use client"

import UserRequestCard from "@/module/UserRequestCard";
import { useEffect, useState } from "react"
import { RequestStatus } from "@prisma/client";

import { Button } from "@/ui/button";
import { Skeleton } from "@/ui/skeleton";
import { formatDateTime } from "@/helper/getDate";

import { useGetUserSavedCars } from "@/hooks/useGetUserSavedCars";
import { useGetRentRequests } from "@/hooks/useGetUserRentRequests"

import { FiFileMinus, FiRefreshCw } from "react-icons/fi";


type car = {
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
    reservation_fee_percentage: number;
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


const Requests = () => {
  const [userRequests, setUserRequests] = useState<{ id: string, createdAt:Date, updatedAt:Date, car: car, status: RequestStatus }[]>([]);

  const { data:userRequestsFromApi, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetRentRequests();

  const { data: userSavedCars={data: []}, isLoading: isLoadingSavedCars, refetch: refetchUserSavedCars } = useGetUserSavedCars();

  useEffect(() => {
    if (userRequestsFromApi) {
      setUserRequests(userRequestsFromApi.data);
    }
  }, [userRequestsFromApi, isSuccess, isError])

  return (
    <div className="flex flex-col items-start w-full bg-white rounded-md px-5 py-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-1">Requests</h2>
      <h4 className="text-sm text-muted-foreground font-medium">You can find requests that you have made for renting car here.</h4>
      <Button onClick={() => refetch()} size="sm" variant={"outline"} type="button" disabled={isFetching} isLoading={isFetching} className="w-fit text-xs h-8 my-4">{isFetching ? 'Refreshing' : <><FiRefreshCw className="me-1.5" />Refresh</>}</Button>
      {isLoading || isLoadingSavedCars ? (
        <Skeleton className="h-96 w-full rounded-md"/>
      ) : (
        userRequests.length > 0 ? (
          userRequests.map((request, index) => (
            <div className="flex flex-col w-full bg-muted p-4 rounded-md !mt-4" key={`${request.car.id}${index}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-muted-foreground text-xs">Requested car:</h3>
                <div className="space-y-2 text-end">
                  <h4 className="text-muted-foreground text-xs">Request made on <span className="underline">{formatDateTime(request.createdAt)}</span></h4>
                  {request.status === "DECLINED" && (
                    <h4 className="text-muted-foreground text-xs">Request declined on <span className="underline">{formatDateTime(request.updatedAt)}</span></h4>
                  )}
                </div>
              </div>
              <UserRequestCard request={request} refetchRequests={refetch} userSavedCars={userSavedCars.data} isFetching={isFetching}/>
            </div>
          ))
        ) : (
          <div className="flex justify-center w-full">
            <h4 className="inline-flex items-center text-xl font-semibold gap-1.5"><FiFileMinus size={20}/>No Requests!</h4>
          </div>
        )
      )}
    </div>
  )
}

export default Requests