"use client"

import Link from "next/link";
import Image from "next/image";
import formatPrice from "@/helper/formatPrice";
import DeleteDialog from "./DeleteDialog";
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio"

import { FiUsers, FiEdit } from "react-icons/fi";
import { Fuel } from 'lucide-react';

import { useDeleteCar, deleteCarHookType } from "@/hooks/useDeleteCar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/button";


type viewTo = "AGENT" | "USER";


type ImageBadgeProps = {
  id: string;
  viewTo: viewTo;
  title: string;
  isPublished?: boolean;
  for_rent: {
    id: string;
    price_per_day: number;
    extra_time: boolean;
  } | null;
  for_sale: {
    id: string;
    price: number;
  } | null;
  refetchCarData : () => void;
};

const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return { isOpen, openDialog, closeDialog };
};

const ImageBadge = ({ id, title, viewTo, isPublished, for_rent, for_sale, refetchCarData }: ImageBadgeProps) => {
  const { mutate: deleteCar, data, isSuccess, isLoading, isError, error }: deleteCarHookType = useDeleteCar();
  const { isOpen, openDialog, closeDialog } = useDialog();

  useEffect(() => {
    if (isSuccess && data?.message) {
      toast.success(data.message);
      refetchCarData();
      closeDialog();
    } else if (isError && error) {
      toast.error(error?.response.data.error);
    }
  }, [isSuccess, isError]);

  return (
    <>
      <div className="absolute right-2 top-2 z-20">
        <DeleteDialog
          isOpen={isOpen}
          closeDialog={closeDialog}
          onDelete={() => deleteCar(id)}
          openDialog={openDialog}
          isLoading={isLoading}
          title={title}
          subText="Are you sure you want to delete the car?"
        />
      </div>
      <div className="absolute right-2 bottom-2 z-20 space-x-1">
        {viewTo === "AGENT" && (
          isPublished ? (
            <Badge variant="default">Published</Badge>
          ) : (
            <Badge variant="destructive">Unpublished</Badge>
          )
        )}
        {for_rent && <Badge variant="outline" className="text-white bg-blue-600 border-blue-700">Rental</Badge>}
        {for_sale && <Badge variant="outline" className="text-white bg-green-600 border-green-700">Sale</Badge>}
      </div>
    </>
  )
};


type ImageSectionProps = {
  id: string
  title: string
  images: {
    id: string;
    url: string;
  }[];
  viewTo: viewTo;
  isPublished?: boolean;
  for_rent: {
    id: string;
    price_per_day: number;
    extra_time: boolean;
  } | null;
  for_sale: {
    id: string;
    price: number;
  } | null;
  refetchCarData : () => void;
};

const ImageSection = ({ id, title, images, viewTo, isPublished, for_rent, for_sale, refetchCarData }: ImageSectionProps) => (
  <div className="w-full min-h-[160px]">
    <AspectRatio ratio={16 / 9} className="bg-muted rounded-t-md">
      <ImageBadge id={id} title={title} viewTo={viewTo} isPublished={isPublished} for_rent={for_rent} for_sale={for_sale} refetchCarData={refetchCarData}/>
      <Image src={images[0].url} quality={100} className="rounded-t-md object-cover" alt={`car_image_cover_${title}`} fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)" placeholder="blur" blurDataURL={images[0].url}/>
    </AspectRatio>
  </div>
);


type RentalCarDetailsSectionProps = {
  title: string;
  category: { category: string };
  price: string | undefined;
};

const RentalCarDetailsSection = ({ title, category, price }: RentalCarDetailsSectionProps) => {
  const { formattedValue } = formatPrice(price!);
  return(
    <div className="flex items-center justify-between px-2">
      <div className="space-y-1">
        <h4 className="text-base font-medium">{title}</h4>
        <Badge variant="secondary" className="!rounded-md">{category.category}</Badge>
      </div>
      <h3 className="flex gap-1 items-center font-bold">{formattedValue} <span className="text-sm text-muted-foreground">/day</span></h3>
    </div>
  )
};


type SaleCarDetailsSectionProps = {
  title: string;
  category: { category: string };
  price: string | undefined;
  color: {
    id: number,
    color_name: string,
    color_code: string
  }
};

