"use client"

import { GalleryCreateAndUpdateSchema, GalleryCreateAndUpdateSchemaType } from "@/validation/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Input } from "@/ui/input"
import { Button, buttonVariants } from "@/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form"
import { cn } from "@/lib/utils"

import { FiX, FiPlus } from "react-icons/fi"
import { useState } from "react"


const CreateGalleryForm = () => {
  const [leftPhoneNumbersCount, setLeftPhoneNumbersCount] = useState<number>(2);

  const form = useForm<GalleryCreateAndUpdateSchemaType>({
    resolver: zodResolver(GalleryCreateAndUpdateSchema),
    defaultValues: {
      name: "",
      address: "",
      phone_numbers:[{ number: "" }]
    },
  })

  const { fields, append, remove } = useFieldArray({
    name:"phone_numbers",
    control: form.control
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
                        <FormDescription className={cn(index !== 0 && "sr-only", "flex items-center justify-between")}>
                          Add a phone number to your gallery, so makes it contact easier.
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
                        <FormControl className="!mt-3">
                          <div className="flex items-center gap-4">
                            <Input type="tel" placeholder="000 000 0000" {...field} className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
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
                        </FormControl>
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
            </div>
            <div className="text-end">
              <Button size="lg" type="submit" disabled={false || false} isLoading={false} className="w-fit" style={{ marginTop: "44px" }}>{false ? 'Creating Gallery...' : 'Create Gallery'}</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CreateGalleryForm