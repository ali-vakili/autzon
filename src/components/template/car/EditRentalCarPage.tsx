"use client"

import { AddAndUpdateRentalCarSchema, AddAndUpdateRentalCarSchemaType } from "@/validation/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner";
import { ScrollArea } from "@/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Input } from "@/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button, buttonVariants } from "@/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form"
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/ui/textarea";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"

import { FiX, FiPlus , FiChevronRight, FiCheck, FiUpload  } from "react-icons/fi"
import { Car } from 'lucide-react';

import { useUpdateRentalCar, updateRentalCarHookType } from "@/hooks/useUpdateRentalCar";


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

type Car = {
  id: string;
  title: string;
  model: { id: number; name: string; brand_id: number; fuel_type_id: number | null };
  model_id: number;
  car_seat: { id: number; seats: string; seats_count: string }
  car_seat_id: number;
  build_year: { id: number; year: string };
  build_year_id: number;
  fuel_type: { id: number; type: string };
  fuel_type_id: number;
  category: { id: number; category: string; abbreviation: string | null };
  category_id: number;
  images: {
    id: string;
    url: string;
    car_id: string | null;
  }[];
  description: string;
  is_published: boolean;
};

type RentalCar = {
  id: string;
  car_id: string;
  price_per_day: number;
  pick_up_place: string;
  drop_off_place: string;
  reservation_fee_percentage: number | null;
  late_return_fee_per_hour: number | null;
  extra_time: boolean;
  createdAt: Date;
  updatedAt: Date;
};


type EditRentalCarPagePropType = {
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
  }[],
  carDetail: Car,
  rentalCarDetail: RentalCar
}


