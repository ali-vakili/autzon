"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/tooltip";
import { Checkbox } from "@/ui/checkbox";
import { Button } from "@/ui/button"
import { Label } from "@/ui/label";

import { FiFilter, FiRotateCw } from "react-icons/fi"


type galleryFilterPropType = {
  galleriesData: any,
  setGalleriesData: Dispatch<SetStateAction<any[]>>
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[];
}


const GalleryFilter = ({ categories, galleriesData, setGalleriesData }: galleryFilterPropType) => {
  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string[]>([]);

  const resetFilters = () => {
    setSelectedCategoriesId([]);
  }

  useEffect(() => {
    const filteredGalleries = galleriesData && galleriesData.data.length > 0 ? galleriesData.data.filter((gallery: any) => {
      if (selectedCategoriesId.length === 0) {
        return true;
      } else {
        // @ts-ignore
        return gallery.categories.some(category =>
          selectedCategoriesId.includes(`${category.id}`)
        );
      }
    }) : [];
    setGalleriesData(filteredGalleries);
  }, [selectedCategoriesId]);

  return (
    <div className="bg-white rounded-md px-5 py-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center text-sm font-semibold text-muted-foreground self-start"><FiFilter size={28} className="bg-gray-100 rounded p-1.5 me-1.5"/> Filter by</h2>
        <Button variant={"ghost"} size={"icon"} className="h-8 w-8" onClick={resetFilters}><FiRotateCw size={16}/></Button>
      </div>
      <Label className="text-muted-foreground">Categories</Label>
      <div className="grid grid-cols-2 gap-2 py-3">
        {categories.map((item) => (
          <div className="flex flex-row items-center space-x-2" key={item.id}>
            <Checkbox 
              checked={selectedCategoriesId.includes(`${item.id}`)}
              onCheckedChange={(checked) => {
                return checked
                  ? setSelectedCategoriesId((prev) => [...prev, `${item.id}`])
                  : setSelectedCategoriesId(
                      selectedCategoriesId.filter(
                        (value) => value !== `${item.id}`
                      )
                    )
              }}
            />
            {item.abbreviation ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label className="text-sm underline cursor-pointer">
                      {item.category}
                    </Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.abbreviation}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Label className="text-sm cursor-pointer">
                {item.category}
              </Label>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GalleryFilter