"use client"

import { GalleryCreateAndUpdateSchema, GalleryCreateAndUpdateSchemaType } from "@/validation/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner";
import { ScrollArea } from "@/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Input } from "@/ui/input"
import { Button, buttonVariants } from "@/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/ui/textarea";
import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

import { FiX, FiPlus, FiChevronRight, FiCheck } from "react-icons/fi"

import { useCreateGallery, createGalleryHookType } from "@/hooks/useCreateGallery";

import { useRouter } from "next/navigation";


type createGalleryFormPropType = {
  categories: {
    id: number;
    category: string;
    abbreviation: string | null;
  }[],
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

const CreateGalleryForm = ({ categories, cities, provinces }: createGalleryFormPropType) => {
  const [leftPhoneNumbersCount, setLeftPhoneNumbersCount] = useState<number>(2);
  const [selectedProvince, setSelectedProvince] = useState<{id:number, name: string}|null>(null);
  const router = useRouter();

  const { mutate: createGalley, data, isLoading, isSuccess, isError, error }: createGalleryHookType = useCreateGallery();

  useEffect(() => {
    isSuccess === true && data?.message && (toast.success(data.message), router.replace("/dashboard"), router.refresh());
    isError === true && error && toast.error(error?.response.data.error);
  }, [isSuccess, isError])

  const form = useForm<GalleryCreateAndUpdateSchemaType>({
    resolver: zodResolver(GalleryCreateAndUpdateSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      imageFile: null,
      city: "",
      address: "",
      phone_numbers:[{ number: "" }],
      categories: [],
      about: ""
    },
  })

  const { fields, append, remove } = useFieldArray({
    name:"phone_numbers",
    control: form.control
  })

  const { isDirty, errors } = form.formState;
  const { watch } = form;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      if (file.length > 0){
        form.setValue('imageFile', file[0]);
      }
    }
  };

  const onSubmit = async (values: GalleryCreateAndUpdateSchemaType) => {
    createGalley(values);
  }

  return (
    <>
      <h1 className="text-xl font-bold">Create Your Own Gallery</h1>
      <div className="mt-4 px-5 SLaptop:px-10 py-8 bg-white rounded">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center space-x-4">
              <Avatar className="w-32 h-32">
                <AvatarImage alt="avatar" src={(watch("imageFile") && URL.createObjectURL(watch("imageFile"))) ?? undefined}/>
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`${buttonVariants({variant: "outline"})} cursor-pointer`}>Upload new image</FormLabel>
                      <FormControl>
                        <Input type="file" name={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} disabled={field.disabled} onChange={(event) => {field.onChange(event), onFileChange(event)}} className="w-fit hidden" accept=".png, .jpg, .jpeg"/>
                      </FormControl>
                      <FormMessage />
                      {errors.imageFile ? <p className="text-sm font-medium text-destructive">{errors.imageFile.message as string }</p> : null}
                    </FormItem>
                  )}
                />
                {!errors.imageFile && (
                  <FormDescription>
                    Upload an image of your gallery, Max size 4Mb.
                  </FormDescription>
                )}
              </div>
            </div>
            <div className="mt-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="tel" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>City <span className="text-destructive">*</span></FormLabel>
                    <Dialog>
                      <DialogTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                            {field.value
                              ? cities.find(
                                  (city) => `${city.id}` === field.value
                                )?.name_en
                              : "Select city"
                            }
                            <FiChevronRight size={16}/>
                          </Button>
                        </FormControl>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Select City</DialogTitle>
                          <DialogDescription>
                            The selected city will be your gallery city.
                          </DialogDescription>
                        </DialogHeader>
                        <Command>
                          <CommandInput placeholder="Search city or province..."/>
                          {selectedProvince && (
                            <Badge variant="secondary" className="w-fit py-2 px-4 m-2 ms-3">
                              <span aria-description="unselect province" className="bg-slate-300 me-1.5 cursor-pointer rounded-full p-0.5" onClick={() => setSelectedProvince(null)}><FiX size={16}/></span>
                              { selectedProvince.name }
                            </Badge>
                          )}
                          <ScrollArea className="h-80">
                            <CommandEmpty>No city or province found.</CommandEmpty>
                            <CommandGroup>
                              <h4 className="text-xs text-gray-400 ms-3 my-3">{selectedProvince ? "Cities" : "Provinces"}</h4>
                              {selectedProvince ? 
                                cities
                                .filter((city) => city.province_id === selectedProvince.id)
                                .map((city) => (
                                  <CommandItem
                                    value={city.name_en}
                                    key={city.id}
                                    className={cn("mb-0.5", `${city.id}` === field.value && "bg-accent")}
                                    onSelect={() => {
                                      form.setValue("city", `${city.id}`);
                                    }}
                                  >
                                    <span className="flex items-center mr-2 h-4 w-4">
                                      {`${city.id}` === field.value && (
                                        <FiCheck
                                          className={cn(
                                            `${city.id}` === field.value ? "opacity-100" : "opacity-0"
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
                      Select which city your gallery is.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>Address <span className="text-destructive">*</span></FormLabel>
                    <FormDescription>
                      Provide your gallery address, so customers can find it.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="" {...field} type="tel" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-8">
                {fields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`phone_numbers.${index}.number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Phone numbers <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormDescription className={cn(index !== 0 && "sr-only", "flex flex-wrap items-center justify-between gap-y-2")}>
                          Add a phone number to your gallery, so it makes contact easier.
                          {leftPhoneNumbersCount === 0 ? (
                            <span className="text-destructive">
                              Can not add more
                            </span>
                          ) : (
                            <span>
                              You can add <span className="bg-slate-200 py-0.5 p-1.5 rounded-full">{ leftPhoneNumbersCount }</span> more
                            </span>
                          )}
                        </FormDescription>
                        <div className="flex items-center gap-4 !mt-3">
                          <FormControl>
                            <Input type="tel" placeholder="000 000 0000" {...field} className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                          </FormControl>
                          {
                            index > 0 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => (remove(index), setLeftPhoneNumbersCount(prev => prev + 1))}
                              >
                                <FiX size={16} className="me-1"/>
                                Remove
                              </Button>
                            )
                          }
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => (append({ number: "" }), setLeftPhoneNumbersCount(prev => prev - 1))}
                  >
                    <FiPlus size={16} className="me-1"/>
                    Add Phone Number
                  </Button>
                )}
              </div>
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem className="mt-8">
                    <div className="mb-4">
                      <FormLabel className="text-base">Categories <span className="text-destructive">*</span></FormLabel>
                      <FormDescription>
                        Select the categories that suit your gallery.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-3 md:!grid-cols-4 gap-2">
                      {categories.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="categories"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-2 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(`${item.id}`)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, `${item.id}`])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== `${item.id}`
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                {item.abbreviation ? (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <FormLabel className="font-normal underline cursor-pointer">
                                          {item.category}
                                        </FormLabel>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        { item.abbreviation }
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                ) : (
                                  <FormLabel className="font-normal cursor-pointer">
                                    {item.category}
                                  </FormLabel>
                                )}
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <FormLabel>About your gallery</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about your gallery"
                        className="px-4 py-2 bg-secondary focus:bg-gray-50 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-end">
              <Button size="lg" type="submit" disabled={isLoading || !isDirty} isLoading={isLoading}className="w-fit" style={{ marginTop: "44px" }}>{isLoading ? 'Creating Gallery...' : 'Create Gallery'}</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateGalleryForm