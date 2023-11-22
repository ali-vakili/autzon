"use client"

import { avatarFallBackText } from "@/helper/fallBackText";
import { useUpdateAgent, updateAgentHookType } from "@/hooks/useUpdateAgent";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button, buttonVariants } from "@/ui/button";
import {
  Form,
  FormControl,
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


type editProfilePropType = {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone_number: string | null;
    bio: string | null;
    image_id: {
      url: string;
    } | null;
  }
}

const EditProfile = ({ user }: editProfilePropType) => {
  const [name, setName] = useState({ firstName: '', lastName: '' });
  const { id, firstName, lastName, image_id, phone_number, bio } = user;
  const { url: image } = image_id ?? { url: null };
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

  const { mutate: updateAgent, data, isLoading, isSuccess, isError, error }: updateAgentHookType = useUpdateAgent();

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
      lastName: lastName || undefined,
      phone_number: phone_number || undefined,
      bio: bio || undefined
    },
  })

  const { isDirty } = form.formState;

  return (
    <div className="flex flex-col h-fit">
      <h1 className="text-2xl font-bold mb-2">Edit profile</h1>
      <h4 className="text-sm">Update your profile any time you need, it is necessary to complete your profile</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <div className="flex items-center space-x-4 mt-8">
            <Avatar className="w-20 h-20">
              <AvatarImage alt="avatar" src={image ?? undefined}/>
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
            <Button type="submit" disabled={isLoading || !isDirty} isLoading={isLoading} className="w-fit" style={{ marginTop: "44px" }}>{isLoading ? 'Saving Profile...' : 'Save Profile'}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditProfile