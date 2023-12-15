import Image from "next/image"
import formatPrice from "@/helper/formatPrice";
import { Badge } from "@/ui/badge"
import { AspectRatio } from "@/ui/aspect-ratio"
import { Separator } from "@/ui/separator";
import { Button } from "@/ui/button";

import { Fuel } from "lucide-react";
import { FiUsers } from "react-icons/fi";


type car = {
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

type carCardPropType = {
  car: car
}

const FormattedRentPrice = ({ price }: {price: number}) => {
  const { formattedValue } = formatPrice(price);
  return (
    <h3 className="flex gap-1 items-center text-xl font-bold">{formattedValue} <span className="text-base text-muted-foreground">/day</span></h3>
  )
}

const CarCard = ({ car }: carCardPropType) => {
  const { id, title, images, category, fuel_type, car_seat, for_rent, is_car_rented, description } = car;
  return (
    <div className="relative flex flex-col justify-start h-fit w-full border bg-white rounded-md pb-2 space-y-2 overflow-hidden">
      <div className="w-full min-h-[160px]">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-t-md">
          <Image src={images[0].url} quality={100} className="rounded-t-md object-cover" alt={`car_image_cover_${title}`} fill sizes="(min-width: 2180px) 241px, (min-width: 1820px) calc(5vw + 133px), (min-width: 1460px) calc(22.06vw - 98px), (min-width: 1100px) calc(33.24vw - 143px), (min-width: 1040px) calc(67.5vw - 283px), (min-width: 840px) calc(50vw - 196px), (min-width: 780px) calc(100vw - 378px), (min-width: 400px) 237px, calc(18.75vw + 166px)" placeholder="blur" blurDataURL={images[0].url}/>
        </AspectRatio>
      </div>
      <div className="flex items-center justify-between p-4 py-2">
        <div className="space-y-2">
          <h4 className="flex items-center text-xl font-semibold">
            {title}
            {is_car_rented.length > 0 ? (
              <Badge variant="destructive" className="!rounded-md w-fit ms-4">Not available</Badge>
            ) : (
              <Badge className="bg-success !rounded-md w-fit ms-4">Available</Badge>
            )}
          </h4>
          <Badge variant="secondary" className="!rounded-md">{category.category}</Badge>
        </div>
        <FormattedRentPrice price={for_rent.price_per_day}/>
      </div>
      {description && (<p className="text-xs text-muted-foreground w-full overflow-hidden overflow-ellipsis whitespace-nowrap h-4 px-4">{description}</p>)}
      <Separator />
      <div className="flex items-center justify-around px-2">
        <h5 className="flex items-center text-sm"><Fuel size={16} className="me-1.5 inline"/>{fuel_type.type}</h5>
        <h5 className="flex items-center text-sm"><FiUsers size={16} className="me-1.5 inline"/>{car_seat.seats_count} Seats</h5>
      </div>
      <Button disabled={is_car_rented.length > 0 ? true : false} className="mx-4 !mt-4 bg-blue-600 hover:bg-blue-500">Rent Car</Button>
    </div>
  )
}

export default CarCard