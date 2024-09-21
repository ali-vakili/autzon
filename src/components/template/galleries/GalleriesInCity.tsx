"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import GalleryCard from "@/components/module/GalleryCard";
import GalleryFilter from "@/components/module/GalleryFilter";
import City from "@/components/module/filters/City";
import { useGetGalleries } from "@/hooks/useGetGalleries";

type Gallery = {
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
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[];
  image: {
    url: string;
  } | null;
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

type GalleriesInCityPropType = {
  userCityId: number | null | undefined;
  agentGalleryId: string | null;
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

const GalleriesInCity = ({ 
  cities, 
  provinces, 
  categories, 
  userCityId, 
  agentGalleryId 
}: GalleriesInCityPropType) => {
  const [galleriesData, setGalleriesData] = useState<Gallery[]>([]);
  const searchParams = useSearchParams();
  const citySlug = searchParams.get('city');
  const [selectedCityId, setSelectedCityId] = useState<string>(
    userCityId ? `${userCityId}` : 
    cities.find(city => city.slug.toLowerCase() === citySlug?.toLowerCase())?.id.toString() || 
    "52"
  );
  const cityName = cities.find(city => `${city.id}` === selectedCityId)?.name_en;
  const router = useRouter();

  const { data: galleriesFromApi, isSuccess, isLoading, isFetching, isError, error, refetch } = useGetGalleries(selectedCityId);

  const prevSelectedCityIdRef = useRef(selectedCityId);

  const handleCityChange = useCallback((newCityId: string) => {
    const citySlug = cities.find(city => `${city.id}` === newCityId)?.slug;
    router.push(`/galleries?city=${citySlug?.toLowerCase()}`);
  }, [cities, router]);

  useEffect(() => {
    if (selectedCityId !== prevSelectedCityIdRef.current) {
      handleCityChange(selectedCityId);
      refetch();
      prevSelectedCityIdRef.current = selectedCityId;
    }
  }, [selectedCityId, handleCityChange, refetch]);

  useEffect(() => {
    if (isSuccess && galleriesFromApi) {
      setGalleriesData(galleriesFromApi.data);
    }
    if (isError && error) {
      toast.error((error as any)?.response?.data?.error || 'An error occurred while fetching galleries.');
    }
  }, [galleriesFromApi, isSuccess, isError, error]);

  const renderSkeletons = () => (
    <>
      {[...Array(4)].map((_, index) => (
        <Skeleton key={index} className="h-72 w-full rounded-md"/>
      ))}
    </>
  );

  const renderGalleries = () => (
    galleriesData && galleriesData.length > 0 ? (
      galleriesData.map((gallery) => (
        <GalleryCard key={gallery.id} gallery={gallery} agentGalleryId={agentGalleryId}/>
      ))
    ) : (
      <div className="flex flex-col place-items-center mx-auto col-span-1 gap-2">
        <h3 className="text-lg font-semibold">Couldn&apos;t find any gallery!</h3>
        <h4 className="text-sm font-medium">Try to change your filters</h4>
      </div>
    )
  );

  return (
    <div className="relative grid grid-cols-8">
      <div className="lg:col-span-6 col-span-8 bg-white rounded-md lg:me-6 px-5 py-6 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Galleries</h2>
          {isFetching ? (
            <Skeleton className="h-9 w-[100px] rounded-full" />
          ) : (
            <Badge variant="outline" className="gap-2 LPhone:text-sm text-xs w-fit text-muted-foreground">
              <span className="text-white LPhone:text-sm text-xs bg-primary py-1 LPhone:px-3 px-2 rounded-full">{galleriesData.length}</span>
              Galleries to explore
            </Badge>
          )}
        </div>
        {isFetching ? (
          <Skeleton className="h-5 w-[200px] rounded-full mt-4 mb-8" />
        ) : (
          <h4 className="text-muted-foreground text-sm mt-4 mb-8">Total {galleriesData.length} gallery in {cityName}</h4>
        )}
        {isFetching && (
          <Badge variant="secondary" className="gap-2 text-sm w-fit text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading
          </Badge>
        )}
        <div className={`grid ${((galleriesData && galleriesData.length > 0) || isLoading) && 'grid-cols-[repeat(auto-fill,minmax(auto,1fr))]'} gap-5`}>
          {isLoading ? renderSkeletons() : renderGalleries()}
        </div>
      </div>
      <aside className="lg:flex flex-col hidden col-span-2 rounded-md h-full">
        <City provinces={provinces} cities={cities} defaultValue={selectedCityId} setFilterOptions={setSelectedCityId}/>
        <GalleryFilter categories={categories} galleriesData={galleriesFromApi} setGalleriesData={setGalleriesData}/>
      </aside>
    </div>
  )
}

export default GalleriesInCity