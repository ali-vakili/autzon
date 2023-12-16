import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getGalleries = async (city_id: string) => {
  const { data } = await axios.get(`/api/gallery?city_id=${city_id}`);
  return data;
};

export const useGetGalleries = (city_id: string) => {
  return useQuery({
    queryKey: ["galleries", city_id],
    queryFn: () => getGalleries(city_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}