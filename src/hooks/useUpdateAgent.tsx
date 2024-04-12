import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AgentUpdateType } from "@/validation/validations"
import axios from "axios";


const updateAgent = async ({ values, agent_id }: {values: AgentUpdateType , agent_id: string}) => {
  const { imageFile, firstName, lastName, phone_number, city, bio } = values;

  const formData = new FormData();
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('phone_number', phone_number);
  formData.append('city', city);
  formData.append('bio', bio);

  const { data } = await axios.patch(
    `/api/agent/profile/edit/${agent_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
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
    values: AgentUpdateType;
    agent_id: string;
  }, unknown>
  data: any,
  error: any,
  isPending: boolean,
  isSuccess: boolean,
  isError: boolean,
}