const EditRentalCarForm = ({ brandsAndModels, fuelTypes, buildYears, categories, carDetail, rentalCarDetail, carSeats }: EditRentalCarPagePropType) => {
  const [leftImageCount, setLeftImageCount] = useState<number>(carDetail? 4 - carDetail.images.length : 3);
  const [selectedBrand , setSelectedBrand] = useState<{id:number, name: string, models: models[]}|null>(null);
  const [carImages , setCarImages] = useState<{id: string, url: string}[]>([]);
  const [deletedImagesId , setDeletedImagesId] = useState<string[]>([]);
  const [updatedImagesIdAndIndex , setUpdatedImagesIdAndIndex] = useState<{id: string, index: number}[]>([]);

  const router = useRouter();

  const { id, title, model, model_id, car_seat_id, build_year_id, fuel_type_id, category_id, images, is_published, description } = carDetail;

  const { pick_up_place, drop_off_place, price_per_day, reservation_fee_percentage, extra_time, late_return_fee_per_hour } = rentalCarDetail;


  const { mutate: updateRentalCar, data, isLoading, isSuccess, isError, error }: updateRentalCarHookType = useUpdateRentalCar();

  useEffect(() => {
    const brandWithId = brandsAndModels.find((brand) => brand.id === model.brand_id);
    brandWithId && setSelectedBrand(brandWithId);
    const imageDetails = images.map((image) => ({
      id: image.id,
      url: image.url
    }));
    setCarImages(imageDetails);
  }, [])

  useEffect(() => {
    isSuccess === true && data?.message && (toast.success(data.message)) && router.push("/dashboard/cars");
    isError === true && error && toast.error(error?.response.data.error);
  }, [isSuccess, isError])

  const form = useForm<AddAndUpdateRentalCarSchemaType>({
    resolver: zodResolver(AddAndUpdateRentalCarSchema),
    defaultValues: {
      title: title ?? "",
      imagesUrl: images.map((image) => ({ imageUrl: "" })) ?? [{ imageUrl: "" }],
      imagesFile: images.map((image) => ({ imageFile: null })) ?? [{ imageFile: null }],
      model: `${model_id}` ?? "",
      seats: `${car_seat_id}` ?? "",
      fuelType: `${fuel_type_id}` ?? "",
      category: `${category_id}` ?? "",
      buildYear: `${build_year_id}` ?? "",
      description: description ?? "",
      price_per_day: `${price_per_day}` ?? "",
      pick_up_place: pick_up_place,
      drop_off_place: drop_off_place,
      reservation_fee_percentage: `${reservation_fee_percentage}` ?? "",
      late_return_fee_per_hour: late_return_fee_per_hour ? `${late_return_fee_per_hour}` : "",
      extra_time: extra_time ?? false,
      is_published: is_published ?? true,
    },
  })
  
  const { fields: ImagesUrlFields, append: ImagesUrlAppend, remove: ImagesUrlRemove } = useFieldArray({
    name:"imagesUrl",
    control: form.control
  })
  
  const { append: ImagesFileAppend, remove: ImagesFileRemove } = useFieldArray({
    name:"imagesFile",
    control: form.control
  })
  
  const { isDirty, errors } = form.formState;
  const { watch } = form;
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files;
    if (file) {
      if (file.length > 0){
        form.setValue(`imagesFile.${index}.imageFile`, file[0]);
        updateImageFromDetail(index);
      }
    }
  };

  const removeImageFromDetail = (index: number) => {
    if (index >= 0 && index < carImages.length) {
      const idToDelete = carImages[index].id;
      setDeletedImagesId((prevDeletedImagesId) => [...prevDeletedImagesId, idToDelete]);
      setCarImages((currentImages) => currentImages.filter((_, idx) => idx !== index));
    }
  }

  const updateImageFromDetail = (index: number) => {
    if (index >= 0 && index < carImages.length) {
      const idToUpdate = carImages[index].id;
      setUpdatedImagesIdAndIndex((prevUpdatedImagesId) => [...prevUpdatedImagesId, { id:idToUpdate, index: index + 1 }]);
    }
  }
  
  const onSubmit = async (values: AddAndUpdateRentalCarSchemaType) => {
    updateRentalCar({ values, deletedImagesId, updatedImagesIdAndIndex, car_id: id });
  }


  return (
    <>
      <h1 className="text-xl font-bold">Edit Rental Car - {title}</h1>
      <div className="mt-4 px-10 py-8 bg-white rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-2">
              <p className="text-xs xl:text-sm">{leftImageCount === 0 ? (
                <span className="text-destructive">
                  Can not add more
                </span>
              ) : (
                <span>
                  You can add <span className="bg-slate-200 py-0.5 p-1.5 rounded-full">{ leftImageCount }</span> more
                </span>
              )}
              </p>
              {ImagesUrlFields.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="text-gray-600 my-auto"
                  onClick={() => (ImagesUrlAppend({ imageUrl: "" }), setLeftImageCount(prev => prev - 1), ImagesFileAppend({ imageFile: null }))}
                >
                  <FiPlus size={16} className="me-1.5"/>
                  Add another image
                </Button>
              )}
            </div>
            <div className="flex items-start flex-wrap gap-4 border border-dashed w-fit rounded-lg p-4">
              {ImagesUrlFields.map((field, index) => (
                <div className="relative flex flex-col items-center gap-2" key={field.id}>
                  <Avatar className="w-64 h-48 !rounded-lg">
                    <AvatarImage className="!rounded-lg" alt="avatar" src={(watch(`imagesFile.${index}.imageFile`) ? URL.createObjectURL(watch(`imagesFile.${index}.imageFile`)) : carImages[index] && carImages[index].url) ?? undefined}/>
                    <AvatarFallback className="flex flex-col !rounded-lg bg-white"><Car className="text-gray-400" size={52} strokeWidth={1}/><span className="text-gray-600 text-sm">Upload your car image</span></AvatarFallback>
                  </Avatar>
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`imagesUrl.${index}.imageUrl`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className={`${buttonVariants({variant: "outline", size: "sm"})} cursor-pointer`}><FiUpload className="me-1"/> Upload</FormLabel>
                        <FormControl>
                          <Input type="file" name={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} disabled={field.disabled} onChange={(event) => {field.onChange(event), onFileChange(event, index)}} className="w-fit hidden" accept=".png, .jpg, .jpeg"/>
                        </FormControl>
                        {
                          index === 0 && (
                            <p className="text-sm text-muted-foreground mt-2 text-center border border-dashed p-2 rounded-md">
                              Cover image
                            </p>
                          )
                        }
                        {
                          index > 0 && (
                            <>
                              <Button
                                className="absolute top-0 right-2 w-8 h-8"
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => (ImagesUrlRemove(index), setLeftImageCount(prev => prev + 1), ImagesFileRemove(index), removeImageFromDetail(index))}
                              >
                                <FiX size={16}/>
                              </Button>
                              <Badge variant={"secondary"} className="rounded w-fit self-center py-2 px-3">{index + 1}</Badge>
                            </>
                          )
                        }
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Upload images of your car, Max size 4Mb.
            </p>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buildYear"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Build Year <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the car build year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-60">
                      {buildYears.map(buildYear => (
                        <SelectItem key={buildYear.id} value={`${buildYear.id}`}>{buildYear.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Provide your car build year.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Model <span className="text-destructive">*</span></FormLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                          {field.value
                            ? selectedBrand?.models.find(
                                (model) => `${model.id}` === field.value
                              )?.name
                            : "Select model"
                          }
                          <FiChevronRight size={16}/>
                        </Button>
                      </FormControl>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Select Model</DialogTitle>
                        <DialogDescription>
                          The selected model will be your car model.
                        </DialogDescription>
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
                                  className={cn("mb-0.5", `${model.id}` === field.value && "bg-accent")}
                                  onSelect={() => {
                                    form.setValue("model", `${model.id}`)
                                  }}
                                >
                                  <span className="flex items-center mr-2 h-4 w-4">
                                    {`${model.id}` === field.value && (
                                      <FiCheck
                                        className={cn(
                                          `${model.id}` === field.value ? "opacity-100" : "opacity-0"
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
                  <FormDescription>
                    Select which model your car is.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seats"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Car seats <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a car seats" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carSeats.map(seat => (
                        <SelectItem key={seat.id} value={`${seat.id}`}>{seat.seats}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select how many seats your car have.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Fuel Type <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelTypes.map(fuelType => (
                        <SelectItem key={fuelType.id} value={`${fuelType.id}`}>{fuelType.type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-60">
                      {categories.map(category => (
                        <SelectItem key={category.id} value={`${category.id}`}>
                          {category.category}&nbsp;
                          {category.abbreviation && (
                            <p className="text-gray-400 inline">
                              - {category.abbreviation}
                            </p>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your car category.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-8" />
            <div>
              <h2 className="text-lg font-semibold">Pick Up And Drop Off Place</h2>
              <p className="text-sm text-gray-400 mt-2">First value for each field is your gallery located address.</p>
              <FormField
                control={form.control}
                name="pick_up_place"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>Pick up place <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="drop_off_place"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Drop off place <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-8" />
            <div>
              <h2 className="text-lg font-semibold">Renting Price And Fee</h2>
              <FormField
                control={form.control}
                name="price_per_day"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Price per day <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="$" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
                    </FormControl>
                    <FormDescription>
                      Provide the amount of money($) for a renting day.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reservation_fee_percentage"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Reservation fee percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="%" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
                    </FormControl>
                    <FormDescription>
                      Provide the  percentage amount(%) for a reservation fee.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-8" />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-8">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your car"
                      className="px-4 py-2 bg-secondary focus:bg-gray-50 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-start rounded-lg border p-4 mt-8">
              <FormField
                control={form.control}
                name="extra_time"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between w-full">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Extra Time
                      </FormLabel>
                      <FormDescription>
                        Enables Extra time price for the rented car per hour.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="late_return_fee_per_hour"
                render={({ field }) => (
                  <FormItem className="mt-8 w-full">
                    <FormLabel>Late return fee per hour <span className="text-destructive">{watch("extra_time") && '*'}</span></FormLabel>
                    <FormControl>
                      <Input disabled={!watch("extra_time")} placeholder="$" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Publish Car
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      You can uncheck if you don't want to,&nbsp;
                      <p className="inline text-orange-500">
                        note that the users will not be able to see the car.
                      </p> 
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <div className="text-end">
              <Button size="lg" type="submit" disabled={isLoading || !isDirty} isLoading={isLoading} className="w-fit" style={{ marginTop: "44px" }}>{isLoading ? 'Editing Rental Car...' : 'Edit Rental Car'}</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default EditRentalCarForm