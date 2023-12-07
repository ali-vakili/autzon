import Link from "next/link";
import CarCard from "@/components/module/CarCard";
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { cn } from "@/lib/utils";
import { AGENT } from "@/constants/roles";

import { FiFilter, FiPlus } from "react-icons/fi";


type allCarsPropType = {
  cars: {
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
  }[]
}

const hasNonNullProperty = <T extends Record<string, any>, K extends keyof T>(
  items: T[],
  propertyName: K
): boolean => {
  return items.some(item => item[propertyName] !== null);
};

const AllCars = ({ cars }: allCarsPropType) => {
  const hasCarsForRent = hasNonNullProperty(cars, 'for_rent');
  const hasCarsForSale = hasNonNullProperty(cars, 'for_sale');

  return (
    <div>
      <div className="h-full">
        <Tabs defaultValue="all_cars" className="h-full space-y-6">
          <div className="space-between flex items-center">
            <TabsList>
              <TabsTrigger value="all_cars" className="relative">
                All Cars
              </TabsTrigger>
              <TabsTrigger value="rental">Rental</TabsTrigger>
              <TabsTrigger value="sale">Sale</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex flex-col items-start md:grid grid-cols-3 gap-6">
            <TabsContent
              value="all_cars"
              className="bg-white lg:col-span-2 col-span-3 rounded-md p-5"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">All Cars</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total rental and sale cars.
                  </p>
                </div>
                <Badge variant={"outline"} className="gap-2 text-base">{cars.length} Cars</Badge>
              </div>
              <div className={`grid ${cars.length > 0 && 'grid-cols-[repeat(auto-fill,minmax(224px,1fr))]'} gap-3`}>
                {cars.length > 0 ? cars.map(car => (
                  <Dialog key={car.id}>
                    <DialogTrigger asChild>
                      <CarCard car={car} view_to={AGENT}/>
                    </DialogTrigger>
                  </Dialog> 
                )) : (
                  <div className="flex flex-col place-items-center mx-auto col-span-1 gap-3">
                    <h3 className="text-lg font-semibold">You don't have any cars to show</h3>
                    <h4 className="text-sm font-medium">Add one</h4>
                    <div className="space-x-2">
                      <Link href={"/dashboard/cars/rental/create"} className={`${buttonVariants({ variant:"secondary" })} !text-blue-500`}><FiPlus size={16} className="me-1.5"/>Add rental car</Link>
                      <Link href={"/dashboard/cars/sale/create"} className={`${buttonVariants({ variant:"secondary" })} !text-green-500`}><FiPlus size={16} className="me-1.5"/>Add sale car</Link>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent
              value="rental"
              className="bg-white lg:col-span-2 col-span-3 rounded-md p-5 h-full flex-col border-none data-[state=active]:flex"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Rental Cars</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total rental cars.
                  </p>
                </div>
                <Badge variant={"outline"} className="gap-2 text-base">{cars.filter(car => car.for_rent).length} Cars</Badge>
              </div>
              <div className={cn('grid gap-3', {'grid-cols-[repeat(auto-fill,minmax(224px,1fr))]': hasCarsForRent})}>
                {cars.filter(car => car.for_rent).length > 0 ? cars.filter(car => car.for_rent).map(car => (
                  <Dialog key={car.id}>
                    <DialogTrigger asChild>
                      <CarCard car={car} view_to={AGENT}/>
                    </DialogTrigger>
                  </Dialog> 
                )) : (
                  <div className="flex flex-col place-items-center mx-auto col-span-1 gap-3">
                    <h3 className="text-lg font-semibold">You don't have any rental cars to show</h3>
                    <h4 className="text-sm font-medium">Add one</h4>
                    <div className="space-x-2">
                      <Link href={"/dashboard/cars/rental/create"} className={`${buttonVariants({ variant:"secondary" })} !text-blue-500`}><FiPlus size={16} className="me-1.5"/>Add rental car</Link>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent
              value="sale"
              className="bg-white lg:col-span-2 col-span-3 rounded-md p-5 h-full flex-col border-none data-[state=active]:flex"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Sale Cars</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total sale cars.
                  </p>
                </div>
                <Badge variant={"outline"} className="gap-2 text-base">{cars.filter(car => car.for_sale).length} Cars</Badge>
              </div>
              <div className={cn('grid gap-3', {'grid-cols-[repeat(auto-fill,minmax(224px,1fr))]': hasCarsForSale})}>
                {cars.filter(car => car.for_sale).length > 0 ? cars.filter(car => car.for_sale).map(car => (
                  <Dialog key={car.id}>
                    <DialogTrigger asChild>
                      <CarCard car={car} view_to={"AGENT"}/>
                    </DialogTrigger>
                  </Dialog> 
                )) : (
                  <div className="flex flex-col place-items-center mx-auto col-span-1 gap-3">
                    <h3 className="text-lg font-semibold">You don't have any sale cars to show</h3>
                    <h4 className="text-sm font-medium">Add one</h4>
                    <div className="space-x-2">
                      <Link href={"/dashboard/cars/sale/create"} className={`${buttonVariants({ variant:"secondary" })} !text-green-500`}><FiPlus size={16} className="me-1.5"/>Add sale car</Link>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <div className="lg:flex flex-col items-center hidden col-span-1 max-w-xs bg-white rounded-md p-5 mt-2">
              <h2 className="flex items-center text-sm font-semibold text-muted-foreground mb-5 self-start"><FiFilter size={28} className="bg-gray-100 rounded p-1.5 me-1.5"/> Filter by</h2>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default AllCars