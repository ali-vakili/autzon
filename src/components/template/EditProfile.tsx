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
import { Input } from "@/ui/input"
import { AgentUpdateSchema, AgentUpdateType } from "@/validation/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";


type editProfilePropType = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone_number: string | null;
  image_id: {
    url: string;
  } | null;
}

const EditProfile = ({ user }: {user: editProfilePropType}) => {
  const [name, setName] = useState({ firstName: '', lastName: '' });
  const { id, firstName, lastName, image_id, phone_number } = user;
  const { url: image } = image_id || { url: null };
  const { data: session, update } = useSession();

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
        firstName: firstName,
        lastName: lastName,
        is_profile_complete: true 
      }
    });
  }
  useEffect(()=> {
    isSuccess === true && data?.message && (toast.success(data.message), updateSession());
    isError === true && error && toast.error(error?.response.data.message);
  }, [isSuccess, isError])

  const form = useForm<AgentUpdateType>({
    resolver: zodResolver(AgentUpdateSchema),
    defaultValues: {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phone_number: phone_number || undefined
    },
  })

  return (
    <div className="flex flex-col h-fit">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20">
          <AvatarImage alt="avatar" src={image ?? undefined}/>
          <AvatarFallback>{avatarFallBackText(firstName, lastName)}</AvatarFallback>
        </Avatar>
        <label htmlFor="uploadImage" className={`${buttonVariants({variant: "outline"})} cursor-pointer`}>Upload new image</label> 
        <Input type="file" id="uploadImage" className="w-fit hidden" accept=".png, .jpg, .jpeg"/>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} >
          <div className="flex flex-wrap items-start justify-between mt-8">
            <div className="lg:w-6/12 w-full lg:pe-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} type="text" className="px-4 py-2 bg-secondary focus:bg-slate-50"/>
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
          <div className="text-end">
            <Button type="submit" disabled={isLoading} isLoading={isLoading} className="w-fit" style={{ marginTop: "44px" }}>{isLoading ? 'Saving Profile...' : 'Save Profile'}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default EditProfile