import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "../ui/button";
import { Separator } from "@/components/ui/separator";

import { FiUsers, FiEdit } from "react-icons/fi";
import { Fuel } from 'lucide-react';
import { cn } from "@/lib/utils";


type viewTo = "AGENT" | "USER";


type ImageBadgeProps = {
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
};

const ImageBadge = ({ viewTo, isPublished, for_rent, for_sale }: ImageBadgeProps) => (
  <div className="absolute right-2 bottom-2 z-20 space-x-1">
    {viewTo === "AGENT" && (
      isPublished ? (
        <Badge variant="default">Published</Badge>
      ) : (
        <Badge variant="destructive">Unpublished</Badge>
      )
    )}
    {for_rent && <Badge variant="outline" className="text-blue-500 bg-white border-blue-500">Rental</Badge>}
    {for_sale && <Badge variant="outline" className="text-green-500 bg-white border-green-500">Sale</Badge>}
  </div>
);


type ImageSectionProps = {
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
};

const ImageSection = ({ title, images, viewTo, isPublished, for_rent, for_sale }: ImageSectionProps) => (
  <div className="relative w-full h-40">
    <ImageBadge viewTo={viewTo} isPublished={isPublished} for_rent={for_rent} for_sale={for_sale} />
    <Image src={images[0].url} quality={100} className="rounded-md object-cover" alt={`car_image_cover_${title}`} fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)" placeholder="blur" blurDataURL={images[0].url}/>
  </div>
);


type DetailsSectionProps = {
  title: string;
  category: { category: string };
  price: string | undefined;
};

const DetailsSection = ({ title, category, price }: DetailsSectionProps) => (
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <h3 className="text-base font-medium">{title}</h3>
      <Badge variant="secondary" className="!rounded-md">{category.category}</Badge>
    </div>
    <h4 className="flex gap-1 items-center font-semibold">${price} <span className="text-sm text-muted-foreground">/day</span></h4>
  </div>
);


type AdditionalInfoSectionProps = {
  fuelType: string;
  seatCount: string;
};

const AdditionalInfoSection = ({ fuelType, seatCount }: AdditionalInfoSectionProps) => (
  <div className="flex items-center justify-around">
    <h5 className="flex items-center text-sm"><Fuel size={16} className="me-1.5 inline"/>{fuelType}</h5>
    <h5 className="flex items-center text-sm"><FiUsers size={16} className="me-1.5 inline"/>{seatCount} Seats</h5>
  </div>
);


type EditLinkProps = {
  viewTo: viewTo;
  id: string;
};

const EditLink = ({ viewTo, id }: EditLinkProps) => (
  viewTo === 'AGENT' && (
    <Link href={`/dashboard/cars/rental/edit/${id}`} className={`${buttonVariants({ variant: 'default' })} !mt-4`}>
      <FiEdit size={16} className="me-1.5"/>Edit Car
    </Link>
  )
);


type carCardPropType = {
  view_to: viewTo;
  car: {
    id: string;
    title: string;
    is_published: boolean;
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

const CarCard = ({ car, view_to }: carCardPropType) => {
  const { id, title, images, category, fuel_type, car_seat, for_rent, for_sale, is_published, is_car_rented } = car;

  return (
    <div className={cn("relative flex flex-col justify-start h-fit max-h-[340px] w-full border bg-white rounded-md p-2 space-y-2")}>
      <ImageSection
        title={title}
        images={images}
        viewTo={view_to}
        isPublished={is_published}
        for_rent={for_rent}
        for_sale={for_sale}
      />

      <DetailsSection
        title={title}
        category={category}
        price={for_rent ? for_rent.price_per_day.toFixed(2) : for_sale?.price.toFixed(2)}
      />

      <Separator />

      <AdditionalInfoSection
        fuelType={fuel_type.type}
        seatCount={car_seat.seats_count}
      />

      <EditLink viewTo={view_to} id={id} />
    </div>
  )
}

export default CarCard