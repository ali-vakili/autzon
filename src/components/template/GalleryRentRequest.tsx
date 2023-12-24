"use client"

import RequestCard from "@/module/RequestCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/button"
import { Skeleton } from "@/ui/skeleton";

import { useGalleryRequests } from "@/hooks/useGetGalleryRequests";

import { FiRefreshCw, FiFileMinus } from "react-icons/fi"



type rentRequestType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  user: {
    id: string;
    phone_number: string | null;
    image: {
      id: string;
      url: string;
    } | null;
    city: {
      id: number;
      name_en: string;
      province: {
        id: number;
        name_en: string;
      };
    } | null;
    firstName: string | null;
    lastName: string | null;
  };
  auto_gallery_id: string;
  car: {
    id: string;
    title: string;
    model_id: number;
    model: {
      id: number;
      name: string;
      brand: {
        id: number;
        name: string;
      };
    };
    createdAt: Date;
    updatedAt: Date;
    build_year_id: number;
    build_year: {
      year: string;
    };
    category: {
      id: number;
      category: string;
      abbreviation: string | null;
    };
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
      reservation_fee_percentage: number | null;
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
  };
}

type galleryRentRequestPropType = {
  galleryId: string;
}

const GalleryRentRequest = ({ galleryId } : galleryRentRequestPropType) => {
  const [ requests, setRequests ] = useState<rentRequestType[]>([]);

  const { data: requestsFromApi, isSuccess, isLoading, isFetching, isError, refetch } = useGalleryRequests(galleryId);

  useEffect(() => {
    isSuccess && setRequests(requestsFromApi.data);
    //@ts-ignore
    isError === true && error && toast.error(error?.response.data.error);
  }, [requestsFromApi, isSuccess, isError])

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-semibold">Renting Car Requests</h2>
      <h4 className="text-sm text-muted-foreground font-medium !mt-1">You can find who requested for cars that you have in your auto gallery.</h4>
      <Button onClick={() => refetch()} size="sm" variant={"outline"} type="button" disabled={isFetching} isLoading={isFetching} className="w-fit text-xs h-8">{isFetching ? 'Refreshing' : <><FiRefreshCw className="me-1.5" />Refresh</>}</Button>
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-md"/>
      ) : (
        requests.length > 0 ? (
          requests.map(request => (
            <div className="flex flex-col w-full bg-muted p-4 rounded-md !mt-4" key={`${request.car.id}${Math.floor(Math.random() * 1000) + 1}`}>
              <RequestCard request={request} refetchRequests={refetch} isFetching={isFetching}/>
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

export default GalleryRentRequest