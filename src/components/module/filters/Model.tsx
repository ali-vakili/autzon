"use client"

import { Label } from "@/components/ui/label";
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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button";
import { FiCheck, FiChevronRight, FiX } from "react-icons/fi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { filterOptionsType } from "@/components/template/car/AllCars";


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

type modelPropType = {
  brandsAndModels: {
    id: number;
    name: string;
    models: models[];
  }[],
  defaultValue: string;
  setFilterOptions: Dispatch<SetStateAction<filterOptionsType>>
}


const Model = ({ brandsAndModels, setFilterOptions, defaultValue } : modelPropType) => {
  const [selectedBrand, setSelectedBrand] = useState<{id:number, name: string, models: models[]}|null>(null);
  const [selectedModelId , setSelectedModelId] = useState<string|null>(defaultValue);
  const handleModelChange = (selectedYearId: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      model_id: selectedYearId,
    }));
  };

  useEffect(() => {
    if (defaultValue === "") {
      setSelectedBrand(null);
      setSelectedModelId(null);
    }
  }, [defaultValue])

  return (
    <div className="space-y-2">
      <Label>Model</Label>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-between", !selectedBrand && "text-muted-foreground")}>
            {selectedModelId
              ? selectedBrand?.models.find(
                  (model) => `${model.id}` === selectedModelId
                )?.name
              : "Select a model"
            }
            <FiChevronRight size={16}/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Model</DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Search model or brand..."/>
            {selectedBrand && (
              <Badge variant="secondary" className="w-fit py-2 px-4 m-2 ms-3">
                <span aria-description="unselect province" className="bg-slate-300 me-1.5 cursor-pointer rounded-full p-0.5" onClick={() => setSelectedBrand(null)}><FiX size={16}/></span>
                { selectedBrand.name }
              </Badge>
            )}
            <ScrollArea className="h-80">
              <CommandEmpty>No model or brand found.</CommandEmpty>
              <CommandGroup>
                <h4 className="text-xs text-gray-400 ms-3 my-3">{selectedBrand ? "Models" : "Brands"}</h4>
                {selectedBrand ? 
                  selectedBrand.models
                  .map((model) => (
                    <CommandItem
                      value={model.name}
                      key={model.id}
                      className={cn("mb-0.5", `${model.id}` === selectedModelId && "bg-accent")}
                      onSelect={() => {
                        setSelectedModelId(`${model.id}`), handleModelChange(`${model.id}`)
                      }}
                    >
                      <span className="flex items-center mr-2 h-4 w-4">
                        {`${model.id}` === selectedModelId && (
                          <FiCheck
                            className={cn(
                              `${model.id}` === selectedModelId ? "opacity-100" : "opacity-0"
                            )}
                          />
                        )}
                      </span>
                      {model.name}
                    </CommandItem>
                  ))
                :
                  brandsAndModels.map((brand) => (
                    <CommandItem
                      value={brand.name}
                      key={brand.id}
                      className={cn("mb-0.5", brand.id === selectedBrand && "bg-accent")}
                      onSelect={() => {
                        setSelectedBrand({id: brand.id, name: brand.name, models: brand.models})
                      }}
                    >
                      <span className="flex items-center mr-2 h-4 w-4">
                        {brand.id === selectedBrand && (
                          <FiCheck
                            className={cn(
                              brand.id === selectedBrand ? "opacity-100" : "opacity-0"
                            )}
                          />
                        )}
                      </span>
                      {brand.name}
                    </CommandItem>
                  ))
                }
              </CommandGroup>
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

export default Model