import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getUserSavedCars = async () => {
  const { data } = await axios.get("/api/car/saves");
  return data;
};

export const useGetUserSavedCars = () => {
  return useQuery({
    queryKey: ["saved_cars"],
    queryFn: () => getUserSavedCars(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}