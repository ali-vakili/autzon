import { useMutation } from "@tanstack/react-query";
import { AgentCreateType } from "@/validation/validations"
import axios from "axios";


const createAgent = async (values: AgentCreateType) => {
  const { email, password, confirmPassword } = values;
  const { data } = await axios.post(
    "/api/auth/signup", { email, password, confirmPassword }
  )
  
  return data;
}

export const useCreateAgent = () => {
  return useMutation({
    mutationFn: createAgent,
  })
}