import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { GalleryCreateAndUpdateSchemaType } from "@/validation/validations"
import axios from "axios";


const createGallery = async (values: GalleryCreateAndUpdateSchemaType) => {
  const { name, imageFile, city, address, phone_numbers, categories, about } = values;

  const formData = new FormData();
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }
  formData.append('name', name);
  formData.append('city', city);
  formData.append('address', address);
  formData.append('phone_numbers', JSON.stringify(phone_numbers));
  formData.append('categories',  JSON.stringify(categories));
  formData.append('about', about);

  const { data } = await axios.post(
    "/api/gallery", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
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