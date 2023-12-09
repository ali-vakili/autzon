import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { AddAndUpdateSaleCarSchemaType } from "@/validation/validations"
import axios from "axios";


const updateSaleCar = async ({ values, deletedImagesId, updatedImagesIdAndIndex, car_id }: {values: AddAndUpdateSaleCarSchemaType, deletedImagesId: string[], updatedImagesIdAndIndex: {id: string, index: number}[],  car_id: string}) => {
  const { imagesFile, title, buildYear, model, seats, fuelType, category, price, mileage, color, description, is_published } = values;

  const formData = new FormData();
  if (imagesFile) {
    imagesFile.forEach((fileObj) => {
      if (fileObj && fileObj.imageFile) {
        const { imageFile } = fileObj;
        if (imageFile) {
          formData.append('imagesFile', imageFile);
        }
      }
      else {
        formData.append('imagesFile', JSON.stringify({ imageFile: null }));
      }
    });
  }
  if (deletedImagesId.length > 0) {
    formData.append('deleted_images_id', JSON.stringify(deletedImagesId));
  }
  if (updatedImagesIdAndIndex.length > 0) {
    formData.append('updated_images_id_and_index', JSON.stringify(updatedImagesIdAndIndex));
  }
  formData.append('title', title);
  formData.append('buildYear', buildYear);
  formData.append('model', model);
  formData.append('seats', seats);
  formData.append('fuelType', fuelType);
  formData.append('category', category);
  formData.append('price',  price);
  formData.append('mileage', mileage);
  formData.append('color', color);
  formData.append('color', color);
  if (description) {
    formData.append('description', description);
  }
  formData.append('is_published', JSON.stringify(is_published));

  const { data } = await axios.patch(
    `/api/car/sale/edit/${car_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  
  return data;
}

export const useUpdateSaleCar = () => {
  return useMutation({
    mutationFn: updateSaleCar,
  })
}


export type updateSaleCarHookType = {
  mutate: UseMutateFunction<any, unknown,{
    values: AddAndUpdateSaleCarSchemaType;
    deletedImagesId: string[];
    updatedImagesIdAndIndex: {id: string, index: number}[];
    car_id: string;
  }, unknown>
  data: any,
  error: any,
  isLoading: boolean,
  isSuccess: boolean,
  isError: boolean,
}