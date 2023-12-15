"use client"

import City from "./filters/City";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FiFilter, FiRotateCw } from "react-icons/fi";
import { Button } from "@/ui/button";
import { ScrollArea } from "@/ui/scroll-area";
import { BuildYear, Category, FuelType, Model, Seats } from "./filters";
import { rentalCarsFilterOptionsType } from "./filters/FiltersType";


type carsFilterPropType = {
  selectedCityId: string;
  setSelectedCityId: Dispatch<SetStateAction<string>>;
  carsFromApi:any;
  setCarsData: Dispatch<SetStateAction<any>>
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
  cities: {
    id: number;
    name_en: string;
    province_id: number;
  }[],
  provinces: {
    id: number;
    name_en: string;
  }[]
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

const CarsFilter = ({ carsFromApi, setCarsData, selectedCityId, setSelectedCityId, cities, provinces, brandsAndModels, buildYears, categories, fuelTypes, carSeats }:carsFilterPropType) => {
  const [filterOptions, setFilterOptions] = useState<rentalCarsFilterOptionsType>({
    buildYearId: "",
    category_id: "",
    model_id: "",
    care_seats_id: "",
    fuel_type_id: "",
  });

  const resetFilters = () => {
    setFilterOptions({
      buildYearId: "",
      category_id: "",
      model_id: "",
      care_seats_id: "",
      fuel_type_id: "",
    });
    setSelectedCityId("52");
  }

  useEffect(() => {
    const filteredCars = carsFromApi && carsFromApi.data.length > 0 ? carsFromApi.data.filter((car: any) => {
      return (
        (!filterOptions.buildYearId || car.build_year_id === Number(filterOptions.buildYearId)) &&
        (!filterOptions.category_id || car.category.id === Number(filterOptions.category_id)) &&
        (!filterOptions.model_id || car.model_id === Number(filterOptions.model_id)) &&
        (!filterOptions.care_seats_id || car.car_seat.id === Number(filterOptions.care_seats_id)) &&
        (!filterOptions.fuel_type_id || car.fuel_type.id === Number(filterOptions.fuel_type_id))
      );
    }) : [];

    setCarsData(filteredCars);
  }, [filterOptions, carsFromApi]);

  return (
    <aside className="lg:flex flex-col hidden sticky top-6 col-span-2 bg-white rounded-md px-5 py-6 h-fit">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center text-sm font-semibold text-muted-foreground self-start"><FiFilter size={28} className="bg-gray-100 rounded p-1.5 me-1.5"/> Filter by</h2>
        <Button variant={"ghost"} size={"icon"} className="h-8 w-8" onClick={resetFilters}><FiRotateCw size={16}/></Button>
      </div>
      <ScrollArea className="h-[420px]">
        <div className="space-y-3 py-3 pe-4">
          <City provinces={provinces} cities={cities} defaultValue={selectedCityId} setFilterOptions={setSelectedCityId}/>
          <BuildYear buildYears={buildYears} defaultValue={filterOptions.buildYearId} setFilterOptions={setFilterOptions}/>
          <Category categories={categories} defaultValue={filterOptions.category_id} setFilterOptions={setFilterOptions}/>
          <Model brandsAndModels={brandsAndModels} defaultValue={filterOptions.model_id} setFilterOptions={setFilterOptions}/>
          <Seats carSeats={carSeats} defaultValue={filterOptions.care_seats_id} setFilterOptions={setFilterOptions}/>
          <FuelType fuelTypes={fuelTypes} defaultValue={filterOptions.fuel_type_id}  setFilterOptions={setFilterOptions}/>
        </div>
      </ScrollArea>
    </aside>
  )
}

export default CarsFilter