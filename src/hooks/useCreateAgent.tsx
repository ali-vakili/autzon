import { useMutation } from "@tanstack/react-query";
import { AccountCreateType } from "@/validation/validations"
import { AGENT } from "@/constants/roles";
import axios from "axios";


const createAgent = async (values: AccountCreateType) => {
  const { email, password, confirmPassword } = values;
  const { data } = await axios.post(
    "/api/auth/signup", { email, password, confirmPassword, role: AGENT }
  )
  
  return data;
}

export const useCreateAgent = () => {
  return useMutation({
    mutationFn: createAgent,
  })
}