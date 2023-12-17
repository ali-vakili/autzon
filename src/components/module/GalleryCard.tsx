import formatPhoneNumber from "@/helper/formatPhoneNumber";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { avatarFallBackText } from "@/helper/fallBackText";
import { Badge } from "@/ui/badge";

import { FiAlertCircle, FiCheckCircle, FiInfo, FiPhone, FiMapPin } from "react-icons/fi";
import { Blocks } from 'lucide-react';



type gallery = {
  id: string;
  name: string;
  about: string | null;
  address: string;
  city: {
    name_en: string;
    province: {
      name_en: string;
    };
  };
  image: {
    url: string;
  } | null;
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[];
  cars: {
    id: string;
  }[];
  phone_numbers: {
    number: string;
    id: string;
  }[];
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type galleryCardPropType = {
  gallery: gallery
}


const GalleryCard = ({ gallery }: galleryCardPropType) => {
  const { id, image, name, about, address, categories, phone_numbers, city: { name_en: city_name_en, province:{name_en: province_name_en} }, city, is_verified } = gallery;

  return (
    <div className="flex flex-col w-full lg:col-span-2 col-span-3 bg-white rounded-md p-5 space-y-5 border">
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
                {is_verified ? (
                  <Badge><FiCheckCircle size={16} className="me-1.5"/> Verified</Badge>
                ) : (
                  <Badge variant="destructive"><FiAlertCircle size={16} className="me-1.5"/> Not Verified</Badge>
                )}
              </TooltipTrigger>
              <TooltipContent>
                {is_verified ? (
                  <p>This Gallery is Verified</p>
                ) : (
                  <p>This Gallery is Not Verified</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h5 className="!ms-auto text-muted-foreground text-sm">{city_name_en}, {province_name_en}</h5>
      </div>
      <div className="flex flex-wrap gap-4 ms-36">
        <div className="flex flex-col items-start space-y-2">
          <h4 className="inline-flex items-center gap-x-1"><FiMapPin size={16}/> Address</h4>
          <h5 className="text-muted-foreground text-sm ms-5">{address}</h5>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <h4 className="inline-flex items-center gap-x-1"><Blocks size={16}/> Categories</h4>
          <div className="flex ms-5 gap-2">
            {categories.map(category => (
              <Badge key={category.id} variant={"secondary"} className="rounded">{category.category}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start space-y-2">
          <h4 className="flex items-center w-fit gap-x-1"><FiPhone size={16}/>Phone numbers</h4>
          {phone_numbers.map((phone_number, index) => (
            <h5 key={phone_number.id} className="text-muted-foreground ms-5">
              <span className="py-1 px-2 bg-secondary rounded-md">{index+1}</span>
              {" "}-{" "}
              {formatPhoneNumber(phone_number.number)}
            </h5>
          ))}
        </div>
      </div>
      <div className="space-y-2 ms-36">
        <h4 className="flex items-center text-sm font-semibold mb-3 w-fit"><FiInfo className="me-1.5 inline" size={16}/>About</h4>
        <p className="text-zinc-500 text-sm ms-5">{about}</p>
      </div>
    </div>
  )
}

export default GalleryCard