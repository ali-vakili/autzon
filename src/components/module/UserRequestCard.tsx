"use client"

import Link from "next/link";
import Image from "next/image"
import formatPrice from "@/helper/formatPrice";
import formatPhoneNumber from "@/helper/formatPhoneNumber";
import { useEffect, useState } from "react";
import { Badge } from "@/ui/badge"
import { AspectRatio } from "@/ui/aspect-ratio"
import { Separator } from "@/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { assetsBucketUrl } from "@/constants/supabaseStorage";
import { Swiper, SwiperSlide } from 'swiper/react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { avatarFallBackText } from "@/helper/fallBackText";

import 'swiper/css';
import 'swiper/css/pagination';

import '../css/common.css';

import { Pagination } from 'swiper/modules';

import { useSaveORUnSaveCar, saveORUnSaveCarHookType } from "@/hooks/useSaveORUnSaveCar";
import { useDeleteRentRequest } from "@/hooks/useDeleteUserRequest";

import { FiMapPin, FiCheckCircle, FiAlertCircle, FiInfo, FiLoader, FiCheck, FiX, FiPhone } from "react-icons/fi";
import { GalleryVerticalEnd, Bookmark, BookmarkCheck } from "lucide-react";

import { RequestStatus } from "@prisma/client";
import { formatDateTime } from "@/helper/getDate";


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

type userRequestCardPropType = {
  request: { id: string, createdAt:Date, updatedAt:Date, car: car, status: RequestStatus };
  userSavedCars?: {car: car}[];
  refetchRequests: any
  isFetching: boolean;
}

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

const calculateReservationFee = (pricePerDay: number, reservationFeePercentage: number) => {
  const reservationFee: number = (pricePerDay * (reservationFeePercentage / 100));
  const { formattedValue } = formatPrice(reservationFee);
  return formattedValue;
};

