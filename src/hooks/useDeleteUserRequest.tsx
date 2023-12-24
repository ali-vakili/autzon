import { useMutation } from "@tanstack/react-query";
import axios from "axios";


const DeleteRentRequest = async ({ request_id, car_id, auto_gallery_id }: { request_id:string, car_id:string, auto_gallery_id: string }) => {
  const { data } = await axios.delete(
    `/api/car/rent-request?request_id=${request_id}&car_id=${car_id}&auto_gallery_id=${auto_gallery_id}`
  )
  
  return data;
}

export const useDeleteRentRequest = () => {
  return useMutation({
    mutationFn: DeleteRentRequest,
  })
}