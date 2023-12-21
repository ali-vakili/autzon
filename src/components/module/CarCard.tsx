"use client"

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

import { FiUsers, FiMapPin, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { Fuel, GalleryVerticalEnd, Bookmark, BookmarkCheck } from "lucide-react";


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

type carCardPropType = {
  car: car
  userSavedCars?: {car: car}[];
  savedCarsRefetch?: any;
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

const formatMileage = (mileage: number) => {
  const formattedValue = mileage.toLocaleString('en-US', {
    style: 'unit',
    unit: 'kilometer',
  });

  return formattedValue;
}

const calculateReservationFee = (pricePerDay: number, reservationFeePercentage: number) => {
  const reservationFee: number = (pricePerDay * (reservationFeePercentage / 100));
  const { formattedValue } = formatPrice(reservationFee);
  return formattedValue;
};

const CarCard = ({ car, userSavedCars, savedCarsRefetch }: carCardPropType) => {
  const [saved, setSaved] = useState(false);
  const { id, title, gallery: { id:galleryId, name, image, phone_numbers, city: { name_en:city_name_en, province: { name_en:province_name_en } }, is_verified }, images, model: { name: modelName, brand: { name: brandName }}, build_year:{year}, category, fuel_type, car_seat, for_rent, for_sale, is_car_rented, description } = car;

  const { mutate, data, isSuccess, isLoading, isError, error }: saveORUnSaveCarHookType = useSaveORUnSaveCar();

  useEffect(()=> {
    isSuccess === true && data?.message && (toast.success(data.message));
    isError === true && error && toast.error(error?.response.data.error);
  }, [isSuccess, isError])

  useEffect(()=> {
    if (data) {
      setSaved(data?.saved);
    }
    savedCarsRefetch && savedCarsRefetch();
  }, [data, userSavedCars])

  useEffect(() => {
    const isCarSaved = userSavedCars?.some(savedCar => savedCar.car.id === id);
    if (isCarSaved) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative flex flex-col justify-start h-full w-full border bg-white rounded-md pb-2 space-y-2 cursor-pointer transition-color overflow-hidden">
          <div className="w-full min-h-[160px]">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-t-md">
              <Image src={images.length > 0 ? images[0].url : `${assetsBucketUrl}default-car-image.png`} quality={100} className="rounded-t-md object-cover" alt={`car_image_cover_${title}`} fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)" placeholder="blur" blurDataURL={images.length > 0 ? images[0].url : `${assetsBucketUrl}default-car-image.png`}/>
              <div className="flex absolute top-2 right-2 gap-2">
                {saved && <BookmarkCheck size={28} className="py-1 px-1.5 bg-muted rounded"/>}
                {images.length > 1 && <GalleryVerticalEnd size={28} className="py-1 px-1.5 bg-muted rounded"/>} 
              </div>
            </AspectRatio>
          </div>
          <div className="flex items-center justify-between p-4 py-2">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold gap-x-3">
                {title}
              </h4>
              {for_rent && is_car_rented.length > 0 ? (
                <Badge variant="destructive" className="!block !rounded-md w-fit ms-4 hover:!bg-destructive">
                  Not available
                </Badge>
              ) : (
                for_rent && (
                  <Badge className="!block bg-success !rounded-md w-fit hover:!bg-success">Available</Badge>
                )
              )}
              <Badge variant="secondary" className="!rounded-md">{category.category}</Badge>
            </div>
            {for_rent && <FormattedRentPrice price={for_rent.price_per_day} type={"RENT"}/>}
            {for_sale && <FormattedRentPrice price={for_sale.price} type={"SALE"}/>}
          </div>
          {for_sale && (
            <div className="flex items-center ms-4">
              <span className="w-4 h-4 rounded-full border border-muted me-1.5" style={{backgroundColor: `${for_sale?.color.color_code}`}}></span>
              <h5 className="text-muted-foreground text-xs">{for_sale?.color.color_name}</h5>
            </div>
            )}
          {description && (<p className="text-xs text-muted-foreground w-full overflow-hidden overflow-ellipsis whitespace-nowrap h-4 px-4 !mb-2">{description}</p>)}
          <Separator className="!mt-auto"/>
          <div className="flex items-center justify-around px-2">
            <h5 className="flex items-center text-sm"><Fuel size={16} className="me-1.5 inline"/>{fuel_type.type}</h5>
            <h5 className="flex items-center text-sm"><FiUsers size={16} className="me-1.5 inline"/>{car_seat.seats_count} Seats</h5>
          </div>
        </div>
      </DialogTrigger>
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
                      <Badge className="bg-success !rounded-md w-fit hover:!bg-success">Available</Badge>
                    )
                  )}
                  {saved ? (
                    <Button isLoading={isLoading} onClick={() => mutate({ car_id: id, action: "UNSAVE" })} variant={"outline"} size={"sm"}>{isLoading ? "" : <BookmarkCheck size={16} className="me-1"/>}{isLoading ? "Unsaving" : "Saved"}</Button>
                  ) : (
                    <Button isLoading={isLoading} onClick={() => mutate({ car_id: id, action: "SAVE" })} variant={"outline"} size={"sm"}>{isLoading ? "" : <Bookmark size={16} className="me-1"/>}{isLoading ? "Saving" : "Save"}</Button>
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
                      <h4 className="text-xs text-muted-foreground font-semibold">Drop Off location: </h4>
                      <h3 className="font-bold">{for_rent.drop_off_place}</h3>
                    </div>
                  </div>
                </>
              )}
              {for_sale && (
                <div className="flex flex-wrap w-full justify-evenly bg-white rounded-md gap-3 p-3">
                  <div className="flex flex-col flex-grow">
                    <h4 className="text-sm text-muted-foreground font-semibold">Price: </h4>
                    <FormattedRentPrice price={for_sale.price} type={"SALE"} className="text-lg font"/>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h4 className="text-sm text-muted-foreground font-semibold">Mileage: </h4>
                    <h3 className="text-lg font-bold">{formatMileage(for_sale.mileage)}</h3>
                  </div>
                </div>
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
              <div className="flex flex-col flex-grow w-full bg-primary px-3 py-5 rounded-md gap-2">
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
                <div className="flex flex-wrap w-full justify-between gap-3">
                  {phone_numbers.map((phone_number, index) => (
                    <h5 key={phone_number.id} className="text-white text-sm font-semibold">
                      <span className="py-1 px-1.5 text-muted-foreground border border-muted-foreground rounded-md">{index+1}</span>
                      {" "}-{" "}
                      {formatPhoneNumber(phone_number.number)}
                    </h5>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="me-6 STablet:items-end pt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="">
              Close
            </Button>
          </DialogClose>
          {for_rent && (
            <div className="flex-col w-full">
              <Badge variant={"secondary"} className="mb-2 text-base rounded-md">Reservation Fee&nbsp;<span className="text-black font-bold">{calculateReservationFee(for_rent.price_per_day, for_rent.reservation_fee_percentage)}</span></Badge>
              <Button type="button" variant="default" className="w-full">
                Send Rent Request
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CarCard