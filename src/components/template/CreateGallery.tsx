"use client"

import { GalleryCreateAndUpdateSchema, GalleryCreateAndUpdateSchemaType } from "@/validation/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Input } from "@/ui/input"
import { Button, buttonVariants } from "@/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form"


const CreateGalleryForm = () => {

  const form = useForm<GalleryCreateAndUpdateSchemaType>({
    resolver: zodResolver(GalleryCreateAndUpdateSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  })

  const onSubmit = async () => {
    console.log("Submitted");
  }

  return (
    <>
      <h1 className="text-xl font-bold">Create Your Own Gallery</h1>
      <div className="mt-4 px-10 py-8 bg-white rounded">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage alt="avatar"/>
            <AvatarFallback>AV</AvatarFallback>
          </Avatar>
          <label htmlFor="uploadImage" className={`${buttonVariants({variant: "outline"})} cursor-pointer`}>Upload image</label> 
          <Input type="file" id="uploadImage" className="w-fit hidden" accept=".png, .jpg, .jpeg"/>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <div className="flex justify-between">
                      <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} type="tel" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mt-8">
                    <div className="flex justify-between">
                      <FormLabel>Address <span className="text-destructive">*</span></FormLabel>
                    </div>
                    <FormControl>
                      <Input placeholder="" {...field} type="tel" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-end">
              <Button type="submit" disabled={false || false} isLoading={false} className="w-fit" style={{ marginTop: "44px" }}>{false ? 'Creating Gallery...' : 'Create Gallery'}</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateGalleryForm