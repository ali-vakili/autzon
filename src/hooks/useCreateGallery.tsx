import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { GalleryCreateAndUpdateSchemaType } from "@/validation/validations"
import axios from "axios";


const createGallery = async (values: GalleryCreateAndUpdateSchemaType) => {
  const { name, city, address, phone_numbers, categories, about } = values;
  const { data } = await axios.post(
    "/api/gallery", { name, city, address, phone_numbers, categories, about }
  )
  
  return data;
}

export const useCreateGallery = () => {
  return useMutation({
    mutationFn: createGallery,
  })
}


export type createGalleryHookType = {
  mutate: UseMutateFunction<any, unknown, GalleryCreateAndUpdateSchemaType, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}