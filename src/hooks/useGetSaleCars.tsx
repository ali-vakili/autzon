import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getSaleCars = async (city_id: string) => {
  const { data } = await axios.get(`/api/car?for=sale&city_id=${city_id}`);
  return data;
};

export const useGetSaleCars = (city_id: string) => {
  return useQuery({
    queryKey: ["sale_cars", city_id],
    queryFn: () => getSaleCars(city_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}