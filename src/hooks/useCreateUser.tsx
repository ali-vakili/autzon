import { useMutation } from "@tanstack/react-query";
import { AccountCreateType } from "@/validation/validations"
import { USER } from "@/constants/roles";
import axios from "axios";


const createUser = async (values: AccountCreateType) => {
  const { email, password, confirmPassword } = values;
  const { data } = await axios.post(
    "/api/auth/signup", { email, password, confirmPassword, role: USER }
  )
  
  return data;
}

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  })
}