const SaleCarDetailsSection = ({ title, category, price, color }: SaleCarDetailsSectionProps) => {
  const { formattedValue } = formatPrice(price!);
  const { color_name, color_code } = color;
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h4 className="text-base font-medium">{title}</h4>
          <Badge variant="secondary" className="!rounded-md">{category.category}</Badge>
        </div>
        <h3 className="flex gap-1 items-center font-bold">{formattedValue}</h3>
      </div>
      <div className="flex items-center px-2 !mt-3">
        <span className="w-4 h-4 rounded-full border border-muted me-1.5" style={{backgroundColor: `${color_code}`}}></span>
        <h5 className="text-muted-foreground text-xs">{color_name}</h5>
      </div>
    </>
  )
};


type AdditionalInfoSectionProps = {
  fuelType: string;
  seatCount: string;
};

const AdditionalInfoSection = ({ fuelType, seatCount }: AdditionalInfoSectionProps) => (
  <div className="flex items-center justify-around px-2">
    <h5 className="flex items-center text-sm"><Fuel size={16} className="me-1.5 inline"/>{fuelType}</h5>
    <h5 className="flex items-center text-sm"><FiUsers size={16} className="me-1.5 inline"/>{seatCount} Seats</h5>
  </div>
);


type EditLinkProps = {
  viewTo: viewTo;
  id: string;
  forCarLink: string;
  disabled: boolean
};

const EditLink = ({ viewTo, id, forCarLink, disabled }: EditLinkProps) => (
  viewTo === 'AGENT' && (
    disabled ? (
      <Button disabled className="!mt-4 mx-2">
        <FiEdit size={16} className="me-1.5"/>Edit Car
      </Button>
    ) : (
      <Link href={`/dashboard/cars/${forCarLink}/edit/${id}`} className={`${buttonVariants({ variant: 'default' })} !mt-4 mx-2`}>
        <FiEdit size={16} className="me-1.5"/>Edit Car
      </Link>
    )
  )
);


type carCardPropType = {
  view_to: viewTo;
  forCard: "RENTAL" | "SALE" | "NONE";
  isFetching: boolean;
  refetchCarData : () => void;
  car: {
    id: string;
    title: string;
    is_published: boolean;
    description: string;
    car_seat: {
      seats_count: string;
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
      price_per_day: number;
      extra_time: boolean;
    } | null;
    for_sale: {
      id: string;
      price: number;
      color: {
        id: number,
        color_name: string,
        color_code: string
      }
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
  }
}

const AgentCarCard = ({ car, view_to, forCard, isFetching, refetchCarData }: carCardPropType) => {
  const { id, title, images, category, fuel_type, car_seat, for_rent, for_sale, is_published, is_car_rented, description } = car;
  return (
    <div className="relative flex flex-col justify-start h-full w-full border bg-white rounded-md pb-2 space-y-2 overflow-hidden">
      <ImageSection
        id={id}
        title={title}
        images={images}
        viewTo={view_to}
        isPublished={is_published}
        for_rent={for_rent}
        for_sale={for_sale}
        refetchCarData = {refetchCarData}
      />
      
      {forCard === "RENTAL" && for_rent && (
        <RentalCarDetailsSection
          title={title}
          category={category}
          price={for_rent.price_per_day.toFixed(2)}
        />
      )}

      {forCard === "SALE" && for_sale && (
        <SaleCarDetailsSection
          title={title}
          category={category}
          price={for_sale.price.toFixed(2)}
          color={for_sale.color}
        />
      )}

      {description && (<p className="text-xs text-muted-foreground w-full overflow-hidden overflow-ellipsis whitespace-nowrap h-4 !mt-3 !mb-2 px-2">{description}</p>)}

      <Separator className="!mt-auto"/>

      <AdditionalInfoSection
        fuelType={fuel_type.type}
        seatCount={car_seat.seats_count}
      />

      <EditLink viewTo={view_to} id={id} disabled={isFetching} forCarLink={forCard === "RENTAL" ? "rental" : forCard === "SALE" ? "sale" : ""}/>
    </div>
  )
}

export default AgentCarCard