"use client"

import Link from "next/link"
import { Button } from "@/ui/button"
import { Loader2 } from "lucide-react"

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

import "./signIn.scss"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"


const SignIn = () => {
  const[loader, setLoader] = useState(false);
  const[error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const onSubmit = async (values: SignInFormSchemaType) => {
    setLoader(true);
    try {
      const {email, password} = values;
      const response = await signIn('credentials', {
        email: email,
        password: password,
        callbackUrl,
        redirect: false
      })
      if (!response?.error) {
        setError("");
        router.push(callbackUrl);
      }
      else {
        setError(response?.error)
      }
    }
    catch(error) { 
      setError("Something went wrong please try again later")
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
    <div className="flex flex-col flex-1 items-center flex-shrink-0 px-5 pt-16 pb-8">
      <div className="flex flex-col flex-1">
        <h1 className="mt-8 mb-2 text-2xl lg:text-3xl font-semibold">Welcome Back</h1>
        <h2 className="text-sm text-foreground-light mb-10">Sign in to your account</h2>
        <Button variant="outline" type="submit" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" role="img" className="me-3">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.64 9.20419C17.64 8.56601 17.5827 7.95237 17.4764 7.36328H9V10.8446H13.8436C13.635 11.9696 13.0009 12.9228 12.0477 13.561V15.8192H14.9564C16.6582 14.2524 17.64 11.9451 17.64 9.20419Z" fill="#4285F4"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40664 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335"></path>
          </svg>
          Sign in with Google
        </Button>
        <hr className="divider"></hr>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-[425px]:w-96 min-[375px]:w-80 w-72 space-y-6">
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
                    <FormLabel>Forgot Password?</FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="••••••••" {...field} type="password" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loader ? (
                <Button disabled className="w-full" style={{marginTop: "32px"}}>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ):(
                <Button type="submit" className="w-full" style={{marginTop: "32px"}}>Sign In</Button>
              )}
          </form>
        </Form>
        <div className="self-center my-8 text-sm">
          <span className="text-foreground-light">
            Don't have an account?&nbsp;
          </span>
          <Link href="#" className="underline transition text-foreground hover:text-foreground-light">
            Sign Up Now
          </Link>    
        </div>
      </div>
    </div>
  )
}

export default SignIn