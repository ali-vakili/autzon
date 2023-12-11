import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getGalleryCars = async (galleryId: string, searchParam:string) => {
  const { data } = await axios.get(`/api/gallery/${galleryId}/cars?order-by=${searchParam}`);

  return data;
};

export const useGetGalleryCars = (galleryId: string, searchParam:string) => {
  return useQuery({
    queryKey: ["gallery_cars", galleryId],
    queryFn: () => getGalleryCars(galleryId, searchParam),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}