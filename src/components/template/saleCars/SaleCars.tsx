"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CarCard from "@/components/module/CarCard";
import CarsFilter from "@/components/module/CarsFilter";
import City from "@/components/module/filters/City";
import { useGetSaleCars } from "@/hooks/useGetSaleCars";

type SaleCar = {
  id: string;
  title: string;
  description: string;
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
  }[];
  for_sale: {
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

type SaleCarsPropType = {
  userCityId: number | null | undefined;
  agentGalleryId: string | null;
  brandsAndModels: {
    id: number;
    name: string;
    models: {
      id: number;
      name: string;
      brand_id: number;
      fuel_type_id: number | null;
      fuel_type: {
        id: number;
        type: string;
      } | null;
    }[];
  }[];
  buildYears: {
    id: number;
    year: string;
  }[];
  fuelTypes: {
    id: number;
    type: string;
  }[];
  carSeats: {
    id: number;
    seats: string;
    seats_count: string;
  }[];
  colors: {
    id: number;
    color_name: string;
    color_code: string;
  }[];
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[];
  cities: {
    id: number;
    name_en: string;
    province_id: number;
    slug: string;
  }[];
  provinces: {
    id: number;
    name_en: string;
  }[];
}

const SaleCars = ({ 
  cities, 
  provinces, 
  brandsAndModels, 
  buildYears, 
  categories, 
  fuelTypes, 
  carSeats, 
  colors, 
  userCityId, 
  agentGalleryId 
}: SaleCarsPropType) => {
  const [carsData, setCarsData] = useState<SaleCar[]>([]);
  const searchParams = useSearchParams();
  const citySlug = searchParams.get('city');
  const [selectedCityId, setSelectedCityId] = useState<string>(
    userCityId ? `${userCityId}` : 
    cities.find(city => city.slug.toLowerCase() === citySlug?.toLowerCase())?.id.toString() || 
    "52"
  );
  const cityName = cities.find(city => `${city.id}` === selectedCityId)?.name_en;
  const router = useRouter();

  const { data: carsFromApi, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetSaleCars(selectedCityId);

  const prevSelectedCityIdRef = useRef(selectedCityId);

  const handleCityChange = useCallback((newCityId: string) => {
    const citySlug = cities.find(city => `${city.id}` === newCityId)?.slug;
    router.push(`/buy-car?city=${citySlug?.toLowerCase()}`);
  }, [cities, router]);

  useEffect(() => {
    if (selectedCityId !== prevSelectedCityIdRef.current) {
      handleCityChange(selectedCityId);
      refetch();
      prevSelectedCityIdRef.current = selectedCityId;
    }
  }, [selectedCityId, handleCityChange, refetch]);

  useEffect(() => {
    if (isSuccess && carsFromApi) {
      setCarsData(carsFromApi.data);
    }
    if (isError && error) {
      toast.error((error as any)?.response?.data?.error || 'An error occurred while fetching cars.');
    }
  }, [carsFromApi, isSuccess, isError, error]);

  const renderSkeletons = () => (
    <>
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="h-96 w-full rounded-md"/>
      ))}
    </>
  );

  const renderCars = () => (
    carsData && carsData.length > 0 ? (
      carsData.map((car) => (
        <CarCard key={car.id} car={car} agentGalleryId={agentGalleryId}/>
      ))
    ) : (
      <div className="flex flex-col place-items-center mx-auto col-span-1 gap-2">
        <h3 className="text-lg font-semibold">Couldn&apos;t find any car!</h3>
        <h4 className="text-sm font-medium">Try to change your filters</h4>
      </div>
    )
  );

  return (
    <div className="relative grid grid-cols-8">
      <div className="lg:col-span-6 col-span-8 bg-white rounded-md lg:me-6 px-5 py-6 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-green-600">Sale Cars</h2>
          {isFetching ? (
            <Skeleton className="h-9 w-[100px] rounded-full" />
          ) : (
            <Badge variant="outline" className="gap-2 text-sm w-fit text-muted-foreground">
              <span className="text-white bg-primary py-1 px-3 rounded-full">{carsData.length}</span>
              Vehicles to buy
            </Badge>
          )}
        </div>
        {isFetching ? (
          <Skeleton className="h-5 w-[200px] rounded-full mt-4 mb-8" />
        ) : (
          <h4 className="text-muted-foreground text-sm mt-4 mb-8">Total {carsData.length} sale cars in {cityName}</h4>
        )}
        {isFetching && (
          <Badge variant="secondary" className="gap-2 text-sm w-fit text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading
          </Badge>
        )}
        <div className={`grid ${((carsData && carsData.length > 0) || isLoading) && 'LPhone:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] grid-cols-[repeat(auto-fill,minmax(auto,1fr))]'} gap-y-4 gap-x-2`}>
          {isLoading ? renderSkeletons() : renderCars()}
        </div>
      </div>
      <aside className="lg:flex flex-col hidden col-span-2 rounded-md h-full">
        <City provinces={provinces} cities={cities} defaultValue={selectedCityId} setFilterOptions={setSelectedCityId}/>
        <CarsFilter 
          carsFromApi={carsFromApi} 
          setCarsData={setCarsData} 
          brandsAndModels={brandsAndModels} 
          buildYears={buildYears} 
          categories={categories} 
          carSeats={carSeats} 
          fuelTypes={fuelTypes}
        />
      </aside>
    </div>
  )
}

export default SaleCars