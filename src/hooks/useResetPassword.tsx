import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { RestPasswordSchemaType } from "@/validation/validations"
import axios from "axios";


const resetPassword = async ({ values, token }: {values: RestPasswordSchemaType , token: string}) => {
  const { newPassword, confirmNewPassword } = values;
  const { data } = await axios.post(
    `/api/auth/reset-password/${token}`, { newPassword, confirmNewPassword }
  )
  
  return data;
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  })
}

export type resetPasswordHookType = {
  mutate: UseMutateFunction<any, unknown, {
    values: RestPasswordSchemaType;
    token: string;
  }, unknown>
  data: any,
  error: any,
  isPending: boolean,
  isSuccess: boolean,
  isError: boolean,
}