import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AccountManagementSchemaType } from "@/validation/validations"
import axios from "axios";


const changeEmail = async (values: AccountManagementSchemaType) => {
  const { email } = values;
  const { data } = await axios.post(
    "/api/auth/agent/change-email", { email }
  )
  
  return data;
}

export const useAccountManagement = () => {
  return useMutation({
    mutationFn: changeEmail,
  })
}

export type changeEmailHookType = {
  mutate: UseMutateFunction<any, unknown, AccountManagementSchemaType, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}