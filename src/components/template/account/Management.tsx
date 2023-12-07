"use client"

import { Button } from "@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/ui/input"
import { AccountManagementSchema, AccountManagementSchemaType, ChangePasswordSchema, ChangePasswordSchemaType } from "@/validation/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useChangePassword, changePasswordHookType } from "@/hooks/useChangePassword";
import { useAccountManagement, changeEmailHookType } from "@/hooks/useChangeEmail";

import { FiEye, FiEyeOff } from "react-icons/fi";


type managementPropType = {
  user: {
    email: string;
  }
}

const Management = ({ user }: managementPropType) => {
  const [newEmail, setNewEmail] = useState<string>("");
  const [togglePasswordType, setTogglePasswordType] = useState<boolean>(false);
  const { email } = user;
  const { data: session, update } = useSession();


  const { mutate: changePassword, data: CPData, isLoading:CPIsLoading, isSuccess:CPIsSuccess, isError:CPIsError, error:CPError }: changePasswordHookType = useChangePassword();

  const { mutate: changeEmail, data: CEData, isLoading:CEIsLoading, isSuccess:CEIsSuccess, isError:CEIsError, error:CEError }: changeEmailHookType = useAccountManagement();

  const onSubmitAccount = async (values: AccountManagementSchemaType) => {
    changeEmail(values);
    setNewEmail(values.email);
  }

  const onSubmitChangePassword = async (values: ChangePasswordSchemaType) => {
    changePassword(values);
  }

  const updateSession = async () => {
    await update({
      ...session,
      user: {
        ...session?.user,
        email: newEmail
      }
    });
    accountForm.reset({
      email: newEmail,
    });
  }

  useEffect(()=> {
    CPIsSuccess === true && CPData?.message && toast.success(CPData.message);
    CPIsError === true && CPError && toast.error(CPError?.response.data.error);
  }, [CPIsSuccess, CPIsError])

  useEffect(()=> {
    CEIsSuccess === true && CEData?.message && (toast.success(CEData.message), updateSession());
    CEIsError === true && CEError && toast.error(CEError?.response.data.error);
  }, [CEIsSuccess, CEIsError])
  

  const accountForm = useForm<AccountManagementSchemaType>({
    resolver: zodResolver(AccountManagementSchema),
    defaultValues: {
      email: email
    },
  })

  const changePasswordForm = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    },
  })

  const { isDirty: AccountIsDirty } = accountForm.formState;
  const { isDirty: ChangePasswordIsDirty } = changePasswordForm.formState;

  return (
    <div className="flex flex-col h-fit">
      <h1 className="text-2xl font-bold mb-2">Account management</h1>
      <h4 className="text-sm">Make changes to your account information</h4>
      <Form {...accountForm}>
        <form onSubmit={accountForm.handleSubmit(onSubmitAccount)} >
          <div className="flex gap-4 mt-8">
            <FormField
              control={accountForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Email <span className="text-gray-400">• Private</span></FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="text" className="px-4 py-2 bg-secondary focus:bg-slate-50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-8">
              <Button type="submit" disabled={CEIsLoading || !AccountIsDirty} isLoading={CEIsLoading} className="w-fit">{CEIsLoading ? 'Changing Email...' : 'Change Email'}</Button>
            </div>
          </div>
        </form>
      </Form>
      <Form {...changePasswordForm}>
        <div className="mt-8">
          <h4 className="text-sm font-medium w-fit">Password <span className="text-gray-400">• Private</span></h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="block mt-2">Change your password</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] gap-6">
              <DialogHeader>
                <DialogTitle>Change your password</DialogTitle>
                <DialogDescription>
                  Make sure to fill all the fields in order to change your password.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={changePasswordForm.handleSubmit(onSubmitChangePassword)}>
                <FormField
                  control={changePasswordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">Old Password</FormLabel>
                      <FormDescription>
                        Provide your current password
                      </FormDescription>
                      <FormControl>
                        <Input placeholder="" {...field} type="text" className="px-4 py-2 bg-secondary focus:bg-slate-50"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={changePasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <div className="relative">
                        <FormControl className="z-0">
                          <Input autoComplete="new-password" placeholder="••••••••" {...field} type={togglePasswordType ? "text" : "password"} className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
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
                  control={changePasswordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl className="z-0">
                        <Input autoComplete="new-password" placeholder="••••••••" {...field} type="password" className="px-4 py-2 bg-secondary focus:bg-gray-50"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="!mt-8">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => changePasswordForm.reset()}>
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={CPIsLoading || !ChangePasswordIsDirty} isLoading={CPIsLoading} className="w-fit">{CPIsLoading ? 'Changing Password...' : 'Change Password'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Form>
    </div>
  )
}

export default Management