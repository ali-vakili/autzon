import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { GalleryCreateAndUpdateSchemaType } from "@/validation/validations"
import axios from "axios";


const updateGallery = async ({ values, gallery_id }: {values: GalleryCreateAndUpdateSchemaType , gallery_id: string}) => {
  const { name, imageFile, address, city, phone_numbers, categories, about } = values;

  const formData = new FormData();
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }
  formData.append('name', name);
  formData.append('address', address);
  formData.append('city', city);
  formData.append('phone_numbers', JSON.stringify(phone_numbers));
  formData.append('categories', JSON.stringify(categories));
  formData.append('about', about);

  const { data } = await axios.patch(
    `/api/gallery/edit/${gallery_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  
  return data;
}

export const useUpdateGallery = () => {
  return useMutation({
    mutationFn: updateGallery,
  })
}

export type updateGalleryHookType = {
  mutate: UseMutateFunction<any, unknown, {
    values: GalleryCreateAndUpdateSchemaType;
    gallery_id: string;
  }, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}