const UserRequestCard = ({ request, refetchRequests, userSavedCars, isFetching }: userRequestCardPropType) => {
  const [saved, setSaved] = useState(false);

  const { id:car_id, title, gallery: { id:galleryId, name, image, phone_numbers, city: { name_en:city_name_en, province: { name_en:province_name_en } }, is_verified }, images, model: { name: modelName, brand: { name: brandName }}, build_year:{year}, category, fuel_type, car_seat, for_rent, for_sale, is_car_rented, description } = request.car;

  const { status } = request;

  const { mutate, data, isSuccess, isPending, isError, error }: saveORUnSaveCarHookType = useSaveORUnSaveCar();

  const { mutate:deleteRequest, data:dataDeleteRequest, isSuccess: isSuccessDeleteRequest, isPending:isLoadingDeleteRequest, isError:isErrorDeleteRequest, error:errorDeleteRequest } = useDeleteRentRequest();

  useEffect(()=> {
    isSuccess === true && data?.message && (toast.success(data.message));
    isError === true && error && toast.error(error?.response.data.error);
  }, [isSuccess, isError])

  useEffect(()=> {
    if (isSuccessDeleteRequest) {
      refetchRequests();
    }
    if(isErrorDeleteRequest && errorDeleteRequest) {
      refetchRequests();
    }
    isSuccessDeleteRequest === true && dataDeleteRequest?.message && (toast.success(dataDeleteRequest.message));
    //@ts-ignore
    isErrorDeleteRequest === true && errorDeleteRequest && toast.error(errorDeleteRequest?.response.dataDeleteRequest.error);
  }, [isSuccessDeleteRequest, isErrorDeleteRequest])

  useEffect(()=> {
    if (data) {
      setSaved(data?.saved);
    }
  }, [data, userSavedCars])

  useEffect(() => {
    const isCarSaved = userSavedCars?.some(savedCar => savedCar.car.id === car_id);

    if (isCarSaved) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [])


  return (
    <Dialog>
      <div className="relative flex flex-col justify-start h-full w-full border bg-white rounded-md cursor-pointer transition-color overflow-hidden px-2 pb-2">
      <DialogTrigger asChild>
          <div className="bg-white rounded-md w-full py-2">
            <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
              <div className="w-full h-[180px] max-w-[316px]">
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-md !p-0">
                  <Image src={images.length > 0 ? images[0].url : `${assetsBucketUrl}default-car-image.png`} quality={100} className="rounded-md object-cover" alt={`car_image_cover_${title}`} fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)" placeholder="blur" blurDataURL={images.length > 0 ? images[0].url : `${assetsBucketUrl}default-car-image.png`}/>
                  <div className="flex absolute top-2 right-2 gap-2">
                    {saved && <BookmarkCheck size={28} className="py-1 px-1.5 bg-muted rounded"/>}
                    {images.length > 1 && <GalleryVerticalEnd size={28} className="py-1 px-1.5 bg-muted rounded"/>} 
                  </div>
                </AspectRatio>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold mt-1">{title}</h4>
                  {status === "PENDING" && (
                    <Badge variant={"outline"} className="gap-1.5 py-2"><FiLoader size={16}/> Pending Request</Badge>
                  )}
                  {status === "ACCEPTED" && (<Badge variant={"outline"} className="text-success border-success gap-1.5 py-2"><FiCheck size={16}/> Accepted Request</Badge>)}
                  {status === "DECLINED" && (<Badge variant={"outline"} className="text-destructive border-destructive gap-1.5 py-2"><FiX size={16}/> Declined Request</Badge>)}
                </div>
                <div className="flex gap-1">
                  <Badge variant={"secondary"} className="border rounded-md">{modelName} - {brandName}</Badge>
                  <Badge variant={"secondary"} className="border rounded-md">{year}</Badge>
                  <Badge variant={"secondary"} className="border rounded-md">
                    {category.category}&nbsp;
                    {category.abbreviation && (
                      <p className="text-gray-400 inline">
                        - {category.abbreviation}
                      </p>
                    )}
                  </Badge>
                </div>
                {is_car_rented.length > 0 ? (
                  <Badge variant="destructive" className="!block !rounded-md w-fit hover:!bg-destructive">
                    Not available
                  </Badge>
                ) : (
                  for_rent && (
                    <Badge className="!block bg-success !rounded-md w-fit hover:!bg-success">Available</Badge>
                  )
                )}
                {for_rent && (
                  <div className="flex flex-wrap w-full justify-evenly bg-white rounded-md gap-3 !mt-2">
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
      </DialogTrigger>
        {status === "ACCEPTED" && (
          <>
            <Separator className="my-4"/>
            <div className="flex flex-col items-start p-3 bg-white border border-success rounded-md gap-1.5 w-full cursor-text">
              <div className="flex items-center justify-between w-full">
                <h4 className="inline-flex items-center text-success text-base font-medium gap-1.5"><FiCheckCircle size={20}/>Your Request Accepted</h4>
                <h4 className="text-muted-foreground text-xs">Request accepted on <span className="underline">{formatDateTime(request.updatedAt)}</span></h4>
              </div>
              <h4 className="text-sm mt-1">Contact with auto gallery to continue</h4>
              <div className="flex flex-col flex-grow w-full border px-3 py-5 rounded-md gap-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage alt="agent_avatar" src={image?.url ?? undefined}/>
                      <AvatarFallback>{avatarFallBackText(name, null)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-base font-bold">
                      {name}
                    </h2>
                  </div>
                  {is_verified ? (
                    <Badge><FiCheckCircle size={16} className="me-1.5"/> Verified</Badge>
                  ) : (
                    <Badge variant="destructive"><FiAlertCircle size={16} className="me-1.5"/> Not Verified</Badge>
                  )}
                </div>
                <h4 className="text-xs text-muted-foreground font-semibold">Phone numbers: </h4>
                <div className="flex flex-wrap flex-col w-fit sm:grid grid-cols-3 justify-between gap-x-3 gap-y-5">
                  {phone_numbers.map((phoneNumber) => (
                    <div key={phoneNumber.id} className="flex items-center bg-secondary py-1 px-0.5 rounded-md gap-1.5">
                      <FiPhone size={32} className="px-2 py-1 ms-1 justify-center inline-flex items-center text-center bg-gray-50 hover:bg-zinc-100 ease-out duration-200 rounded-md outline-none transition-all outline-0 border shadow-sm text-xs" />
                      <h4 className="text-sm me-1">{formatPhoneNumber(phoneNumber.number)}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        {status === "PENDING" && (
          <>
            <Separator className="my-4"/>
            <div className="flex justify-center w-full">
              <Button onClick={() => deleteRequest({ request_id: request.id, car_id: car_id, auto_gallery_id: galleryId })} isLoading={isLoadingDeleteRequest} disabled={isLoadingDeleteRequest || isSuccessDeleteRequest || isFetching} variant={"destructive"} className="gap-1">{!isLoadingDeleteRequest && <FiX size={16}/>} {isLoadingDeleteRequest ? "Canceling" : isSuccessDeleteRequest ? "Canceled"  : "Cancel"}</Button>
            </div>
          </>
        )} 
      </div>
      <DialogContent className="SLaptop:max-w-[1000px] STablet:max-w-[580px] LPhone:max-w-[420px] phone:max-w-[360px] max-w-[320px] pe-0">
        <DialogHeader>
          <DialogTitle>Car details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="relative w-full h-96">
          <div className="SLaptop:flex SLaptop:gap-6">
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="SLaptop:!sticky SLaptop:top-0 SLaptop:max-w-[420px] STablet:max-w-[532px] LPhone:max-w-[372px] phone:max-w-[316px] max-w-[272px] !mx-0 mb-2"
            >
              {images.length > 0 ? images.map((image, index) => (
                <SwiperSlide key={image.id}>
                  <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
                    <Image src={image.url} alt={`car_image_${index+1}`} quality={100} className="rounded-md object-cover" fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)"/>
                  </AspectRatio>
                </SwiperSlide>
              )) : (
                <SwiperSlide>
                  <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
                    <Image src={`${assetsBucketUrl}default-car-image.png`} alt={"default_car_image"} quality={100} className=" rounded-md object-cover" fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)"/>
                  </AspectRatio>
                </SwiperSlide>
              )}
            </Swiper>
            <div className="flex flex-col w-full items-start gap-3 pe-5">
              <div className="flex items-start justify-between w-full !mb-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold">
                    {title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge variant={"secondary"} className="w-fit rounded-md">{brandName} - {modelName}</Badge>
                    <Badge variant={"secondary"} className="w-fit rounded-md">{year}</Badge>
                    <Badge variant={"secondary"} className="items-start w-fit rounded-md">
                      {category.category}&nbsp;
                      {category.abbreviation && (
                        <p className="text-gray-400 inline">
                          - {category.abbreviation}
                        </p>
                      )}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {for_rent && is_car_rented.length > 0 ? (
                    <Badge variant="destructive" className="rounded-md w-fit ms-4 hover:!bg-destructive">
                      Not available
                    </Badge>
                  ) : (
                    for_rent && (
                      <Badge className="bg-success !rounded-md w-fit hover:!bg-success min-h-[32px]">Available</Badge>
                    )
                  )}
                  {saved ? (
                    <Button isLoading={isPending} onClick={() => mutate({ car_id: car_id, action: "UNSAVE" })} variant={"outline"} size={"sm"}>{isPending ? "" : <BookmarkCheck size={16} className="me-1"/>}{isPending ? "Unsaving" : "Saved"}</Button>
                  ) : (
                    <Button isLoading={isPending} onClick={() => mutate({ car_id: car_id, action: "SAVE" })} variant={"outline"} size={"sm"}>{isPending ? "" : <Bookmark size={16} className="me-1"/>}{isPending ? "Saving" : "Save"}</Button>
                  )}
                </div>
              </div>
              {for_rent && (
                <>
                  <div className="flex flex-wrap w-full justify-evenly bg-white rounded-md gap-3 p-3">
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
                      <h3 className="text-lg font-bold">{calculateReservationFee(for_rent.price_per_day, for_rent.reservation_fee_percentage)}</h3>
                    </div>
                  </div>
                  {for_rent.extra_time && for_rent?.late_return_fee_per_hour && (
                    <div className="flex flex-col w-full flex-grow bg-orange-300 p-3 rounded-md">
                      <h3 className="text-sm font-bold mb-2">Extra Time</h3>
                      <h4 className="text-xs font-semibold">Late return fee per hour: </h4>
                      <FormattedLateReturnPrice price={for_rent.reservation_fee_percentage} className="text-lg"/>
                      <h5 className="text-xs text-orange-800 inline-flex items-center gap-1 mt-2"><FiInfo size={16} />This is a penalty in case you return car late.</h5>
                    </div>
                  )}
                  <div className="flex flex-col flex-wrap w-full justify-evenly bg-white rounded-md gap-3 p-3">
                    <h3 className="inline-flex items-center gap-1 text-sm text-muted-foreground font-semibold"><FiMapPin size={16}/>{city_name_en}, {province_name_en}</h3>
                    <div className="flex flex-col flex-grow">
                      <h4 className="text-xs text-muted-foreground font-semibold">Pick up location: </h4>
                      <h3 className="font-bold">{for_rent.pick_up_place}</h3>
                    </div>
                    <Separator />
                    <div className="flex flex-col flex-grow">
                      <h4 className="text-xs text-muted-foreground font-semibold">Drop off location: </h4>
                      <h3 className="font-bold">{for_rent.drop_off_place}</h3>
                    </div>
                  </div>
                </>
              )}
              <div className="flex flex-wrap w-full justify-evenly bg-white rounded-md gap-3 p-3">
                <div className="flex flex-col flex-grow">
                  <h4 className="text-xs text-muted-foreground font-semibold">Fuel Type: </h4>
                  <h3 className="text-lg font-bold">{fuel_type.type}</h3>
                </div>
                <div className="flex flex-col flex-grow">
                  <h4 className="text-xs text-muted-foreground font-semibold">Car Seats: </h4>
                  <h3 className="text-lg font-bold">{car_seat.seats_count} seats</h3>
                </div>
                {for_sale && (
                  <div className="flex flex-col flex-grow gap-1">
                    <h4 className="text-xs text-muted-foreground font-semibold">Color: </h4>
                    <div className="flex items-center">
                      <span className="w-4 h-4 rounded-full border border-muted me-1.5" style={{backgroundColor: `${for_sale?.color.color_code}`}}></span>
                      <h5 className="text-muted-foreground text-xs">{for_sale?.color.color_name}</h5>
                    </div>
                  </div>
                )}
              </div>
              {description && (
                <>
                  <div className="flex flex-col flex-grow mb-2">
                    <h4 className="text-xs text-muted-foreground font-semibold">Description: </h4>
                    <h3 className="text-sm font-bold">{description}</h3>
                  </div>
                  <Separator className="my-2"/>
                </>
              )}
              <h3 className="text-sm text-muted-foreground font-bold">From auto gallery:</h3>
              <Link href={`/gallery/${galleryId}`} className="flex flex-col flex-grow w-full bg-primary px-3 py-5 rounded-md gap-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage alt="agent_avatar" src={image?.url ?? undefined}/>
                      <AvatarFallback>{avatarFallBackText(name, null)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-base text-white font-bold">
                      {name}
                    </h2>
                  </div>
                  {is_verified ? (
                    <Badge><FiCheckCircle size={16} className="me-1.5"/> Verified</Badge>
                  ) : (
                    <Badge variant="destructive"><FiAlertCircle size={16} className="me-1.5"/> Not Verified</Badge>
                  )}
                </div>
                <h4 className="text-xs text-muted-foreground font-semibold mb-1">Phone numbers: </h4>
                <div className="flex flex-wrap flex-col w-full sm:grid grid-cols-3 justify-between gap-x-3 gap-y-5">
                  {phone_numbers.map((phone_number, index) => (
                    <h5 key={phone_number.id} className="text-white text-sm font-semibold col-span-1">
                      <span className="py-1 px-1.5 text-muted-foreground border border-muted-foreground rounded-md">{index+1}</span>
                      {" "}-{" "}
                      {formatPhoneNumber(phone_number.number)}
                    </h5>
                  ))}
                </div>
              </Link>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="me-6 STablet:items-end pt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="">
              Close
            </Button>
          </DialogClose>
          <div className="flex-col w-full">
            {for_rent && (
              <Badge variant={"secondary"} className="mb-2 text-base rounded-md">Reservation Fee&nbsp;<span className="text-black font-bold">{calculateReservationFee(for_rent.price_per_day, for_rent.reservation_fee_percentage)}</span></Badge>
            )}
            {status === "ACCEPTED" && (
              <Button type="button" className="w-full bg-success hover:bg-success">
                Request Accepted
              </Button>
            )} 
            {status === "PENDING" && (
              <Button disabled type="button" variant="secondary" className="w-full gap-1.5">
                <FiLoader size={16}/>
                Pending Rent Request
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UserRequestCard