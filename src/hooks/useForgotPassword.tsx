import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordSchemaType } from "@/validation/validations"
import axios from "axios";


const sendResetPasswordLink = async (values: ForgotPasswordSchemaType) => {
  const { email } = values;
  const { data } = await axios.post(
    "/api/auth/forgot-password", { email }
  )
  
  return data;
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: sendResetPasswordLink,
  })
}