import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import axios from "axios";


const acceptORDeclineRequest = async ({ car_id, user_id, gallery_id, request_id, action }: { user_id: string , car_id: string, gallery_id:string, request_id: string, action:"ACCEPTED" | "DECLINED"}) => {

  const { data } = await axios.patch(
    `/api/car/rent-request`, { request_id, car_id, user_id, gallery_id, action }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  
  return data;
}

export const useAcceptORDeclineRequest = () => {
  return useMutation({
    mutationFn: acceptORDeclineRequest,
  })
}

export type useAcceptORDeclineRequestHookType = {
  mutate: UseMutateFunction<any, unknown, {
    user_id: string;
    car_id: string;
    gallery_id: string;
    request_id: string;
    action:"ACCEPTED" | "DECLINED"
  }, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}