"use client"

import { avatarFallBackText } from "@/helper/fallBackText";
import { useUpdateAgent, updateAgentHookType } from "@/hooks/useUpdateAgent";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button, buttonVariants } from "@/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form"
import { Textarea } from "@/ui/textarea";
import { Input } from "@/ui/input"
import { AgentUpdateSchema, AgentUpdateType } from "@/validation/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FiCheck, FiChevronRight, FiX } from "react-icons/fi";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";


type editProfilePropType = {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone_number: string | null;
    bio: string | null;
    city_id: number | null,
    city: {
      id: number;
      name_en: string;
      latitude: number;
      longitude: number;
      province: {
        id: number;
        name_en: string;
        latitude: number;
        longitude: number;
      };
    } | null;
    image: {
      url: string;
    } | null;
  }
  cities: {
    id: number;
    name_en: string;
    province_id: number;
    latitude: number;
    longitude: number;
  }[],
  provinces: {
    id: number;
    name_en: string;
    latitude: number;
    longitude: number;
  }[]
}

const EditProfile = ({ user, cities, provinces }: editProfilePropType) => {
  // console.log(user);
  // console.log(cities);
  // console.log(provinces);
  const [name, setName] = useState({ firstName: '', lastName: '' });

  const [selectedProvince, setSelectedProvince] = useState<{id:number, name_en: string, latitude: number, longitude: number}|null>(user.city !== null ? { id: user.city.province.id, name_en: user.city.province.name_en, latitude: user.city.province.latitude, longitude: user.city.province.longitude } : null);

  const [selectedCity, setSelectedCity] = useState<{id:number, name_en: string, latitude: number, longitude: number}|null>(user.city !== null ? { id: user.city.id, name_en: user.city.name_en, latitude: user.city.latitude, longitude: user.city.longitude } : null);

  const { id, firstName, lastName, image, phone_number, bio } = user;
  const { url } = image ?? { url: null };
  const { data: session, update } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const messageType = searchParams.get("messageType");
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    if (message) {
      if (messageType === "error") {
        toast.error(message);
      }
    }
  }, [])

  const { mutate: updateAgent, data, isPending, isSuccess, isError, error }: updateAgentHookType = useUpdateAgent();

  const onSubmit = async (values: AgentUpdateType) => {
    const { firstName, lastName } = values;
    updateAgent({ values, agent_id: id });
    setName({ firstName, lastName });
  }

  const updateSession = async () => {
    const { firstName, lastName } = name;
    await update({
      ...session,
      user: {
        ...session?.user,
        profile: data.image_url,
        firstName: firstName,
        lastName: lastName,
        city: { ...selectedCity, province: selectedProvince },
        is_profile_complete: true 
      }
    });
    redirectTo(callbackUrl);
  }

  const redirectTo = (url: string | null) => {
    url === "/dashboard" && toast.loading("Going to the dashboard page...");
    isSuccess === true && url && router.push(url);
  }

  useEffect(()=> {
    isSuccess === true && data?.message && (toast.success(data.message), updateSession(), router.replace(pathname));
    isError === true && error && toast.error(error?.response.data.error);
  }, [isSuccess, isError])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      if (file.length > 0){
        form.setValue('imageFile', file[0]);
      }
    }
  };

  const form = useForm<AgentUpdateType>({
    resolver: zodResolver(AgentUpdateSchema),
    defaultValues: {
      imageUrl: "",
      imageFile: null,
      firstName: firstName || undefined,
      city: selectedCity ? `${selectedCity?.id}` : "",
      lastName: lastName || undefined,
      phone_number: phone_number || undefined,
      bio: bio || undefined
    },
  })

  const { errors } = form.formState;
  const { watch } = form;

  return (
    <div className="flex flex-col h-fit">
      <h1 className="text-2xl font-bold mb-2">Edit profile</h1>
      <h4 className="text-sm">Update your profile any time you need, it is necessary to complete your profile</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <div className="flex items-center space-x-4 mt-8">
            <Avatar className="w-20 h-20">
              <AvatarImage alt="avatar" src={(watch("imageFile") && URL.createObjectURL(watch("imageFile"))) ?? url ?? undefined}/>
              <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
            </Avatar>
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
                  {errors.imageFile ? <p className="text-sm font-medium text-destructive">{errors.imageFile.message as string}</p> : null}
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-wrap items-start justify-between mt-8">
            <div className="lg:w-6/12 w-full lg:pe-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="text" className="px-4 py-2 bg-secondary focus:bg-slate-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:w-6/12 w-full lg:ps-3">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Last name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="text" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem className="mt-8">
                <div className="flex justify-between">
                  <FormLabel>Your phone number <span className="text-destructive">*</span></FormLabel>
                </div>
                <FormControl>
                  <Input placeholder="000 000 0000" {...field} type="tel" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
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
                  <DialogContent className="STablet:max-w-[425px] phone:max-w-[360px] max-w-[320px]">
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
                          { selectedProvince.name_en }
                        </Badge>
                      )}
                      <ScrollArea className="h-80">
                        <CommandList>
                          <CommandEmpty>No city or province found.</CommandEmpty>
                          <CommandGroup heading={selectedProvince ? "Cities" : "Provinces"}>
                            {/* <h4 className="text-xs text-gray-400 ms-3 my-3">{selectedProvince ? "Cities" : "Provinces"}</h4> */}
                            {selectedProvince ? 
                              cities
                              .filter((city) => city.province_id === selectedProvince.id)
                              .map((city) => (
                                <CommandItem
                                  value={city.name_en}
                                  key={city.id}
                                  className={cn("mb-0.5", `${city.id}` === field.value && "bg-accent", "cursor-pointer")}
                                  onSelect={() => {
                                    form.setValue("city", `${city.id}`), setSelectedCity({id: city.id, name_en: city.name_en, latitude: city.latitude, longitude: city.longitude});
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
                                  className={cn("mb-0.5", province.id === selectedProvince && "bg-accent", "cursor-pointer")}
                                  onSelect={() => {
                                    setSelectedProvince({id: province.id, name_en: province.name_en, latitude: province.latitude, longitude: province.longitude})
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
                <FormDescription>
                  Select which city your gallery is.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="mt-8">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="px-4 py-2 bg-secondary focus:bg-slate-50 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-end">
            <Button type="submit" disabled={isPending} isLoading={isPending} className="w-fit" style={{ marginTop: "44px" }}>{isPending ? 'Saving Profile...' : 'Save Profile'}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditProfile