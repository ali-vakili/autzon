"use client"

import Link from "next/link";
import CarCard from "@/components/module/CarCard";
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { AGENT } from "@/constants/roles";

import { useGetGalleryCars } from "@/hooks/useGetGalleryCars";

import { FiFilter, FiPlus, FiRefreshCw, FiRotateCw  } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BuildYear from "@/components/module/filters/BuildYear";
import Category from "@/components/module/filters/Category";
import Color from "@/components/module/filters/Color";
import Model from "@/components/module/filters/Model";
import Seats from "@/components/module/filters/Seats";
import FuelType from "@/components/module/filters/FuelType";
import { ScrollArea } from "@/components/ui/scroll-area";
import Published from "@/components/module/filters/Published";



type cars = {
  id: string;
  title: string;
  is_published: boolean;
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
  createdAt: Date;
  updatedAt: Date;
}

type models = {
  id: number;
  name: string;
  brand_id: number;
  fuel_type_id: number | null;
  fuel_type: {
    id: number;
    type: string;
  } | null;
}

type allCarsPropType = {
  gallery_id: string;
  cars: cars[]
  brandsAndModels: {
    id: number;
    name: string;
    models: models[];
  }[],
  buildYears: {
    id: number;
    year: string;
  }[],
  fuelTypes: {
    id: number;
    type: string;
  }[],
  carSeats: {
    id: number;
    seats: string;
    seats_count: string;
  }[]
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[]
  colors: {
    id: number;
    color_name: string;
    color_code: string;
  }[]
}

export type filterOptionsType = {
  buildYearId: string;
  model_id: string;
  category_id: string;
  fuel_type_id: string;
  care_seats_id: string;
  color_id: string;
}


const hasNonNullProperty = <T extends Record<string, any>, K extends keyof T>(
  items: T[],
  propertyName: K
): boolean => {
  return items.some(item => item[propertyName] !== null);
};

