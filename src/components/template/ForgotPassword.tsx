"use client"

import Link from "next/link"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"

import { Button } from "@/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form"
import { Input } from "@/ui/input"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ForgotPasswordSchema, ForgotPasswordSchemaType } from "@/validation/validations"
import { useForgotPassword } from "@/hooks/useForgotPassword";

import { FiArrowLeft, FiCheckCircle, FiInfo } from "react-icons/fi";

import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"


const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const { data } = useSession();
  if (data?.user) {
    return redirect('/');
  }

  const { mutate: sendResetPasswordLink, isLoading, isSuccess, isError, error } = useForgotPassword();

  useEffect(() => {
    if(isError) {
      if (error instanceof AxiosError) {
        const { error: errorMessage } = error.response?.data;
        setErrorMessage(errorMessage);
      }
    }
  },[error])

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    sendResetPasswordLink(values)
  }
  
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const { isDirty } = form.formState;

  return (
    <div className="flex flex-col flex-1 items-center flex-shrink-0 px-5">
      <div className="flex flex-col flex-1 max-w-sm mt-14">
        <Button onClick={router.back} variant={"link"} size={"sm"} className="w-fit p-0"><FiArrowLeft size={24} className="me-1.5"/>Back</Button>
        <h1 className="mt-4 mb-2 text-2xl font-semibold">Reset Your Password</h1>
        <h2 className="text-sm text-foreground-light mb-10">Type in your email and we&apos;ll send you a link to reset your password</h2>
        {isError && (
          <div className="w-full bg-destructive/80 rounded mb-3">
            <h4 className="text-gray-50 text-sm p-2 text-center ">{errorMessage}</h4>
          </div>
        )}
        {isSuccess ? (
          <div className="flex px-6 py-4 rounded bg-success border-1 border-green-700">
            <FiCheckCircle className="text-gray-200 text-xl w-100 flex-shrink-0 me-4"/>
            <div>
              <h4 className="text-gray-200 mb-1.5 font-semibold text-sm">Check your email</h4>
              <p className="text-gray-200 text-xs font-semibold">
                We have successfully sent a link to reset your password, Please check your email inbox.
              </p>
              <Separator className="my-2" />
              <div className="bg-white p-2 rounded-md">
                <h3 className="inline-flex text-gray-600 text-xs font-semibold">
                <FiInfo size={16} className="me-1.5 flex-shrink-0"/>if you registered using your email and password, you will receive a password reset email.
                </h3>
              </div>
            </div>
          </div>
        ):(
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="min-[425px]:w-96 min-[375px]:w-80 w-72 space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="email" placeholder="you@example.com" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Separator className="!mt-8" />
              <Button type="submit" disabled={isLoading || !isDirty} isLoading={isLoading} className="w-full" style={{ marginTop: "16px" }}>{isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}</Button>
            </form>
          </Form>
        )}
        <div className="self-center my-8 text-sm">
          <span className="text-foreground-light">
            Have an account?&nbsp;
          </span>
          <Link href="/sign-in" className="underline transition text-foreground hover:text-foreground-light">
            Sign In Now
          </Link>    
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword