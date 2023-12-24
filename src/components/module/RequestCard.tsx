"use client"

import Image from "next/image";
import formatPrice from "@/helper/formatPrice";
import formatPhoneNumber from "@/helper/formatPhoneNumber";
import { formatDateTime } from "@/helper/getDate";
import { avatarFallBackText } from "@/helper/fallBackText";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/ui/separator";
import { assetsBucketUrl } from "@/constants/supabaseStorage";
import { AspectRatio } from "@/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";

import { useAcceptORDeclineRequest, useAcceptORDeclineRequestHookType } from "@/hooks/useAcceptORDeclineRequest";

import { FiPhone, FiCheck, FiX, FiLoader, FiXCircle } from "react-icons/fi";


type rentRequestType = {
  id: string;
  createdAt:Date;
  updatedAt: Date;
  status: string;
  user: {
    id: string;
    phone_number: string|null;
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


const calculateReservationFee = (pricePerDay: number, reservationFeePercentage: number) => {
  const reservationFee: number = (pricePerDay * (reservationFeePercentage / 100));
  const { formattedValue } = formatPrice(reservationFee);
  return formattedValue;
};

const FormattedRentPrice = ({ price, type, className }: {price: number, type: "RENT" | "SALE", className?: string | undefined}) => {
  const { formattedValue } = formatPrice(price);
  return (
    <h3 className={cn("text-xl font-bold", className)}>{formattedValue} {type === "RENT" && <span className="text-base text-muted-foreground">/day</span>}</h3>
  )
}

const FormattedLateReturnPrice = ({ price, className }: {price: number, className?: string | undefined}) => {
  const { formattedValue } = formatPrice(price);
  return (
    <h3 className={cn("text-xl font-bold", className)}>{formattedValue} <span className="text-base text-muted-foreground">/hour</span></h3>
  )
}

type requestCardPropType = {
  request : rentRequestType;
  refetchRequests: any;
  isFetching: boolean;
}

const RequestCard = ({ request, refetchRequests, isFetching }: requestCardPropType) => {
  const [action, setAction] = useState<"ACCEPT" | "DECLINE" | "NONE">("NONE");

  const { user: { id: userId, firstName, lastName, image, city, phone_number } } = request;
  const { car: { id: carId, title, images, category, build_year, model, for_rent } } = request;
  const { status } = request;
  const { auto_gallery_id, id: requestId } = request;

  const { mutate, data, isSuccess, isLoading, isError, error }: useAcceptORDeclineRequestHookType = useAcceptORDeclineRequest();

  useEffect(()=> {
    isSuccess === true && data?.message && (toast.success(data.message));
    isError === true && error && toast.error(error?.response.data.error);
  }, [isSuccess, isError])

  useEffect(()=> {
    if (data) {
      refetchRequests();
    }
    if (isError) {
      setAction("NONE");
    }
  }, [data, isError])

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          {status === "PENDING" && (<h2 className="text-lg inline-flex items-center gap-1.5 mb-2"><FiLoader size={16}/> Pending Request</h2>)}
          {status === "ACCEPTED" && (<h2 className="text-lg text-green-600 inline-flex items-center gap-1.5 mb-2"><FiCheck size={16}/> Accepted Request</h2>)}
          {status === "DECLINED" && (<h2 className="text-lg text-red-600 inline-flex items-center gap-1.5 mb-2"><FiXCircle size={20}/> Declined Request</h2>)}
        </div>
        <div className="space-y-2 text-end">
          <h4 className="text-muted-foreground text-xs">Request made on <span className="underline">{formatDateTime(request.createdAt)}</span></h4>
          {status !== "PENDING" && (
            <h4 className="text-muted-foreground text-xs">Request {status === "ACCEPTED" ? "accepted" : "declined"} on <span className="underline">{formatDateTime(request.updatedAt)}</span></h4>
          )}
        </div>
      </div>
      <h3 className="text-muted-foreground text-xs mb-3">Requested user:</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage alt="avatar" src={image?.url ?? undefined}/>
            <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
              <h4 className="text-base font-semibold">
                {firstName}&nbsp;{lastName}
              </h4>
              <h4 className="text-xs text-muted-foreground">
                {city?.name_en},&nbsp;{city?.province.name_en}
              </h4>
          </div>
        </div>
        <div className="flex items-center py-1 px-0.5 bg-white rounded-md gap-1.5">
          <FiPhone size={32} className="px-2 py-1 ms-1 justify-center inline-flex items-center text-center bg-gray-50 hover:bg-zinc-100 ease-out duration-200 rounded-md outline-none transition-all outline-0 border shadow-sm text-xs" />
          <h4 className="text-sm me-1">{formatPhoneNumber(phone_number)}</h4>
        </div>
      </div>
      <Separator className="my-4"/>
      <h3 className="text-muted-foreground text-xs mb-3">Requested car:</h3>
      <div className="bg-white rounded-md w-full p-2">
        <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
          <div className="w-full h-[180px] max-w-[316px]">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-md !p-0">
              <Image src={images.length > 0 ? images[0].url : `${assetsBucketUrl}default-car-image.png`} quality={100} className="rounded-md object-cover" alt={`car_image_cover_${title}`} fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)" placeholder="blur" blurDataURL={images.length > 0 ? images[0].url : `${assetsBucketUrl}default-car-image.png`}/>
            </AspectRatio>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <h4 className="text-xl font-semibold mt-1">{title}</h4>
            <div className="flex gap-1">
              <Badge variant={"secondary"} className="border rounded-md">{model.brand.name} - {model.name}</Badge>
              <Badge variant={"secondary"} className="border rounded-md">{build_year.year}</Badge>
              <Badge variant={"secondary"} className="border rounded-md">
                {category.category}&nbsp;
                {category.abbreviation && (
                  <p className="text-gray-400 inline">
                    - {category.abbreviation}
                  </p>
                )}
              </Badge>
            </div>
            {for_rent && (
              <div className="flex flex-wrap w-full justify-evenly bg-white rounded-md gap-3 !mt-4">
                <div className="flex flex-col flex-grow">
                  <h4 className="text-xs text-muted-foreground font-semibold">Rent Price: </h4>
                  <FormattedRentPrice price={for_rent.price_per_day} type={"RENT"} className="text-lg"/>
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-xs text-muted-foreground font-semibold">Reservation fee percentage: </h4>
                  <h3 className="text-lg font-bold">{for_rent.reservation_fee_percentage}%</h3>
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-xs text-muted-foreground font-semibold">Reservation fee: </h4>
                  {for_rent.reservation_fee_percentage && (
                    <h3 className="text-lg font-bold">{calculateReservationFee(for_rent.price_per_day, for_rent.reservation_fee_percentage)}</h3>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {for_rent && for_rent.extra_time && for_rent?.late_return_fee_per_hour && for_rent.reservation_fee_percentage && (
          <div className="flex flex-col w-full flex-grow bg-orange-300 p-3 rounded-md">
            <h3 className="text-sm font-bold mb-2">Extra Time</h3>
            <h4 className="text-xs font-semibold">Penalty in case renter returns car late fee per hour: </h4>
            <FormattedLateReturnPrice price={for_rent.reservation_fee_percentage} className="text-lg"/>
          </div>
        )}
      </div>
      {status === "PENDING" && (
        <>
          <Separator className="my-4"/>
          <div className="flex justify-center w-full gap-2">
            {action !== "ACCEPT" && (
              <Button onClick={() => {mutate({ action:"DECLINED", car_id:carId, gallery_id: auto_gallery_id, user_id: userId, request_id: requestId }), setAction("DECLINE")}} isLoading={isLoading} disabled={isLoading || isSuccess || isFetching} variant={"ghost"} className="bg-white text-destructive hover:text-destructive hover:bg-white border border-destructive gap-1">{!isLoading && <FiX size={16}/>}&nbsp;{isLoading ? "Declining" : isSuccess ? "Declined" : "Decline"}</Button>
            )}
            {action !== "DECLINE" && (
              <Button onClick={() => {mutate({ action:"ACCEPTED", car_id:carId, gallery_id: auto_gallery_id, user_id: userId, request_id: requestId }), setAction("ACCEPT")}} isLoading={isLoading} disabled={isLoading || isSuccess || isFetching} variant={"ghost"} className="bg-white text-success hover:text-success hover:bg-white border border-success gap-1">{!isLoading && <FiCheck size={16}/>}&nbsp;{isLoading ? "Accepting" : isSuccess ? "Accepted" : "Accept"}</Button>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default RequestCard