const AllCars = ({ cars, gallery_id, brandsAndModels, buildYears, categories, fuelTypes, carSeats, colors }: allCarsPropType) => {
  const hasCarsForRent = hasNonNullProperty(cars, 'for_rent');
  const hasCarsForSale = hasNonNullProperty(cars, 'for_sale');
  const [carsData, setCarsData] = useState<cars[]>(cars);
  const [searchParam, setSearchParam] = useState<string>("newest");
  const [filterOptions, setFilterOptions] = useState<filterOptionsType>({
    buildYearId: "",
    category_id: "",
    color_id: "",
    model_id: "",
    care_seats_id: "",
    fuel_type_id: "",
  });

  const { data, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetGalleryCars(gallery_id, searchParam);

  useEffect(() => {
    isSuccess && setCarsData(data.data);
    //@ts-ignore
    isError === true && error && toast.error(error?.response.data.error);
  }, [data])

  const refetchCarData = () => {
    refetch();
  }

  const resetFilters = () => {
    setFilterOptions({
      buildYearId: "",
      category_id: "",
      color_id: "",
      model_id: "",
      care_seats_id: "",
      fuel_type_id: "",
    });
    setCarsData(data.data);
  }

  useEffect(() => {
    refetchCarData();
  },[searchParam])

  useEffect(() => {
    console.log(data);
    const filteredCars = data ? data.data.filter((car: any) => {
      return (
        (!filterOptions.buildYearId || car.build_year_id === Number(filterOptions.buildYearId)) &&
        (!filterOptions.category_id || car.category.id === Number(filterOptions.category_id)) &&
        (!filterOptions.color_id || (car.for_sale && car.for_sale.color.id === Number(filterOptions.color_id))) &&
        (!filterOptions.model_id || car.model_id === Number(filterOptions.model_id)) &&
        (!filterOptions.care_seats_id || car.car_seat.id === Number(filterOptions.care_seats_id)) &&
        (!filterOptions.fuel_type_id || car.fuel_type.id === Number(filterOptions.fuel_type_id))
      );
    }) : cars;

    setCarsData(filteredCars);
  }, [filterOptions, data]);

  return (
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
          className="bg-white w-full lg:col-span-2 col-span-3 rounded-md p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">All Cars</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Total rental and sale cars.
              </p>
            </div>
            <Badge variant={"outline"} className="gap-2 text-base w-fit">{carsData.length} Cars</Badge>
          </div>
          <div className="flex items-center justify-between mb-6">
            <Button onClick={() => refetch()} size="sm" variant={"outline"} type="button" disabled={isFetching} isLoading={isFetching} className="w-fit text-xs h-8">{isFetching ? 'Refreshing' : <><FiRefreshCw className="me-1.5" />Refresh</>}</Button>
            <Select defaultValue="newest" value={searchParam} onValueChange={(param) => setSearchParam(param)} disabled={isFetching || (carsData.length > 0 ? false : true)}>
              <SelectTrigger className="ml-auto w-fit gap-3 rounded-full h-8 text-xs">
                <SelectValue placeholder="Select your gallery state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="last-updated">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={`grid ${((carsData && carsData.length > 0) || isLoading) && 'grid-cols-[repeat(auto-fill,minmax(224px,1fr))]'} gap-3`}>
          {isLoading ? (
            <>
              <Skeleton className="h-72 w-full rounded-md"/>
              <Skeleton className="h-72 w-full rounded-md"/>
              <Skeleton className="h-72 w-full rounded-md"/>
            </>
          ) : (
            carsData && carsData.length > 0 ? (
              carsData.map(car => (
                <CarCard key={car.id} car={car} view_to={AGENT} forCard={car.for_rent ? "RENTAL" : car.for_sale ? "SALE" : "NONE"} isFetching={isFetching} refetchCarData={refetchCarData}/>
              ))
            ) : (
              <div className="flex flex-col place-items-center mx-auto col-span-1 gap-3">
                <h3 className="text-lg font-semibold">You don't have any cars to show</h3>
                <h4 className="text-sm font-medium">Add one</h4>
                <div className="space-x-2">
                  <Link href={"/dashboard/cars/rental/create"} className={`${buttonVariants({ variant:"secondary" })} !text-blue-600`}><FiPlus size={16} className="me-1.5"/>Add rental car</Link>
                  <Link href={"/dashboard/cars/sale/create"} className={`${buttonVariants({ variant:"secondary" })} !text-green-600`}><FiPlus size={16} className="me-1.5"/>Add sale car</Link>
                </div>
              </div>
            )
          )}
          </div>
        </TabsContent>
        <TabsContent
          value="rental"
          className="bg-white w-full lg:col-span-2 col-span-3 rounded-md p-5 h-full flex-col border-none data-[state=active]:flex"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Rental Cars</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Total rental cars.
              </p>
            </div>
            <Badge variant={"outline"} className="gap-2 text-base">{carsData.filter(car => car.for_rent).length} Cars</Badge>
          </div>
          <Button onClick={refetchCarData} size="sm" variant={"outline"} type="button" disabled={isFetching} isLoading={isFetching} className="w-fit text-xs h-8" style={{ marginBottom: "24px" }}>{isFetching ? 'Refreshing' : <><FiRefreshCw className="me-1.5" />Refresh</>}</Button>
          <div className={cn('grid gap-3', {'grid-cols-[repeat(auto-fill,minmax(224px,1fr))]': hasCarsForRent})}>
            {carsData.filter(car => car.for_rent).length > 0 ? carsData.filter(car => car.for_rent).map(car => (
              <CarCard key={car.id} car={car} view_to={AGENT} forCard={"RENTAL"} refetchCarData={refetchCarData} isFetching={isFetching}/>
            )) : (
              <div className="flex flex-col place-items-center mx-auto col-span-1 gap-3">
                <h3 className="text-lg font-semibold">You don't have any rental cars to show</h3>
                <h4 className="text-sm font-medium">Add one</h4>
                <div className="space-x-2">
                  <Link href={"/dashboard/cars/rental/create"} className={`${buttonVariants({ variant:"secondary" })} !text-blue-600`}><FiPlus size={16} className="me-1.5"/>Add rental car</Link>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent
          value="sale"
          className="bg-white w-full lg:col-span-2 col-span-3 rounded-md p-5 h-full flex-col border-none data-[state=active]:flex"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Sale Cars</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Total sale cars.
              </p>
            </div>
            <Badge variant={"outline"} className="gap-2 text-base">{carsData.filter(car => car.for_sale).length} Cars</Badge>
          </div>
          <Button onClick={() => refetch()} size="sm" variant={"outline"} type="button" disabled={isFetching} isLoading={isFetching} className="w-fit text-xs h-8" style={{ marginBottom: "24px" }}>{isFetching ? 'Refreshing' : <><FiRefreshCw className="me-1.5" />Refresh</>}</Button>
          <div className={cn('grid gap-3', {'grid-cols-[repeat(auto-fill,minmax(224px,1fr))]': hasCarsForSale})}>
            {carsData.filter(car => car.for_sale).length > 0 ? carsData.filter(car => car.for_sale).map(car => (
              <CarCard key={car.id} car={car} view_to={"AGENT"} forCard={"SALE"} refetchCarData={refetchCarData} isFetching={isFetching}/>
            )) : (
              <div className="flex flex-col place-items-center mx-auto col-span-1 gap-3">
                <h3 className="text-lg font-semibold">You don't have any sale cars to show</h3>
                <h4 className="text-sm font-medium">Add one</h4>
                <div className="space-x-2">
                  <Link href={"/dashboard/cars/sale/create"} className={`${buttonVariants({ variant:"secondary" })} !text-green-600`}><FiPlus size={16} className="me-1.5"/>Add sale car</Link>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <div className="lg:flex flex-col sticky top-6 hidden col-span-1 max-w-xs bg-white rounded-md py-5 mt-2">
          <div className="flex items-center justify-between mb-5 px-5">
            <h2 className="flex items-center text-sm font-semibold text-muted-foreground self-start"><FiFilter size={28} className="bg-gray-100 rounded p-1.5 me-1.5"/> Filter by</h2>
            <Button variant={"ghost"} size={"icon"} className="h-8 w-8" onClick={resetFilters}><FiRotateCw size={16}/></Button>
          </div>
          <ScrollArea className="h-96">
            <div className="space-y-3 px-5 py-3">
              <Published />
              <BuildYear buildYears={buildYears} defaultValue={filterOptions.buildYearId} setFilterOptions={setFilterOptions}/>
              <Category categories={categories} defaultValue={filterOptions.category_id} setFilterOptions={setFilterOptions}/>
              <Color colors={colors} defaultValue={filterOptions.color_id} setFilterOptions={setFilterOptions}/>
              <Model brandsAndModels={brandsAndModels} defaultValue={filterOptions.model_id} setFilterOptions={setFilterOptions}/>
              <Seats carSeats={carSeats} defaultValue={filterOptions.care_seats_id} setFilterOptions={setFilterOptions}/>
              <FuelType fuelTypes={fuelTypes} defaultValue={filterOptions.fuel_type_id}  setFilterOptions={setFilterOptions}/>
            </div>
          </ScrollArea>
        </div>
      </div>
    </Tabs>
  )
}

export default AllCars