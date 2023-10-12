import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AgentType } from "@/validation/validations"


const createAgent = async (values: AgentType) => {
  const { email, password, confirmPassword } = values;
  const { data } = await axios.post(
    "api/auth/signup", { email, password, confirmPassword }
  )
  console.log(data)
  return data;
}

export const useCreateAgent = () => {
  return useMutation({
    mutationFn: createAgent,
  })
}