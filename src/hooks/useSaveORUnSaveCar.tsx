import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import axios from "axios";


const saveORUnSaveCar = async ({ car_id, action } : { car_id: string, action: "SAVE" | "UNSAVE" }) => {
  const { data } = await axios.post(
    `/api/car/${car_id}`, { action }
  )
  
  return data;
}

export const useSaveORUnSaveCar = () => {
  return useMutation({
    mutationFn: saveORUnSaveCar,
  })
}

export type saveORUnSaveCarHookType = {
  mutate: UseMutateFunction<any, unknown, { car_id: string, action: "SAVE" | "UNSAVE" }, unknown>
  data: any,
  error: any,
  isPending: boolean,
  isSuccess: boolean,
  isError: boolean,
}