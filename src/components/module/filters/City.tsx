"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { FiCheck, FiMapPin, FiX } from "react-icons/fi";


type cityPropType = {
  cities: {
    id: number;
    name_en: string;
    province_id: number;
  }[],
  provinces: {
    id: number;
    name_en: string;
  }[]
  defaultValue: string;
  setFilterOptions: Dispatch<SetStateAction<string>>
}


const City = ({ cities, provinces, setFilterOptions, defaultValue } : cityPropType) => {
  const [selectedProvince, setSelectedProvince] = useState<{id:number, name: string}|null>(null);
  const [selectedCityId , setSelectedCityId] = useState<string|null>(defaultValue);
  const handleModelChange = (selectedCityId: string) => {
    setFilterOptions(selectedCityId);
  };

  useEffect(() => {
    setSelectedProvince(null);
    setSelectedCityId(defaultValue);
  }, [defaultValue])

  return (
    <div className="flex items-end">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className={cn("w-fit justify-between px-3 bg-white mb-3 ms-auto", !selectedProvince && "text-muted-foreground")}>
            <FiMapPin size={16} className="me-1.5"/>
            {selectedCityId
              ? cities.find(
                  (city) => `${city.id}` === selectedCityId
                )?.name_en
              : "Select a city"
            }
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select City</DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Search city..."/>
            {selectedProvince && (
              <Badge variant="secondary" className="w-fit py-2 px-4 m-2 ms-3">
                <span aria-description="unselect province" className="bg-slate-300 me-1.5 cursor-pointer rounded-full p-0.5" onClick={() => setSelectedProvince(null)}><FiX size={16}/></span>
                { selectedProvince.name }
              </Badge>
            )}
            <ScrollArea className="h-80">
              <CommandEmpty>No city or brand province.</CommandEmpty>
              <CommandList>
                <CommandGroup heading={selectedProvince ? "Cities" : "Provinces"}>
                  {/* <h4 h4 className="text-xs text-gray-400 ms-3 my-3">{selectedProvince ? "Cities" : "Provinces"}</h4> */}
                  {selectedProvince ? 
                    cities
                    .filter((city) => city.province_id === selectedProvince.id)
                    .map((city) => (
                      <CommandItem
                        value={city.name_en}
                        key={city.id}
                        className={cn("mb-0.5", `${city.id}` === selectedCityId && "bg-accent")}
                        onSelect={() => {
                          setSelectedCityId(`${city.id}`), handleModelChange(`${city.id}`)
                        }}
                      >
                        <span className="flex items-center mr-2 h-4 w-4">
                          {`${city.id}` === selectedCityId && (
                            <FiCheck
                              className={cn(
                                `${city.id}` === selectedCityId ? "opacity-100" : "opacity-0"
                              )}
                            />
                          )}
                        </span>
                        {city.name_en}
                      </CommandItem>
                    ))
                  :
                    provinces.map((province) => (
                      <CommandItem
                        value={province.name_en}
                        key={province.id}
                        className={cn("mb-0.5", province.id === selectedProvince && "bg-accent")}
                        onSelect={() => {
                          setSelectedProvince({id: province.id, name: province.name_en})
                        }}
                      >
                        <span className="flex items-center mr-2 h-4 w-4">
                          {province.id === selectedProvince && (
                            <FiCheck
                              className={cn(
                                province.id === selectedProvince ? "opacity-100" : "opacity-0"
                              )}
                            />
                          )}
                        </span>
                        {province.name_en}
                      </CommandItem>
                    ))
                  }
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default City