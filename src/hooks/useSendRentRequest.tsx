import { useMutation } from "@tanstack/react-query";
import axios from "axios";


const SendRentRequest = async ({ car_id, auto_gallery_id }: { car_id:string, auto_gallery_id: string }) => {
  const { data } = await axios.post(
    "/api/car/rent-request", { car_id, auto_gallery_id }
  )
  
  return data;
}

export const useSendRentRequest = () => {
  return useMutation({
    mutationFn: SendRentRequest,
  })
}