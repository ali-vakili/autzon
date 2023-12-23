import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const getRentRequests = async () => {
  const { data } = await axios.get(`/api/car/rent-request`);
  return data;
};

export const useGetRentRequests = () => {
  return useQuery({
    queryKey: ["rent-request"],
    queryFn: () => getRentRequests(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}