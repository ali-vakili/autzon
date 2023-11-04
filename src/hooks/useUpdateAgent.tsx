import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AgentUpdateType } from "@/validation/validations"
import axios from "axios";


const updateAgent = async ({ values, agent_id }: {values: AgentUpdateType , agent_id: string}) => {
  const { firstName, lastName, phone_number } = values;
  const { data } = await axios.patch(
    `/api/agent/profile/edit/${agent_id}`, { firstName, lastName, phone_number }
  )
  
  return data;
}

export const useUpdateAgent = () => {
  return useMutation({
    mutationFn: updateAgent,
  })
}

export type updateAgentHookType = {
  mutate: UseMutateFunction<any, unknown, {
    values: {
      firstName: string;
      lastName: string;
      phone_number: string;
    };
    agent_id: string;
  }, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}