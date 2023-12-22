import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getGalleryDetail = async (gallery_id: string) => {
  const { data } = await axios.get(`/api/gallery/${gallery_id}`);
  return data;
};

export const useGetGalleryDetail = (gallery_id: string) => {
  return useQuery({
    queryKey: ["gallery", gallery_id],
    queryFn: () => getGalleryDetail(gallery_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}