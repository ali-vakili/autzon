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
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

import { USER } from "@/constants/roles";
import logoIcon from "../../../public/logo-icon.svg";
import Image from "next/image";

import "../css/common.css"


const SignInForm = () => {
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

  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

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
  
  const { data } = useSession();
  if (data?.user) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col flex-1 items-center flex-shrink-0 md:grid lg:max-w-none lg:grid-cols-5 px-4 lg:min-h-[680px] lg:my-8 lg:mx-24 lg:px-0 lg:border rounded">
      <div className="relative col-span-2 hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-primary rounded" />
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <Image src={logoIcon} alt="logo-icon" width={32} height={32}/>
          autzon
        </div>
        <div className="relative z-20 mt-auto">
          <div className="absolute select-none -top-10 -left-4">
            <span className="text-[160px] leading-none text-muted-foreground/30">“</span>
          </div>
          <div className="!backdrop-blur-sm bg-white/95 shadow-lg rounded-xl supports-[backdrop-filter]:bg-white/10 p-4">
            <blockquote className="space-y-2">
              <p className="text-2xl">
                &ldquo;autzon has saved me countless hours of work and
                helped me managing my auto gallery to have work with amazing clients better than
                ever before.&rdquo;
              </p>
              <footer className="flex items-center pt-4 text-sm text-muted-foreground"><Image src={'https://i.pravatar.cc/400?img=13'} width={48} height={48} quality={100} alt="user" className="rounded-full me-3"/><h5 className="font-semibold">John Davis</h5></footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 col-span-3 LPhone:max-w-sm w-full mx-auto">
        <h1 className="mt-10 mb-2 text-2xl font-semibold">Welcome Back</h1>
        <h2 className="text-sm text-foreground-light mb-10">Sign in to your account</h2>
        <ContinueWithGoogle text='Sign in with Google' callbackUrl={callbackUrl} role={USER} isLoading={loader}/>
        <hr className="divider sign-in"></hr>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-[425px]:w-96 space-y-4">
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
            Don&apos;t have an account?&nbsp;
          </span>
          <Link href="/sign-up" className="underline transition text-foreground hover:text-foreground-light">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  )
}

const SignIn = () => {
  return(
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}

export default SignIn