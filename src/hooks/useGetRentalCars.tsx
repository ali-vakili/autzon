import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getRentalCars = async (city_id: string) => {
  const { data } = await axios.get(`/api/car?for=rent&city_id=${city_id}`);
  return data;
};

export const useGetRentalCars = (city_id: string) => {
  return useQuery({
    queryKey: ["rental_cars", city_id],
    queryFn: () => getRentalCars(city_id),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}