import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { ChangePasswordSchemaType } from "@/validation/validations"
import axios from "axios";


const changePassword = async (values: ChangePasswordSchemaType) => {
  const { oldPassword, newPassword, confirmNewPassword } = values;
  const { data } = await axios.post(
    "/api/auth/agent/change-password", { oldPassword, newPassword, confirmNewPassword }
  )
  
  return data;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  })
}

export type changePasswordHookType = {
  mutate: UseMutateFunction<any, unknown, ChangePasswordSchemaType, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}