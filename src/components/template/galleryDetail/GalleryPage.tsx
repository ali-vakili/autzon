import CarCard from "@/module/CarCard";
import formatPhoneNumber from "@/helper/formatPhoneNumber";
import galleryDetailType from "./galleryDetailType";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { avatarFallBackText } from "@/helper/fallBackText";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { getCreatedAndJoinDate } from "@/helper/getDate";
import { Separator } from "@/ui/separator";
import { Badge } from "@/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/ui/skeleton";

import { useGetRentRequests } from "@/hooks/useGetUserRentRequests";
import { useGetUserSavedCars } from "@/hooks/useGetUserSavedCars";

import { FiAlertCircle, FiCheckCircle, FiInfo, FiMapPin, FiPhone } from "react-icons/fi";
import { Blocks } from "lucide-react";


type galleryPagePropType= {
  gallery: galleryDetailType;
  agentGalleryId: string|null;
}

const GalleryPage = ({ gallery, agentGalleryId }: galleryPagePropType) => {
  const { id: gallery_id, name, image, is_verified, phone_numbers, categories, address, city: {name_en: city_name_en, province: { name_en: province_name_en }}, cars, about, createdAt } = gallery;
  const gallery_created_at = getCreatedAndJoinDate(createdAt);

  const { data: userSavedCars={data: []}, isLoading } = useGetUserSavedCars();

  const { data: userRentRequests={data: []}, isLoading: isLoadingRentRequests, refetch: refetchRentRequests } = useGetRentRequests();

  return (
    <>
      <div className="flex flex-col items-center w-full gap-4">
        {gallery_id === agentGalleryId && (<Badge variant={"secondary"}>Your Gallery</Badge>)}
        <div className="text-center space-y-2">
          <Avatar className="w-36 h-36">
            <AvatarImage alt="agent_avatar" src={image?.url ?? undefined}/>
            <AvatarFallback>{avatarFallBackText(name, null)}</AvatarFallback>
          </Avatar>
          <h4 className="text-2xl font-semibold">{name}</h4>
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
                  <p>Gallery is Verified</p>
                ) : (
                  <p>Gallery is Not Verified</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h4 className="text-xs font-medium">Created At: {gallery_created_at}</h4>
        <div className="flex flex-col bg-secondary rounded-md w-fit p-4 gap-2 min-w-[320px]">
          <h4 className="text-sm text-muted-foreground font-semibold">Contact info</h4>
          <h4 className="inline-flex items-center font-semibold gap-1.5"><FiPhone size={16}/>Phone numbers:</h4>
          <div className="flex flex-wrap w-full gap-y-2 gap-x-2">
            {phone_numbers.map((phone_number, index) => (
              <h5 key={phone_number.id} className="text-lg font-semibold mx-5">
                <span className="text-muted-foreground">{index+1}</span>
                {" "}-{" "}
                {formatPhoneNumber(phone_number.number)}
              </h5>
            ))}
          </div>
        </div>
        <div className="flex md:grid grid-cols-2 flex-wrap w-full p-4 gap-2">
          <div className="flex flex-col flex-grow col-span-1 border p-4 rounded-md">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><FiMapPin className="me-1.5 inline" size={16}/>Location and address</h3>
            <h5 className="text-zinc-500 text-sm ms-5 mb-1">{address}</h5>
            <h5 className="text-zinc-500 text-sm ms-5">{city_name_en}, {province_name_en}</h5>
          </div>
          <div className="flex flex-col flex-grow col-span-1 border p-4 rounded-md">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><Blocks className="me-1.5 inline" size={16}/>Categories</h3>
            <div className="flex flex-wrap gap-1">
              {categories.map(category => (
                <Badge key={category.id} variant={"secondary"} className="items-start w-fit rounded-md">
                  {category.category}&nbsp;
                  {category.abbreviation && (
                    <p className="text-gray-400 inline">
                      - {category.abbreviation}
                    </p>
                  )}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1 mt-4">
            <h3 className="flex items-center text-sm font-semibold mb-3 w-fit"><FiInfo className="me-1.5 inline" size={16}/>About</h3>
            <p className="text-zinc-500 text-sm ms-5">{about}</p>
          </div>
        </div>
      </div>
      <Separator />
      <h2 className="text-2xl font-bold mb-3">Cars in auto gallery</h2>
      <Tabs defaultValue="rental" className="h-full space-y-4 w-full">
        <div className="space-between flex items-center">
          <TabsList className="grid w-64 grid-cols-2">
            <TabsTrigger value="rental">Rental</TabsTrigger>
            <TabsTrigger value="sale">Sale</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="rental"
          className="w-full rounded-md py-3 h-full border-none data-[state=active]:grid"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Rental Cars</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Total rental cars.
              </p>
            </div>
            <Badge variant={"outline"} className="gap-2 text-base">{cars.filter(car => car.for_rent).length} Rental Cars</Badge>
          </div>
          <div className={`grid ${(cars.filter(car => car.for_rent).length > 0 || isLoadingRentRequests || isLoading) && 'grid-cols-[repeat(auto-fill,minmax(320px,1fr))]'} gap-3`}>
            {(isLoading || isLoadingRentRequests) ? (
              <>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
              </>
            ) : 
            cars.filter(car => car.for_rent).length > 0 ? cars.filter(car => car.for_rent).map(car => (
              //@ts-ignore
              <CarCard key={car.id} car={car} userSavedCars={userSavedCars.data} agentGalleryId={agentGalleryId} userRentRequests={userRentRequests.data}/>
            )) : (
              <div className="flex flex-col place-items-center mx-auto col-span-1 gap-2">
                <h3 className="text-lg font-semibold">No Rental Car</h3>
                <h4 className="text-sm font-medium">This gallery don&apos;t have any rental car.</h4>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent
          value="sale"
          className="w-full rounded-md py-3 h-full border-none data-[state=active]:grid"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Sale Cars</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Total sale cars.
              </p>
            </div>
            <Badge variant={"outline"} className="gap-2 text-base">{cars.filter(car => car.for_sale).length} Sale Cars</Badge>
          </div>
          <div className={`grid ${(cars.filter(car => car.for_sale).length > 0) && 'grid-cols-[repeat(auto-fill,minmax(320px,1fr))]'} gap-3`}>
            {(isLoading) ? (
              <>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
                <Skeleton className="h-96 w-full rounded-md"/>
              </>
            ) : 
            cars.filter(car => car.for_sale).length > 0 ? cars.filter(car => car.for_sale).map(car => (
              //@ts-ignore
              <CarCard key={car.id} car={car} userSavedCars={userSavedCars.data}/>
            )) : (
              <div className="flex flex-col place-items-center mx-auto col-span-1 gap-2">
                <h3 className="text-lg font-semibold">No Sale Car</h3>
                <h4 className="text-sm font-medium">This gallery don&apos;t have any sale car.</h4>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default GalleryPage