import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import axios from "axios";


const deleteCar = async (car_id: string) => {

  const { data } = await axios.delete(
    `/api/car/delete/${car_id}`
  )
  
  return data;
}

export const useDeleteCar = () => {
  return useMutation({
    mutationFn: deleteCar,
  })
}

export type deleteCarHookType = {
  mutate: UseMutateFunction<any, unknown, string, unknown>
  data: any,
  error: any,
  isPending: boolean,
  isSuccess: boolean,
  isError: boolean,
}