"use client"

import Link from "next/link"
import { Button } from "@/ui/button"
import { toast } from 'sonner';
import ContinueWithGoogle from "@/module/ContinueWithGoogle";

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
import { SignInFormSchema, SignInFormSchemaType } from "@/validation/validations"

import { signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { USER } from "@/constants/roles";
import "@/scss/Common.scss"


const SignIn = () => {
  const[loader, setLoader] = useState(false);
  const[success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const messageType = searchParams.get("messageType");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  useEffect(() => {
    if (message) {
      if (messageType === "error") {
        toast.error(message);
      }
    }
  }, [])

  const onSubmit = async (values: SignInFormSchemaType) => {
    toast.loading("Signing in...");
    setLoader(true);
    try {
      const {email, password} = values;
      const response = await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl,
        redirect: false
      })
      if (!response?.error && response?.error !== "Your email is not verified") {
        setSuccess(true);
        toast.success("Signed in successfully");
        router.replace(callbackUrl);
      }
      else {
        if (response?.error === "Your email is not verified") {
          toast.error(response?.error)
        }
        else {
          toast.error("Invalid credentials");
        }
      }
    }
    catch(error) { 
      setSuccess(false);
      toast.error("Something went wrong please try again later");
    }
    finally {
      setLoader(false);
    }
  }

  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  return (
    <div className="flex flex-col flex-1 items-center flex-shrink-0 px-5">
      <div className="flex flex-col flex-1">
        <h1 className="mt-8 mb-2 text-2xl font-semibold">Welcome Back</h1>
        <h2 className="text-sm text-foreground-light mb-10">Sign in to your account</h2>
        <ContinueWithGoogle text='Sign in with Google' callbackUrl={callbackUrl} role={USER} isLoading={loader}/>
        <hr className="divider sign-in"></hr>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-[425px]:w-96 min-[375px]:w-80 w-72 space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} type="text" className="border text-sm px-4 py-2 bg-secondary focus:bg-slate-50"/>
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
                    <Link href={"/forgot-password"} className="text-sm text-muted-foreground">Forgot Password?</Link>
                  </div>
                  <FormControl>
                    <Input placeholder="••••••••" {...field} type="password" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={success || loader} isLoading={loader} className="w-full" style={{ marginTop: "32px" }}>{loader ? 'Signing in' :'Sign In'}</Button>
          </form>
        </Form>
        <div className="self-center my-8 text-sm">
          <span className="text-foreground-light">
            Don't have an account?&nbsp;
          </span>
          <Link href="/sign-up" className="underline transition text-foreground hover:text-foreground-light">
            Sign Up Now
          </Link>    
        </div>
      </div>
    </div>
  )
}

export default SignIn