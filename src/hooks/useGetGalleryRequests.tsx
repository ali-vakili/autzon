import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getGalleryRequests = async (gallery_id: string) => {
  const { data } = await axios.get(`/api/gallery/${gallery_id}/rent-requests`);
  return data;
};

export const useGalleryRequests = (gallery_id: string) => {
  return useQuery({
    queryKey: ["gallery-requests"],
    queryFn: () => getGalleryRequests (gallery_id),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}