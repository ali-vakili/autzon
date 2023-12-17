import Link from "next/link";
import formatPhoneNumber from "@/helper/formatPhoneNumber";
import { sessionUser } from "@/lib/types/sessionUserType";
import { DefaultSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { avatarFallBackText } from "@/helper/fallBackText";
import { buttonVariants } from "@/components/ui/button";
import { getCreatedAndJoinDate } from "@/helper/getDate";
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FiUser, FiAlertCircle, FiCheckCircle, FiEdit, FiPhone, FiMapPin, FiInfo } from "react-icons/fi";
import { Building, Blocks, Car, CalendarPlus } from 'lucide-react';


type galleryPropType = {
  agent: sessionUser & DefaultSession,
  gallery: {
    id: string;
    name: string;
    address: string;
    about: string | null;
    image: {
      id: string;
      url: string;
    } | null;
    categories: {
      id: number;
      category: string;
      abbreviation: string | null;
    }[];
    phone_numbers: {
      id: string;
      number: string
    }[];
    city: {
      name_en: string;
      province: {
        name_en: string;
      };
    };
    cars: {
      for_rent: {
        id: string;
      } | null;
      for_sale: {
        id: string;
      } | null;
    }[];
    is_verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    agent: {
      phone_number: string | null;
    };
  }
}


const Gallery = ({ gallery, agent }: galleryPropType) => {
  const { agent: galleryAgent, image, name, is_verified: isGalleryVerified, address, city: { name_en: city_name_en, province:{name_en: province_name_en} }, categories, phone_numbers, about, cars, createdAt, updatedAt } = gallery
  const { email, firstName, lastName ,profile, join_date, is_verified } = agent;
  const joined_date = getCreatedAndJoinDate(join_date);
  const gallery_created_at = getCreatedAndJoinDate(createdAt);

  return (
    <div className="flex flex-col items-start md:grid grid-cols-3 gap-6">
      <div className="flex flex-col w-full lg:col-span-2 col-span-3 bg-white rounded-md p-5 space-y-5">
        <h2 className="flex items-center text-sm font-semibold text-muted-foreground self-start"><Building size={28} className="bg-gray-100 rounded p-1.5 me-1.5" />Gallery Details</h2>
        <div className="flex items-center space-x-4">
          <Avatar className="w-32 h-32">
            <AvatarImage alt="agent_avatar" src={image?.url ?? undefined}/>
            <AvatarFallback>{avatarFallBackText(name, null)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start space-y-2">
            <h2 className="text-xl font-bold">
              {name}
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {isGalleryVerified ? (
                    <Badge><FiCheckCircle size={16} className="me-1.5"/> Verified</Badge>
                  ) : (
                    <Badge variant="destructive"><FiAlertCircle size={16} className="me-1.5"/> Not Verified</Badge>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  {isGalleryVerified ? (
                    <p>Your Gallery is Verified</p>
                  ) : (
                    <p>Your Gallery is Not Verified</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="px-6 space-y-5">
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><FiUser className="me-1.5 inline" size={16}/>Owner</h3>
            <h5 className="text-zinc-500 text-sm ms-5">{firstName} {lastName}</h5>
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><FiMapPin className="me-1.5 inline" size={16}/>Location and address</h3>
            <h5 className="text-zinc-500 text-sm ms-5">{city_name_en}, {province_name_en}</h5>
            <h5 className="text-zinc-500 text-sm ms-5">{address}</h5>
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><FiPhone className="me-1.5 inline" size={16}/>Phone numbers</h3>
            {phone_numbers.map((phone_number, index) => (
            <h5 key={phone_number.id} className="text-muted-foreground ms-5">
              <span className="py-1 px-2 bg-secondary rounded-md">{index+1}</span>
              {" "}-{" "}
              {formatPhoneNumber(phone_number.number)}
            </h5>
          ))}
          </div>
          <div className="space-x-3 space-y-2">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><Blocks className="me-1.5 inline" size={16}/>Categories</h3>
            {categories.map(category => (
              <Badge key={category.id} variant={"secondary"} className="rounded">{category.category}</Badge>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><FiInfo className="me-1.5 inline" size={16}/>About</h3>
            <p className="text-zinc-500 text-sm ms-5">{about}</p>
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><CalendarPlus className="me-1.5 inline" size={16}/>Created At</h3>
            <p className="text-zinc-500 text-sm ms-5">{gallery_created_at}</p>
          </div>
        </div>
        <div className="border rounded-md p-4 !mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center text-sm font-semibold w-fit"><Car className="bg-gray-100 rounded p-1.5 me-1.5" size={28}/>Cars</h3>
            <Link href={"/dashboard/cars"} className={buttonVariants({ variant: "link", size: "sm" })}>
              See all cars
            </Link>
          </div>
          <div className="flex flex-wrap items-start md:items-center justify-around gap-4">
            <div className="space-y-2 flex-grow border rounded-md p-4">
              <h4 className="text-sm font-semibold text-gray-400">Total</h4>
              <h5 className="text-3xl ms-auto w-fit">{cars.length}</h5>
            </div>
            <div className="space-y-2 flex-grow border rounded-md p-4">
              <h4 className="text-sm font-semibold text-blue-600">Rental</h4>
              <h5 className="text-3xl ms-auto w-fit">{cars.filter(car => car.for_rent).length}</h5>
            </div>
            <div className="space-y-2 flex-grow border rounded-md p-4">
              <h4 className="text-sm font-semibold text-green-600">Sale</h4>
              <h5 className="text-3xl ms-auto w-fit">{cars.filter(car => car.for_sale).length}</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex flex-col items-center hidden col-span-1 max-w-xs bg-white rounded-md p-5">
        <h2 className="flex items-center text-sm font-semibold text-muted-foreground mb-5 self-start"><FiUser size={28} className="bg-gray-100 rounded p-1.5 me-1.5"/> Gallery Agent</h2>
        <div className="text-center space-y-2">
          <Avatar className="w-24 h-24">
            <AvatarImage alt="agent_avatar" src={profile ?? undefined}/>
            <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
          </Avatar>
          <h4>{firstName} {lastName}</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {is_verified ? (
                  <Badge><FiCheckCircle size={16} className="me-1.5"/> Verified</Badge>
                ) : (
                  <Badge variant="destructive"><FiAlertCircle size={16} className="me-1.5"/> Not Verified</Badge>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {is_verified ? (
                  <p>Your Account is Verified</p>
                ) : (
                  <p>Your Account is Not Verified</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator className="my-4"/>
        <div className="self-start mb-6">
          <h4 className="mb-1 font-semibold text-sm text-primary">Email</h4>
          <h5 className="text-zinc-500 text-sm ms-3">{email}</h5>
          <h4 className="mb-1 font-semibold text-sm text-primary mt-3">Phone Number</h4>
          <h5 className="text-zinc-500 text-sm ms-3">{formatPhoneNumber(galleryAgent.phone_number)}</h5>
          <h4 className="mb-1 font-semibold text-sm text-primary mt-3">Join Date</h4>
          <h5 className="text-zinc-500 text-sm ms-3">{joined_date}</h5>
        </div>
        <Link href="/account/profile" className={`${buttonVariants({variant: "secondary"})} w-full`}><FiEdit size={16} className="me-1.5"/> Edit Profile</Link>
      </div>
    </div>
  )
}

export default Gallery