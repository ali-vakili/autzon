import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getGalleryCars = async (galleryId: string) => {
  const { data } = await axios.get(`/api/gallery/${galleryId}/cars`);

  return data;
};

export const useGetGalleryCars = (galleryId: string) => {
  return useQuery({
    queryKey: ["gallery_cars", galleryId],
    queryFn: () => getGalleryCars(galleryId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}