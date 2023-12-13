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
import { RestPasswordSchema, RestPasswordSchemaType } from "@/validation/validations"
import { useResetPassword, resetPasswordHookType } from "@/hooks/useResetPassword";
import { toast } from "sonner"

import { FiEye, FiEyeOff } from "react-icons/fi";

import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"


type RestPasswordPropsType = {
  token: string;
}

const ResetPassword = ({ token }: RestPasswordPropsType) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [togglePasswordType, setTogglePasswordType] = useState<boolean>(false);
  const router = useRouter();

  const { data: session } = useSession();
  if (session?.user) {
    return redirect('/');
  }

  const { mutate: resetPassword, data, isLoading, isSuccess, isError, error }: resetPasswordHookType = useResetPassword();

  useEffect(() => {
    if(isError) {
      if (error instanceof AxiosError) {
        const { error: errorMessage } = error.response?.data;
        setErrorMessage(errorMessage);
      }
    }
  },[error])

  useEffect(()=> {
    isSuccess === true && data?.message && (toast.success(data.message), router.replace("/sign-in"));
    isError === true && error && toast.error(error?.response.data.error);
  }, [isSuccess, isError])

  const onSubmit = async (values: RestPasswordSchemaType) => {
    resetPassword({values, token})
  }
  
  const form = useForm<RestPasswordSchemaType>({
    resolver: zodResolver(RestPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    mode: "onTouched"
  })

  const { isDirty } = form.formState;

  return (
    <div className="flex flex-col flex-1 items-center flex-shrink-0 px-5">
      <div className="flex flex-col flex-1 max-w-sm">
        <h1 className="mt-8 mb-2 text-2xl font-semibold">Reset Your Password</h1>
        <h2 className="text-sm text-foreground-light mb-10">Type in a new secure password and press reset password to update your password</h2>
        {isError && (
          <div className="w-full bg-destructive/80 rounded mb-3">
            <h4 className="text-gray-50 text-sm p-2 text-center ">{errorMessage}</h4>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-[425px]:w-96 min-[375px]:w-80 w-72 space-y-4">
          <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="">
                  <div className="flex justify-between">
                    <FormLabel>New password</FormLabel>
                  </div>
                  <div className="relative">
                    <FormControl className="z-0">
                      <Input autoComplete="new-password" id="password" placeholder="••••••••" {...field} type={togglePasswordType ? "text" : "password"} className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                    </FormControl>
                    <div className="absolute inset-y-0 right-0 pl-3 pr-1 flex space-x-1 items-center">
                      <button type="button" onClick={() => setTogglePasswordType(prev => !prev)} className="relative justify-center cursor-pointer inline-flex items-center text-center bg-gray-50 hover:bg-zinc-100 ease-out duration-200 rounded-md outline-none transition-all outline-0 border shadow-sm text-xs px-2.5 py-1 !mr-1">
                        {togglePasswordType ? <FiEyeOff/> : <FiEye/>}
                      </button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input id="confirmNewPassword" autoComplete="new-password" placeholder="••••••••" {...field} type="password" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="!mt-8" />
            <Button type="submit" disabled={isLoading || !isDirty} isLoading={isLoading} className="w-full" style={{ marginTop: "16px" }}>{isLoading ? 'Resetting Password...' : 'Reset Password'}</Button>
          </form>
        </Form>
        
        <div className="self-center my-8 text-sm">
          <span className="text-foreground-light">
            If you didn't mean to reset your password&nbsp;
          </span>
          <Link href="/sign-in" className="underline transition text-foreground hover:text-foreground-light">
            return to sign in
          </Link>    
        </div>
      </div>
    </div>
  )
}

export default ResetPassword