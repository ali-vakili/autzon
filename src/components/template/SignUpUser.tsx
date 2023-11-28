"use client"

import Link from "next/link"
import { Button } from "@/ui/button"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import ContinueWithGoogle from "@/module/ContinueWithGoogle"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form"
import { Input } from "@/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AccountCreateSchema, AccountCreateType } from "@/validation/validations"

import { FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";

import { useCreateUser } from "@/hooks/useCreateUser"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

import { USER } from "@/constants/roles"
import Image from "next/image"
import "@/scss/Common.scss"


const SignUpUser = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [togglePasswordType, setTogglePasswordType] = useState<boolean>(false);

  const { data } = useSession();
  if (data?.user) {
    return redirect('/');
  }

  const { mutate: createUser, isLoading, isSuccess, isError, error } = useCreateUser();

  useEffect(() => {
    if(isError) {
      if (error instanceof AxiosError) {
        const { error: errorMessage } = error.response?.data;
        setErrorMessage(errorMessage);
      }
    }
  },[error])

  const onSubmit = async (values: AccountCreateType) => {
    createUser(values);
  }
  
  const form = useForm<AccountCreateType>({
    resolver: zodResolver(AccountCreateSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onTouched"
  })

  const { isDirty } = form.formState;

  return (
    <div className="flex flex-col flex-1 items-center flex-shrink-0 md:grid lg:max-w-none lg:grid-cols-5 px-4 lg:min-h-[680px] lg:my-8 lg:mx-24 lg:px-0 lg:border rounded">
      <div className="relative col-span-2 hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900 rounded" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          autzon
        </div>
        <div className="relative z-20 mt-auto">
          <div className="absolute select-none -top-10 -left-4">
            <span className="text-[160px] leading-none text-muted-foreground/30">“</span>
          </div>
          <div className="!backdrop-blur-sm bg-white/95 shadow-lg rounded-xl supports-[backdrop-filter]:bg-white/10 p-4">
            <blockquote className="space-y-2">
              <p className="text-2xl">
                &ldquo;Thanks to Autzon, I've streamlined my workload and transformed the way I connect with top-tier clients in my auto gallery, saving me invaluable time and maximizing productivity.&rdquo;
              </p>
              <footer className="flex items-center pt-4 text-sm text-muted-foreground"><Image src={'https://supabase.com/images/twitter-profiles/6f1O8ZOW_400x400.jpg'} width={48} height={48} alt="user" className="rounded-full me-3"/>louis barclay</footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start flex-1 col-span-3 max-w-sm mx-auto">
        <h1 className="mt-8 mb-2 text-2xl font-semibold">Get started</h1>
        <h2 className="text-sm text-foreground-light mb-10">Create a new account</h2>
        <ContinueWithGoogle text='Sign up with Google' callbackUrl={"/"} role={USER} isLoading={isLoading}/>
        <hr className="divider sign-up"></hr>
        {isError && (
          <div className="w-full bg-destructive/80 rounded mb-3">
            <h4 className="text-gray-50 text-sm p-2 text-center ">{errorMessage}</h4>
          </div>
        )}
        {isSuccess ? (
          <div className="flex px-6 py-4 rounded bg-success border-1 border-green-700">
            <FiCheckCircle className="text-gray-200 text-xl w-100 flex-shrink-0 me-4"/>
            <div>
              <h4 className="text-gray-200 mb-1.5 font-semibold text-sm">Check your email to confirm</h4>
              <p className="text-gray-200 text-xs font-semibold">
                You've successfully signed up, Please check your email to confirm your account before signing in to the autzone dashboard.
              </p>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input id="confirmPassword" autoComplete="new-password" placeholder="••••••••" {...field} type="password" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !isDirty} isLoading={isLoading} className="w-full" style={{ marginTop: "32px" }}>{isLoading ? 'Signing up...' : 'Sign Up'}</Button>
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
        <div className="sm:text-center mb-6">
          <p className="text-xs text-muted-foreground sm:mx-auto sm:max-w-sm">By continuing, you agree to autzon's <Link className="underline hover:text-foreground" href="#">Terms of Service</Link> and <Link className="underline hover:text-foreground" href="#">Privacy Policy</Link>, and to receive periodic emails with updates.</p>
        </div>
      </div>
    </div>
  )
}

export default SignUpUser